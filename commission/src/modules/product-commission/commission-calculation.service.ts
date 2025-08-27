import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CommissionModule,
  CommissionType,
} from '../commission/enum/commissionType.enum';
import { PriceRanges } from '../commission/enum/priceRanges.enum';
import { ProductAccessSource } from '../commission/enum/productAccessSource.enum';
import { PromoType } from './enum/promoType.enum';
import { PromoGenerator } from './enum/promoGenerator.enum';
import {
  Commission,
  CommissionDocument,
} from '../commission/schemas/commission.schema';
import {
  AddOn,
  CalculateAddonSummaryRequest,
  CalculateAddonSummaryResponse,
  CalculationSettings,
  CreateCommissionSummaryRequest,
  ForceUpdateCommissionRequest,
  Product,
  PromoCode,
} from '../grpc/proto/commission.pb';
import {
  AddOnCalculations,
  CommissionAnalysis,
  ProductCommission,
} from './schemas/product-commission.schema';
import { PriceRangeOperator } from '../commission/enum/PriceRangeOperator.enum';
@Injectable()
export class CommissionCalculationService {
  calculateCommission(data: {
    product: Product;
    commissions: CommissionDocument[];
  }) {
    const commissionResults = data.commissions.map((elem) => {
      if (elem.commissionModule === CommissionModule.REAL_ESTATE_VAT) return 0; // We shoudn't add Real estate VAT to commissions.
      if (CommissionType.FIXED == elem.type) return elem.minimum;
      if (CommissionType.PERCENTAGE == elem.type) {
        const commissionValue =
          (data?.product?.sellPrice * elem.percentage) / 100;
        if (Math.abs(commissionValue) < elem.minimum) return elem.minimum;
        if (
          Math.abs(commissionValue) >= elem.minimum &&
          Math.abs(commissionValue) < elem.maximum
        )
          return commissionValue;
        return elem.maximum;
      }
      if (CommissionType.PRICE_QUALITY == elem.type) {
        const fairCommission =
          (data?.product?.sellPrice * elem.ranges.fairPercentage) / 100;

        const excellentCommission =
          (data?.product?.sellPrice * elem.ranges.excellentPercentage) / 100;

        const expensiveCommission =
          (data?.product?.sellPrice * elem.ranges.expensivePercentage) / 100;
        if (
          [
            PriceRanges.FAIR,
            PriceRanges.FAIR_EXPENSIVE,
            PriceRanges.ABOVE,
          ].includes(data?.product?.priceRange as PriceRanges)
        )
          return fairCommission;
        if (PriceRanges.EXCELLENT == data?.product?.priceRange)
          return excellentCommission;
        if (
          [PriceRanges.EXPENSIVE, PriceRanges.EXPENSIVE_UPPER].includes(
            data?.product?.priceRange as PriceRanges,
          )
        )
          return expensiveCommission;
        else return 0;
      }
    });
    return commissionResults.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );
  }

  getNewSellPriceAfterDiscount(data: {
    sellPrice: number;
    commission: number;
    discount: number;
    isBuyer: boolean;
  }) {
    if (data.commission == 0) {
      return {
        newSellPrice: data.isBuyer
          ? data.sellPrice - data.discount
          : data.sellPrice,
        newCommission: 0,
      };
    }
    if (data.commission >= data.discount)
      return {
        newSellPrice: data.sellPrice,
        newCommission: data.commission - data.discount,
      };
    const discountChange = data.discount - data.commission;
    return {
      newSellPrice: data.isBuyer
        ? data.sellPrice - discountChange
        : data.sellPrice,
      newCommission: 0,
    };
  }

  calculateDiscount(data: {
    promoCode: PromoCode;
    product: Product;
    settings: CalculationSettings;
  }) {
    if (data.promoCode.promoLimit > data.product.sellPrice) return 0;
    let discountValue = 0;
    if (PromoType.PERCENTAGE == data.promoCode.type) {
      discountValue =
        (data.product.sellPrice * data.promoCode.percentage) / 100;
      discountValue =
        discountValue > data.promoCode.discount
          ? data.promoCode.discount
          : discountValue;
    } else {
      discountValue = data.promoCode.discount;
    }

    if (
      data.promoCode.generator === PromoGenerator.REFERRAL &&
      discountValue > data.settings.referralFixedAmount
    )
      discountValue = data.settings.referralFixedAmount;

    return discountValue;
  }

  calculateVat(vatPercentage: number, totalCommission: number) {
    return (totalCommission * vatPercentage) / 100;
  }

  calculateDF(data: {
    product: Product;
    settings: CalculationSettings;
    totalPrice: number;
  }) {
    const deliveryFee = data.settings.deliveryFee;
    let sourceDeliveryFeeFlag = true;

    if (ProductAccessSource.SPP == data.product.source)
      sourceDeliveryFeeFlag = data.settings.applyDeliveryFeeSPPs;
    if (ProductAccessSource.MPP == data.product.source)
      sourceDeliveryFeeFlag = data.settings.applyDeliveryFeeMPPs;
    const applyDeliveryFee =
      (data.settings.applyDeliveryFee && sourceDeliveryFeeFlag) || false;

    if (
      !(
        applyDeliveryFee && data.totalPrice < data.settings.deliveryFeeThreshold
      )
    ) {
      return 0;
    }
    return deliveryFee;
  }

  formatPriceInDecimalPoints(price: number, decimals: number) {
    return Number(
      Math.round(Math.trunc(Number(price) * 1000) / 10) /
        Math.pow(10, decimals),
    );
  }

  getProductCommissionSummary(
    payload: CreateCommissionSummaryRequest,
    commissions: CommissionDocument[],
  ) {
    let sellPrice = payload.product.sellPrice;
    let commission = this.calculateCommission({
      product: payload.product,
      commissions,
    });

    let commissionDiscount = 0;
    let discount = 0;
    if (payload.promoCode) {
      discount = this.calculateDiscount({
        promoCode: payload.promoCode,
        product: payload.product,
        settings: payload.calculationSettings,
      });
      const { newCommission, newSellPrice } = this.getNewSellPriceAfterDiscount(
        {
          sellPrice: sellPrice,
          commission,
          discount,
          isBuyer: payload.commission.isBuyer,
        },
      );
      commissionDiscount = commission - newCommission;
      commission = newCommission;
      sellPrice = newSellPrice;
    }
    const commissionVat = this.calculateVat(
      payload.calculationSettings.vatPercentage,
      commission,
    );
    let DF = 0,
      DFVat = 0;
    if (payload.commission.isBuyer) {
      DF = this.calculateDF({
        product: payload.product,
        settings: payload.calculationSettings,
        totalPrice: sellPrice + commission + commissionVat,
      });
      DFVat = this.calculateVat(payload.calculationSettings.vatPercentage, DF);
    }

    let realEstateVat = 0;
    const realEstateVatCommission: CommissionDocument = commissions.find(
      (item) => item.commissionModule === CommissionModule.REAL_ESTATE_VAT,
    );
    if (payload.commission.isBuyer && realEstateVatCommission) {
      realEstateVat = this.calculateRealEstateVat(
        sellPrice,
        realEstateVatCommission.percentage,
      );
      // We don't charge delivery fee for real estate category
      DF = 0;
      DFVat = 0;
    }

    const commissionAnalysis = this.calculateAnalysis(
      payload.product,
      payload.calculationSettings,
      commissions,
      DFVat,
    );
    const grandTotalForBuyer =
      this.formatPriceInDecimalPoints(sellPrice, 2) +
      this.formatPriceInDecimalPoints(commission, 2) +
      this.formatPriceInDecimalPoints(commissionVat, 2) +
      this.formatPriceInDecimalPoints(DF, 2) +
      this.formatPriceInDecimalPoints(DFVat, 2) +
      this.formatPriceInDecimalPoints(realEstateVat, 2);

    const grandTotalForSeller =
      this.formatPriceInDecimalPoints(sellPrice, 2) -
      (this.formatPriceInDecimalPoints(commission, 2) +
        this.formatPriceInDecimalPoints(commissionVat, 2) +
        this.formatPriceInDecimalPoints(DF, 2) +
        this.formatPriceInDecimalPoints(DFVat, 2));

    const grandTotal = payload.commission.isBuyer
      ? grandTotalForBuyer
      : grandTotalForSeller;

    let reservation = null;
    if (payload.reservation && payload.calculationSettings.applyReservation) {
      reservation = this.calculateReservation(
        grandTotal,
        payload.reservation?.reservationAmount || 0,
      );
    }
    const calculationSummary = {
      paymentId: payload?.paymentOption?.id,
      productId: payload.product?.id,
      sellPrice: this.formatPriceInDecimalPoints(sellPrice, 2),
      commission: this.formatPriceInDecimalPoints(commission, 2),
      commissionVat: this.formatPriceInDecimalPoints(commissionVat, 2),
      deliveryFee: this.formatPriceInDecimalPoints(DF, 2),
      deliveryFeeVat: this.formatPriceInDecimalPoints(DFVat, 2),
      totalVat: this.formatPriceInDecimalPoints(commissionVat + DFVat, 2),
      discount: this.formatPriceInDecimalPoints(discount, 2),
      grandTotal: this.formatPriceInDecimalPoints(grandTotal, 2),
      commissions: commissions as Commission[],
      commissionDiscount: this.formatPriceInDecimalPoints(
        commissionDiscount,
        2,
      ),
      commissionAnalysis,
      reservation: reservation,
      financingRequest: payload.calculationSettings?.applyFinancing
        ? payload.financingRequest
        : {},
      realEstateVat: this.formatPriceInDecimalPoints(realEstateVat, 2),
    } as ProductCommission;

    return calculationSummary;
  }

  calculateAnalysis(
    product: Product,
    calculationSettings: CalculationSettings,
    commissions: CommissionDocument[],
    DFVat: number,
  ) {
    const paymentCommission = this.calculateCommission({
      product: product,
      commissions: commissions.filter(
        (elem) => (elem.paymentOptionIds || []).length != 0,
      ),
    });
    const paymentCommissionVat = this.calculateVat(
      calculationSettings?.vatPercentage,
      paymentCommission,
    );

    const nonPaymentCommission = this.calculateCommission({
      product: product,
      commissions: commissions.filter(
        (elem) => (elem.paymentOptionIds || []).length == 0,
      ),
    });

    const nonPaymentCommissionVat = this.calculateVat(
      calculationSettings?.vatPercentage,
      nonPaymentCommission,
    );
    const commissionTotalFixed = commissions
      .filter((elem) => elem.type == CommissionType.FIXED)
      .reduce((accumulator, commission) => accumulator + commission.minimum, 0);
    let commissionTotalPercentage = commissions
      .filter((elem) => elem.type == CommissionType.PERCENTAGE)
      .reduce(
        (accumulator, commission) => accumulator + commission.percentage,
        0,
      );

    const penaltyCommissions = this.calculateCommission({
      product: product,
      commissions: commissions.filter(
        (elem) => CommissionModule.PENALTY === elem.commissionModule,
      ),
    });
    const penaltyCommissionVat = this.calculateVat(
      calculationSettings?.vatPercentage,
      penaltyCommissions,
    );
    const PriceQualityCommissions = commissions.filter(
      (elem) => elem.type == CommissionType.PRICE_QUALITY,
    );

    if (
      PriceQualityCommissions?.length &&
      PriceRanges.FAIR === product?.priceRange
    ) {
      commissionTotalPercentage += PriceQualityCommissions.reduce(
        (accumulator, commission) =>
          accumulator + commission?.ranges?.fairPercentage || 0,
        commissionTotalPercentage,
      );
    } else if (
      PriceQualityCommissions?.length &&
      PriceRanges.EXPENSIVE === product?.priceRange
    ) {
      commissionTotalPercentage += PriceQualityCommissions.reduce(
        (accumulator, commission) =>
          accumulator + commission?.ranges?.expensivePercentage || 0,
        commissionTotalPercentage,
      );
    } else if (
      PriceQualityCommissions?.length &&
      PriceRanges.EXCELLENT === product?.priceRange
    ) {
      commissionTotalPercentage += PriceQualityCommissions.reduce(
        (accumulator, commission) =>
          accumulator + commission?.ranges?.excellentPercentage || 0,
        commissionTotalPercentage,
      );
    }
    let realEstateVat = 0;
    const realEstateVatCommission: CommissionDocument = commissions.find(
      (item) => item.commissionModule === CommissionModule.REAL_ESTATE_VAT,
    );
    if (realEstateVatCommission) {
      realEstateVat = this.calculateRealEstateVat(
        product.sellPrice,
        realEstateVatCommission.percentage,
      );
    }
    return {
      paymentCommission: this.formatPriceInDecimalPoints(paymentCommission, 2),
      paymentCommissionVat: this.formatPriceInDecimalPoints(
        paymentCommissionVat,
        2,
      ),
      paymentCommissionWithVat: this.formatPriceInDecimalPoints(
        paymentCommissionVat + paymentCommission,
        2,
      ),
      nonPaymentCommission: this.formatPriceInDecimalPoints(
        nonPaymentCommission,
        2,
      ),
      nonPaymentCommissionVat: this.formatPriceInDecimalPoints(
        nonPaymentCommissionVat,
        2,
      ),
      nonPaymentCommissionWithVat: this.formatPriceInDecimalPoints(
        nonPaymentCommission + nonPaymentCommissionVat + DFVat,
        2,
      ),
      commissionTotalFixed: this.formatPriceInDecimalPoints(
        commissionTotalFixed,
        2,
      ),
      commissionTotalPercentage: this.formatPriceInDecimalPoints(
        commissionTotalPercentage,
        2,
      ),
      penaltyCommission: this.formatPriceInDecimalPoints(penaltyCommissions, 2),
      penaltyCommissionVat: this.formatPriceInDecimalPoints(
        penaltyCommissionVat,
        2,
      ),
      realEstateVat: this.formatPriceInDecimalPoints(realEstateVat, 2),
    } as CommissionAnalysis;
  }

  filterCommissions(
    payload: CreateCommissionSummaryRequest,
    commissions: CommissionDocument[],
  ): CommissionDocument[] {
    return commissions.filter((commission) => {
      return (
        this.validatePaymentType(payload, commission) &&
        this.validatePaymentTypePriceRange(payload, commission)
      );
    });
  }

  addOnsCalculation(payload: CreateCommissionSummaryRequest) {
    let addOnsGrandTotal = 0;
    let addOnsTotal = 0;
    let addOnsVat = 0;

    const addOns = payload?.addOns;
    if (addOns && addOns?.length > 0) {
      const vatPercentage = payload.calculationSettings.vatPercentage;
      addOnsTotal =
        addOns?.reduce(
          (total: number, addon: AddOn) => total + Number(addon?.addOnPrice),
          0,
        ) || 0;

      addOnsVat = (vatPercentage / 100) * addOnsTotal;
      addOnsGrandTotal = addOnsTotal + addOnsVat;
    }

    return {
      addOnsGrandTotal: this.formatPriceInDecimalPoints(addOnsGrandTotal, 2),
      addOnsTotal: this.formatPriceInDecimalPoints(addOnsTotal, 2),
      addOnsVat: this.formatPriceInDecimalPoints(addOnsVat, 2),
    } as AddOnCalculations;
  }

  validatePaymentType(
    payload: CreateCommissionSummaryRequest,
    commission: CommissionDocument,
  ) {
    if (!(commission.paymentOptionIds || []).length) return true;
    if (!payload.paymentOption && commission.paymentOptionIds) return false;

    const paymentOption = (commission.paymentOptionIds || []).find(
      (id) => id === payload.paymentOption.id,
    );
    if (paymentOption) return true;
    return false;
  }

  validatePaymentTypePriceRange(
    payload: CreateCommissionSummaryRequest,
    commission: CommissionDocument,
  ) {
    if (!commission.priceRange) return true;
    if (
      PriceRangeOperator.LESS_THAN === commission.priceRange.operator &&
      payload.product.sellPrice < commission.priceRange.endValue
    )
      return true;
    if (
      PriceRangeOperator.BETWEEN === commission.priceRange.operator &&
      payload.product.sellPrice >= commission.priceRange.startValue &&
      payload.product.sellPrice <= commission.priceRange.endValue
    )
      return true;

    if (
      PriceRangeOperator.GREATER_THAN === commission.priceRange.operator &&
      payload.product.sellPrice > commission.priceRange.startValue
    )
      return true;
    return false;
  }

  calculateReservation(grandTotal: number, reservationAmount: number) {
    return {
      reservationAmount,
      reservationRemainingAmount: this.formatPriceInDecimalPoints(
        grandTotal - reservationAmount,
        2,
      ),
    };
  }

  calculateRealEstateVat(sellPrice: number, percentage: number) {
    const commissionValue = (sellPrice * percentage) / 100;
    return commissionValue;
  }

  calculateAddonSummary(
    payload: CalculateAddonSummaryRequest,
  ): CalculateAddonSummaryResponse {
    try {
      const totalPriceValue =
        parseFloat(
          payload.addonSummaryCalculateData
            .reduce((total, item) => total + item.addonPrice, 0)
            .toFixed(2),
        ) || 0;

      // vat percentage to be fetched from vaults
      const vat = parseFloat(((15 / 100) * totalPriceValue).toFixed(2)) || 0;

      return {
        addOnsVat: vat,
        addOnsTotal: totalPriceValue,
        addOnsGrandTotal: parseFloat((totalPriceValue + vat).toFixed(2)) || 0,
      };
    } catch (err) {
      throw new BadRequestException(
        err?.message || 'Failed to calculate addon summary',
      );
    }
  }

  calculateReplacemenmtCommissionVat(
    payload: ForceUpdateCommissionRequest,
  ): number {
    const commissionVat = (payload.buyerCommission * 15) / 100;
    return parseFloat(commissionVat.toFixed(2));
  }
}
