import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { Container } from 'typedi';

import moment from 'moment';
import { PaymentModuleName } from '../enums/PO-module-name.enum';
import { ProductOrderStatus, ProductStatus } from '../enums/ProductStatus.Enum';
import { ILegacyProductModel } from '../models/LegacyProducts';
import { ProductRepository } from '../repositories';
import { DeltaMachineService } from '../services/deltaMachineService';
import { ProductService } from '../services/productService';
import { SettingService } from '../services/settingService';
import { isGreatDeal } from '../util/isGreatDeal';
import { getConditions } from './category';
import {
  BidProduct,
  BreakDownResponse,
  DeviceModel,
  GetBidSummaryRequest,
  GetBidSummaryResponse,
  GetProductsForProductServiceResponse,
  GetProductsRequest,
  GetProductsResponse,
  GetProductsResponse_Product,
  GetProductStatusesRequest,
  GetProductStatusesResponse,
  GetPromoCodeRequest,
  GetPromoCodeResponse,
  GetRecentlySoldProductsRequest,
  GetViewedProductsRequest,
  GetViewedProductsResponse,
  GetViewedProductsResponse_Product,
  UpdateHighestBidRequest,
  UpdateHighestBidResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  Variant,
} from './proto/v2.pb';
import { GetCountdownValInHoursRequest } from './proto/v2/GetCountdownValInHoursRequest';
import { GetCountdownValInHoursResponse } from './proto/v2/GetCountdownValInHoursResponse';
import { ValidateSellerDetectionNudgeRequest } from './proto/v2/ValidateSellerDetectionNudgeRequest';
import { ValidateSellerDetectionNudgeResponse } from './proto/v2/ValidateSellerDetectionNudgeResponse';

import { ProductUpdateDto } from '../dto/product/ProductUpdateDto';
import { VariantDocument } from '../models/Variant';
import { VariantRepository } from '../repositories/variantRepository';
import { SearchService } from '../services/searchService';
import {
  IMappedAttribute,
  mapAttributes,
  mapMultipleAttributes,
} from '../util/attributes';
import { formatPriceInDecimalPoints } from '../util/common';
import { getPromoCodeDetailsById } from './commission';

const productService = Container.get(ProductService);
const settingService = Container.get(SettingService);
const deltaMachineService = Container.get(DeltaMachineService);
const productRepository = Container.get(ProductRepository);
const variantRepository = Container.get(VariantRepository);
const searchService = Container.get(SearchService);

export const UpdateHighestBid = async (
  call: ServerUnaryCall<UpdateHighestBidRequest, UpdateHighestBidResponse>,
  callback: sendUnaryData<UpdateHighestBidResponse>
) => {
  try {
    const { productId, bid } = call.request;
    // update highest bid due to unused Agolia reflection
    await productRepository.updateHighestBidProduct(productId, bid);
    // Push product to typesense
    // await searchService.updateHighestBid([productId], bid);

    callback(null, null);
  } catch (error) {
    console.log(error);
    callback(new Error(error.message), null);
  }
};

export const GetProducts = async (
  call: ServerUnaryCall<GetProductsRequest, GetProductsResponse>,
  callback: sendUnaryData<GetProductsResponse>
) => {
  try {
    const getAttributes = call.request.getAttributes;
    const productIds = call.request.productIds;
    const [productPromiseResponse, sellDateData] = await Promise.all([
      productService.getProducts(productIds),
      deltaMachineService.getProductSellDateFromDmOrders(productIds),
    ]);

    let allProductAttributes: any[] = [];
    let mappedAttributes: Record<string, IMappedAttribute> = {};

    const [err, data] = productPromiseResponse;

    if (err) throw new Error('Unable to get product');
    if (typeof data.result === 'string') {
      throw new Error('Invalid Legacy Product Document');
    }
    const products = data.result;

    if (getAttributes) {
      products.forEach((product: any) => {
        const attributes = product.variant?.attributes;
        allProductAttributes = [...allProductAttributes, ...attributes];
      });

      mappedAttributes = await mapMultipleAttributes(allProductAttributes);
    }

    const response: GetProductsResponse = {
      products: products.map((product: any) => {
        const sellDate = sellDateData[product?.product_id];
        const billingSettings = product?.billingSettings;
        let productAttributes: IMappedAttribute[] = [];
        if (getAttributes) {
          product.variant?.attributes.forEach((attribute: any) => {
            productAttributes = [
              ...productAttributes,
              mappedAttributes[attribute._id],
            ];
          });
        }
        const getDmUserResponse: GetProductsResponse_Product = {
          productId: product?.product_id,
          sellerId: product?.user_id,
          productName: product?.models?.model_name,
          productNameAr: product?.models?.model_name_ar,
          startBid: billingSettings.start_bid,
          sellerName: product?.seller_name,
          shipping: billingSettings?.delivery_fee || 0,
          commission: billingSettings?.buyer_commission_percentage / 100,
          vat: billingSettings?.vat_percentage / 100,
          availablePayment: JSON.stringify(
            billingSettings?.available_payment_bidding || []
          ),
          isExpired: product?.expiryDate < moment().toDate(),
          isDeleted: product?.status === ProductStatus.Delete,
          isSold: product?.sell_status === ProductOrderStatus.Sold,
          productImg: product?.product_images[0],
          sellPrice: product.sell_price,
          sellerCity: product.seller_city,
          vatPercentage: billingSettings.vat_percentage,
          sellDate: sellDate ? sellDate.toISOString() : '',
          attributes: productAttributes,
        };

        return getDmUserResponse;
      }),
    };

    callback(null, response);
  } catch (error) {
    console.log(error);
    callback(new Error(error.message), null);
  }
};

