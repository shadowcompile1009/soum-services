import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { Container } from 'typedi';

import {
  CancelOrderRequest,
  CancelOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  CreateSMSATracking,
  FetchInvoiceGenerationDataRequest,
  FetchInvoiceGenerationDataResponse,
  GenerateSmsaTrackingResponse,
  GetCompletionRateUserRequest,
  GetCompletionRateUserResponse,
  GetOrderDetailByIdResponse,
  GetOrderDetailByUserTypeRequest,
  GetOrderDetailRequest,
  GetOrderDetailResponse,
  GetOrderSaleAnalyticsRequest,
  GetOrderSaleAnalyticsResponse,
  GetPenalizedOrdersRequest,
  GetPenalizedOrdersResponse,
  GetPendingPayoutAnalyticsRequest,
  GetPendingPayoutAnalyticsResponse,
  GetPendingPayoutPaginationRequest,
  GetPendingPayoutPaginationResponse,
  GetTopSellingProductModelsRequest,
  GetTopSellingProductModelsResponse,
  UpdateOrderAttributeRequest,
  UpdateOrderAttributeResponse,
  GetUserDataRequest,
  Request,
  ProcessReserveFinancingPaymentRequest,
  ProcessReserveFinancingPaymentResponse,
  UpdateLogisticServiceRequest,
  UpdateLogisticServiceResponse,
  UpdatePaymentStatusOfOrderRequest,
  UpdatePaymentStatusOfOrderResponse,
  GetUserLastOrderDataResponse,
  SubmitRatingResponse,
  SubmitRatingRequest,
  GetCategoryModelsCountResponse,
  GetVariantsRequest,
} from './proto/v2.pb';

import { PaymentOrderUpdateDto } from '../dto/order/PaymentOrderUpdateDto';
import { UpdatePaymentDto } from '../dto/payment/UpdatePaymentDto';
import { PurchaseProductDto } from '../dto/product/PurchaseProductDto';
import { DeltaMachineStatusName } from '../enums/DeltaMachineStatusName';
import { InvoiceFormats } from '../enums/InvoiceFormats';
import {
  TransactionOrderStatus,
  TransactionStatus,
} from '../enums/TransactionStatus';
import { UserType } from '../enums/UserType.Enum';
import { AddressDocument } from '../models/Address';
import { DeltaMachineOrderDocument } from '../models/DeltaMachineOrder';
import { DMStatusGroups } from '../models/DmStatusGroup';
import { PaymentProvider, PaymentProviderType } from '../models/Payment';
import {
  OrderRepository,
  ProductRepository,
  ModelRepository,
} from '../repositories';
import { AddressRepository } from '../repositories/addressRepository';
import { DeltaMachineService } from '../services/deltaMachineService';
import { DmStatusGroupService } from '../services/dmStatusGroupsService';
import { OrderService } from '../services/orderService';
import { PaymentService } from '../services/paymentService';
import { SettingService } from '../services/settingService';
import { UserService } from '../services/userService';
import { _get } from '../util/common';
import { GetUserData } from './authz';
import { GetPaymentOptionRequest } from './proto/payment.pb';
import { getPaymentOption } from './payment';
import { Constants } from '../constants/constant';
import { DeltaMachineStatusDocument } from '../models/DeltaMachineStatus';
import { ModelService } from '../services/modelService';
import { BrandService } from '../services/brandService';
import { VariantRepository } from '../repositories/variantRepository';
import { VariantDocument } from '../models/Variant';
import { mapAttributes } from '../util/attributes';

const deltaMachineService = Container.get(DeltaMachineService);
const orderService = Container.get(OrderService);
const userService = Container.get(UserService);
const paymentService = Container.get(PaymentService);
const settingService = Container.get(SettingService);
const orderRepository = Container.get(OrderRepository);
const modelRepository = Container.get(ModelRepository);
const dmStatusGroupService = Container.get(DmStatusGroupService);
const modelService = Container.get(ModelService);
const brandService = Container.get(BrandService);
const variantRepository = Container.get(VariantRepository);
const productRepository = Container.get(ProductRepository);

