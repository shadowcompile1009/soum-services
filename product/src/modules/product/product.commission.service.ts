import { InjectRepository } from '@mikro-orm/nestjs';
import { CategoryService } from '../category/category.service';
import { CommissionService } from '../commission/commission.service';
import { Condition } from '../grpc/proto/category.pb';
import {
  CalculateCommissionSummaryRequest,
  CalculationSettings,
  CommissionFilters,
  Product as CommissionProduct,
  CreateCommissionSummaryRequest,
  PaymentOption,
  Reservation,
} from '../grpc/proto/commission.pb';
import { GetUserResponse } from '../grpc/proto/v2.pb';
import { V2Service } from '../v2/v2.service';
import { ReservationSummary } from './dto/productCalculationSummary.dto';
import { Product } from './entity/product.entity';
import { Settings } from './entity/settings.entity';
import { CategoryType } from './enum/categoryType.enum';
import { PaymentModuleName } from './enum/POModuleName.enum';
import { ProductAccessSource } from './enum/productAccessSource.enum';
import { SellerUserType } from './enum/sellerType.enum';
import { ProductSellType } from './enum/productSellType.enum';

export class ProductCommissionService {
  constructor(
    @InjectRepository(Product)
    private readonly categoryService: CategoryService,
    private readonly v2Service: V2Service,
    private readonly commissionService: CommissionService,
  ) {}

  async calculateSummaryCommission(data: {
    product: Product;
    settings?: Settings;
    promoCodeId?: string | null;
    source?: ProductAccessSource | null;
    isCommissionForBuyer?: boolean | true;
    allPayments?: boolean | false;
    paymentModuleName?: PaymentModuleName | PaymentModuleName.GENERAL_ORDER;
    paymentOptionId?: string;
    reservation?: ReservationSummary;
  }) {
    let priceRange = null;
    if (data.isCommissionForBuyer) {
      const condition = await this.categoryService.getProductCondition({
        id: data.product.categories.find(
          (elem) => CategoryType.CONDITION === elem.categoryType,
        )?.categoryId,
        variantId: data.product.categories.find(
          (elem) => CategoryType.VARIANT === elem.categoryType,
        )?.categoryId,
        sellPrice: data.product.sellPrice,
      });
      priceRange = condition?.priceQuality?.name || null;
    }
    let { userType, isCompliant } = await this.getSellerUserType(
      null,
      data.product.userId,
    );
    // not Compliant and seller
    userType =
      !isCompliant &&
      !data.isCommissionForBuyer &&
      data.product.sellType != ProductSellType.CONSIGNMENT
        ? SellerUserType.NOT_COMPLIANT
        : userType;
    const promoCode = data.promoCodeId
      ? await this.getPromoCode(data.promoCodeId)
      : null;
    const commissionSummaryRequest = {
      commission: {
        userType,
        isBuyer: data.isCommissionForBuyer,
      } as CommissionFilters,
      product: {
        id: data.product.id,
        sellPrice: data.product.sellPrice,
        priceRange,
        source: data.source,
        categoryId: data.product.categories.find(
          (elem) => CategoryType.CATEGORY === elem.categoryType,
        )?.categoryId,
        modelId: data.product.categories.find(
          (elem) => CategoryType.MODEL === elem.categoryType,
        )?.categoryId,
      } as CommissionProduct,
      calculationSettings: {
        vatPercentage: data.settings.vatPercentage,
        applyDeliveryFeeSPPs: data.settings.applyDeliveryFeeSPP,
        applyDeliveryFeeMPPs: data.settings.applyDeliveryFeeMPPs,
        applyDeliveryFee: data.settings.applyDF,
        deliveryFeeThreshold: data.settings.deliveryThreshold,
        deliveryFee: data.settings.deliveryFee,
        referralFixedAmount: data.settings.refFixedAmount,
        applyReservation: !!data.reservation,
      } as CalculationSettings,
      promoCode: promoCode
        ? {
            promoLimit: promoCode?.promoLimit,
            type: promoCode?.type,
            generator: promoCode?.generator,
            discount: promoCode?.discount,
            percentage: promoCode?.percentage,
          }
        : null,
      allPayments: data.allPayments,
      paymentModuleName: data.paymentModuleName,
      paymentOption: data.paymentOptionId
        ? {
            id: data.paymentOptionId,
          }
        : null,
      reservation: data.reservation
        ? {
            reservationAmount: data.reservation.reservationAmount,
          }
        : null,
    } as CalculateCommissionSummaryRequest;
    return this.commissionService.calculateProductCommissionSummary(
      commissionSummaryRequest,
    );
  }

  async calculateSummaryCommissionsFromProducts(
    products: CalculateCommissionSummaryRequest[],
  ) {
    const result =
      await this.commissionService.calculateProductCommissionSummaryForList({
        calculateCommissionSummaryRequests: products,
      });
    return result?.calculateCommissionSummaryResponses || [];
  }