export const GetProductStatuses = async (
  call: ServerUnaryCall<GetProductStatusesRequest, GetProductStatusesResponse>,
  callback: sendUnaryData<GetProductStatusesResponse>
) => {
  try {
    const productId = call.request.productId;
    const [err, data] = await productRepository.getProductById(productId);

    if (err) console.log(err);

    const product = data.result as ILegacyProductModel;

    const result: GetProductStatusesResponse = {
      deleted: product?.status === ProductStatus.Delete,
      sold: product?.sell_status === ProductOrderStatus.Sold,
      expired: product?.expiryDate < moment().toDate(),
    };

    callback(null, result);
  } catch (error) {
    console.log(error);
    callback(new Error(error.message), null);
  }
};
export const GetBidSummary = async (
  call: ServerUnaryCall<GetBidSummaryRequest, GetBidSummaryResponse>,
  callback: sendUnaryData<GetBidSummaryResponse>
) => {
  try {
    const productId = call.request.productId;
    const bidPrice = call.request.bidPrice;
    const userId = call.request.userId;
    const allPayments = call.request.allPayments;
    const paymentOptionId = call.request.paymentOptionId;

    const [err, data] = await productService.getProducts([productId]);

    if (err) throw new Error('Unable to get product');
    if (typeof data.result === 'string') {
      throw new Error('Invalid Legacy Product Document');
    }
    const product = data.result[0];
    const isCommissionForBuyer = product?.user_id?.toString() !== userId; // false

    const commissionSummaries = await productService.calculateSummaryCommission(
      {
        product: {
          id: productId,
          sellPrice: bidPrice,
          modelId: product.model_id,
          varientId: product.varient_id,
          categoryId: product.category_id,
          grade: product.grade,
          conditionId: product.condition_id,
        },
        promoCode: null,
        sellerId: product.user_id,
        isCommissionForBuyer,
        source: null,
        sysSettings: product.billingSettings,
        allPayments,
        paymentModuleName: PaymentModuleName.BID,
        paymentOptionId: paymentOptionId,
        reservation: null,
      }
    );
    const billingSettings = product?.billingSettings;
    const bidProductsRes: BidProduct = {
      productId: product?.product_id,
      sellerId: product?.user_id,
      productName: product?.models?.model_name,
      productNameAr: product?.models?.model_name_ar,
      startBid: billingSettings.start_bid,
      sellerName: product?.seller_name,
      isExpired: product?.expiryDate < moment().toDate(),
      isDeleted: product?.status === ProductStatus.Delete,
      isSold: product?.sell_status === ProductOrderStatus.Sold,
      productImg: product?.product_images[0],
    };
    callback(null, {
      product: bidProductsRes,
      commissionSummaries: commissionSummaries as BreakDownResponse[],
    });
  } catch (error) {
    console.log(error);
    callback(new Error(error.message), null);
  }
};