export const GetOrderDetail = async (
  call: ServerUnaryCall<GetOrderDetailRequest, GetOrderDetailResponse>,
  callback: sendUnaryData<GetOrderDetailResponse>
) => {
  try {
    const { orderId } = call.request;
    const [buyerErr, buyerResult] = await deltaMachineService.getOrderInfo(
      orderId,
      UserType.BUYER
    );
    const [sellerErr, sellerResult] = await deltaMachineService.getOrderInfo(
      orderId,
      UserType.SELLER
    );

    if (buyerErr || sellerErr) {
      throw new Error('Unknown error');
    }

    const result = {
      buyerId: buyerResult.order.buyer._id,
      sellerId: sellerResult.order.seller._id,
      sellerOrderDetail: {
        payoutAmount: sellerResult.order.grand_total,
        sellPrice: sellerResult.order.sell_price,
      },
      buyerOrderDetail: {
        grandTotal: buyerResult.order.grand_total,
      },
      productName: buyerResult.order.product.model.model_name,
      orderNumber: buyerResult.order.order_number,
      orderId: buyerResult?.order?.id,
      productId: buyerResult?.order?.product?._id,
      sellerPhoneNumber: sellerResult?.order?.sellerPhoneNumber,
      buyerPhoneNumber: buyerResult?.order?.buyerPhoneNumber,
      isFinancingEmailSent: buyerResult?.order?.isFinancingEmailSent ?? false,
    };

    callback(null, result);
  } catch (error) {
    console.log(error);
    callback(new Error('Order not found'), null);
  }
};

export const CreateOrder = async (
  call: ServerUnaryCall<CreateOrderRequest, CreateOrderResponse>,
  callback: sendUnaryData<CreateOrderResponse>
) => {
  try {
    const {
      productId,
      userId,
      amount,
      soumTransactionNumber,
      clientType,
      paymentOptionId,
    } = call.request;
    const buyer = await userService.getUserAddresses(userId);
    const paymentOption = await getPaymentOption({
      id: paymentOptionId,
    } as GetPaymentOptionRequest);
    const purchaseProductDto: PurchaseProductDto = {
      productId: productId,
      orderId: '',
      promoCodeId: null,
      paymentType:
        paymentOption?.paymentCardType.toLocaleUpperCase() as PaymentProviderType,
      paymentProvider: paymentOption?.paymentProvider as PaymentProvider,
      actionType: 'buyWithBid',
      returnUrls: null,
      bidAmount: amount,
      paymentId: paymentOptionId,
      orderNumber: soumTransactionNumber,
    };

    const newOrder = await orderService.createOrder(
      buyer,
      purchaseProductDto,
      clientType
    );

    await paymentService.reflectChangesInOrderAndProduct(
      {
        orderId: newOrder.orderId,
        productId: newOrder.productId,
        paymentProvider: null,
      } as PurchaseProductDto,
      TransactionStatus.COMPLETED,
      {
        orderId: newOrder.orderId,
        response: 'Response should be saved in payment service',
      } as PaymentOrderUpdateDto,
      true
    );
    const dmOrders = await deltaMachineService.findDMOrdersById([
      newOrder.orderId,
    ]);
    const dmOrderId = dmOrders?.length ? dmOrders[0].id : '';
    callback(null, {
      orderId: newOrder.orderId,
      dmOrderId,
    });
  } catch (error) {
    console.log(error);
    callback(new Error('Create order is failed'), null);
  }
};

export const UpdateOrderAttribute = async (
  call: ServerUnaryCall<
    UpdateOrderAttributeRequest,
    UpdateOrderAttributeResponse
  >,
  callback: sendUnaryData<UpdateOrderAttributeResponse>
) => {
  try {
    const { orderId } = call.request;

    const result = await orderService.updateOrderAttribute(orderId);

    callback(null, {
      message: result.message,
    });
  } catch (error) {
    console.log(error);
    callback(new Error('Update order is failed'), null);
  }
};

export const UpdateLogisticService = async (
  call: ServerUnaryCall<
    UpdateLogisticServiceRequest,
    UpdateLogisticServiceResponse
  >,
  callback: sendUnaryData<UpdateLogisticServiceResponse>
) => {
  try {
    const { dmoId, serviceId, vendorId, serviceName } = call.request;
    const result = await deltaMachineService.updateDMO(dmoId, {
      serviceId: serviceId,
      vendorId: vendorId,
    });
    const dmOrder = await deltaMachineService.getById(dmoId);
    if (serviceName && serviceName === 'Pickup') {
      await deltaMachineService.createPickUpForOrder(dmOrder?.orderId, dmoId);
    }

    callback(null, result);
  } catch (error) {
    console.log(error);
    callback(new Error('Order not found'), null);
  }
};

