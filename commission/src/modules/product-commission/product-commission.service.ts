import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { InjectModel } from '@nestjs/mongoose';
import {
  Commission,
  CommissionDocument,
} from '../commission/schemas/commission.schema';
import { Model } from 'mongoose';
import { Status } from '../commission/enum/status.enum';
import {
  CreateCommissionSummaryRequest,
  CommissionSummaryResponse,
  MigrateCommissionSummaryRequest,
  PaymentOption,
  Product,
  ProductCommissionSummaryRequest,
  UpdateSellPriceRequest,
  UpdateSellerCommissionRequest,
  CalculationSettings,
  CalculateAddonSummaryResponse,
  CalculateAddonSummaryRequest,
  CalculateCommissionSummaryRequest,
  CalculateCommissionSummaryResponse,
  CalculateCommissionSummaryResponseForList,
  ForceUpdateCommissionRequest,
} from '../grpc/proto/commission.pb';
import { CommissionCalculationService } from './commission-calculation.service';
import {
  ProductCommission,
  ProductCommissionDocument,
} from './schemas/product-commission.schema';
import { UserType } from '../commission/enum/userSellerType.enum';
import {
  CommissionModule,
  CommissionType,
} from '../commission/enum/commissionType.enum';
import { PaymentService } from '../payment/payment.service';
import { PaymentModuleName } from '../payment/enum/PO-module-name.enum';
import { PCData, PCDataDocument } from './schemas/PC-Data.schema';
import { PromoType } from './enum/promoType.enum';
import { DynamicCommissionService, DynamicCommissionRequest } from '../commission/services/dynamic-commission.service';
import { PaymentProviderType } from './enum/paymentProviderType.enum';

@Injectable()
export class ProductCommissionService {
  private readonly logger = new Logger(ProductCommissionService.name);

  constructor(
    @InjectModel(Commission.name)
    private readonly commissionModel: Model<CommissionDocument>,
    @InjectModel(PCData.name)
    private readonly pCDataModel: Model<PCDataDocument>,
    @InjectModel(ProductCommission.name)
    private readonly productCommissionModel: Model<ProductCommissionDocument>,
    private readonly commissionCalculationService: CommissionCalculationService,
    private readonly paymentService: PaymentService,
    private readonly dynamicCommissionService: DynamicCommissionService,
  ) {}

  async addSellerCommissionPenalty(
    payload: UpdateSellerCommissionRequest,
  ): Promise<CommissionSummaryResponse> {
    const commissions = [
      {
        type: CommissionType.FIXED,
        minimum: payload.sellerNewCommission,
        maximum: payload.sellerNewCommission,
        commissionModule: CommissionModule.PENALTY,
        //min and max here
        name: 'Added commission based on penalty',
      } as CommissionDocument,
    ];
    const queryObj = {
      productId: payload.product?.id,
      isBuyer: false,
    };
    const docs = await this.productCommissionModel.find(queryObj);
    const sellPrice = docs.find((elem) => elem.promoCode == null)?.sellPrice;
    const commissionSummaries = await Promise.all(
      docs.map((iterator) => {
        iterator.commissions = iterator.commissions.concat(commissions);
        return this.calculateAndSaveCommission(
          {
            commission: {
              isBuyer: false,
              userType: iterator.userType,
            },
            order: null,
            product: {
              id: iterator.productId,
              sellPrice: sellPrice,
              priceRange: payload.product.priceRange,
            } as Product,
            calculationSettings: iterator.sysSettings,
            promoCode: iterator.promoCode,
            paymentOption: null,
            paymentModuleName: null,
            reservation: null,
            financingRequest: null,
            addOns: null,
          } as CreateCommissionSummaryRequest,
          iterator.commissions as CommissionDocument[],
        );
      }),
    );
    return (
      commissionSummaries.find((elem) => elem.promoCode != null) ||
      commissionSummaries.find((elem) => elem.promoCode == null) ||
      null
    );
  }