export const GetViewedProducts = async (
  call: ServerUnaryCall<GetViewedProductsRequest, GetViewedProductsResponse>,
  callback: sendUnaryData<GetViewedProductsResponse>
) => {
  try {
    const shouldSkipExpire: boolean = call.request.shouldSkipExpire ?? false;
    const productIds = call.request.productIds;
    const categoryId: string = call.request?.categoryId || '';
    const getSpecificCategory = call.request?.getSpecificCategory || false;
    if ((productIds || []).length) {
      const [err, data] = await productService.GetViewedProductsData(
        productIds,
        shouldSkipExpire,
        categoryId,
        getSpecificCategory
      );

      if (err) throw new Error('Unable to get viewed product');
      if (typeof data.result === 'string') {
        throw new Error('Invalid Legacy Product Document');
      }
      const products = data.result;

      const conditionIds = products
        .map((elem: any) => elem.conditionId)
        .filter(Boolean);
      const conditions = conditionIds?.length
        ? await getConditions({
            ids: conditionIds,
          })
        : [];
      const response: GetViewedProductsResponse = {
        products: await Promise.all(
          products.map(async (product: any) => {
            let expressDeliveryBadge = false;
            if (product?.isConsignment) {
              expressDeliveryBadge = true;
            } else {
              expressDeliveryBadge =
                await productService.checkExpressDeliveryFlag({
                  sellerId: product?.seller?._id.toString(),
                  productId: product?._id?.toString(),
                });
            }
            const [, variantRes] = await variantRepository.getById(
              product.varientId
            );
            const varient: VariantDocument =
              variantRes.result as VariantDocument;
            const attributes = await mapAttributes(varient.attributes);
            let year = '';
            for (const attribute of attributes) {
              if (attribute?.title?.enName === 'Year') {
                year = attribute?.value?.enName;
                break;
              }
            }
            const condition = product.conditionId
              ? conditions.find(cond => cond.id == product.conditionId)
              : null;
            const viewedProd: GetViewedProductsResponse_Product = {
              id: product?._id,
              deviceModel: {
                name: product?.modelName,
                nameAr: product?.arModelName,
              } as DeviceModel,
              variant: {
                name: product?.variantName,
                nameAr: product?.arVariantName,
              } as Variant,
              attributes: attributes,
              productImage: product?.productImages[0],
              grade: product?.grade,
              gradeAr: product?.arGrade,
              isGreatDeal: product?.conditions
                ? isGreatDeal(
                    product?.grade,
                    product?.sellPrice,
                    product?.conditions
                  )
                : false,
              isMerchant: product?.isMerchant || false,
              originalPrice: product?.originalPrice,
              productImages: product?.productImages,
              sellPrice: product?.sellPrice,
              grandTotal: formatPriceInDecimalPoints(product?.grandTotal) || 0,
              vat: formatPriceInDecimalPoints(product?.vat) || 0,
              buyAmount: formatPriceInDecimalPoints(product?.buyAmount) || 0,
              shippingCharge:
                formatPriceInDecimalPoints(product?.shippingCharge) || 0,
              tags: product?.productData || '',
              sellStatus: product?.sellStatus,
              sellDate:
                product?.sellStatus == ProductOrderStatus.Sold
                  ? product?.sellDate.toISOString()
                  : '',
              condition: condition
                ? {
                    id: condition.id,
                    name: condition.name,
                    nameAr: condition.nameAr,
                    labelColor: condition.labelColor,
                    textColor: condition.textColor,
                  }
                : null,
              showSecurityBadge: null,
              brand: {
                id: null,
                type: null,
                name: product?.brand?.brand_name,
                nameAr: product?.brand?.brand_name_ar,
              },
              category: {
                id: null,
                type: null,
                name: product?.category?.category_name,
                nameAr: product?.category?.category_name_ar,
              },
              expressDeliveryBadge,
              year,
            };
            return viewedProd;
          })
        ),
      };
      callback(null, response);
    } else {
      callback(null, { products: [] });
    }
  } catch (error) {
    console.log(error);
    callback(new Error(error.message), null);
  }
};