export const CreateSmsaTracking = async (
  call: ServerUnaryCall<CreateSMSATracking, CreateSMSATracking>,
  callback: sendUnaryData<CreateSMSATracking>
) => {
  try {
    const { trackingData } = call.request;
    for (const data of trackingData) {
      data.trackingNumber = await deltaMachineService.createSMSATracking(
        data.id,
        data.inspectionStatus,
        data.inspectionCenter
      );
    }
    const returnedData: CreateSMSATracking = {
      trackingData: trackingData,
    };
    callback(null, returnedData);
  } catch (error) {
    console.log(error);
    callback(new Error('Order not found'), null);
  }
};

export const GetCategoryModelsCount = async (
  call: ServerUnaryCall<GetVariantsRequest, GetCategoryModelsCountResponse>,
  callback: sendUnaryData<GetCategoryModelsCountResponse>
) => {
  try {
    let { categoryId } = call.request;
    const returnData: any = await modelService.getModelsSummaryByCatergory();
    const brands: any[] = await brandService.getBrandListViaCategory(
      returnData.categoryId
    );
    const filteredBrands: any = [];
    let showMileageFilter = false;
    let showFinancingFilter = false;
    for (const brand of brands) {
      categoryId = brand.category_id;
      brand.id = brand._id;
      brand.categoryId = brand.category_id;
      brand.brandNameAr = brand.brand_name_ar;
      brand.brandName = brand.brand_name;
      brand.brandIcon = brand.brand_icon;
      brand.totalAvailableProducts = 0;
      for (const modelData of returnData.modelData) {
        if (modelData.brandId.toString() === brand._id.toString()) {
          if (brand.models?.length) {
            brand.models.push(modelData);
          } else {
            brand.models = [];
            brand.models.push(modelData);
          }
          brand.totalAvailableProducts += modelData?.totalAvailableProducts;
          if (showMileageFilter === false || showFinancingFilter === false) {
            const [err, variantRes] = await variantRepository.getById(
              modelData.varientId
            );
            if (!err) {
              const varient: VariantDocument =
                variantRes.result as VariantDocument;
              const attributes = await mapAttributes(varient.attributes);
              for (const attribute of attributes) {
                if (
                  attribute?.title?.enName === 'Year' &&
                  showFinancingFilter === false
                ) {
                  const currentYear = new Date().getFullYear();
                  showFinancingFilter =
                    currentYear - Number(attribute?.value?.enName) > 4
                      ? true
                      : false;
                }
                if (
                  attribute?.title?.enName === 'Mileage' &&
                  showMileageFilter === false &&
                  (attribute?.value?.enName === '1 - 20,000KM' ||
                    attribute?.value?.enName === '20,000 - 80,000KM')
                ) {
                  showMileageFilter = true;
                }
              }
            }
          }
        }
      }
      if (brand.models?.length) {
        filteredBrands.push(brand);
      }
    }
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const shopGreatDeals = (await productRepository.findProductsByDateRange(
      sevenDaysAgo,
      new Date(),
      categoryId
    ))
      ? true
      : false;
    const carsPrice = (await productRepository.findProductsByPriceRange(
      1,
      60000,
      categoryId
    ))
      ? true
      : false;
    const showLT31 = (await productRepository.findProductsByPriceRange(
      1,
      30999,
      categoryId
    ))
      ? true
      : false;
    const showGT80 = (await productRepository.findProductsByPriceRange(
      80000,
      null,
      categoryId
    ))
      ? true
      : false;
    const showGT30AndLT60 = (await productRepository.findProductsByPriceRange(
      30000,
      60000,
      categoryId
    ))
      ? true
      : false;
    const showGT60AndLT80 = (await productRepository.findProductsByPriceRange(
      60000,
      80000,
      categoryId
    ))
      ? true
      : false;
    callback(null, {
      brands: filteredBrands,
      showMileageFilter,
      showFinancingFilter,
      shopGreatDeals,
      carsPrice,
      showLT31,
      showGT80,
      showGT30AndLT60,
      showGT60AndLT80,
    });
  } catch (error) {
    callback(new Error('User not found'), null);
  }
};

export const GetUserProfile = async (
  call: ServerUnaryCall<GetUserDataRequest, GetOrderDetailByIdResponse>,
  callback: sendUnaryData<GetOrderDetailByIdResponse>
) => {
  try {
    const { userId } = call.request;
    const returnData = await userService.getUserData(userId);
    callback(null, { response: JSON.stringify(returnData) });
  } catch (error) {
    callback(new Error('User not found'), null);
  }
};

