import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CustomResponse, CustomResponseStatus } from '@src/customResponse';
import { Cities } from '@src/utils/couriers/enums/city.enum';
import { SmsaService } from '@src/utils/couriers/SmsaService';
import { TorodService } from '@src/utils/couriers/TorodService';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';
import { FreshChatService } from '../../utils/freshchat/freshchat.service';
import { CategoryService } from '../category/category.service';
import { PayoutStatus } from '../grpc/proto/payment.pb';
import { UpdateProductRequest } from '../grpc/proto/v2.pb';
import { PaymentService } from '../payment/payment.service';
import { CreateProductService } from '../product/createProduct.service';
import { ProductUpdateDto } from '../product/dto/productUpdate.dto';
import { CategoryType } from '../product/enum/categoryType.enum';
import { ProductSellType } from '../product/enum/productSellType.enum';
import { ProductStatus } from '../product/enum/productStatus.enum';
import { ProductService } from '../product/product.service';
import { V2Service } from '../v2/v2.service';
import {
  APPListMyConsignmentsResponseDTO,
  CheckEligibilityRequestDTO,
  CheckEligibilityResponseDTO,
  ConsignmentPayoutDetailsResponseDto,
  ConsignmentResponseDto,
  CreateConsignmentDTO,
  ListConsignmentRequestDTO,
  ListConsignmentResponseDTO,
  UpdateConsignmentPayoutAmountDto,
} from './dto/consignment.dto';
import { Consignment } from './entity/consignment.entity';
import { ConsignmentDeliveryProviders } from './enum/consignment.delivery-providers.enum';
import {
  ConsignmentStatus,
  mapConsignmentToMySalesStatus,
} from './enum/consignment.status.enum';
import { TradeInRecoService } from './utils/trade-in-reco.util';
import { Queue } from 'bullmq';
import { ConsignmentJob } from './enum';
import { VaultInstance } from '@src/utils/vault.util';
import { SystemUpdateProductService } from '../product/systemUpdateProduct.service';
import { ProductActionsEnum } from '../product/enum/productActions.enum';

@Injectable()
export class ConsignmentService {
  private readonly logger = new Logger(ConsignmentService.name);
  private readonly vaultInstance = new VaultInstance();

  constructor(
    @InjectRepository(Consignment)
    private readonly consignmentRepository: EntityRepository<Consignment>,
    private readonly em: EntityManager,
    @Inject()
    private readonly tradeInRecoProvider: TradeInRecoService,
    private readonly freshChatService: FreshChatService,
    private readonly torodService: TorodService,
    private readonly smsaService: SmsaService,
    private readonly createProductService: CreateProductService,
    private readonly categoryService: CategoryService,
    private readonly v2Service: V2Service,
    private readonly paymentService: PaymentService,
    private readonly productService: ProductService,
    @InjectQueue(process.env.CONSIGNMENT_QUEUE_NAME)
    private readonly queue: Queue,
    private readonly systemUpdateProductService: SystemUpdateProductService,
  ) {}