export const GetRecentlySoldProducts = async (
  call: ServerUnaryCall<
    GetRecentlySoldProductsRequest,
    GetRecentlySoldProductsRequest
  >,
  callback: sendUnaryData<GetViewedProductsResponse>
) => {
  try {
    const [err, data] = await productService.getRecentlySoldProducts(
      call.request.hours || 6,
      call.request.limit || 10,
      call.request.offset || 0,
      call.request.categoryId || '',
      call.request.getSpecificCategory || false
    );
    if (err) throw new Error('Unable to ge product');
    if (typeof data.result === 'string') {
      throw new Error('Invalid Legacy Product Document');
    }
    const products = data.result;
    const conditionIds = products
      .map((elem: any) => elem.conditionId)
      .filter(Boolean);
    const conditions = conditionIds?.length
      ? await getConditions({
          ids: conditionIds,
        })
      : [];
    const recentlySoldProducts = [];
    for (let index = 0; index < products.length; index++) {
      if (recentlySoldProducts.length == call.request.limit) break;
      const product = products[index];

      let expressDeliveryBadge = false;
      if (product?.isConsignment) {
        expressDeliveryBadge = true;
      } else {
        expressDeliveryBadge = await productService.checkExpressDeliveryFlag({
          sellerId: product?.sellerId?.toString(),
          productId: product?._id?.toString(),
        });
      }
      // const priceRange = categoryCondition?.priceQuality?.name || null;
      // if (priceRange == 'Excellent') {

      const [, variantRes] = await variantRepository.getById(product.varientId);
      const varient: VariantDocument = variantRes.result as VariantDocument;
      const attributes = await mapAttributes(varient.attributes);
      let year = '';
      for (const attribute of attributes) {
        if (attribute?.title?.enName === 'Year') {
          year = attribute?.value?.enName;
          break;
        }
      }
      const condition = product.conditionId
        ? conditions.find(cond => cond.id == product.conditionId)
        : null;
      const prod: GetViewedProductsResponse_Product = {
        id: product?._id,
        deviceModel: {
          name: product?.modelName,
          nameAr: product?.arModelName,
        } as DeviceModel,
        variant: {
          name: product?.variantName,
          nameAr: product?.arVariantName,
        } as Variant,
        attributes: attributes,
        productImage: product?.productImages[0],
        grade: product?.grade,
        gradeAr: product?.arGrade,
        isGreatDeal: product?.conditions
          ? isGreatDeal(product?.grade, product?.sellPrice, product?.conditions)
          : false,
        isMerchant: product?.isMerchant || false,
        originalPrice: product?.originalPrice,
        productImages: product?.productImages,
        sellPrice: product?.sellPrice,
        grandTotal: formatPriceInDecimalPoints(product?.grandTotal) || 0,
        vat: formatPriceInDecimalPoints(product?.vat) || 0,
        buyAmount: formatPriceInDecimalPoints(product?.buyAmount) || 0,
        shippingCharge:
          formatPriceInDecimalPoints(product?.shippingCharge) || 0,
        tags: product?.productData || '',
        sellStatus: product?.sellStatus,
        sellDate:
          product?.sellStatus == ProductOrderStatus.Sold
            ? product?.sellDate.toISOString()
            : '',
        condition: condition
          ? {
              id: condition.id,
              name: condition.name,
              nameAr: condition.nameAr,
              labelColor: condition.labelColor,
              textColor: condition.textColor,
            }
          : null,
        showSecurityBadge: null,
        brand: null,
        category: {
          id: null,
          type: null,
          name: product?.category?.category_name,
          nameAr: product?.category?.category_name_ar,
        },
        expressDeliveryBadge,
        year,
      };
      recentlySoldProducts.push(prod);
      // }
    }

    const response: GetViewedProductsResponse = {
      products: recentlySoldProducts,
    };

    callback(null, response);
  } catch (error) {
    console.log(error);
    callback(new Error(error.message), null);
  }
};

export const GetCountdownValInHours = async (
  call: ServerUnaryCall<
    GetCountdownValInHoursRequest,
    GetCountdownValInHoursResponse
  >,
  callback: sendUnaryData<GetCountdownValInHoursResponse>
) => {
  try {
    const res = await settingService.getCountdownValInHours(
      call.request.modelId
    );
    callback(null, res);
  } catch (error) {
    callback(new Error(error.message), null);
  }
};

export const GetProductsForProductService = async (
  call: ServerUnaryCall<
    GetProductsRequest,
    GetProductsForProductServiceResponse
  >,
  callback: sendUnaryData<GetProductsForProductServiceResponse>
) => {
  try {
    const products = await productService.GetProductsForProductService(
      call.request.productIds
    );
    callback(null, { products: products || [] });
  } catch (error) {
    callback(new Error(error.message), null);
  }
};

export const ValidateSellerDetectionNudge = async (
  call: ServerUnaryCall<
    ValidateSellerDetectionNudgeRequest,
    ValidateSellerDetectionNudgeResponse
  >,
  callback: sendUnaryData<ValidateSellerDetectionNudgeResponse>
) => {
  try {
    const res = await deltaMachineService.validateSellerDetectionNudge();
    callback(null, res);
  } catch (error) {
    callback(new Error(error.message), null);
  }
};

export const getPromoCode = async (
  call: ServerUnaryCall<GetPromoCodeRequest, GetPromoCodeResponse>,
  callback: sendUnaryData<GetPromoCodeResponse>
) => {
  try {
    const promoCode = await getPromoCodeDetailsById(call.request.id);
    callback(null, {
      discount: Number(promoCode.discount),
      generator: promoCode.promoGenerator,
      percentage: Number(promoCode.percentage),
      promoLimit: Number(promoCode.promoLimit),
      type: promoCode.promoType,
    });
  } catch (error) {
    callback(new Error(error.message), null);
  }
};

export const UpdateProduct = async (
  call: ServerUnaryCall<UpdateProductRequest, UpdateProductResponse>,
  callback: sendUnaryData<UpdateProductResponse>
) => {
  try {
    const { productId, updateProduct } = call.request;
    const updateProductDto = {
      isApproved: updateProduct?.isApproved,
      status: updateProduct?.status,
      consignment: updateProduct?.consignment,
      sellPrice: updateProduct?.sellPrice,
      conditionId: updateProduct?.conditionId,
    } as ProductUpdateDto;

    const [hasErr] = await productRepository.updateProductDetails(
      productId,
      updateProductDto
    );
    await searchService.addProducts([productId]);
    callback(null, { status: !hasErr });
  } catch (error) {
    console.log(error);
    callback(null, { status: false });
  }
};
