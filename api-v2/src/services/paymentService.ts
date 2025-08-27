import moment from 'moment';
import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { PaymentOrderUpdateDto } from '../dto/order/PaymentOrderUpdateDto';
import { UpdatePaymentDto } from '../dto/payment/UpdatePaymentDto';
import { ValidateBNPLOrderDto } from '../dto/payment/ValidateBNPLOrderDto';
import { UpdatePaymentFeesDto } from '../dto/payment/updatePaymentFeesDto';
import { PurchaseProductDto } from '../dto/product/PurchaseProductDto';
import { DeltaMachineBNPLStatuses } from '../enums/DeltaMachineStatusSubmodule';
import { ListingType } from '../enums/ListingType.Enum';
import { ProductOrderStatus } from '../enums/ProductStatus.Enum';
import { SettingValues } from '../enums/SettingValues';
import {
  TabbyStatusEnum,
  TransactionOrderStatus,
  TransactionStatus,
  WalletTransactionStatus,
} from '../enums/TransactionStatus';
import {
  CaptureTransaction,
  CreatePaymentTransaction,
  GetPaymentTransactionBySoumTransactionNumber,
  ReverseTransaction,
  ValidateBNPLForUser,
} from '../grpc/payment';
import { CreateTransactionResponse } from '../grpc/proto/payment/CreateTransactionResponse';
import { TransactionResponse } from '../grpc/proto/payment/TransactionResponse';
import {
  CheckoutRequest,
  checkPaymentStatusCode,
  getPaymentStatusFromCheckout,
  getPaymentStatusFromReporting,
  mapToRefundStatus,
  prepareCheckout,
} from '../libs/hyperpay';
import {
  Currency,
  PaymentCaptureRequest,
  PaymentItem,
} from '../libs/payment/index';
import {
  TamaraCancelRequest,
  TamaraCheckoutRequest,
  TamaraPaymentStatus,
  authorizeTamaraPayment,
  cancelOrderFromTamara,
  captureTamaraOrder,
  checkPaymentCheckoutStatusTamara,
  checkPaymentStatusTamara,
  getPaymentInformationFromTamara,
} from '../libs/payment/tamara';
import { createKey, deleteCache } from '../libs/redis';
import {
  capturePayment,
  checkPaymentCheckoutStatus,
  checkPaymentStatus,
  closeTabbyOrder,
  getPaymentStatusTabby,
} from '../libs/tabby';
import { AddressDocument } from '../models/Address';
import { AddOn } from '../models/Brand';
import { DeltaMachineOrderDocument } from '../models/DeltaMachineOrder';
import { PayoutRefundHistoryInput } from '../models/DmoPayoutRefundHistory';
import { OrderDocument } from '../models/Order';
import {
  PaymentActionType,
  PaymentCompleteness,
  PaymentDocument,
  PaymentInput,
  PaymentProvider,
  PaymentProviderType,
  SoumPaymentType,
} from '../models/Payment';
import { SettingDocument } from '../models/Setting';
import { OrderRepository, ProductRepository } from '../repositories';
import { AddressRepository } from '../repositories/addressRepository';
import { DmoPayoutRefundHistoryRepository } from '../repositories/dmoPayoutRefundHistoryRepository';
import { PaymentRepository } from '../repositories/paymentRepository';
import {
  formatPriceInDecimalPoints,
  generateRandomOperationNumber,
  normalize,
} from '../util/common';
import { sendEventData } from '../util/webEngageEvents';
import { DeltaMachineService } from './deltaMachineService';
import { DMSecurityFeeService } from './dmSecurityFeeService';
import { OrderService } from './orderService';
import { ProductService } from './productService';
import { SearchService } from './searchService';
import { SettingService } from './settingService';
import { UserService } from './userService';
import { BullMQService, Queues } from '../libs/bullmq.util';
import { JobTypes } from '../libs/bull.util';
import { DeltaMachineStatusName } from '../enums/DeltaMachineStatusName';
import { syncProduct } from '../grpc/productMicroService';
import { ProductActions } from '../enums/productActions.enum';

@Service()
export class PaymentService {
  @Inject()
  addressRepository: AddressRepository;

  @Inject()
  productRepository: ProductRepository;
  @Inject()
  productService: ProductService;
  @Inject()
  searchService: SearchService;
  @Inject()
  orderService: OrderService;
  @Inject()
  paymentRepository: PaymentRepository;
  @Inject()
  orderRepository: OrderRepository;

  @Inject()
  settingService: SettingService;
  @Inject()
  userService: UserService;
  @Inject()
  deltaMachineService: DeltaMachineService;
  @Inject()
  dmSecurityFeeService: DMSecurityFeeService;
  @Inject()
  dmoPayoutRefundHistoryRepository: DmoPayoutRefundHistoryRepository;

  @Inject()
  bullMQService?: BullMQService;
  constructor() {}