export const SubmitRating = async (
  call: ServerUnaryCall<SubmitRatingRequest, SubmitRatingResponse>,
  callback: sendUnaryData<SubmitRatingResponse>
) => {
  try {
    const { userId, rating, notes } = call.request;
    const [error, mySalesResult] =
      await deltaMachineService.getDMOrdersByBuyerId(userId);
    if (error) {
      return callback(null, { isRated: false });
    }
    const [, userData] = await userService.getUserInfo(
      userId,
      '_id name mobileNumber'
    );
    const dmOrders =
      (mySalesResult?.result as DeltaMachineOrderDocument[]) || [];
    const dmOrder = dmOrders[0];
    if (parseInt(rating) >= 3) {
      await deltaMachineService.submitRating(
        userData?.name,
        userData?.mobileNumber,
        notes,
        rating,
        new Date().toString()
      );
    }
    await deltaMachineService.update(dmOrder?.id, {
      'orderData.isRated': true,
    });
    return callback(null, { isRated: true });
  } catch (error) {
    return callback(null, { isRated: false });
  }
};

export const GetUserLastOrderData = async (
  call: ServerUnaryCall<GetUserDataRequest, GetUserLastOrderDataResponse>,
  callback: sendUnaryData<GetUserLastOrderDataResponse>
) => {
  try {
    const { userId } = call.request;
    const [error, mySalesResult] =
      await deltaMachineService.getDMOrdersByBuyerId(userId);
    if (error) {
      return callback(null, {
        isDelivered: false,
        isRated: false,
        attributes: [],
      });
    }
    const dmOrders =
      (mySalesResult?.result as DeltaMachineOrderDocument[]) || [];
    let statusName = '';
    if (dmOrders?.length) {
      const statuses = await deltaMachineService.getStatusList();
      const statusObj = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.toObject().id === dmOrders[0].statusId.toString()
      );
      statusName = statusObj?.name;
    }
    const isDelivered =
      statusName === DeltaMachineStatusName.ITEM_DELIVERED ||
      statusName === DeltaMachineStatusName.TRANSFERRED;

    if (!isDelivered) {
      return callback(null, {
        isDelivered: false,
        isRated: false,
        attributes: [],
      });
    }

    if (dmOrders[0]?.orderData?.isRated) {
      return callback(null, {
        isDelivered: false,
        isRated: true,
        attributes: [],
      });
    }
    const [, variantRes] = await variantRepository.getById(
      dmOrders[0]?.orderData?.variantId
    );
    const varient: VariantDocument = variantRes.result as VariantDocument;
    const [, model]: any = await modelRepository.getById(varient?.model_id);
    const attributes = await mapAttributes(varient.attributes);
    return callback(null, {
      buyerName: dmOrders[0]?.orderData?.buyerName,
      productName: dmOrders[0]?.orderData?.productName || '',
      orderId: dmOrders[0]?.orderId || '',
      productId: dmOrders[0]?.orderData?.productId || '',
      statusId: dmOrders[0]?.statusId || '',
      sellPrice: parseFloat(dmOrders[0]?.orderData?.sellPrice) || 0,
      createdAt: dmOrders[0]?.createdAt.toString() || '',
      modelName: model?.result?.model_name,
      arModelName: model?.result?.model_name_ar,
      variantName: varient?.varient,
      arVariantName: varient?.varient_ar,
      attributes,
      isDelivered,
      isRated: false,
    });
  } catch (error) {
    callback(new Error('User not found'), null);
  }
};

export const GenerateSmsaTracking = async (
  call: ServerUnaryCall<Request, GenerateSmsaTrackingResponse>,
  callback: sendUnaryData<GenerateSmsaTrackingResponse>
) => {
  try {
    const { request } = call.request;
    const orderObj = JSON.parse(request);
    // const trackingNumber = await deltaMachineService.generatetrackingNumber(
    //   orderObj.orderid,
    //   orderObj.orderData
    // );
    const trackingNumber = await deltaMachineService.handleShipmentCreation(
      orderObj.shipmentType,
      orderObj.orderData,
      orderObj.orderid
    );
    const returnedData: GenerateSmsaTrackingResponse = {
      trackingNumber,
    };
    callback(null, returnedData);
  } catch (error) {
    console.log(error);
    callback(new Error('Order not found'), null);
  }
};

export const GetOrderDetailByUserType = async (
  call: ServerUnaryCall<
    GetOrderDetailByUserTypeRequest,
    GetOrderDetailByIdResponse
  >,
  callback: sendUnaryData<GetOrderDetailByIdResponse>
) => {
  try {
    const { orderId, userType } = call.request;
    const [err, orderData] = await orderService.getOrderDetail(
      orderId,
      userType
    );
    if (err) {
      callback(new Error('Order not found'), null);
    } else {
      callback(null, { response: JSON.stringify(orderData) });
    }
  } catch (err) {
    callback(new Error('Order not found'), null);
  }
};