  async updateSellerCommission(
    payload: UpdateSellerCommissionRequest,
  ): Promise<CommissionSummaryResponse> {
    const commissions = [
      {
        type: CommissionType.PERCENTAGE,
        percentage: payload.sellerNewCommission,
        minimum: 0,
        maximum: 9999,
        //min and max here
        name: 'Updated commission based on admin',
      } as CommissionDocument,
    ];
    const queryObj = {
      productId: payload.product?.id,
      isBuyer: false,
    };
    const docs = await this.productCommissionModel.find(queryObj);
    const sellPrice = docs.find((elem) => elem.promoCode == null)?.sellPrice;
    const commissionSummaries = await Promise.all(
      docs.map((iterator) => {
        return this.calculateAndSaveCommission(
          {
            commission: {
              isBuyer: false,
              userType: iterator.userType,
            },
            order: null,
            addOns: null,
            product: {
              id: iterator.productId,
              sellPrice: sellPrice,
            } as Product,
            calculationSettings: iterator.sysSettings,
            promoCode: iterator.promoCode,
            paymentOption: null,
            paymentModuleName: null,
            reservation: null,
            financingRequest: null,
          } as CreateCommissionSummaryRequest,
          commissions,
        );
      }),
    );
    return (
      commissionSummaries.find((elem) => elem.promoCode != null) ||
      commissionSummaries.find((elem) => elem.promoCode == null) ||
      null
    );
  }

  async forceUpdateSellerAndBuyerCommission(
    payload: ForceUpdateCommissionRequest,
  ): Promise<CommissionSummaryResponse> {
    try {
      const queryObj = {
        productId: payload.productId,
        orderId: payload.orderId,
        isBuyer: true,
      };
      const doc = await this.productCommissionModel.findOne(queryObj);
      if (doc) {
        doc.grandTotal = payload.grandTotal;
        doc.discount = payload.discount;
        doc.commission = parseFloat(payload.buyerCommission.toFixed(2));
        if (doc.commission > 0) {
          doc.commissionVat =
            this.commissionCalculationService.calculateReplacemenmtCommissionVat(
              payload,
            );
          doc.totalVat = doc.commissionVat + doc.deliveryFeeVat;
        }
        await doc.save();
      }
      return doc;
    } catch (err) {
      throw err;
    }
  }

  async updateSellPrice(
    payload: UpdateSellPriceRequest,
  ): Promise<CommissionSummaryResponse> {
    const queryObj = {
      productId: payload?.product?.id,
      isBuyer: false,
    };
    const docs = await this.productCommissionModel.find(queryObj);
    if (docs.length > 2 || docs.length < 1)
      throw new BadRequestException(
        'seller commission object count should be between 1 and 2',
      );

    const commissionSummaries = await Promise.all(
      docs.map((iterator) => {
        return this.calculateAndSaveCommission(
          {
            commission: {
              isBuyer: false,
              userType: iterator.userType,
            },
            order: null,
            product: {
              id: iterator.productId,
              sellPrice: payload.product.sellPrice,
              categoryId: payload.product.categoryId,
              priceRange: payload.product.priceRange,
            } as Product,
            calculationSettings: iterator.sysSettings,
            promoCode: iterator.promoCode,
            saveCalculation: true,
            paymentOption: null,
            paymentModuleName: null,
            addOns: null,
            reservation: null,
            financingRequest: null,
          } as CreateCommissionSummaryRequest,
          null,
        );
      }),
    );

    return (
      commissionSummaries.find((elem) => elem.promoCode != null) ||
      commissionSummaries.find((elem) => elem.promoCode == null) ||
      null
    );
  }