  async getListingFeesValue() {
    try {
      const [settingsError, settings] =
        await this.settingService.getSettingsWithKeys([
          SettingValues.SECURITY_FEE,
        ]);

      if (settingsError) {
        return {
          isActive: false,
          amount: 0,
        };
      }

      const feesSettings: SettingDocument[] = settings as SettingDocument[];
      const paymentFeeSetting = feesSettings.find(
        (elem: any) => elem.name == SettingValues.SECURITY_FEE
      );
      if (!paymentFeeSetting) {
        return {
          isActive: false,
          amount: 0,
        };
      }
      return {
        isActive: true,
        amount: paymentFeeSetting.value,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_PREPARE_CHECKOUT,
          exception.message
        );
      }
    }
  }

  async updateSecurityFeesOption(
    amount: number,
    userId: string,
    isOptIn: boolean
  ) {
    try {
      // Create deposit transaction in Wallet
      await this.dmSecurityFeeService.createWalletTransaction(userId, amount);
      const updateCustomerObj = { hasOptedForSF: false, isSFPaid: true };
      if (isOptIn) {
        updateCustomerObj.hasOptedForSF = true;
      }
      this.userService.updateCustomer(userId, updateCustomerObj);
      await deleteCache([createKey(Constants.CACHE_KEYS.USER_PRE, [userId])]);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_PAY_LISTING_FEES,
          exception.message
        );
      }
    }
  }
  async payListingFees(
    userInfo: any,
    paymentProviderType: PaymentProviderType
  ) {
    try {
      // get user address info
      const { addresses } = await this.userService.getUserAddresses(
        userInfo.id
      );
      const [settingsError, settings] =
        await this.settingService.getSettingsWithKeys([
          SettingValues.OPT_IN_SF,
          SettingValues.SECURITY_FEE,
          SettingValues.REGION,
        ]);

      if (settingsError) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_ADDRESS
        );
      }

      // get payment fees settings
      const feesSettings: SettingDocument[] = settings as SettingDocument[];
      if (
        !feesSettings.find(
          (elem: any) => elem.name == SettingValues.SECURITY_FEE
        ).value
      )
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.LISTING_FEES_NOT_ENABLED,
          Constants.MESSAGE.LISTING_FEES_NOT_ENABLED
        );
      const regionConf = await this.settingService.getRegionConfigs();
      // create checkout for the payment
      const paymentDocument = {
        payment_provider: PaymentProvider.HyperPay,
        payment_provider_type: paymentProviderType,
        payment_action_type: PaymentActionType.ListingFees,
        payment_completeness: PaymentCompleteness.Full,
        soum_payment_type: SoumPaymentType.OnlineProvider,
        payment_status: TransactionStatus.PENDING,
        checkout_payment_status: TransactionStatus.PENDING,
        payment_input: {
          amount: feesSettings.find(
            (elem: any) => elem.name == SettingValues.SECURITY_FEE
          ).value,
          city: addresses[0]?.city || '',
          country: regionConf.region,
          payment_number: generateRandomOperationNumber('listing-fees'),
          street: addresses[0]?.street?.substring(0, 99) || '',
          state: addresses[0]?.city?.substring(0, 49) || '',
          currency: regionConf.currency,
          postcode: addresses[0]?.postal_code?.substring(0, 15) || '',
          name: userInfo.name,
          country_code: userInfo.countryCode,
          mobile_number: userInfo.mobileNumber,
          surname: userInfo.name,
          userId: userInfo.id,
        } as PaymentInput,
      } as PaymentDocument;

      paymentDocument.checkout_payment_response =
        await this.paymentToCheckoutMapping(paymentDocument);
      const status = checkPaymentStatusCode(
        paymentDocument.checkout_payment_response.result as any
      );
      paymentDocument.checkout_payment_status = mapToRefundStatus(status);
      const [paymentSaveErr, paymentResult] =
        await this.paymentRepository.savePayment(paymentDocument);
      if (
        paymentDocument.checkout_payment_status == TransactionStatus.FAILED ||
        paymentSaveErr
      ) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_PREPARE_CHECKOUT,
          Constants.MESSAGE.FAILED_TO_PREPARE_CHECKOUT
        );
      }

      return {
        paymentId: (paymentResult.result as PaymentDocument)._id,
        paymentNumber: paymentDocument.payment_input.payment_number,
        checkoutId: paymentDocument.checkout_payment_response.id,
        paymentType: paymentProviderType,
        checkOutPaymentStatus: paymentDocument.checkout_payment_status,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_PREPARE_CHECKOUT,
          exception.message
        );
      }
    }
  }

  async updatePaymentFeesStatus(
    updatePaymentFeesDto: UpdatePaymentFeesDto,
    userId: string,
    isOptIn: string
  ) {
    try {
      // get payment row
      const [paymentErr, paymentResult] = await this.paymentRepository.getById(
        updatePaymentFeesDto.paymentId
      );
      if (paymentErr) throw new Error(Constants.MESSAGE.FAILED_TO_GET_PAYMENT);
      // collect payment status from hyper pay
      const paymentDocument = paymentResult.result as PaymentDocument;
      const { response, status } = await this.collectPaymentStatus(
        paymentDocument.checkout_payment_response?.id,
        updatePaymentFeesDto.paymentNumber,
        paymentDocument.payment_provider_type
      );
      paymentDocument.updated_date = new Date();
      paymentDocument.payment_status = status;
      paymentDocument.payment_response = response;

      // update payment row
      const [paymentSaveErr] = await this.paymentRepository.updatePayment(
        paymentDocument
      );
      // return payment status to user
      if (
        paymentDocument.payment_status == TransactionStatus.FAILED ||
        paymentSaveErr
      )
        throw new Error(Constants.MESSAGE.FAILED_TO_PAY_LISTING_FEES);

      // Create security Fee entity for the user
      if (
        paymentDocument.payment_status === TransactionStatus.COMPLETED &&
        paymentDocument.payment_action_type === PaymentActionType.ListingFees &&
        'userId' in paymentDocument.payment_input
      ) {
        // Create deposit transaction in Wallet
        await this.dmSecurityFeeService.createWalletTransaction(
          paymentDocument.payment_input.userId,
          paymentDocument.payment_input.amount
        );
        const updateCustomerObj = { hasOptedForSF: false, isSFPaid: true };
        if (isOptIn === 'true') {
          updateCustomerObj.hasOptedForSF = true;
        }
        this.userService.updateCustomer(userId, updateCustomerObj);
        await deleteCache([createKey(Constants.CACHE_KEYS.USER_PRE, [userId])]);
      }
      return {
        paymentStatus: paymentDocument.payment_status,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_PAY_LISTING_FEES,
          exception.message
        );
      }
    }
  }

  async collectPaymentStatus(
    checkoutId: string,
    paymentNumber: string,
    paymentProviderType: PaymentProviderType
  ) {
    const checkOutPaymentResponse: any = await getPaymentStatusFromCheckout(
      checkoutId,
      paymentProviderType
    );
    const checkOutPaymentStatus = mapToRefundStatus(
      checkPaymentStatusCode(checkOutPaymentResponse.result)
    );

    if (
      checkOutPaymentStatus == TransactionStatus.COMPLETED ||
      checkOutPaymentStatus == TransactionStatus.PENDING
    ) {
      return {
        response: checkOutPaymentResponse,
        status: checkOutPaymentStatus,
      };
    }
    const reportingPaymentResponse: any = await getPaymentStatusFromReporting(
      paymentNumber,
      paymentProviderType
    );
    const reportingPaymentStatus = mapToRefundStatus(
      checkPaymentStatusCode(reportingPaymentResponse.result)
    );

    if (reportingPaymentStatus == TransactionStatus.FAILED)
      return {
        response: reportingPaymentResponse,
        status: reportingPaymentStatus,
      };
    if (
      reportingPaymentResponse.payments &&
      reportingPaymentResponse.payments.length > 0
    ) {
      return {
        response: reportingPaymentResponse.payments[0],
        status: mapToRefundStatus(
          checkPaymentStatusCode(reportingPaymentResponse.payments[0].result)
        ),
      };
    }
    return {
      response: reportingPaymentResponse,
      status: reportingPaymentStatus,
    };
  }
  async paymentToCheckoutMapping(paymentDocument: PaymentDocument) {
    try {
      const regionConf = await this.settingService.getRegionConfigs();
      const data: CheckoutRequest = {
        cardType: paymentDocument.payment_provider_type,
        paymentType: 'DB',
        paymentNumber: paymentDocument.payment_input.payment_number,
        amount: paymentDocument.payment_input.amount,
        currency: regionConf.currency,
        testMode: null,
        userAddress: {
          address: paymentDocument.payment_input.street,
          city: paymentDocument.payment_input.city,
          state: paymentDocument.payment_input.state,
          country: paymentDocument.payment_input.country,
          postalCode: paymentDocument.payment_input.postcode,
          givenName: paymentDocument.payment_input.name,
          surName: paymentDocument.payment_input.surname,
        },
        countryCode: paymentDocument.payment_input.country,
        phoneNumber: paymentDocument.payment_input.mobile_number,
      };
      return await prepareCheckout(data);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_PREPARE_CHECKOUT_PAGE,
          exception.message
        );
      }
    }
  }

  async orderCheckOut(purchaseProductDto: PurchaseProductDto) {
    try {
      if (
        purchaseProductDto.paymentProvider !== PaymentProvider.Tabby &&
        purchaseProductDto.paymentProvider !== PaymentProvider.TAMARA
      ) {
        throw new Error('Not provided yet');
      }
      const [errOrder, orderData] = await this.orderRepository.getById(
        purchaseProductDto.orderId
      );
      if (errOrder) throw new Error(Constants.MESSAGE.FAILED_TO_GET_ORDER);

      const [productErr, productResult] =
        await this.productRepository.getDetailProduct(
          purchaseProductDto.productId
        );
      if (productErr) throw new Error(Constants.MESSAGE.PRODUCT_GET_NOT_FOUND);

      const order = orderData.result as OrderDocument;
      const product = productResult.result;
      const items = this.createItemPayloadForCheckout(
        product,
        purchaseProductDto,
        order.buy_amount
      );
      const mappedItems = items.map(item => ({
        ...item,
        unitPrice: item.unitPrice.toString(),
      }));
      const result: CreateTransactionResponse = await CreatePaymentTransaction({
        userId: order.buyer,
        productId: purchaseProductDto.productId,
        amount: formatPriceInDecimalPoints(order.grand_total),
        paymentOptionId: purchaseProductDto.paymentId,
        soumTransactionNumber: order.order_number,
        transactionType: ListingType.DIRECT.toLocaleUpperCase(),
        nationalId: purchaseProductDto.nationalId,
        orderId: order.id,
        items: mappedItems,
        returnUrls: purchaseProductDto.returnUrls,
      });
      if (!result.transactionId) {
        throw new Error(Constants.MESSAGE.FAILED_TO_CREATE_CHECKOUT);
      }
      purchaseProductDto.paymentId = result.transactionId;
      await this.productRepository.updateProductStatus(
        purchaseProductDto.productId,
        ProductOrderStatus.Locked
      );
      await this.searchService.deleteOneOrManyProducts([
        purchaseProductDto.productId,
      ]);
      await this.bullMQService.addJob(
        {
          id: purchaseProductDto.orderId,
          type: JobTypes.UPDATE_PRODUCT_SYNC_STATUS,
        },
        { delay: 20 * 60 * 1000 }, // 20 min delay
        Queues.DM_ORDERS
      );
      return {
        orderId: purchaseProductDto.orderId,
        paymentNumber: order.order_number,
        checkoutId: result.checkoutId,
        paymentId: result.transactionId,
        tabbyUrl:
          purchaseProductDto.paymentProvider === PaymentProvider.Tabby
            ? result.checkoutURL
            : null,
        paymentUrl: result.checkoutURL,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_BUY_PRODUCT,
          exception.message
        );
      }
    }
  }

  createItemPayloadForCheckout(
    product: any,
    purchaseProductDto: PurchaseProductDto,
    unitPrice: number
  ) {
    let items: PaymentItem[] = [
      {
        title: product.models?.model_name,
        description: `${product.category?.category_name}, ${product.models?.model_name}, ${product.description}`,
        category: product.category?.category_name,
        productImage: product.product_images[0] || '',
        productId: product._id.toString(),
        quantity: 1,
        unitPrice: unitPrice,
      },
    ];

    if (purchaseProductDto?.addOns?.selectedAddOns) {
      const addOnItems = purchaseProductDto.addOns.selectedAddOns.map(
        (addOn: AddOn) => {
          return {
            title: addOn.addOnName,
            description: addOn.addOnName,
            category: 'AddOn',
            productImage: addOn.addOnIcon,
            productId: addOn.id,
            quantity: 1,
            unitPrice: addOn?.addOnPrice,
          } as PaymentItem;
        }
      );
      items = [...items, ...addOnItems];
    }
    return items;
  }
  handleCheckoutCreationURL(
    paymentProvider: PaymentProvider,
    checkoutPaymentResponse: any
  ) {
    if (paymentProvider == PaymentProvider.Tabby) {
      return checkoutPaymentResponse.configuration?.available_products
        ?.installments[0]?.web_url;
    } else if (paymentProvider == PaymentProvider.TAMARA) {
      return checkoutPaymentResponse?.checkout_url;
    }
  }
  handleCheckoutCreationStatus(
    paymentProvider: PaymentProvider,
    checkoutPaymentResponse: any
  ) {
    let status = null;
    if (paymentProvider == PaymentProvider.Tabby) {
      status = mapToRefundStatus(
        checkPaymentCheckoutStatus(checkoutPaymentResponse)
      );
    } else if (paymentProvider == PaymentProvider.TAMARA) {
      status = checkPaymentCheckoutStatusTamara(checkoutPaymentResponse);
    }
    return status;
  }
  async validateBNPLForUser(
    userInfo: any,
    validateBNPLOrderDto: ValidateBNPLOrderDto
  ) {
    if (
      validateBNPLOrderDto.paymentProvider !== PaymentProvider.Tabby &&
      validateBNPLOrderDto.paymentProvider !== PaymentProvider.TAMARA
    ) {
      throw new Error('Not provided yet');
    }

    try {
      const [addressErr, addressData] =
        await this.addressRepository.getUserAddress(userInfo._id.toString());

      if (
        addressErr ||
        ((addressData.result as AddressDocument[]) || []).length == 0
      )
        return {
          message: Constants.MESSAGE.ADDRESS_GET_NOT_FOUND,
          status: TransactionStatus.FAILED,
        };

      const [productErr, productResult] =
        await this.productRepository.getDetailProduct(
          validateBNPLOrderDto.productId.toString()
        );
      if (productErr || productResult.result == null)
        return {
          message: Constants.MESSAGE.PRODUCT_ID_NOT_FOUND,
          status: TransactionStatus.FAILED,
        };
      const product: any = productResult.result;

      const validateBNPLForUser = await ValidateBNPLForUser({
        userId: userInfo._id.toString(),
        productId: validateBNPLOrderDto.productId,
        amount: formatPriceInDecimalPoints(validateBNPLOrderDto.amount),
        paymentOption: {
          paymentProvider: validateBNPLOrderDto.paymentProvider,
        },
        soumTransactionNumber: generateRandomOperationNumber('newOrder'),
        transactionType: ListingType.DIRECT.toLocaleUpperCase(),
        nationalId: '',
        items: [
          {
            title: product.models?.model_name,
            description: `${product.category?.category_name}, ${product.models?.model_name}, ${product.description}`,
            unitPrice: `${validateBNPLOrderDto.amount}`,
            vatAmount: '',
          },
        ],
      });

      if (validateBNPLForUser?.isValid) {
        return {
          status: TransactionStatus.COMPLETED,
        };
      }

      const message = validateBNPLForUser.reason
        ? validateBNPLForUser.reason
        : `Payment is not allowed from ${validateBNPLOrderDto.paymentProviderType}`;
      return {
        message,
        status: TransactionStatus.FAILED,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_BUY_PRODUCT,
          exception.message ||
            `There was a problem while validating ${validateBNPLOrderDto.paymentProviderType} as payment option`
        );
      }
    }
  }

  mapPaymentStatus = (status: string): TransactionStatus => {
    if (status === TransactionOrderStatus.SUCCESS) {
      return TransactionStatus.COMPLETED;
    }
    if (status === TransactionStatus.COMPLETED) {
      return TransactionStatus.COMPLETED;
    }
    if (status === TransactionOrderStatus.PENDING) {
      return TransactionStatus.PENDING;
    }
    if (status === TransactionOrderStatus.CANCELED) {
      return TransactionStatus.CLOSED;
    }
    if (status === TransactionOrderStatus.AUTHORISED) {
      return TransactionStatus.AUTHORISED;
    }
    return TransactionStatus.FAILED;
  };

  async processUpdatePaymentStatusForTransaction(
    updatePaymentDto: UpdatePaymentDto,
    transaction: TransactionResponse,
    clientId?: string
  ) {
    const transactionStatus = this.mapPaymentStatus(
      transaction.transactionStatusId
    );
    const order: OrderDocument =
      await this.orderRepository.getOrderByOrderNumber(
        transaction.soumTransactionNumber
      );
    if (order.transaction_status === TransactionOrderStatus.SUCCESS) {
      return {
        ...updatePaymentDto,
        paymentStatus: transactionStatus,
        orderTransactionStatus: order.transaction_status,
      };
    }
    const updateOrderObj = {
      orderId: order._id.toString(),
      response: transaction.providerResponse
        ? JSON.parse(transaction.providerResponse)
        : null,
      transactionId: transaction.checkoutId,
      orderNumber: transaction.soumTransactionNumber,
    } as PaymentOrderUpdateDto;

    if (clientId !== '' && clientId !== undefined) {
      updateOrderObj.sourcePlatform = clientId;
    }

    console.log(
      `${transaction.soumTransactionNumber}: calling  reflectChangesInOrderAndProduct.`
    );
    const handleOrderRes = await this.reflectChangesInOrderAndProduct(
      {
        orderId: order._id.toString(),
        productId: order.product,
        paymentProvider: updatePaymentDto.paymentProvider,
      } as PurchaseProductDto,
      transactionStatus,
      updateOrderObj,
      false
    );

    const updatedOrder = await this.orderRepository.getOrderByOrderNumber(
      transaction.soumTransactionNumber
    );
    let result = {
      ...updatePaymentDto,
      ...handleOrderRes,
      orderTransactionStatus: updatedOrder.transaction_status,
    };

    if (
      transactionStatus === TransactionStatus.COMPLETED ||
      transactionStatus === TransactionStatus.AUTHORISED
    ) {
      result = {
        ...result,
        paymentStatus: TransactionStatus.COMPLETED,
      };
    }
    return result;
  }
  async updatePaymentStatus(
    updatePaymentDto: UpdatePaymentDto,
    clientId?: string
  ) {
    try {
      // Call payment svc with gRPC
      const transaction: TransactionResponse =
        await GetPaymentTransactionBySoumTransactionNumber(
          {
            soumTransactionNumber: updatePaymentDto.paymentNumber,
          },
          true
        );

      const isReserveFinancingTransaction =
        transaction.soumTransactionNumber.split('-').length === 2
          ? true
          : false;
      if (isReserveFinancingTransaction) {
        return await this.acknowledgeReservationPayment(
          updatePaymentDto,
          transaction
        );
      }
      return await this.processUpdatePaymentStatusForTransaction(
        updatePaymentDto,
        transaction,
        clientId
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PAYMENT_STATUS,
          exception.message
        );
      }
    }
  }

  async closeOrder(orderId: string, userId: string = '') {
    try {
      const order = await this.orderService.findOrderById(orderId);
      let paymentResult: any = {
        status: null,
        response: null,
      };
      let userName = '';
      if (userId) {
        const user = await this.deltaMachineService.getDMUser(userId);
        userName = user.username;
      }
      const orderNumber = order?.order_number || '';
      const paymentDocument = await this.getPaymentDocumentWithOrderId(
        orderId,
        true
      );
      const transaction = await GetPaymentTransactionBySoumTransactionNumber(
        {
          soumTransactionNumber: orderNumber,
        },
        true
      );
      if (!transaction && !paymentDocument) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT
        );
      }
      let transactionCompleted = false;
      let transactionAlreadyClosed = false;
      let paymentGatewayTransactionId: string;
      let paymentAmount: number;
      let transactionTimestampFromHyperpay: Date;
      if (paymentDocument) {
        paymentResult = await this.closeTabbyOrder(
          paymentDocument,
          orderNumber
        );
        transactionCompleted =
          paymentResult?.status === TransactionStatus.COMPLETED;
        transactionAlreadyClosed =
          paymentResult?.status === TransactionStatus.CLOSED;
        paymentGatewayTransactionId = paymentResult.response?.id;
        paymentAmount = paymentDocument.payment_input.amount;
        transactionTimestampFromHyperpay = paymentDocument.updated_date;
      } else {
        const reverseTransaction = await ReverseTransaction({
          transactionId: transaction.transactionId,
        });
        const { operationId, transactionStatusId, totalAmount } =
          reverseTransaction;
        const mappedStatus = this.mapPaymentStatus(transactionStatusId);
        transactionCompleted =
          mappedStatus === TransactionStatus.CLOSED && !!operationId;
        transactionAlreadyClosed =
          mappedStatus === TransactionStatus.CLOSED && !operationId;
        paymentGatewayTransactionId = operationId;
        paymentAmount = Number(totalAmount);
      }

      if (transactionCompleted) {
        const payoutId = await this.orderService.generateTransactionId(
          'refund'
        );
        const paymentLogCloseOrder: PayoutRefundHistoryInput = {
          dmoTransactionId: payoutId,
          orderId: orderId,
          transactionType: 'Refund',
          transactionStatus: TransactionStatus.COMPLETED,
          paymentMethod: 'Tabby Close',
          amount: paymentAmount,
          paymentGatewayTransactionId: paymentGatewayTransactionId,
          transactionTimestampFromHyperpay: transactionTimestampFromHyperpay
            ? moment(transactionTimestampFromHyperpay).format(
                'DD/MM/YYYY hh:mm:ss A'
              )
            : moment().format('DD/MM/YYYY hh:mm:ss A'),
          transactionTimestamp: moment().toISOString(),
          doneBy: userName,
        };
        await this.dmoPayoutRefundHistoryRepository.addPayoutRefundHistory(
          paymentLogCloseOrder
        );
        const orders = await this.orderService.findOrdersById([orderId]);
        const orderData = this.deltaMachineService.populateOrdersData(
          orders[0]
        );
        const webEngageData = {
          'Product ID': orderData?.productId,
          'Buyer ID': orderData?.buyerId,
          'Buyer Phone Number': orderData?.buyerPhone,
          'Order ID': orderId,
          'Order Number': orderData?.orderNumber,
          'Refund Amount': paymentAmount,
          'Product Name': orderData?.productName,
        };
        const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
        await sendEventData(
          orderData?.buyerId,
          'Order Refunded',
          dateFormat,
          webEngageData
        );
        return {
          paymentStatus: `Tabby closing to ${orderNumber} was successful`,
        };
      }
      if (transactionAlreadyClosed) {
        return {
          paymentStatus: `Order ${orderNumber} is already closed`,
        };
      }
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_CLOSE_ORDER,
        null
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      }
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_CLOSE_ORDER,
        exception.message || exception
      );
    }
  }

  async cancelTamara(orderId: string, userId: string = '') {
    try {
      const order = await this.orderService.findOrderById(orderId);
      let userName = '';
      if (userId) {
        const user = await this.deltaMachineService.getDMUser(userId);
        userName = user.username;
      }
      const orderNumber = order?.order_number || '';
      const paymentDocument = await this.getPaymentDocumentWithOrderId(
        orderId,
        true
      );
      const transaction = await GetPaymentTransactionBySoumTransactionNumber(
        {
          soumTransactionNumber: orderNumber,
        },
        true
      );
      if (!transaction && !paymentDocument) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT
        );
      }

      let status: string;

      let transactionCompleted = false;
      let paymentGatewayTransactionId: string;
      let paymentAmount: number;
      if (paymentDocument) {
        const [, productResult] = await this.productRepository.getProductDetail(
          paymentDocument.payment_input.product.toString()
        );
        const product: any = productResult.result;
        const amount = parseFloat(
          paymentDocument.payment_input.amount.toFixed(2)
        );
        const cancelTamaraResult: { status?: string; cancel_id?: string } =
          await cancelOrderFromTamara({
            paymentId: paymentDocument._id,
            orderId: paymentDocument.payment_input.order,
            amount,
            currency: 'SAR',
            items: [
              {
                title: product.models?.model_name,
                category: product.category?.category_name,
                productImage: product.product_images[0] || '',
                productId: product._id.toString(),
                quantity: 1,
                unitPrice: amount,
              } as PaymentItem,
            ],
          } as TamaraCancelRequest);
        transactionCompleted =
          cancelTamaraResult?.status ===
          normalize(WalletTransactionStatus.CANCELED);
        paymentGatewayTransactionId = cancelTamaraResult.cancel_id;
        paymentAmount = paymentDocument.payment_input.amount;
      } else {
        const reverseTransaction = await ReverseTransaction({
          transactionId: transaction.transactionId,
        });
        const { operationId, transactionStatusId, totalAmount } =
          reverseTransaction;
        const mappedStatus = this.mapPaymentStatus(transactionStatusId);
        transactionCompleted =
          mappedStatus === TransactionStatus.CLOSED && !!operationId;
        paymentGatewayTransactionId = operationId;
        paymentAmount = Number(totalAmount);
      }

      if (transactionCompleted) {
        status = normalize(WalletTransactionStatus.CANCELED);
        const refundId = await this.orderService.generateTransactionId(
          'refund'
        );
        const paymentLogCloseOrder: PayoutRefundHistoryInput = {
          dmoTransactionId: refundId,
          orderId: orderId,
          transactionType: 'Refund',
          transactionStatus: TransactionStatus.COMPLETED,
          paymentMethod: 'Tamara Close',
          amount: paymentAmount,
          paymentGatewayTransactionId: paymentGatewayTransactionId,
          transactionTimestamp: moment().toISOString(),
          doneBy: userName,
        };
        await this.dmoPayoutRefundHistoryRepository.addPayoutRefundHistory(
          paymentLogCloseOrder
        );
        const orders = await this.orderService.findOrdersById([orderId]);
        const orderData = this.deltaMachineService.populateOrdersData(
          orders[0]
        );
        const webEngageData = {
          'Product ID': orderData?.productId,
          'Buyer ID': orderData?.buyerId,
          'Buyer Phone Number': orderData?.buyerPhone,
          'Order ID': orderId,
          'Order Number': orderData?.orderNumber,
          'Refund Amount': paymentDocument.payment_input.amount,
          'Product Name': orderData?.productName,
        };
        const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
        await sendEventData(
          orderData?.buyerId,
          'Order Refunded',
          dateFormat,
          webEngageData
        );
        return {
          paymentStatus: status,
        };
      }
      return {
        paymentStatus: '',
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      }
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_CLOSE_ORDER,
        exception.message || exception
      );
    }
  }

  async paymentFinalizationUsingTransaction(
    transaction: TransactionResponse,
    order: OrderDocument,
    skipAutoCapturePayment: boolean,
    clientId: string
  ) {
    if (
      skipAutoCapturePayment &&
      transaction.transactionStatusId === 'Authorised'
    ) {
      transaction = await CaptureTransaction({
        transactionId: transaction.transactionId,
      });
    }
    const transactionStatus = this.mapPaymentStatus(
      transaction.transactionStatusId
    );
    const updateOrderObj = {
      orderId: order._id.toString(),
      response: transaction.providerResponse
        ? JSON.parse(transaction.providerResponse)
        : null,
      transactionId: transaction.checkoutId,
    } as PaymentOrderUpdateDto;
    if (clientId !== '' && clientId !== undefined) {
      updateOrderObj.sourcePlatform = clientId;
    }
    return await this.reflectChangesInOrderAndProduct(
      {
        orderId: order._id.toString(),
        productId: order.product,
        paymentProvider: transaction.paymentOption.paymentProvider,
      } as PurchaseProductDto,
      transactionStatus,
      updateOrderObj,
      skipAutoCapturePayment
    );
  }
  async paymentFinalizationUsingPaymentDocument(
    paymentDocument: PaymentDocument,
    skipAutoCapturePayment: boolean,
    clientId: string
  ) {
    let paymentResult: { status: TransactionStatus; response: any } = {
      status: null,
      response: null,
    };
    const [productErr, productResult] =
      await this.productRepository.getProductDetail(
        paymentDocument.payment_input.product.toString()
      );
    if (productErr) throw new Error(Constants.MESSAGE.PRODUCT_GET_NOT_FOUND);
    const product: any = productResult.result;
    if (paymentDocument.payment_provider == PaymentProvider.Tabby) {
      paymentResult = await this.tabbyPaymentFinalization(
        paymentDocument,
        product,
        skipAutoCapturePayment
      );
    } else if (paymentDocument.payment_provider == PaymentProvider.TAMARA) {
      paymentResult = await this.tamaraPaymentFinalization(
        paymentDocument,
        product,
        skipAutoCapturePayment
      );
    }

    paymentDocument.updated_date = new Date();
    paymentDocument.payment_status = paymentResult.status;
    paymentDocument.payment_response = paymentResult.response;
    await this.paymentRepository.updatePayment(paymentDocument);

    const updateOrderObj = {
      orderId: paymentDocument.payment_input.order,
      response: paymentDocument.payment_response,
      transactionId: paymentDocument.checkout_payment_response.id,
    } as PaymentOrderUpdateDto;

    if (clientId !== '' && clientId !== undefined) {
      updateOrderObj.sourcePlatform = clientId;
    }

    return await this.reflectChangesInOrderAndProduct(
      {
        orderId: paymentDocument.payment_input.order,
        productId: paymentDocument.payment_input.product,
        paymentProvider: paymentDocument.payment_provider,
      } as PurchaseProductDto,
      paymentDocument.payment_status,
      updateOrderObj,
      skipAutoCapturePayment
    );
  }
  async handleOrderPayment(
    orderId: string,
    clientId: string = '',
    skipAutoCapturePayment: boolean = false
  ) {
    try {
      const [, settings] = await this.settingService.getSettingsWithKeys([
        'disable_bnpl_automation',
      ]);
      if (settings?.length) {
        if (!skipAutoCapturePayment) {
          skipAutoCapturePayment = !settings[0].value;
        }
      }
      const order = await this.orderService.findOrderById(orderId);
      const orderNumber = order?.order_number || '';
      const paymentDocument = await this.getPaymentDocumentWithOrderId(
        orderId,
        true
      );
      const transaction = await GetPaymentTransactionBySoumTransactionNumber(
        {
          soumTransactionNumber: orderNumber,
        },
        true
      );
      if (!transaction && !paymentDocument) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT
        );
      }
      if (paymentDocument) {
        return await this.paymentFinalizationUsingPaymentDocument(
          paymentDocument,
          skipAutoCapturePayment,
          clientId
        );
      }
      return await this.paymentFinalizationUsingTransaction(
        transaction,
        order,
        skipAutoCapturePayment,
        clientId
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PAYMENT_STATUS,
          exception.message || exception
        );
      }
    }
  }

  async tabbyPaymentFinalization(
    paymentDocument: PaymentDocument,
    product: any,
    canAutoCapturePayment: boolean
  ) {
    let response: any = await getPaymentStatusTabby(
      paymentDocument.checkout_payment_response?.payment?.id
    );

    if (response.status == 'AUTHORIZED' && canAutoCapturePayment) {
      response = await capturePayment({
        amount: paymentDocument.payment_input.amount,
        paymentId: paymentDocument.checkout_payment_response?.payment?.id,
        items: [
          {
            title: product.models?.model_name,
            description: `${product.category?.category_name}, ${product.models?.model_name}, ${product.description}`,
            category: product.category?.category_name,
            productImage: product.product_images[0] || '',
            productId: paymentDocument.payment_input.product,
            quantity: 1,
            unitPrice: paymentDocument.payment_input.amount,
          } as PaymentItem,
        ],
      } as PaymentCaptureRequest);
    }
    const status = checkPaymentStatus(response);
    return {
      response,
      status,
    };
  }

  async closeTabbyOrder(paymentDocument: PaymentDocument, orderNumber: string) {
    const statusResponse: any = await getPaymentStatusTabby(
      paymentDocument.checkout_payment_response?.payment?.id
    );
    if (statusResponse?.status === TabbyStatusEnum.CLOSED) {
      return {
        statusResponse,
        status: TransactionStatus.CLOSED,
        statusMessage: `Order ${orderNumber} is already closed`,
      };
    }
    if (statusResponse?.status === TabbyStatusEnum.AUTHORISED) {
      try {
        const response = await closeTabbyOrder(
          paymentDocument.checkout_payment_response?.payment?.id
        );
        return {
          response,
          status: TransactionStatus.COMPLETED,
          statusMessage: `Tabby closing to ${orderNumber} was successful`,
        };
      } catch (err) {
        return {
          err,
          status: `Tabby closing to ${orderNumber} has failed`,
        };
      }
    }
  }

  async tamaraPaymentFinalization(
    paymentDocument: PaymentDocument,
    product: any,
    canAutoCapturePayment: boolean
  ) {
    let response: any = await getPaymentInformationFromTamara(
      paymentDocument.checkout_payment_response?.order_id
    );
    if (response.status == TamaraPaymentStatus.APPROVED) {
      await authorizeTamaraPayment(
        paymentDocument.checkout_payment_response?.order_id
      );
      response = await getPaymentInformationFromTamara(
        paymentDocument.checkout_payment_response?.order_id
      );
    }
    if (
      response.status == TamaraPaymentStatus.AUTHORIZED &&
      canAutoCapturePayment
    ) {
      await captureTamaraOrder({
        amount: paymentDocument.payment_input.amount,
        paymentId: paymentDocument.checkout_payment_response?.order_id,
        currency: Currency.SAR,
        items: [
          {
            title: product.models?.model_name,
            description: `${product.category?.category_name}, ${product.models?.model_name}, ${product.description}`,
            category: product.category?.category_name,
            productImage: product.product_images[0] || '',
            productId: paymentDocument.payment_input.product,
            quantity: 1,
            unitPrice: paymentDocument.payment_input.amount,
          } as PaymentItem,
        ],
      } as TamaraCheckoutRequest);
      response = await getPaymentInformationFromTamara(
        paymentDocument.checkout_payment_response?.order_id
      );
    }
    const status = checkPaymentStatusTamara(response);
    return {
      response,
      status,
    };
  }

  async getPaymentDocumentWithOrderId(orderId: string, returnNull = false) {
    try {
      const [paymentErr, paymentResult] =
        await this.paymentRepository.getByOrderId(orderId);
      if (paymentErr && returnNull) {
        return null;
      }
      if (paymentErr) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT
        );
      }
      const paymentDocument = paymentResult.result as PaymentDocument;
      return paymentDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT,
          exception.message
        );
      }
    }
  }

  async reflectChangesInOrderAndProduct(
    purchaseProductDto: PurchaseProductDto,
    paymentStatus: TransactionStatus,
    paymentOrderUpdateDto: PaymentOrderUpdateDto,
    skipAutoCapturePayment: boolean
  ) {
    console.log(
      `${paymentOrderUpdateDto.orderNumber}:processing reflectChangesInOrderAndProduct paymentStatus=${paymentStatus}.`
    );
    if (paymentStatus === TransactionStatus.FAILED) {
      paymentOrderUpdateDto.status = TransactionOrderStatus.FAILED;
      paymentOrderUpdateDto.paymentReceivedFromBuyer = 'No';
      await this.orderRepository.updateOrderAfterPayment(paymentOrderUpdateDto);
      await this.productRepository.updateProductStatus(
        purchaseProductDto.productId,
        ProductOrderStatus.Available
      );
      await this.searchService.addProducts([purchaseProductDto.productId]);
      throw new Error(Constants.MESSAGE.FAILED_TO_PAY_ORDER);
    }
    if (paymentStatus === TransactionStatus.COMPLETED) {
      const dmOrders = await this.deltaMachineService.findDMOrdersById([
        purchaseProductDto.orderId,
      ]);
      paymentOrderUpdateDto.status = TransactionOrderStatus.SUCCESS;
      paymentOrderUpdateDto.paymentReceivedFromBuyer = 'Yes';
      const [error, orderResult] =
        await this.orderRepository.updateOrderAfterPayment(
          paymentOrderUpdateDto
        );
      if (!error) {
        const order = orderResult.result as OrderDocument;
        if (!order.isFinancing) {
          await this.productRepository.updateProductStatus(
            purchaseProductDto.productId,
            ProductOrderStatus.Sold
          );
          await syncProduct({
            productAction: ProductActions.SYSTEM_SOLD_UPDATE,
            productId: purchaseProductDto.productId,
            status: ProductOrderStatus.Sold,
            order: {
              soumNumber: order.order_number,
            },
          });
        }
        console.log(
          `${paymentOrderUpdateDto.orderNumber}:processed reflectChangesInOrderAndProduct ${order.transaction_status}.`
        );
      } else {
        console.log(
          `${paymentOrderUpdateDto.orderNumber}:processed reflectChangesInOrderAndProduct error=${orderResult.message}.`
        );
      }

      if (dmOrders.length === 0) {
        // Add this order to DM
        await this.deltaMachineService.createDmOrderJob({
          orderId: purchaseProductDto.orderId,
        } as DeltaMachineOrderDocument);
      }

      await this.searchService.deleteOneOrManyProducts([
        purchaseProductDto.productId,
      ]);

      return {
        paymentStatus: paymentStatus,
      };
    }

    if (
      paymentStatus === TransactionStatus.AUTHORISED &&
      (purchaseProductDto.paymentProvider === PaymentProvider.TAMARA ||
        purchaseProductDto.paymentProvider === PaymentProvider.Tabby) &&
      !skipAutoCapturePayment
    ) {
      const dmOrders = await this.deltaMachineService.findDMOrdersById([
        purchaseProductDto.orderId,
      ]);
      paymentOrderUpdateDto.status = TransactionOrderStatus.SUCCESS;
      paymentOrderUpdateDto.paymentReceivedFromBuyer = 'No';
      await this.orderRepository.updateOrderAfterPayment(paymentOrderUpdateDto);
      await this.productRepository.updateProductStatus(
        purchaseProductDto.productId,
        ProductOrderStatus.Sold
      );

      await syncProduct({
        productAction: ProductActions.SYSTEM_SOLD_UPDATE,
        productId: purchaseProductDto.productId,
        status: ProductOrderStatus.Sold,
        order: {
          soumNumber: paymentOrderUpdateDto.orderNumber,
        },
      });
      if (dmOrders.length === 0) {
        // Add this order to DM
        await this.deltaMachineService.createDmOrderJob({
          orderId: purchaseProductDto.orderId,
          captureStatus: DeltaMachineBNPLStatuses.NOT_CAPTURED,
        } as DeltaMachineOrderDocument);
      }
      await this.searchService.deleteOneOrManyProducts([
        purchaseProductDto.productId,
      ]);
      return {
        paymentStatus: paymentStatus,
      };
    }

    // paymentOrderUpdateDto.status = TransactionOrderStatus.PENDING;
    // paymentOrderUpdateDto.paymentReceivedFromBuyer = 'No';
    // await this.orderRepository.updateOrderAfterPayment(paymentOrderUpdateDto);
    console.log(
      `${paymentOrderUpdateDto.orderNumber}:processed reflectChangesInOrderAndProduct executed with pending.`
    );
    return {
      paymentStatus: paymentStatus,
    };
  }

  async getTransactionWithOrderId(orderId: string) {
    try {
      const order = await this.orderService.findOrderById(orderId);
      const orderNumber = order?.order_number || '';
      const transaction = await GetPaymentTransactionBySoumTransactionNumber(
        {
          soumTransactionNumber: orderNumber,
        },
        true
      );
      if (!transaction) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT
        );
      }
      return transaction;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT,
          exception.message
        );
      }
    }
  }

  async finalizeReservationPayment(orderNumber: string, status: string) {
    const order = await this.orderRepository.getOrderByOrderNumber(orderNumber);
    const productId = order.product._id.toString();
    const orderId = order._id.toString();
    if (status === 'Success') {
      await Promise.all([
        this.deltaMachineService.updateDMOrderStatusByName(
          orderId,
          DeltaMachineStatusName.WAITING_FOR_VISIT
        ),
        this.productRepository.updateProductStatus(
          productId,
          ProductOrderStatus.Sold
        ),
      ]);
      await syncProduct({
        productAction: ProductActions.SYSTEM_SOLD_UPDATE,
        productId: productId,
        status: ProductOrderStatus.Sold,
        order: {
          soumNumber: order.order_number,
        },
      });
    }
    if (status === 'Fail') {
      await this.productRepository.updateProductStatus(
        productId,
        ProductOrderStatus.Available
      );
    }
  }

  async acknowledgeReservationPayment(
    updatePaymentDto: UpdatePaymentDto,
    transaction: TransactionResponse
  ) {
    const transactionStatus = this.mapPaymentStatus(
      transaction.transactionStatusId
    );
    const orderNumber = updatePaymentDto.paymentNumber.split('-')[1];
    let reservationTransactionStatus = 'Success';
    if (
      transactionStatus === TransactionStatus.FAILED ||
      transactionStatus === TransactionStatus.CLOSED
    ) {
      reservationTransactionStatus = 'Fail';
    }
    if (transactionStatus === TransactionStatus.PENDING) {
      reservationTransactionStatus = 'Pending';
    }
    await this.finalizeReservationPayment(
      orderNumber,
      reservationTransactionStatus
    );

    return {
      ...updatePaymentDto,
      paymentStatus: transactionStatus,
    };
  }
}