export const CreateDmOrder = async (
  call: ServerUnaryCall<Request, GetOrderDetailByIdResponse>,
  callback: sendUnaryData<GetOrderDetailByIdResponse>
) => {
  try {
    const { request } = call.request;
    const orderObj = JSON.parse(request);
    const [err, returnedData] = await deltaMachineService.createDMOrder(
      orderObj?.orderData,
      orderObj?.order,
      orderObj?.newOrder
    );
    if (err) {
      callback(new Error('Order not found'), null);
    } else {
      callback(null, { response: JSON.stringify(returnedData) });
    }
  } catch (err) {
    console.log(err);
    callback(new Error('Order not found'), null);
  }
};

export const UpdateDmOrder = async (
  call: ServerUnaryCall<Request, GetOrderDetailByIdResponse>,
  callback: sendUnaryData<GetOrderDetailByIdResponse>
) => {
  try {
    const { request } = call.request;
    const updateOrderObj = JSON.parse(request);
    const dynamicTimerStatusIds = (await dmStatusGroupService.getDmStatusGroups(
      DMStatusGroups.DYNAMIC_TIMER_STATUS_IDS
    )) as string[];
    const [err, returnedData] = await deltaMachineService.updateDMOrder(
      updateOrderObj.dmOrderId,
      updateOrderObj.userId,
      updateOrderObj.userName,
      updateOrderObj.updateData,
      updateOrderObj.nctReasonId,
      dynamicTimerStatusIds
    );
    if (err) {
      callback(new Error('Order not found'), null);
    } else {
      callback(null, { response: JSON.stringify(returnedData) });
    }
  } catch (err) {
    console.log(err);
    callback(new Error('Order not found'), null);
  }
};

export const GetOrderDetailById = async (
  call: ServerUnaryCall<GetOrderDetailRequest, GetOrderDetailByIdResponse>,
  callback: sendUnaryData<GetOrderDetailByIdResponse>
) => {
  try {
    const { orderId } = call.request;
    const orders = await orderService.findOrdersById([orderId]);
    if (orders.length) {
      const orderData: any = orders[0];
      const [errAddress, data] = await userService.getListUserAddress(
        orders[0]?.buyer
      );
      if (!errAddress) {
        const buyerAddresses = data.result as AddressDocument[];
        if (buyerAddresses.length) {
          const buyerAddress = buyerAddresses.pop();
          orderData.buyerAddress = buyerAddress;
        }
      }
      const [errSellerAddress, sellerData] =
        await userService.getListUserAddress(orders[0]?.seller);
      if (!errSellerAddress) {
        const sellerAddresses = sellerData.result as AddressDocument[];
        if (sellerAddresses.length) {
          const sellerAddress = sellerAddresses.pop();
          orderData.sellerAddress = sellerAddress;
        }
      }
      const [, sysSettings] = await settingService.getSettingsObjectByKeys([
        'riyadh_specific_pickup_only',
      ]);
      orderData.isRiyadhSpecificPickup =
        sysSettings['riyadh_specific_pickup_only'];
      const [sellerErr, orderDetailSeller] = await orderService.getOrderDetail(
        orderId,
        'seller'
      );
      if (!sellerErr) {
        orderData.sellerData = {};
        orderData.sellerData.payoutAmount = orderDetailSeller.order.grand_total;
        orderData.sellerData.sellPrice = orderDetailSeller.order.sell_price;
        orderData.sellerData.sellerPromoCode =
          orderDetailSeller.order.promo_code;
        orderData.sellerData.commissionAmount =
          orderDetailSeller.order.commission.toString();
        orderData.sellerData.vatAmount = orderDetailSeller.order.vat.toString();
        orderData.sellerData.deliveryFee = orderDetailSeller.order.delivery_fee;
        orderData.sellerData.discount = orderDetailSeller.order.totalDiscount;
      }
      const [buyerErr, orderDetailBuyer] = await orderService.getOrderDetail(
        orderId,
        'buyer'
      );
      if (!buyerErr) {
        orderData.buyerData = {};
        orderData.buyerData.grandTotal = orderDetailBuyer.order.grand_total;
        orderData.buyerData.buyerPromoCode = orderDetailBuyer.order.promo_code;
        orderData.buyerData.deliveryFee = orderDetailBuyer.order.delivery_fee;
        orderData.sellerData.discount = orderDetailSeller.order.totalDiscount;
        orderData.sellerData.listingFee = orderDetailSeller.order.listingFee;
        orderData.sellerData.shippingCharges =
          orderDetailSeller.order.shipping_charge;
        orderData.buyerData.shippingAmount =
          orderDetailBuyer.order.shipping_charge;
      }
      orderData.dmoNCTReason =
        await deltaMachineService.findDmoNCTReasonByOrderId(orderId);
      orderData.nctReasons = await deltaMachineService.getNCTReasonList();
      const isSuccessPayout =
        await deltaMachineService.getSuccessPayoutRefundTransaction(
          orderId,
          'Payout',
          'Transfer'
        );
      const isSuccessRefund =
        await deltaMachineService.getSuccessPayoutRefundTransaction(
          orderId,
          'Refund',
          'Instant Refund'
        );
      const isSuccessReversal =
        await deltaMachineService.getSuccessPayoutRefundTransaction(
          orderId,
          'Refund',
          'Reversal'
        );
      orderData.isSuccessPayout = isSuccessPayout;
      orderData.isSuccessRefund = isSuccessRefund;
      orderData.isSuccessReversal = isSuccessReversal;

      (orderData.paymentMethods =
        deltaMachineService.getPaymentMethodSuggestion(
          orderData.order_date,
          orderData.paymentType
        )),
        (orderData.bankDetail = await deltaMachineService.getIBANInfo(
          orderData?.buyer?._id
        )),
        (orderData.userData = await GetUserData({ userId: orderData.seller })),
        (orderData.buyerUserData = await GetUserData({
          userId: orderData.buyer,
        }));
      callback(null, { response: JSON.stringify(orderData) });
    } else {
      callback(new Error('Order not found'), null);
    }
  } catch (error) {
    console.log(error);
    callback(new Error('Order not found'), null);
  }
};

