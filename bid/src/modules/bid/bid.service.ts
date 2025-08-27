import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Bid, BidDocument } from './schemas/bid.schema';
import { PaginatedDto } from '@src/dto/paginated.dto';
import { CreateBidDto } from './dto/create-bid.dto';
import { StatusService } from '../status/status.service';
import { PaymentService } from '../payment/payment.service';
import { BidSettingsService } from '../bid-settings/bid-settings.service';
import { CreateTransactionRequest } from '../grpc/proto/payment.pb';
import { TransactionTypeEnum } from './enums/transactionType.enum';
import { V2Service } from '../v2/v2.service';
import { BidStatus } from '../status/enums/status.enum';
import {
  BreakDownResponse,
  GetMarketPriceByVariantIdResponse,
  GetProductsResponse_Product,
} from '../grpc/proto/v2.pb';
import { StatusDocument } from '../status/schemas/status.schema';
import { generateSoumTrackingNumber } from '@src/utils/common.util';
import { ProductStatus, PurchaseBidDto } from './dto/purchase-bid.dto';
import { TransactionStatusEnum } from './enums/transactionStatus.enum';
import { sendEventData } from '@src/utils/webEngageEvents';
import { CatConditionQualityEnum } from './enums/catConditionQuality.enum';
import { CategoryService } from '../category/category.service';
import {
  GetCatConPriceRangeRequest,
  PriceNudge,
} from '../grpc/proto/category.pb';

@Injectable()
export class BidService {
  constructor(
    @InjectModel(Bid.name)
    private readonly model: Model<BidDocument>,
    private readonly statusService: StatusService,
    private readonly paymentService: PaymentService,
    private readonly v2Service: V2Service,
    private readonly bidSettingsService: BidSettingsService,
    private readonly categoryService: CategoryService,
  ) {}