  async calculateAndSaveCommission(
    payload: CreateCommissionSummaryRequest,
    commissions: CommissionDocument[],
  ) {
    const { commissionSummaries } = await this.calculateCommissions(
      payload,
      commissions,
      false,
    );

    const withoutPromoPayload = {} as CreateCommissionSummaryRequest;
    Object.assign(withoutPromoPayload, payload);
    if (payload.promoCode) {
      delete withoutPromoPayload.promoCode;
    }
    const { withPromo, withoutPromo } = commissionSummaries[0];

    const withoutPromoResponse = await this.saveCalculation({
      commissionSummaryRequest: withoutPromoPayload,
      calculationSummary: withoutPromo as ProductCommission,
    });

    const withPromoResponse = withPromo
      ? await this.saveCalculation({
          commissionSummaryRequest: payload,
          calculationSummary: withPromo as ProductCommission,
        })
      : null;
    return withPromoResponse ? withPromoResponse : withoutPromoResponse;
  }

  async calculateCommissions(
    payload: CreateCommissionSummaryRequest,
    commissions: CommissionDocument[],
    allPayments: boolean,
  ) {
    if (!commissions) {
      commissions = await this.getCommissionsToApply(payload);
    }

    // at any time will calculate without payment id (null here)
    let payments: PaymentOption[] = [null];
    if (allPayments) {
      // get all paymentIds
      const { paymentOptions } = await this.paymentService.getAllPaymentOptions(
        {
          isEnabled: true,
          moduleName:
            payload.paymentModuleName || PaymentModuleName.GENERAL_ORDER,
        },
      );
      payments = paymentOptions;
    } else if (!allPayments && payload?.paymentOption?.id) {
      payments = [
        await this.paymentService.getPaymentOptionById({
          id: payload?.paymentOption?.id,
        }),
      ];
    }
    return {
      commissionSummaries: payments.map((payment) => {
        const paymentId = payment?.id;
        if (paymentId != null) {
          payload.paymentOption = {
            id: paymentId,
          } as PaymentOption;
        }

        const withoutPromoPayload = {} as CreateCommissionSummaryRequest;
        Object.assign(withoutPromoPayload, payload);
        if (payload.promoCode) {
          delete withoutPromoPayload.promoCode;
        }
        const filteredCommissions =
          this.commissionCalculationService.filterCommissions(
            payload,
            commissions,
          );
        return {
          withoutPromo: {
            ...this.commissionCalculationService.getProductCommissionSummary(
              withoutPromoPayload,
              filteredCommissions,
            ),
            paymentCardType: payment?.paymentCardType || '',
          },
          withPromo: payload.promoCode
            ? {
                ...this.commissionCalculationService.getProductCommissionSummary(
                  payload,
                  filteredCommissions,
                ),
                paymentCardType: payment?.paymentCardType || '',
              }
            : null,
        };
      }),
      productId: payload.product.id,
    };
  }

  async calculateCommissionsForList(
    payloads: CalculateCommissionSummaryRequest[],
  ) {
    return {
      calculateCommissionSummaryResponses: await Promise.all(
        payloads.map(async (payload) => {
          const { commissionSummaries } = await this.calculateCommissions(
            { ...payload, order: null, addOns: null },
            null,
            false,
          );
          return {
            commissionSummaries,
            productId: payload.product.id,
          } as CalculateCommissionSummaryResponse;
        }),
      ),
    } as CalculateCommissionSummaryResponseForList;
  }

  filterCommissionBasedOnPrecedence(
    commissions: CommissionDocument[],
    categoryId: string,
    modelId: string,
  ): CommissionDocument[] {
    const commissionModelBased = commissions.filter(
      (elem) =>
        (elem?.modelIds || []).includes(modelId) &&
        elem.commissionModule !== CommissionModule.REAL_ESTATE_VAT,
    );

    const commissionCategoryBased = commissions.filter(
      (elem) =>
        elem.categoryId != null &&
        elem.categoryId == categoryId &&
        elem.commissionModule !== CommissionModule.REAL_ESTATE_VAT,
    );
    const commissionNonCategoryBased = commissions.filter(
      (elem) =>
        (elem.categoryId == null && (elem.modelIds || []).length == 0) ||
        elem.commissionModule === CommissionModule.REAL_ESTATE_VAT,
    );

    if (commissionModelBased.length) {
      return commissionModelBased;
    } else if (!commissionCategoryBased.length && categoryId) {
      return commissionNonCategoryBased;
    }
    return commissionCategoryBased;
  }