  async createSummaryCommission(data: {
    product: Product;
    settings?: Settings;
    source?: ProductAccessSource | null;
    isCommissionForBuyer?: boolean | true;
    allPayments?: boolean | false;
    paymentModuleName?: PaymentModuleName | PaymentModuleName.GENERAL_ORDER;
    paymentOptionId?: string;
    reservation?: ReservationSummary;
  }) {
    let priceRange = null;
    if (data.isCommissionForBuyer) {
      const condition = await this.categoryService.getProductCondition({
        id: data.product.categories.find(
          (elem) => CategoryType.CONDITION === elem.categoryType,
        )?.categoryId,
        variantId: data.product.categories.find(
          (elem) => CategoryType.VARIANT === elem.categoryType,
        )?.categoryId,
        sellPrice: data.product.sellPrice,
      });
      priceRange = condition?.priceQuality?.name || null;
    }
    let { userType, isCompliant } = await this.getSellerUserType(
      null,
      data.product.userId,
    );
    // not Compliant and seller
    userType =
      !isCompliant &&
      !data.isCommissionForBuyer &&
      data.product.sellType != ProductSellType.CONSIGNMENT
        ? SellerUserType.NOT_COMPLIANT
        : userType;
    const promoCode = data?.product?.sellerPromoCodeId
      ? await this.getPromoCode(data.product.sellerPromoCodeId)
      : null;
    const commissionSummaryRequest = {
      commission: {
        userType,
        isBuyer: data.isCommissionForBuyer,
      } as CommissionFilters,
      product: {
        id: data.product.id,
        sellPrice: data.product.sellPrice,
        priceRange,
        source: data.source,
        categoryId: data.product.categories.find(
          (elem) => CategoryType.CATEGORY === elem.categoryType,
        )?.categoryId,
        modelId: data.product.categories.find(
          (elem) => CategoryType.MODEL === elem.categoryType,
        )?.categoryId,
      } as CommissionProduct,
      calculationSettings: {
        vatPercentage: data.settings.vatPercentage,
        applyDeliveryFeeSPPs: data.settings.applyDeliveryFeeSPP,
        applyDeliveryFeeMPPs: data.settings.applyDeliveryFeeMPPs,
        applyDeliveryFee: data.settings.applyDF,
        deliveryFeeThreshold: data.settings.deliveryThreshold,
        deliveryFee: data.settings.deliveryFee,
        referralFixedAmount: data.settings.refFixedAmount,
        applyReservation: !!data.reservation,
      } as CalculationSettings,
      promoCode: promoCode
        ? {
            promoLimit: promoCode?.promoLimit,
            type: promoCode?.type,
            generator: promoCode?.generator,
            discount: promoCode?.discount,
            percentage: promoCode?.percentage,
          }
        : null,
      allPayments: data.allPayments,
      paymentModuleName: data.paymentModuleName,
      paymentOption: data.paymentOptionId
        ? ({
            id: data.paymentOptionId,
          } as PaymentOption)
        : null,
      order: null,
      // order: {
      //   id: data.orderId,
      // } as Order,
      reservation: data.reservation
        ? ({
            reservationAmount: data.reservation.reservationAmount,
          } as Reservation)
        : null,
      addOns: null,
      financingRequest: null,
    } as CreateCommissionSummaryRequest;
    return this.commissionService.createProductCommissionSummary(
      commissionSummaryRequest,
    );
  }

  async getSellerUserType(user: GetUserResponse, userId: string) {
    if (!user) user = await this.v2Service.getUser({ id: userId });
    let userType = SellerUserType.INDIVIDUAL_SELLER;
    if (user.isKeySeller) userType = SellerUserType.KEY_SELLER;
    else if (user.isMerchant) userType = SellerUserType.MERCHANT_SELLER;
    return {
      userType: userType as SellerUserType,
      isCompliant: user.isCompliant,
    };
  }

  async productToCalculateCommissionSummaryRequest(
    product: Product,
    condition: Condition,
    user: GetUserResponse,
    promoCode: any,
    settings: Settings,
  ) {
    // calculate priceRange
    const priceRange = '',
      isBuyer = true;
    let { userType, isCompliant } = await this.getSellerUserType(
      user,
      product.userId,
    );
    // not Compliant and seller
    userType =
      !isCompliant &&
      !isBuyer &&
      product.sellType != ProductSellType.CONSIGNMENT
        ? SellerUserType.NOT_COMPLIANT
        : userType;
    return {
      commission: {
        isBuyer: true,
        userType,
      },
      product: {
        categoryId: product.categories.find(
          (elem) => CategoryType.CATEGORY === elem.categoryType,
        )?.categoryId,
        modelId: product.categories.find(
          (elem) => CategoryType.MODEL === elem.categoryType,
        )?.categoryId,
        id: product.id,
        priceRange,
        sellPrice: product.sellPrice,
        source: null,
      },
      calculationSettings: {
        vatPercentage: settings.vatPercentage,
        applyDeliveryFeeSPPs: settings.applyDeliveryFeeSPP,
        applyDeliveryFeeMPPs: settings.applyDeliveryFeeMPPs,
        applyDeliveryFee: settings.applyDF,
        deliveryFeeThreshold: settings.deliveryThreshold,
        deliveryFee: settings.deliveryFee,
        referralFixedAmount: settings.refFixedAmount,
        applyReservation: false,
      },
      promoCode: promoCode,
      allPayments: null,
      paymentModuleName: null,
      paymentOption: null,
      reservation: null,
      addonIds: null,
      financingRequest: null,
    } as CalculateCommissionSummaryRequest;
  }

  getPromoCode(id: string) {
    return this.v2Service.getPromoCode({ id });
  }
}