  async findAll({ offset, limit, search }): Promise<PaginatedDto<Bid>> {
    let matchCondition: any = search ? { $text: { $search: search } } : {};
    matchCondition = {
      ...matchCondition,
      ...{ isAuthorizedTransaction: true },
    };
    const bids = await this.model
      .find(matchCondition)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: 1 })
      .exec();

    const count = await this.model.count(matchCondition).exec();

    const statusIds = bids.map((bid: Bid) => bid.statusId);
    const statuses = await this.statusService.findAll(statusIds);

    const statusesMap = new Map<string, StatusDocument>();
    statuses.forEach((status) => {
      statusesMap.set(status.toObject().id, status);
    });

    const res = bids.map((bid: Bid) => {
      if (statusesMap.has(bid.statusId)) {
        bid.status = statusesMap.get(bid.statusId)?.name;
      }
      return bid;
    });

    return {
      items: res,
      total: count,
      limit: Number(limit),
      offset: Number(offset),
    };
  }

  async getBidDetails(bidId: string): Promise<Bid> {
    const bid = await this.model.findById(bidId).exec();
    const productIds = [];
    productIds.push(bid.productId);

    const getProductsRes = await this.v2Service.getProducts({
      productIds: [...productIds],
    });

    const prodsMap = new Map<string, GetProductsResponse_Product>();
    if (getProductsRes.products) {
      getProductsRes.products.forEach((prod: GetProductsResponse_Product) => {
        prodsMap.set(prod.productId, prod);
      });
    }
    if (prodsMap.has(bid.productId)) {
      bid.startBid = prodsMap.get(bid.productId)?.startBid;
      bid.sellerId = prodsMap.get(bid.productId)?.sellerId;
      bid.sellerName = prodsMap.get(bid.productId)?.sellerName;
    }
    const status = await this.statusService.findOne({ _id: bid.statusId });
    bid.status = status.displayName;
    const getUserResponse = await this.v2Service.getUser({ id: bid.userId });
    bid.buyerName = getUserResponse.name;
    bid.transaction = TransactionStatusEnum.AUTHORISED;
    if (!bid.isAuthorizedTransaction) {
      const transactionRes = await this.paymentService.getTransactionById({
        transactionId: bid.transactionId,
      });
      bid.transaction = transactionRes.transactionStatusId;
      if (bid.transaction === TransactionStatusEnum.AUTHORISED) {
        bid.isAuthorizedTransaction = true;
        await bid.save();
      }
    }
    return bid;
  }

  async create(createBidDto: CreateBidDto): Promise<BidDocument> {
    const productsRes = await this.v2Service.getProductStatuses({
      productId: createBidDto.productId,
    });
    if (productsRes?.expired || productsRes?.sold || productsRes?.deleted) {
      throw new BadRequestException('The product is expired/sold/deleted');
    }
    const statuses = await this.statusService.findAll();
    const statusesMap = new Map<string, StatusDocument>();
    statuses.forEach((status: StatusDocument) => {
      statusesMap.set(status.name, status);
    });
    const duplicatedBid = await this.model
      .findOne({
        productId: createBidDto.productId,
        userId: createBidDto.userId,
        statusId: statusesMap.get(BidStatus.OPEN).toObject().id,
        isAuthorizedTransaction: true,
      })
      .exec();
    if (duplicatedBid) {
      throw new BadRequestException(
        'The bid is already created for this product',
      );
    }
    const { commissionSummary, product } =
      await this.v2Service.getBidSummaryForOne({
        productId: createBidDto.productId,
        bidPrice: createBidDto.amount,
        allPayments: false,
        paymentOptionId: createBidDto.paymentOptionId,
        userId: createBidDto.userId,
      });
    if (!commissionSummary) {
      throw new BadRequestException('No commissions was found');
    }
    const commissionSummaryBreakDown =
      commissionSummary.withPromo || commissionSummary.withoutPromo;
    if (createBidDto.amount < product?.startBid) {
      throw new BadRequestException('This bid is less than start bid');
    }

    const paymentReq: CreateTransactionRequest = {
      userId: createBidDto.userId,
      productId: createBidDto.productId,
      amount: commissionSummaryBreakDown?.grandTotal,
      paymentOptionId: createBidDto.paymentOptionId,
      soumTransactionNumber: generateSoumTrackingNumber(),
      transactionType: TransactionTypeEnum.BIDDING,
      items: [],
      orderId: '',
      returnUrls: [],
    };
    const map = new Map();
    map.set('lang', createBidDto.lang);
    const transaction = await this.paymentService.createTransaction(
      paymentReq,
      map,
    );
    if (!transaction.transactionId) {
      throw new BadRequestException('Fail to payment');
    }
    const bidSettings = await this.bidSettingsService.getBidSettings();
    const expiredTime = ((bidSettings?.config as any) || []).find(
      (item) => item?.name === 'biddingExperationTime',
    );
    const updatedBid = await this.model
      .findOneAndUpdate(
        {
          productId: createBidDto.productId,
          userId: createBidDto.userId,
          isAuthorizedTransaction: true,
        },
        {
          ...createBidDto,
          statusId: statusesMap.get(BidStatus.OPEN).toJSON().id,
          productName: product?.productName,
          productNameAr: product?.productNameAr,
          transactionId: transaction.transactionId,
          isAuthorizedTransaction: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          expiresAt: new Date(
            Date.now() + (Number(expiredTime?.value) || 24) * 3600 * 1000,
          ),
        },
        {
          new: true,
          upsert: true,
        },
      )
      .exec();

    return {
      ...updatedBid.toJSON(),
      grandTotal: paymentReq.amount,
      checkoutId: transaction.checkoutId,
      checkoutURL: transaction.checkoutURL,
    };
  }

  async updateBidAfterCheckOut({ transactionId }) {
    const updatedBid = await this.model
      .findOneAndUpdate(
        {
          transactionId,
        },
        {
          isAuthorizedTransaction: true,
          updatedAt: new Date(),
        },
        {
          new: true,
          upsert: true,
        },
      )
      .exec();
    const highestBid = await this.getHighestBid({
      productId: updatedBid.productId,
    });
    // update highest one in Agolia
    await this.v2Service.updateHighestBid({
      productId: highestBid.productId,
      bid: highestBid.amount,
    });

    // Send webengage event
    const webEngageData = {
      'Bid Amount': highestBid.amount,
      'Payment Status': 'Success',
    };
    let dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
    await sendEventData(
      highestBid.userId,
      'Buyer - Bid Placed Successfully',
      dateFormat,
      webEngageData,
    );

    const getProductsRes = await this.v2Service.getProducts({
      productIds: [highestBid.productId],
    });
    if (getProductsRes.products.length < 1) {
      return {};
    }
    // Send webengage event for seller
    const product = getProductsRes.products.pop();
    dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
    const webEngageSellerData = {
      'Bid Amount': highestBid.amount,
      'Product ID': highestBid.productId,
    };
    await sendEventData(
      product.sellerId,
      'Seller - Bid Placed',
      dateFormat,
      webEngageSellerData,
    );

    return {};
  }

  async getHighestBid({ productId }): Promise<Bid> {
    const openStatus = await this.statusService.findOne({
      name: BidStatus.OPEN,
    });
    return this.model
      .findOne({
        productId,
        isAuthorizedTransaction: true,
        statusId: openStatus.toObject().id,
        expiresAt: { $gte: moment().toDate() },
      })
      .sort('-amount')
      .exec();
  }

  async load({ id }): Promise<Bid> {
    return this.model.findOne({ _id: id }).exec();
  }

  async findByProduct({
    offset,
    limit,
    productId,
  }): Promise<PaginatedDto<Bid>> {
    const matchCondition: any = productId ? { productId } : {};
    const statuses = await this.statusService.findAll();

    const statusMapById = new Map();
    statuses.forEach((item: StatusDocument) => {
      const localItem = item.toObject();
      statusMapById.set(localItem.name, item.toObject().id);
    });

    let bids = await this.model.aggregate([
      {
        $match: matchCondition,
      },
      {
        $project: {
          _id: 1,
          productId: 1,
          userId: 1,
          statusId: 1,
          transactionId: 1,
          productName: 1,
          productNameAr: 1,
          amount: 1,
          expiresAt: 1,
          createdAt: 1,
          updatedAt: 1,
          isAuthorizedTransaction: 1,
          sortOrder: {
            $cond: {
              if: { $eq: ['$statusId', statusMapById.get(BidStatus.OPEN)] },
              then: 1,
              else: {
                $cond: {
                  if: {
                    $eq: ['$statusId', statusMapById.get(BidStatus.EXPIRED)],
                  },
                  then: 2,
                  else: 3,
                },
              },
            },
          },
        },
      },
      {
        $sort: {
          isAuthorizedTransaction: -1,
          sortOrder: 1,
          amount: -1,
          expiresAt: 1,
        },
      },
      { $limit: Number(offset) + Number(limit) },
      { $skip: Number(offset) },
      {
        $project: {
          _id: 0,
          id: '$_id',
          productId: 1,
          userId: 1,
          statusId: 1,
          transactionId: 1,
          productName: 1,
          productNameAr: 1,
          amount: 1,
          expiresAt: 1,
          createdAt: 1,
          updatedAt: 1,
          isAuthorizedTransaction: 1,
        },
      },
    ]);

    const statusMap = new Map();
    statuses.forEach((item: StatusDocument) => {
      const localItem = item.toObject();
      statusMap.set(localItem.id, item);
    });

    bids = bids.map((item) => {
      item.status = statusMap.get(item.statusId)['name'];
      return item;
    });

    const count = await this.model.count(matchCondition).exec();

    return {
      items: bids,
      total: count,
      limit: Number(limit),
      offset: Number(offset),
    };
  }

  async getStartingPrice({
    variantId,
    conditionId,
  }): Promise<GetMarketPriceByVariantIdResponse> {
    const settingItem = await this.bidSettingsService.getBidingBase();
    const res = await this.categoryService.GetCategoryConditionPriceRange({
      variantId,
      conditionId,
      catConditionQuality: settingItem.value as CatConditionQualityEnum,
    } as GetCatConPriceRangeRequest);
    const priceRange = res
      ? res?.priceRange
      : ({ min: 0, max: 0 } as PriceNudge);
    const bidSettings =
      await this.bidSettingsService.getBidStartingBidPricePercentage();
    const calculatedMinPrice =
      priceRange.min - (priceRange.min * bidSettings?.value) / 100;

    return {
      minPrice: Math.round(calculatedMinPrice * 100) / 100,
      maxPrice: res.priceRange.max,
    };
  }

  async findMyBids({ offset, limit, userId }): Promise<PaginatedDto<Bid>> {
    const acceptedStatus = await this.statusService.findOne({
      name: BidStatus.ACCEPTED,
    });
    let matchCondition: any = {
      statusId: { $ne: acceptedStatus.toObject().id },
      isAuthorizedTransaction: true,
    };
    if (userId) {
      matchCondition = { ...matchCondition, ...{ userId } };
    }

    let bids = await this.model
      .find(matchCondition)
      .skip(offset)
      .limit(limit)
      .sort({ amount: -1, expiresAt: 1 })
      .exec();

    const count = await this.model.count(matchCondition).exec();

    const statuses = await this.statusService.findAll();

    const statusMap = new Map();
    statuses.forEach((item: StatusDocument) => {
      const localItem = item.toObject();
      statusMap.set(localItem.id, item);
    });
    bids = bids.map((item) => {
      item.status = statusMap.get(item.statusId)['name'];
      return item;
    });

    return {
      items: bids,
      total: count,
      limit: Number(limit),
      offset: Number(offset),
    };
  }

  async getBidBasicSummary({
    productId,
    bid,
    userId = '',
    paymentOptionId = null,
  }) {
    const { commissionSummary, product } =
      await this.v2Service.getBidSummaryForOne({
        productId,
        bidPrice: bid,
        userId,
        allPayments: false,
        paymentOptionId,
      });

    if (!commissionSummary) {
      throw new BadRequestException('No commissions was found');
    }
    return {
      product: product,
      commissionSummary: this.mapCommissionSummary(commissionSummary),
    };
  }

  async getBidPaymentSummaries({
    productId,
    bid,
    userId = '',
    paymentOptionId = null,
  }) {
    const { commissionSummaries, product } =
      await this.v2Service.getBidPaymentSummaries({
        productId,
        bidPrice: bid,
        userId,
        allPayments: true,
        paymentOptionId,
      });

    if (!commissionSummaries.length) {
      throw new BadRequestException('No commissions was found');
    }
    const commissionsObject: any = {};
    for (const elem of commissionSummaries) {
      commissionsObject[elem.withoutPromo.paymentId] =
        this.mapCommissionSummary(elem);
    }
    return {
      product: product,
      commissionSummaries: commissionsObject,
    };
  }

  mapCommissionSummary(commissionSummary: BreakDownResponse) {
    const { withPromo, withoutPromo } = commissionSummary;
    const productPriceSummary = {
      itemSellPrice: withoutPromo.sellPrice,
      commission: withoutPromo.commission,
      vat: withoutPromo.totalVat,
      shipping: withoutPromo.deliveryFee,
      grandTotal: withoutPromo.grandTotal,
      commissionAnalysis: withoutPromo.commissionAnalysis || {},
    };
    const productPriceDiscountSummary = withPromo
      ? {
          itemSellPrice: withPromo?.sellPrice,
          commission: withPromo?.commission,
          vat:
            Number(withPromo?.commissionVat) + Number(withPromo.deliveryFeeVat),
          shipping: withPromo?.deliveryFee,
          grandTotal: withPromo?.grandTotal,
          discountValue: withPromo.discount,
          totalDiscount:
            Number(withoutPromo.grandTotal) - Number(withPromo.grandTotal),
          commissionAnalysis: withPromo.commissionAnalysis || {},
        }
      : null;

    return {
      productPriceSummary,
      productPriceDiscountSummary,
    };
  }

  async getDetailWithProductStatues({ id }) {
    let bid = await this.model.findOne({ _id: id }).exec();
    if (!bid) {
      throw new NotFoundException('Bid not found');
    }
    bid = bid.toObject();
    const productStatuses = await this.v2Service.getProductStatuses({
      productId: bid.productId,
    });
    const status = await this.statusService.findOne({ _id: bid.statusId });
    bid.status = status.name;

    return { ...bid, ...{ productStatuses } };
  }

  async acceptBid({ id, clientType }) {
    const bid = await this.model.findById(id).exec();
    const productsRes = await this.v2Service.getProductStatuses({
      productId: bid.productId,
    });
    if (productsRes?.expired || productsRes?.sold || productsRes?.deleted) {
      throw new BadRequestException('The product is expired/sold/deleted');
    }
    let captureRes;
    try {
      captureRes = await this.paymentService.captureTransaction({
        transactionId: bid.transactionId,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Fail to capture transaction');
    }
    if (
      !captureRes &&
      !captureRes?.transactionStatusId &&
      captureRes?.transactionStatusId !== 'Completed'
    ) {
      throw new BadRequestException('Fail to capture payment');
    }
    const transactionRes = await this.paymentService.getTransactionById({
      transactionId: bid.transactionId,
    });
    let newOrder;
    let updatedBid;
    const statuses = await this.statusService.findAll();
    const statusMapById = new Map();
    statuses.forEach((item: StatusDocument) => {
      const localItem = item.toObject();
      statusMapById.set(localItem.name, localItem.id);
    });
    try {
      // update status bid to accepted
      const acceptedStatusId = statusMapById.get(BidStatus.ACCEPTED);
      updatedBid = await this.model.findByIdAndUpdate(id, [
        {
          $set: {
            statusId: acceptedStatusId,
            updatedAt: new Date(),
          },
        },
      ]);
      updatedBid.transaction = captureRes.transactionStatusId;
      // create order
      newOrder = await this.v2Service.createOrder({
        productId: bid.productId,
        paymentOptionId: transactionRes.paymentOptionId,
        userId: bid.userId,
        amount: bid.amount,
        soumTransactionNumber: transactionRes.soumTransactionNumber,
        clientType,
      });
      updatedBid = await this.model.findByIdAndUpdate(id, [
        {
          $set: {
            orderId: newOrder.orderId,
            dmOrderId: newOrder.dmOrderId,
            updatedAt: new Date(),
          },
        },
      ]);
      updatedBid.orderId = newOrder.orderId;
      updatedBid.dmOrderId = newOrder.dmOrderId;
      updatedBid.transaction = captureRes.transactionStatusId;
      // Send webengage event
      const webEngageData = {
        'Bid Amount': bid.amount,
        'Product ID': bid.productId,
      };
      const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
      await sendEventData(
        bid.userId,
        'Buyer - Bid Accepted',
        dateFormat,
        webEngageData,
      );
    } catch (error) {
      console.log(error);
      await this.model.findByIdAndUpdate(id, [
        {
          $set: {
            statusId: statusMapById.get(BidStatus.OPEN),
            updatedAt: new Date(),
          },
        },
      ]);
      throw new BadRequestException('Fail to create order');
    }
    // update to others bid
    await this.refundOtherBids(bid, statusMapById);
    return updatedBid;
  }

  async delete({ id, userId }): Promise<{ status: string }> {
    const bid = await this.model.findOne({ _id: id }).exec();
    if (!bid || bid.userId !== userId) {
      throw new NotFoundException('Bid not found');
    }

    const openStatus = await this.statusService.findOne({
      name: BidStatus.OPEN,
    });
    if (bid.statusId !== openStatus.toObject().id) {
      throw new NotFoundException('Bid not found');
    }
    try {
      let deleteThisBid = false;
      if (bid.isAuthorizedTransaction) {
        const result = await this.paymentService.reverseTransaction({
          transactionId: bid.transactionId,
        });
        if (result.transactionStatusId === 'Canceled/Reversed') {
          deleteThisBid = true;
        }
      } else {
        deleteThisBid = true;
      }
      if (deleteThisBid) {
        const deletedStatus = await this.statusService.findOne({
          name: BidStatus.DELETED,
        });
        bid.statusId = deletedStatus.toObject().id;
        bid.updatedAt = new Date();
        await bid.save();

        const highestBid = await this.getHighestBid({
          productId: bid.productId,
        });
        let updatedAmount = 0;
        if (highestBid) {
          updatedAmount = highestBid.amount;
        }
        // update highest one in Agolia
        await this.v2Service.updateHighestBid({
          productId: bid.productId,
          bid: updatedAmount,
        });
      }
      return { status: 'Ok' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Refund was unsuccessful');
    }
  }

  async refundOtherBids(
    bid: BidDocument,
    statusMapById: Map<any, any>,
  ): Promise<any> {
    const matchCondition: any = {
      _id: {
        $ne: new mongoose.Types.ObjectId(bid?.toObject()?.id?.toString()),
      },
      productId: bid.productId,
      statusId: statusMapById.get(BidStatus.OPEN),
      isAuthorizedTransaction: true,
    };
    const remainingBids = await this.model.find(matchCondition).exec();
    return Promise.all(
      remainingBids.map(async (bid) => {
        try {
          let updateThisBid = false;
          const result = await this.paymentService.reverseTransaction({
            transactionId: bid.transactionId,
          });
          updateThisBid = result.transactionStatusId === 'Canceled/Reversed';
          if (updateThisBid) {
            bid.statusId = statusMapById.get(BidStatus.EXPIRED);
            return this.model.findByIdAndUpdate(
              bid.toObject().id,
              [
                {
                  $set: {
                    statusId: bid.statusId,
                    updatedAt: new Date(),
                  },
                },
              ],
              { new: true },
            );
          }
        } catch (error) {
          console.log(
            `Refund was unseccussful for bid: ${
              bid.toObject().id
            }, error: ${error}`,
          );
        }
      }),
    );
  }

  async clearExpiredBids({ productIds = null }): Promise<any> {
    const openStatus = await this.statusService.findOne({
      name: BidStatus.OPEN,
    });
    let matchCondition: any = {
      expiresAt: { $lte: moment().toDate() },
      statusId: openStatus.toObject().id,
    };
    if (productIds) {
      if (!Array.isArray(productIds)) {
        productIds = [productIds];
      }
      matchCondition = {
        productId: { $in: productIds },
        statusId: openStatus.toObject().id,
      };
    }
    const bids = await this.model.find(matchCondition).exec();
    const expiredStatus = await this.statusService.findOne({
      name: BidStatus.EXPIRED,
    });

    return Promise.all(
      bids.map(async (bid) => {
        try {
          let updateThisBid = false;
          if (bid.isAuthorizedTransaction) {
            const result = await this.paymentService.reverseTransaction({
              transactionId: bid.transactionId,
            });
            if (result.transactionStatusId === 'Canceled/Reversed') {
              updateThisBid = true;
            }
          } else {
            updateThisBid = true;
          }
          if (updateThisBid) {
            bid.statusId = expiredStatus.toObject().id;
            return this.model.findByIdAndUpdate(
              bid.toObject().id,
              [
                {
                  $set: {
                    statusId: expiredStatus.toJSON().id,
                    updatedAt: new Date(),
                  },
                },
              ],
              { new: true },
            );
          }

          return { status: 'Fail' };
        } catch (error) {
          console.log(
            `Refund was unseccussful for bid: ${
              bid.toObject().id
            }, error: ${error}`,
          );
        }
      }),
    );
  }

  async getTrackingMyBids({
    offset,
    limit,
    userId,
  }): Promise<PaginatedDto<PurchaseBidDto>> {
    const matchCondition: any = { userId: userId };
    const bids = await this.model
      .find(matchCondition)
      .skip(offset)
      .limit(limit)
      .sort({ amount: -1, expiresAt: 1 })
      .exec();
    const count = await this.model.count(matchCondition).exec();

    const productIds = bids.map((bid: Bid) => bid.productId);
    const getProductsRes = await this.v2Service.getProducts({
      productIds: [...productIds],
    });

    const prodsMap = new Map<string, GetProductsResponse_Product>();
    if (getProductsRes.products) {
      getProductsRes.products.forEach((prod: GetProductsResponse_Product) => {
        prodsMap.set(prod.productId, prod);
      });
    }

    const statuses = await this.statusService.findAll();
    const statusesMap = new Map<string, StatusDocument>();
    statuses.forEach((status: StatusDocument) => {
      statusesMap.set(status.toObject().id, status);
    });

    const mappingBids: PurchaseBidDto[] = [];
    await Promise.all(
      bids.map(async (bid: Bid) => {
        try {
          if (prodsMap.has(bid.productId)) {
            const productStatuses: ProductStatus = {
              deleted: prodsMap.get(bid.productId).isDeleted,
              expired: prodsMap.get(bid.productId).isExpired,
              sold: prodsMap.get(bid.productId).isSold,
            };
            const mappingBid: PurchaseBidDto = {
              ...(bid as any).toObject(),
              productImg: prodsMap.get(bid.productId).productImg,
              bidId: bid.id,
              productName: bid.productName,
              productNameAr: bid.productNameAr,
              status: statusesMap.get(bid.statusId)?.displayName,
              productStatuses,
            };
            mappingBids.push(mappingBid);
          }
        } catch (error) {
          console.log(`Get purchased bid fails: ${error}`);
        }
      }),
    );

    return {
      items: mappingBids,
      total: count,
      limit: Number(limit),
      offset: Number(offset),
    };
  }
}