  async getById(id: string): Promise<ProductCommission> {
    const doc = await this.productCommissionModel.findById(id);
    return doc.toObject() as ProductCommission;
  }

  async create(
    productCommission: ProductCommission,
  ): Promise<ProductCommission> {
    const doc = await new this.productCommissionModel(productCommission).save();
    return { id: doc.toObject().id, ...productCommission } as ProductCommission;
  }

  async saveCalculation(data: {
    commissionSummaryRequest: CreateCommissionSummaryRequest;
    calculationSummary: ProductCommission;
  }) {
    const { addOnsGrandTotal, addOnsTotal, addOnsVat } =
      this.commissionCalculationService.addOnsCalculation(
        data.commissionSummaryRequest,
      );

    data.calculationSummary.grandTotal =
      this.commissionCalculationService.formatPriceInDecimalPoints(
        data.calculationSummary.grandTotal + addOnsGrandTotal,
        2,
      );

    data.calculationSummary.addOnsVat =
      this.commissionCalculationService.formatPriceInDecimalPoints(
        addOnsVat,
        2,
      );
    data.calculationSummary.addOnsTotal =
      this.commissionCalculationService.formatPriceInDecimalPoints(
        addOnsTotal,
        2,
      );
    data.calculationSummary.addOnsGrandTotal =
      this.commissionCalculationService.formatPriceInDecimalPoints(
        addOnsGrandTotal,
        2,
      );

    const queryObj = {
      productId: data.commissionSummaryRequest.product.id,
      isBuyer: data.commissionSummaryRequest.commission.isBuyer,
      promoCode: data.commissionSummaryRequest.promoCode
        ? { $ne: null }
        : { $eq: null },
    };

    if (data.commissionSummaryRequest.commission.isBuyer)
      Object.assign(queryObj, {
        orderId: data.commissionSummaryRequest?.order?.id,
      });

    const doc = await this.productCommissionModel.findOne(queryObj);
    if (doc) {
      await this.productCommissionModel.updateOne(
        { _id: doc.toObject().id },
        {
          $set: {
            ...data.calculationSummary,
            ...data.commissionSummaryRequest.commission,
            orderId: data.commissionSummaryRequest?.order?.id,
            promoCode: data.commissionSummaryRequest.promoCode,
            sysSettings: data.commissionSummaryRequest.calculationSettings,
          },
        },
      );
      return { ...data.calculationSummary, id: doc.toObject().id };
    }
    const result = await this.create({
      ...data.calculationSummary,
      ...data.commissionSummaryRequest.commission,
      orderId: data.commissionSummaryRequest?.order?.id,
      promoCode: data.commissionSummaryRequest.promoCode,
      sysSettings: data.commissionSummaryRequest.calculationSettings,
    } as ProductCommission);
    return result;
  }

  async getCommissions(
    payload: ProductCommissionSummaryRequest,
    limit: number,
    offset: number,
  ): Promise<ProductCommission[]> {
    const queryObj: any = {};
    Object.assign(queryObj, payload);

    if (payload.isOriginalBreakDown != null) {
      queryObj.promoCode = queryObj.isOriginalBreakDown
        ? { $eq: null }
        : { $ne: null };
      delete queryObj.isOriginalBreakDown;
    }

    const doc = await this.productCommissionModel
      .find(queryObj)
      .skip(offset)
      .limit(limit);

    return doc.map((elem) => {
      const productCommission = elem.toObject() as ProductCommission;
      const commissionAnalysis =
        this.commissionCalculationService.calculateAnalysis(
          {
            id: productCommission.productId,
            sellPrice: productCommission.sellPrice,
          } as Product,
          productCommission.sysSettings as CalculationSettings,
          productCommission.commissions as CommissionDocument[],
          productCommission.deliveryFeeVat,
        );
      productCommission.commissionAnalysis = commissionAnalysis;

      return productCommission;
    });
  }