export const CancelOrder = async (
  call: ServerUnaryCall<CancelOrderRequest, CancelOrderResponse>,
  callback: sendUnaryData<CancelOrderResponse>
) => {
  try {
    const { userId, orderId } = call.request;
    let result: any;
    const transaction = await paymentService.getTransactionWithOrderId(orderId);
    if (transaction?.paymentOption.paymentProvider === PaymentProvider.TAMARA) {
      result = await paymentService.cancelTamara(orderId, userId);
    }
    if (transaction?.paymentOption.paymentProvider === PaymentProvider.Tabby) {
      result = await paymentService.closeOrder(orderId, userId);
      const order = await deltaMachineService.getDetailsOfOrder(orderId);
      // Cancel seller credit transaction
      await deltaMachineService.cancelCreditTransaction(order);
    }
    callback(null, result);
  } catch (error) {
    console.log(error);
    callback(new Error('Order not found'), null);
  }
};

export const UpdatePaymentStatusOfOrder = async (
  call: ServerUnaryCall<
    UpdatePaymentStatusOfOrderRequest,
    UpdatePaymentStatusOfOrderResponse
  >,
  callback: sendUnaryData<UpdatePaymentStatusOfOrderResponse>
) => {
  const { transaction, ...updatePaymentDetail } = call.request;
  const updatePaymentDto = updatePaymentDetail as UpdatePaymentDto;
  try {
    console.log(
      `${updatePaymentDto.paymentNumber}: transaction status ${transaction.transactionStatusId}`
    );
    const response =
      await paymentService.processUpdatePaymentStatusForTransaction(
        updatePaymentDto,
        transaction
      );
    console.log(
      `${updatePaymentDto.paymentNumber}: response transaction status ${response.orderTransactionStatus}`
    );
    callback(null, {
      orderTransactionStatus: response.orderTransactionStatus,
    });
  } catch (error) {
    console.log(
      `Update failed for order. OrderNumber: ${updatePaymentDto.paymentNumber},PaymentId: ${updatePaymentDto.paymentId}`
    );
    console.log(error);
    if (error.message === Constants.MESSAGE.FAILED_TO_PAY_ORDER) {
      callback(null, {
        orderTransactionStatus: TransactionOrderStatus.FAILED,
      });
    }
    callback(error, null);
  }
};