  async checkEligibility(
    params: CheckEligibilityRequestDTO,
  ): Promise<CheckEligibilityResponseDTO> {
    try {
      const tradeInRecoRes =
        await this.tradeInRecoProvider.getTradeInRecoPrice(params);
      if (tradeInRecoRes?.trade_in_reco) {
        return { isEligible: true, offerPrice: tradeInRecoRes?.trade_in_reco };
      }
      return { isEligible: false };
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async create(params: CreateConsignmentDTO): Promise<CustomResponse<any>> {
    try {
      // Extract category IDs
      const variantId = (params.categories.find(
        (item) => item.categoryType === CategoryType.VARIANT,
      )?.categoryId || null) as unknown as Types.ObjectId;

      const conditionId = (params.categories.find(
        (item) => item.categoryType === CategoryType.CONDITION,
      )?.categoryId || null) as unknown as Types.UUID;

      const modelId =
        params.categories.find(
          (item) => item.categoryType === CategoryType.MODEL,
        )?.categoryId || null;

      // Validate required category IDs
      if (!variantId || !conditionId || !modelId) {
        throw new Error('Missing required category IDs');
      }

      // Get trade-in recommendation price
      const tradeInRecoRes = await this.tradeInRecoProvider.getTradeInRecoPrice(
        {
          variantId,
          conditionId,
        },
      );

      if (!tradeInRecoRes?.resell_reco || !tradeInRecoRes?.trade_in_reco) {
        throw new Error('Failed to get trade-in recommendation prices');
      }

      // Create product
      const result = await this.createProductService.addNewProduct(
        {
          ...params,
          sellPrice: tradeInRecoRes.resell_reco,
          recommendedPrice: tradeInRecoRes.resell_reco,
          productSellType: ProductSellType.CONSIGNMENT,
        },
        params.userId,
      );

      // Get product name from categories
      const categoriesInfo = await this.categoryService.getCategories({
        limit: 1,
        offset: 0,
        type: CategoryType.MODEL,
        categories: { ids: [modelId] },
      });

      if (!categoriesInfo?.categories?.length) {
        throw new Error('Category info not found');
      }

      const productName = categoriesInfo.categories[0].name;

      // Get user info
      const user = await this.v2Service.getUser({
        id: params.userId,
      });

      // Generate consignment details
      const consignmentId = new ObjectId().toString();
      const orderNumber = this.generateRandomOperationNumber();

      // Generate tracking number
      const { trackingNumber, pdfLink } = await this.generateTrackingNumber(
        user,
        productName,
        orderNumber,
        consignmentId,
        tradeInRecoRes.trade_in_reco,
      );

      if (!trackingNumber) {
        this.logger.error('Failed to generate tracking number');
      }
      const deliveryProvider = await this.getDeliveryProvider();
      let freshChatText = pdfLink;
      if (deliveryProvider === ConsignmentDeliveryProviders.TOROD) {
        freshChatText = 'تم إرسال معلومات الشحن عن طريق الرسالة النصية';
      }

      // Send notification
      this.freshChatService
        .sendOutboundMsg({
          phoneNumber: user.phoneNumber,
          templateName: process.env.FRESHCHAT_TEMPLATE_UPFRONT_PAYMENT,
          productId: result.id,
          productName,
          pdfLink: freshChatText,
        })
        .catch((error) => {
          this.logger.error('Failed to send FreshChat message:', error);
        });

      // Create and save consignment record
      const consignmentDoc = this.consignmentRepository.create({
        id: consignmentId,
        product: result,
        status: ConsignmentStatus.NEW,
        userId: params.userId,
        payoutAmount: tradeInRecoRes.trade_in_reco,
        orderNumber,
        trackingNumber,
        deliveryProvider: await this.getDeliveryProvider(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.consignmentRepository
        .getEntityManager()
        .persistAndFlush(consignmentDoc);

      return {
        status: CustomResponseStatus.SUCCESS,
        data: result,
        code: 200,
        message: 'Consignment created successfully',
      };
    } catch (error) {
      this.logger.error('Create consignment error:', error);
      throw error;
    }
  }

  async list(
    params: ListConsignmentRequestDTO,
  ): Promise<ListConsignmentResponseDTO> {
    try {
      const offset = params.offset ?? 0;
      const limit = params.limit ?? 10;

      const qb = this.em.createQueryBuilder(Consignment, 'c').select(['c.*']);

      if (params.status && params.status.length > 0) {
        qb.andWhere({ status: { $in: params.status } });
      }

      if (params.search) {
        const search = `%${params.search}%`;
        qb.andWhere(
          `(CAST(c.order_number AS TEXT) ILIKE ? OR
            CAST(c.product_id AS TEXT) ILIKE ? OR
            CAST(c.user_id AS TEXT) ILIKE ?)`,
          [search, search, search],
        );
      }

      qb.orderBy({ createdAt: 'DESC' }).offset(offset).limit(limit);

      const [rawItems, total] = await qb.getResultAndCount();

      // Manually map to ConsignmentResponseDto
      const items = rawItems.map((item) => {
        const mappedItem = this.em.map(Consignment, item);
        return {
          id: mappedItem.id,
          product: mappedItem.product?.id,
          status: mappedItem.status,
          userId: mappedItem.userId,
          payoutAmount: mappedItem.payoutAmount,
          orderNumber: mappedItem.orderNumber,
          trackingNumber: mappedItem.trackingNumber,
          shippingLabel: this.getShippingLabel(mappedItem),
          deliveryProvider: mappedItem.deliveryProvider,
          createdAt: mappedItem.createdAt.toISOString(),
          updatedAt: mappedItem.updatedAt?.toISOString(),
        } as ConsignmentResponseDto;
      });

      return {
        items,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateStatus(
    status: ConsignmentStatus,
    id?: string,
    orderNumber?: string,
    userId?: string,
  ): Promise<Consignment> {
    try {
      let filter: Record<string, string> = id ? { id } : { orderNumber };
      if (userId) {
        filter = { ...filter, userId };
      }
      const consignment = await this.consignmentRepository.findOne(filter, {
        populate: ['product'],
      });
      if (!consignment) {
        throw new NotFoundException(
          `Consignment with ID ${id ? id : orderNumber} not found`,
        );
      }

      consignment.status = status;
      consignment.updatedAt = new Date();

      await this.consignmentRepository
        .getEntityManager()
        .persistAndFlush(consignment);

      if (consignment.status === ConsignmentStatus.APPROVED) {
        await this.updateProduct(consignment?.product.id, {
          isApproved: true,
          status: ProductStatus.ACTIVE,
          categories: consignment.product.categories,
          sellPrice: consignment.product.sellPrice,
          consignment: {
            payoutAmount: consignment?.payoutAmount,
            orderNumber: consignment?.orderNumber,
            payoutStatus: consignment?.status,
          },
        });
        const vaultSettings = await this.getVaultSettingsForConsignment();
        if (vaultSettings.isConsignmentFeatureEnabled) {
          const delay =
            vaultSettings.consignmentPriceUpdateInterval * 24 * 60 * 60 * 1000; //number of days (24*60*60*1000 = 1 day)
          await this.queue.add(
            ConsignmentJob.ADJUST_CONSIGNMENT_SELL_PRICE,
            {
              id,
              productId: consignment?.product.id,
            },
            {
              delay: delay,
            },
          );
        }
      }
      return consignment;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updatePayoutAmount(
    id: string,
    updatePayoutAmountDto: UpdateConsignmentPayoutAmountDto,
  ): Promise<Consignment> {
    try {
      const consignment = await this.consignmentRepository.findOne({ id });
      if (!consignment) {
        throw new NotFoundException(`Consignment with ID ${id} not found`);
      }

      consignment.payoutAmount = updatePayoutAmountDto.payoutAmount;
      consignment.updatedAt = new Date();

      await this.consignmentRepository
        .getEntityManager()
        .persistAndFlush(consignment);

      return consignment;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async userUpdateConsignmentStatus(
    id: string,
    userId: string,
    approved: boolean,
  ): Promise<Consignment> {
    try {
      const status = approved
        ? ConsignmentStatus.APPROVED
        : ConsignmentStatus.CLOSED_UNFULFILLED;
      const consignment = await this.updateStatus(status, id, null, userId);
      return consignment;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async payout(
    id: string,
    agentId: string,
    payoutAmount: number,
  ): Promise<Partial<Consignment>> {
    try {
      const consignment = await this.consignmentRepository.findOne({ id });
      if (!consignment) {
        throw new NotFoundException(`Consignment with ID ${id} not found`);
      }
      if (consignment.status !== ConsignmentStatus.PAYOUT_TO_SELLER) {
        throw new BadRequestException(
          `Consignment status should be: ${ConsignmentStatus.PAYOUT_TO_SELLER}`,
        );
      }
      if (payoutAmount) {
        consignment.payoutAmount = payoutAmount;
      }

      const response = await this.paymentService.createPayout({
        amount: consignment.payoutAmount,
        recipientId: consignment.userId,
        agentId: agentId,
        orderId: consignment.orderNumber,
      });

      if (response.status === PayoutStatus.COMPLETED) {
        consignment.status = ConsignmentStatus.TRANSFERRED;
      } else if (response.status === PayoutStatus.PROCESSING) {
        consignment.status = ConsignmentStatus.PAYOUT_PROCESSING;
      } else {
        throw new BadRequestException(
          `Something is wrong with Payout. Pls check`,
        );
      }

      await this.consignmentRepository
        .getEntityManager()
        .persistAndFlush(consignment);
      return {
        id: consignment.id,
        status: consignment.status,
        payoutAmount: consignment.payoutAmount,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async checkPayoutStatus(id: string): Promise<Partial<Consignment>> {
    try {
      const consignment = await this.consignmentRepository.findOne({ id });
      if (!consignment) {
        throw new NotFoundException(`Consignment with ID ${id} not found`);
      }
      if (consignment.status === ConsignmentStatus.TRANSFERRED) {
        return { id: consignment.id, status: consignment.status };
      }

      const response = await this.paymentService.checkPayoutStatus({
        orderId: consignment.orderNumber,
      });

      if (response.status === PayoutStatus.COMPLETED) {
        consignment.status = ConsignmentStatus.TRANSFERRED;
      } else if (response.status === PayoutStatus.FAILED) {
        consignment.status = ConsignmentStatus.PAYOUT_TO_SELLER;
      }

      await this.consignmentRepository
        .getEntityManager()
        .persistAndFlush(consignment);
      return { id: consignment.id, status: consignment.status };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getPayoutDetails(
    id: string,
  ): Promise<ConsignmentPayoutDetailsResponseDto> {
    try {
      const consignment = await this.consignmentRepository.findOne({ id });
      if (!consignment) {
        throw new NotFoundException(`Consignment with ID ${id} not found`);
      }

      const response = await this.v2Service.getUser({
        id: consignment.userId,
      });
      return {
        payoutAmount: consignment.payoutAmount,
        accountHolderName: response?.bankDetail?.accountHolderName,
        accountId: response?.bankDetail?.accountId,
        bankBIC: response?.bankDetail?.bankBIC,
        bankName: response?.bankDetail?.bankName,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateProduct(productId: string, productUpdate: ProductUpdateDto) {
    try {
      const isUpdated = this.productService.updateProduct(productId, {
        status: productUpdate?.status,
        categories: productUpdate?.categories,
        sellPrice: productUpdate.sellPrice,
      });
      if (isUpdated) {
        const conditionId = productUpdate.categories.find(
          (category) => category.categoryType === CategoryType.CONDITION,
        )?.categoryId;
        const grpcRes = await this.v2Service.updateProductService({
          productId: productId,
          updateProduct: {
            status: productUpdate?.status,
            isApproved: productUpdate?.isApproved,
            consignment: productUpdate?.consignment,
            conditionId: conditionId,
            sellPrice: productUpdate.sellPrice,
          },
        } as UpdateProductRequest);
        if (!grpcRes.status) {
          this.logger.error('error updating product');
        }
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async listMyConsignments(
    userId: string,
  ): Promise<APPListMyConsignmentsResponseDTO[]> {
    try {
      const rawQuery = `
          SELECT c.id                AS "consignmentId",
                 c.status            AS "consignmentStatus",
                 c.payout_amount     AS "payoutAmount",
                 c.user_id           AS "userId",
                 c.order_number      AS "orderNumber",
                 c.tracking_number   AS "trackingNumber",
                 c.delivery_provider AS "deliveryProvider",
                 p.id                AS "productId",
                 p.categories        AS "categories",
                 ARRAY_AGG(pis.urls) AS "imageUrls",
                 p.listing_sell_price  As "listingSellPrice",
                 p.sell_price         As "sellPrice",
                 c.seller_notification_record  As "sellerNotificationRecord"
          FROM consignment c
                   LEFT JOIN
               product p ON c.product_id = p.id
                   LEFT JOIN
               product_image_section pis ON p.id = pis.product_id
          WHERE c.user_id = ?
          GROUP BY c.id, p.id
          ORDER BY c.created_at DESC
      `;

      const result = await this.em.getConnection().execute(rawQuery, [userId]);
      const modelIds = [];
      const variantIds = [];
      const items = result.map((element) => {
        const item = element;
        try {
          // Parse categories if it's a string
          const categories =
            typeof element.categories === 'string'
              ? JSON.parse(element.categories)
              : element.categories;

          if (categories && Array.isArray(categories)) {
            categories.forEach((e) => {
              if (e.categoryType === CategoryType.MODEL) {
                modelIds.push(e.categoryId);
                item.modelId = e.categoryId;
              }
              if (e.categoryType === CategoryType.VARIANT) {
                variantIds.push(e.categoryId);
                item.variantId = e.categoryId;
              }
            });
          }
        } catch (error) {
          this.logger.error(
            `Error parsing categories for consignment ${element.consignmentId}:`,
            error,
          );
        }
        return item;
      });

      const modelsInfoMap = new Map();
      if (modelIds.length) {
        const modelsInfo = await this.categoryService.getCategories({
          limit: 10,
          offset: 0,
          type: CategoryType.MODEL,
          categories: { ids: modelIds },
        });
        if (modelsInfo?.categories) {
          modelsInfo.categories.forEach((element) => {
            modelsInfoMap.set(element.id, element);
          });
        }
      }
      const variantsInfoMap = new Map();
      if (variantIds.length) {
        const variantsInfo = await this.categoryService.getCategories({
          limit: 10,
          offset: 0,
          type: CategoryType.VARIANT,
          categories: { ids: variantIds },
        });

        if (variantsInfo?.categories) {
          variantsInfo.categories.forEach((element) => {
            variantsInfoMap.set(element.id, element);
          });
        }
      }

      const returnItem = items.map((item: any) => {
        const productImages = Array.isArray(item.imageUrls)
          ? item.imageUrls
              .filter((imgGroup: any) => Array.isArray(imgGroup))
              .map((imgGroup: any[]) =>
                imgGroup.map((img: any) => `${img.base}/${img.relativePath}`),
              )
              .flat()
          : [];

        const displayPriceAdjustmentTag =
          !item.sellerNotificationRecord.priceAdjustmentNotified &&
          item.listingSellPrice &&
          item.listingSellPrice > item.sellPrice;

        const newItem: APPListMyConsignmentsResponseDTO = {
          id: item.consignmentId,
          status: mapConsignmentToMySalesStatus(item.consignmentStatus),
          orderNumber: item.orderNumber,
          trackingNumber: item.trackingNumber,
          shippingLabel: this.getShippingLabel(item),
          productNameEn: modelsInfoMap.get(item.modelId)?.name ?? '',
          productNameAr: modelsInfoMap.get(item.modelId)?.nameAr ?? '',
          variantNameEn: variantsInfoMap.get(item.variantId)?.name ?? '',
          variantNameAr: variantsInfoMap.get(item.variantId)?.nameAr ?? '',
          payoutAmount: item.payoutAmount,
          productImages,
          deliveryProvider: item.deliveryProvider,
          displayPriceAdjustmentTag,
        };
        return newItem;
      });
      const idsToUpdate = returnItem
        .filter((item) => item.displayPriceAdjustmentTag)
        .map((item) => item.id);
      await this.consignmentRepository.nativeUpdate(
        { id: { $in: idsToUpdate } },
        {
          sellerNotificationRecord: { priceAdjustmentNotified: true },
          updatedAt: new Date(),
        },
      );
      return returnItem;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async getDeliveryProvider(): Promise<ConsignmentDeliveryProviders> {
    try {
      const secretData = await this.vaultInstance.getSecretData('product');
      const deliveryProvider =
        secretData?.deliveryProvider ?? ConsignmentDeliveryProviders.TOROD;
      return deliveryProvider;
    } catch (error) {
      this.logger.error('Failed to get delivery provider from vault:', error);
      return ConsignmentDeliveryProviders.TOROD;
    }
  }

  private async generateTrackingNumber(
    user: any,
    productName: string,
    orderNumber: string,
    consignmentId: string,
    grandTotal: number,
  ): Promise<{ trackingNumber: string | null; pdfLink: string | null }> {
    const deliveryProvider = await this.getDeliveryProvider();
    let trackingNumber = null;

    if (deliveryProvider === ConsignmentDeliveryProviders.TOROD) {
      trackingNumber = await this.torodService.generateTrackingNumber({
        senderName: user.name,
        senderPhone: user.phoneNumber,
        senderAddress: [
          user?.address.city,
          user?.address.district,
          user?.address.street,
          user?.address.postalCode,
        ].join(', '),
        senderCity: user?.address.city,
        receiverName: process.env.SOUM_SELLER_NAME,
        receiverPhone: process.env.SOUM_SELLER_RIYADH_PHONE_NUMBER,
        receiverAddress: process.env.SOUM_SELLER_RIYADH_ADDRESS,
        receiverCity: Cities.RIYADH,
        description: productName,
        grandTotal: grandTotal,
        trackingNumber: orderNumber,
        shipmentType: 'firstMile',
        serviceName: 'torod',
      });
    } else {
      trackingNumber = await this.smsaService.createOrder({
        orderId: consignmentId,
        orderNumber,
        sellerName: user.name,
        sellerPhone: user.phoneNumber,
        sellerCity: user.address.city,
        sellerPostalCode: user.address.postalCode,
        sellerAddress: user.address.street,
        buyerName: process.env.SOUM_SELLER_NAME,
        buyerCity: Cities.RIYADH,
        buyerPostalCode: process.env.SOUM_SELLER_POSTAL_CODE,
        buyerAddress: process.env.SOUM_SELLER_RIYADH_ADDRESS,
        buyerPhone: process.env.SOUM_SELLER_RIYADH_PHONE_NUMBER,
        productName,
      });
    }

    const pdfLink = this.getShippingLabel({
      trackingNumber,
      deliveryProvider,
    } as Consignment);

    return { trackingNumber, pdfLink };
  }

  generateRandomOperationNumber() {
    return (
      'SOUMCON' +
      Math.round(new Date().getTime() / 1000) +
      Math.floor(1000 + Math.random() * 9000)
    );
  }

  async getVaultSettingsForConsignment() {
    const secretData = await this.vaultInstance.getSecretData('product');

    return {
      consignmentPriceUpdateInterval: Number(
        secretData.consignmentPriceUpdateInterval,
      ),
      consignmentPriceUpdateAmount: Number(
        secretData.consignmentPriceUpdateAmount,
      ),
      consignmentPriceThreshold: Number(secretData.consignmentPriceThreshold),
      isConsignmentFeatureEnabled:
        secretData.isConsignmentFeatureEnabled === 'true',
    };
  }

  async processAdjustConsignmentSellPriceBullMqJob(
    id: string,
    productId: string,
  ) {
    const [productData, vaultSettings, consignment] = await Promise.all([
      this.productService.getProductFromOldOrNew(productId),
      this.getVaultSettingsForConsignment(),
      this.consignmentRepository.findOne({ id }),
    ]);
    const { product } = productData;

    if (
      !product ||
      !vaultSettings.isConsignmentFeatureEnabled ||
      !product.listingSellPrice
    ) {
      return;
    }
    if (
      product.status !== ProductStatus.ACTIVE ||
      consignment.status !== ConsignmentStatus.APPROVED
    ) {
      return;
    }
    const thresholdForPriceReduction = this.getThresholdForPriceReduction(
      product.listingSellPrice,
      vaultSettings.consignmentPriceThreshold,
    );
    const updatedSellPrice = this.getUpdatedSellPrice(
      product.sellPrice,
      vaultSettings.consignmentPriceUpdateAmount,
    );

    if (updatedSellPrice < thresholdForPriceReduction) return;
    await this.systemUpdateProductService.systemUpdateActions({
      id: productId,
      productAction: ProductActionsEnum.SYSTEM_SELL_PRICE_UPDATE,
      sellPrice: updatedSellPrice,
    });
    consignment.payoutAmount =
      consignment.payoutAmount - vaultSettings.consignmentPriceUpdateAmount;
    await this.consignmentRepository
      .getEntityManager()
      .persistAndFlush(consignment);

    const delay =
      vaultSettings.consignmentPriceUpdateInterval * 24 * 60 * 60 * 1000; //number of days (24*60*60*1000 = 1 day)
    await this.queue.add(
      ConsignmentJob.ADJUST_CONSIGNMENT_SELL_PRICE,
      {
        id,
        productId,
      },
      {
        delay,
      },
    );
  }

  private getThresholdForPriceReduction(
    listingSellPrice: number,
    threshold: number,
  ): number {
    return listingSellPrice * threshold;
  }

  private getUpdatedSellPrice(
    currentSellPrice: number,
    reductionAmount: number,
  ): number {
    return currentSellPrice - reductionAmount;
  }

  async calculateMinimumPriceForConsignment(value: number) {
    const vaultSettings = await this.getVaultSettingsForConsignment();
    return this.getThresholdForPriceReduction(
      value,
      vaultSettings.consignmentPriceThreshold,
    );
  }
  getShippingLabel(consignment: Consignment) {
    if (!consignment.trackingNumber) {
      return null;
    }
    return `${process.env.SMSA_API_BASE_URL}/getPDF2.aspx?awbNo=${consignment.trackingNumber}`;
  }

  async updateConsignmentCondition(productId: string, conditionId: string) {
    try {
      const consignment = await this.consignmentRepository.findOne(
        {
          product: productId,
          status: ConsignmentStatus.NEW,
        },
        { populate: ['product'] },
      );

      if (!consignment) {
        throw new NotFoundException(
          `Consignment with Product ID ${productId} in new status not found`,
        );
      }

      const product = consignment.product;

      const currentConditionId = product.categories.find(
        (category) => category.categoryType === CategoryType.CONDITION,
      )?.categoryId;

      if (currentConditionId === conditionId) {
        return consignment;
      }

      const variantId = product.categories.find(
        (category) => category.categoryType === CategoryType.VARIANT,
      )?.categoryId as unknown as Types.ObjectId;

      const conditionUUID = conditionId as unknown as Types.UUID;

      // Get trade-in recommendation price
      const tradeInRecoRes = await this.tradeInRecoProvider.getTradeInRecoPrice(
        {
          variantId,
          conditionId: conditionUUID,
        },
      );

      if (!tradeInRecoRes?.resell_reco || !tradeInRecoRes?.trade_in_reco) {
        throw new BadRequestException(
          'Failed to get trade-in recommendation prices',
        );
      }

      const updatedCategories = product.categories.map((category) => {
        if (category.categoryType !== CategoryType.CONDITION) {
          return category;
        }
        return {
          ...category,
          categoryId: conditionId,
        };
      });

      consignment.payoutAmount = tradeInRecoRes?.trade_in_reco;
      // consignment.status =
      //   ConsignmentStatus.AWAITING_SELLER_CONFIRMATION_OF_PAYOUT;
      consignment.updatedAt = new Date();

      await this.consignmentRepository
        .getEntityManager()
        .persistAndFlush(consignment);

      await this.updateProduct(consignment?.product.id, {
        isApproved: product.statusSummary.isApproved,
        status: product.status,
        categories: updatedCategories,
        sellPrice: tradeInRecoRes?.resell_reco,
        consignment: {
          payoutAmount: consignment?.payoutAmount,
          orderNumber: consignment?.orderNumber,
          payoutStatus: consignment?.status,
        },
      });
      return consignment;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