  async calculateAddonSummary(
    payload: CalculateAddonSummaryRequest,
  ): Promise<CalculateAddonSummaryResponse> {
    try {
      return this.commissionCalculationService.calculateAddonSummary(payload);
    } catch (err) {
      throw new BadRequestException(
        err?.message || 'Failed to calculate addon summary',
      );
    }
  }

  async getDynamicCommission(payload: CreateCommissionSummaryRequest): Promise<CommissionDocument[]> {
    try {
      const dynamicCommissions = await this.dynamicCommissionService.getDynamicCommissionPrice({
        variantId: payload.product.varientId,
        conditionId: payload.product.conditionId,
      });

      if (!dynamicCommissions?.length) return [];

      const filterObj: any = {
        userType: {
          $in: [UserType.ALL_SELLERS, payload.commission.userType],
        },
        isBuyer: payload.commission.isBuyer,
        status: Status.ACTIVE,
        paymentOptionIds: {
          $exists: true,
          $ne: [],
        },
      };

      // Get commissions from database
      const dbCommissions = await this.commissionModel.find(filterObj);

      const combinedCommissions = [
        ...dbCommissions,
        ...dynamicCommissions,
      ] as CommissionDocument[];

      return combinedCommissions;
    } catch (err) {
      this.logger.error('Error getting dynamic commission:', err);
      return [];
    }
  }

  async getDatabaseCommissions(
    payload: CreateCommissionSummaryRequest,
  ): Promise<CommissionDocument[]> {
    let userTypeFilter;
    if (!payload.commission.isBuyer && payload.commission.userType === UserType.NOT_COMPLIANT) {
      userTypeFilter = UserType.NOT_COMPLIANT;
    } else {
      userTypeFilter = { $in: [UserType.ALL_SELLERS, payload.commission.userType] };
    }

    const filterObj: any = {
      userType: userTypeFilter,
      $or: [
        { categoryId: payload.product.categoryId },
        { modelIds: payload.product.modelId },
        { categoryId: { $exists: false } },
        { categoryId: { $eq: null } },
      ],
      isBuyer: payload.commission.isBuyer,
      status: Status.ACTIVE,
    };
    const commissions = await this.commissionModel.find(filterObj);
    return this.filterCommissionBasedOnPrecedence(
      commissions,
      payload.product.categoryId,
      payload.product.modelId,
    );
  }

  async getCommissionsToApply(
    payload: CreateCommissionSummaryRequest,
  ): Promise<CommissionDocument[]> {
    // Check if payload.product has varientId and conditionId
    let commissions: CommissionDocument[] = [];
    if (
      payload.product.varientId &&
      payload.product.conditionId &&
      payload.commission.isBuyer
    ) {
      commissions = await this.getDynamicCommission(payload);
    }
    if (commissions?.length > 0) return commissions;

    // If not, get commissions from database
    return await this.getDatabaseCommissions(payload);
  }
  async getInstallmentPlan(
    paymentProvideType: PaymentProviderType,
    paymentAmount: number,
  ) {
    const numberOfInstallmentsMap = {
      [PaymentProviderType.Tabby]: 4,
      [PaymentProviderType.TAMARA]: 4,
      [PaymentProviderType.TAMAM]: 4,
      [PaymentProviderType.MADFU]: 4,
      [PaymentProviderType.EMKAN]: 5,
    };
    const numberOfInstallments = numberOfInstallmentsMap[paymentProvideType];
    let installments = [];
    const installmentAmount = paymentAmount / numberOfInstallments;
    for (let i = 0; i < numberOfInstallments; i++) {
      const installmentDate = new Date();
      installmentDate.setMonth(installmentDate.getMonth() + i);
      installments = [...installments, { installmentAmount, installmentDate }];
    }
    return {
      numberOfInstallments,
      installments,
    };
  }
}