export const FetchInvoiceGenerationData = async (
  call: ServerUnaryCall<
    FetchInvoiceGenerationDataRequest,
    FetchInvoiceGenerationDataResponse
  >,
  callback: sendUnaryData<FetchInvoiceGenerationDataResponse>
) => {
  const addressRepository = new AddressRepository();
  const { orderId, type } = call.request;

  try {
    const order = await orderService.getOrderDataForGeneratingInvoice(orderId);
    const invoiceInput = await orderService.calculateAmountConfigSeller(
      type,
      null,
      order
    );

    const data = await orderService.invoiceInputMap(
      invoiceInput,
      InvoiceFormats.ZATCA
    );
    const [, sellerAddr] = await addressRepository.getAddressById(
      _get(order, 'seller.address.address_id', '')
    );
    const sellerAddress = sellerAddr as AddressDocument;
    const [, buyerAddr] = await addressRepository.getAddressById(
      _get(order, 'buyer.address.address_id', '')
    );
    const buyerAddress = buyerAddr as AddressDocument;

    callback(null, {
      billType: data?.bill_type,
      issueDate: data?.issue_date,
      billTo: data?.bill_to,
      billedByCOR: data?.billed_by_cor,
      billedBySeller: data?.billed_by_seller,
      ZATCAInvoiceNo: data?.ZATCA_invoice_number,
      dateOfSupply: data?.date_of_supply,
      seller: {
        id: order?.seller?._id?.toString(),
        name: order?.seller?.name,
        address: {
          street: sellerAddress?.street,
          district: sellerAddress?.district,
          city: sellerAddress?.city,
          postalCode: sellerAddress?.postal_code,
          latitude: sellerAddress?.latitude,
          longitude: sellerAddress?.latitude,
        },
      },
      buyer: {
        id: order?.buyer?._id?.toString(),
        name: order?.buyer?.name,
        address: {
          street: buyerAddress?.street,
          district: buyerAddress?.district,
          city: buyerAddress?.city,
          postalCode: buyerAddress?.postal_code,
          latitude: buyerAddress?.latitude,
          longitude: buyerAddress?.latitude,
        },
      },
      order: {
        commission: data?.commission,
        vat: data?.vat,
        deliveryFee: data?.delivery_fee,
        deliveryFeeVAT: 0,
        penaltyFee: data?.penalty_fee,
        discount:
          type === 'buyer'
            ? data?.total_discount
            : data?.commission_detail?.discount,
        grandTotal:
          type === 'buyer'
            ? data?.grandTotal
            : data?.commission_detail?.sub_total,
        orderId: data?.order,
        orderNumber: data?.order_number,
        // totalExcludeVAT: data?.order_detail?.unit_price,
        totalTaxableAmount:
          type === 'buyer'
            ? data?.totalTaxable
            : data?.commission_detail?.unit_price_after_discount,
        totalVAT: type === 'buyer' ? data?.grandVatTotal : data?.total_vat,
      },
      product: {
        productId: data?.product,
        nameAR: data?.order_detail?.device_ar,
        nameEN: data?.order_detail?.device_en,
        item: {
          unitPrice: data?.order_detail?.unit_price,
          commission: data?.commission_detail?.unit_price,
          vat: data?.commission_detail?.tax,
          discount: data?.commission_detail?.discount,
          grandTotal: data?.commission_detail?.sub_total,
          quantity: data?.order_detail?.quantity,
        },
      },
    });
  } catch (error) {
    console.error(
      `Failed to get order data. Order Id: ${orderId}. Error:`,
      error
    );
    callback(error, null);
  }
};
export const GetOrderSaleAnalytics = async (
  call: ServerUnaryCall<
    GetOrderSaleAnalyticsRequest,
    GetOrderSaleAnalyticsResponse
  >,
  callback: sendUnaryData<GetOrderSaleAnalyticsResponse>
) => {
  try {
    const { merchantId, range } = call.request;
    let result = {
      data: [
        {
          statusName: DeltaMachineStatusName.TRANSFERRED,
          totalAmount: 0,
          transaction: 0,
        },
        {
          statusName: DeltaMachineStatusName.REFUNDED,
          totalAmount: 0,
          transaction: 0,
        },
      ],
      totalTransactions: 0,
      totalAmountOverall: 0,
    };
    const dmOrders: any = await deltaMachineService.getOrderSaleAnalytics(
      merchantId,
      range
    );
    if (!dmOrders || dmOrders?.length === 0) {
      return callback(null, result);
    }
    result = {
      ...result,
      data: result.data.map((item, index) => ({
        ...item,
        ...dmOrders[0]?.totalsByStatus?.[index],
      })),
      totalTransactions:
        dmOrders?.[0]?.totalTransactions || result.totalTransactions,
      totalAmountOverall:
        dmOrders?.[0]?.totalAmountOverall || result.totalAmountOverall,
    };
    return callback(null, result);
  } catch (error) {
    console.log(error);
    return callback(new Error('Order not found'), null);
  }
};

export const GetPendingPayoutAnalytics = async (
  call: ServerUnaryCall<
    GetPendingPayoutAnalyticsRequest,
    GetPendingPayoutAnalyticsResponse
  >,
  callback: sendUnaryData<GetPendingPayoutAnalyticsResponse>
) => {
  try {
    const { merchantId } = call.request;
    const dmOrders: any = await deltaMachineService.getPendingPayoutAnalytics(
      merchantId
    );
    if (!dmOrders || dmOrders?.length === 0) {
      return callback(null, {
        merchantId,
        totalAmount: 0,
      } as GetPendingPayoutAnalyticsResponse);
    }
    const result = {
      merchantId,
      totalAmount: dmOrders?.[0]?.totalAmount,
    } as GetPendingPayoutAnalyticsResponse;
    return callback(null, result);
  } catch (error) {
    console.log(error);
    return callback(null, {
      merchantId: null,
      totalAmount: 0,
    } as GetPendingPayoutAnalyticsResponse);
  }
};

export const GetPendingPayoutPagination = async (
  call: ServerUnaryCall<
    GetPendingPayoutPaginationRequest,
    GetPendingPayoutPaginationResponse
  >,
  callback: sendUnaryData<GetPendingPayoutPaginationResponse>
) => {
  try {
    const { merchantId, search, page, size } = call.request;
    const payouts = await deltaMachineService.getPendingPayoutPagination(
      merchantId,
      page,
      size,
      search
    );
    const data = (payouts?.data as DeltaMachineOrderDocument[]) || [];
    const flattenedData = data.map((payout: any) => ({
      orderNumber: payout?.orderData?.orderNumber as string,
      productName: payout?.orderData?.productName as string,
      payoutAmount: payout?.orderData?.payoutAmount as string,
      productNameAR: payout?.orderData?.productNameAr as string,
    }));
    return callback(null, {
      payouts: flattenedData,
      totalItems: payouts?.totalItems || 0,
      totalPages: payouts?.totalPages || 0,
      currentPage: payouts?.currentPage || 0,
    });
  } catch (error) {
    console.log(error);
    return callback(null, {
      payouts: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 0,
    });
  }
};

export const GetPenalizedOrders = async (
  call: ServerUnaryCall<GetPenalizedOrdersRequest, GetPenalizedOrdersResponse>,
  callback: sendUnaryData<GetPenalizedOrdersResponse>
) => {
  try {
    const { dmoIds, page, size } = call.request;
    const dmOrders = await deltaMachineService.getPenalizedOrders(
      dmoIds,
      page,
      size
    );
    return callback(null, {
      orders: (dmOrders?.data as any) || [],
      currentPage: dmOrders?.currentPage,
      totalItems: dmOrders?.totalItems,
      totalPages: dmOrders?.totalPages,
      pageSize: dmOrders?.pageSize,
    });
  } catch (error) {
    console.log(error);
    return callback(null, {
      orders: [],
      currentPage: 0,
      totalItems: 0,
      totalPages: 0,
      pageSize: 0,
    });
  }
};

export const GetCompletionRateUser = async (
  call: ServerUnaryCall<
    GetCompletionRateUserRequest,
    GetCompletionRateUserResponse
  >,
  callback: sendUnaryData<GetCompletionRateUserResponse>
) => {
  try {
    const { userId, range } = call.request;
    const completionRate = await userService.calculateRatesForMerchant(
      userId,
      range
    );
    return callback(null, {
      completionRate,
    });
  } catch (error) {
    console.log(error);
    return callback(null, {
      completionRate: 0,
    });
  }
};

export const GetTopSellingProductModels = async (
  call: ServerUnaryCall<
    GetTopSellingProductModelsRequest,
    GetTopSellingProductModelsResponse
  >,
  callback: sendUnaryData<GetTopSellingProductModelsResponse>
) => {
  try {
    const { merchantId, range, sorting, page, size } = call.request;
    const data = await orderRepository.getTopSellingProductModels(
      merchantId,
      range,
      sorting,
      page,
      size
    );
    return callback(null, {
      ...data,
    });
  } catch (error) {
    console.log(error);
    return callback(null, {
      products: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 5,
    });
  }
};

export const ProcessReserveFinancingPayment = async (
  call: ServerUnaryCall<
    ProcessReserveFinancingPaymentRequest,
    ProcessReserveFinancingPaymentResponse
  >,
  callback: sendUnaryData<ProcessReserveFinancingPaymentResponse>
) => {
  try {
    const { orderNumber, status } = call.request;
    await paymentService.finalizeReservationPayment(orderNumber, status);
    return callback(null, {});
  } catch (error) {
    console.log(error);
    return callback(error, {});
  }
};
