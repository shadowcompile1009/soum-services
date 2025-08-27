import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { SecurityFeeStatus } from '../enums/DMSecurityFeeStatus';
import { InvoiceFormats } from '../enums/InvoiceFormats';
import {
  TransactionType,
  WalletTransactionStatus,
} from '../enums/TransactionStatus';
import {
  CreateTransaction,
  GetTransactionById,
  GetWallet,
  UpdateTransaction,
  UpdateWallet,
} from '../grpc/wallet';
import { InvoiceJobType, JobTypes } from '../libs/bull.util';
import { DMSecurityFeeDocument } from '../models/DMSecurityFee';
import { SettingDocument } from '../models/Setting';
import { DMSecurityFeeRepository } from '../repositories/dmSecurityFeeRepository';
import { DeltaMachineService } from './deltaMachineService';
import { ProductService } from './productService';
import { SettingService } from './settingService';
import { FeedService } from './feedService';

@Service()
export class DMSecurityFeeService {
  @Inject()
  error: ErrorResponseDto;
  @Inject()
  dmSecurityFeeRepository: DMSecurityFeeRepository;

  @Inject()
  feedService: FeedService;
  @Inject()
  productService: ProductService;
  @Inject()
  settingService: SettingService;
  @Inject()
  deltaMachineService: DeltaMachineService;
  async getByUserId(userId: string) {
    try {
      const [err, data] = await this.dmSecurityFeeRepository.getByUserId(
        userId
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_GET_DM_SECURITY_FEE;
        throw this.error;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DM_SECURITY_FEE,
          exception.message
        );
      }
    }
  }

  async updateSecurityFeeIfApplicable(securityFeeObj: DMSecurityFeeDocument) {
    try {
      if (securityFeeObj?.status === SecurityFeeStatus.AVAILABLE) {
        const [settingsError, settings] =
          await this.settingService.getSettingsWithKeys([
            'apply_listing_fees',
            'listing_fees',
          ]);
        if (settingsError) {
          throw new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DM_SECURITY_FEE
          );
        }
        const feesSettings: SettingDocument[] = settings as SettingDocument[];
        if (
          !feesSettings.find((elem: any) => elem.name == 'apply_listing_fees')
            .value
        ) {
          throw new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.LISTING_FEES_NOT_ENABLED,
            Constants.MESSAGE.LISTING_FEES_NOT_ENABLED
          );
        }
        const listingFeeValue = feesSettings.find(
          (elem: any) => elem.name == 'listing_fees'
        ).value;
        const wallet = await GetWallet({ ownerId: securityFeeObj.userId });
        if (wallet?.availableBalance < listingFeeValue) {
          securityFeeObj.status = SecurityFeeStatus.NOT_SET;
          await this.update(securityFeeObj._id, securityFeeObj);
        }
      }
      return securityFeeObj;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_DM_SECURITY_FEE,
          exception.message
        );
      }
    }
  }

  async create(newSecurityFeeObj: DMSecurityFeeDocument) {
    try {
      const [err, data] = await this.dmSecurityFeeRepository.create(
        newSecurityFeeObj
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_DM_SECURITY_FEE,
          exception.message
        );
      }
    }
  }

  async update(id: string, securityFeeObj: DMSecurityFeeDocument) {
    try {
      const [err, data] = await this.dmSecurityFeeRepository.update(
        id,
        securityFeeObj
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_DM_SECURITY_FEE,
          exception.message
        );
      }
    }
  }

  async createWalletTransaction(ownerId: string, amount: number) {
    // Create deposit transaction in Wallet
    const data: any = await CreateTransaction({
      ownerId,
      amount,
      type: TransactionType.DEPOSIT,
      description: 'Security fee',
      status: 'Success',
    });
    // await UpdateWallet({
    //   walletId: data.walletId,
    //   amount: data.amount,
    //   transactionType: 'deposit',
    // });
    const [err, result] = await this.dmSecurityFeeRepository.getByUserId(
      ownerId
    );
    if (err) {
      const newSecurityFeeObj = {
        transactionId: data.id,
        userId: ownerId,
        status: SecurityFeeStatus.AVAILABLE,
      };
      await this.create(newSecurityFeeObj as DMSecurityFeeDocument);
    } else {
      const securityFeeObj = result.result as DMSecurityFeeDocument;
      securityFeeObj.status = SecurityFeeStatus.AVAILABLE;
      securityFeeObj.transactionId = data.id;
      await this.update(securityFeeObj._id, securityFeeObj);
    }
  }

  async findProductsByUserId(userId: string) {
    const [, productsResult] = await this.productService.findProductsByUserId(
      userId
    );
    return productsResult?.result;
  }

  async updateSecurityFeeStatusAndDeposit(userId: string) {
    try {
      const result = await this.getByUserId(userId);
      const sFDocument = result?.result as DMSecurityFeeDocument;
      if (!sFDocument || sFDocument?.status === SecurityFeeStatus.NOT_SET) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
          ''
        );
      }
      const transactionStatus = WalletTransactionStatus.SUCCESS;
      if (sFDocument.status === SecurityFeeStatus.AVAILABLE) return;
      if (sFDocument.status === SecurityFeeStatus.ON_HOLD) {
        sFDocument.status = SecurityFeeStatus.AVAILABLE;
      }
      const data = await this.update(sFDocument._id, sFDocument);
      const updatedSFDocument = data?.result as DMSecurityFeeDocument;
      if (updatedSFDocument) {
        const transaction = await GetTransactionById({
          id: sFDocument.transactionId,
        });
        if (transaction) {
          await UpdateTransaction({
            transactionId: sFDocument.transactionId,
            status: transactionStatus,
          });
          await UpdateWallet({
            walletId: transaction.walletId,
            amount: transaction.amount,
            transactionType: 'deposit',
          });
        }
        return result;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
          ''
        );
      }
    } catch (error) {
      return null;
    }
  }

  async updateSecurityFeeStatusAndWithdraw(userId: string) {
    const result = await this.getByUserId(userId);
    const sFDocument = result?.result as DMSecurityFeeDocument;
    if (!sFDocument || sFDocument?.status === SecurityFeeStatus.NOT_SET) {
      return new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
        ''
      );
    }
    const transactionStatus = WalletTransactionStatus.PENDING;
    if (sFDocument?.status === SecurityFeeStatus.ON_HOLD) return;
    sFDocument.status = SecurityFeeStatus.ON_HOLD;
    const data = await this.update(sFDocument._id, sFDocument);
    const updatedSFDocument = data?.result as DMSecurityFeeDocument;
    if (updatedSFDocument) {
      const transaction = await GetTransactionById({
        id: sFDocument.transactionId,
      });
      if (transaction?.status === WalletTransactionStatus.SUCCESS) {
        await UpdateTransaction({
          transactionId: sFDocument.transactionId,
          status: transactionStatus,
        });
        await UpdateWallet({
          walletId: transaction.walletId,
          amount: transaction.amount,
          transactionType: 'withdraw',
        });
      }
      return result;
    } else {
      return new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
        ''
      );
    }
  }

  async deductSecurityFee(userId: string, orderId: string) {
    try {
      const result = await this.getByUserId(userId);
      const sFDocument = result?.result as DMSecurityFeeDocument;
      if (
        !sFDocument ||
        sFDocument?.status === SecurityFeeStatus.NOT_SET ||
        sFDocument?.status === SecurityFeeStatus.PENALISED
      ) {
        return new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
          sFDocument?.status
        );
      }
      const user = await this.deltaMachineService.getUserByNumber(
        process.env.SOUM_PHONE_NUMBER
      );
      if (!user) {
        return new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
          'Soum user is not created'
        );
      }
      const transaction = await GetTransactionById({
        id: sFDocument.transactionId,
      });
      if (!transaction) {
        return new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
          ''
        );
      }
      await CreateTransaction({
        ownerId: userId,
        amount: '-' + transaction.amount,
        type: TransactionType.CREDIT,
        description: 'Listing Fee Deduction',
        status: WalletTransactionStatus.SUCCESS,
        orderId,
      });
      if (transaction.status === WalletTransactionStatus.SUCCESS) {
        await UpdateWallet({
          walletId: transaction.walletId,
          amount: transaction.amount,
          transactionType: 'withdraw',
        });
      }
      if (transaction.status === WalletTransactionStatus.PENDING) {
        await UpdateTransaction({
          transactionId: sFDocument.transactionId,
          status: WalletTransactionStatus.SUCCESS,
        });
      }

      const wallet = await GetWallet({ ownerId: user._id });
      await CreateTransaction({
        ownerId: user._id,
        amount: transaction.amount,
        type: TransactionType.CREDIT,
        description: 'Listing Fee Deduction',
        status: WalletTransactionStatus.SUCCESS,
        orderId,
      });
      await UpdateWallet({
        walletId: wallet.id,
        amount: transaction.amount,
        transactionType: 'deposit',
      });
      sFDocument.status = SecurityFeeStatus.PENALISED;
      await this.update(sFDocument._id, sFDocument);
      return sFDocument;
    } catch (err) {
      return new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
        err
      );
    }
  }

  async handleBullJobs(
    dmOrderId: string,
    type: JobTypes,
    sellerPhone?: string,
    questions?: string[]
  ) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Executing Job');
        console.log({
          dmOrderId,
          type,
          sellerPhone,
          questions,
        });
      }
      switch (type) {
        case JobTypes.CONFIRMATION:
          await this.deltaMachineService.handleNewOrdersJob(dmOrderId);
          break;
        case JobTypes.NOT_SHIPPED:
          await this.deltaMachineService.handleAwaitingSellerToShipJob(
            dmOrderId
          );
          break;
        case JobTypes.NOT_PICKED:
          await this.deltaMachineService.handleAwaitingCourierToPickUpJob(
            dmOrderId
          );
          break;
        case JobTypes.CONFIRMED_AVAILABILITY:
          await this.deltaMachineService.handleConfirmationJob(dmOrderId);
          break;
        case JobTypes.IN_TRANSIT:
          await this.deltaMachineService.handleBacklogIntransitOrderJob(
            dmOrderId
          );
          break;
        case JobTypes.SEND_MESSAGE_ON_DM_STATUS_CHANGE:
          await this.deltaMachineService.handleOrderStatusUpdateFreshChatMessage(
            dmOrderId
          );
          break;
        case JobTypes.SELLER_DELETION_NUDGE:
          await this.deltaMachineService.handleSellerDeletionNudgeJob(
            dmOrderId,
            sellerPhone
          );
          break;
        case JobTypes.SELLER_UNRESPONSIVE_NUDGE:
          await this.deltaMachineService.handleSellerDeactivationNudgeJob(
            dmOrderId,
            sellerPhone
          );
          break;
        case JobTypes.ITEM_DELIVERED:
          await this.deltaMachineService.handleItemDeliveriedJob(dmOrderId);
          break;
        case JobTypes.PRICE_NUDGE_MESSAGE:
          await this.deltaMachineService.handlePriceNudgeMessage(
            dmOrderId,
            sellerPhone
          );
          break;
        case JobTypes.REFUND_TO_BUYER:
          await this.deltaMachineService.handleBuyerWithdrawalJob(
            dmOrderId,
            sellerPhone
          );
          break;
        case JobTypes.GENERATIVE_QA_TO_SELLER:
          await this.deltaMachineService.handleGenerativeQASelerJob(
            dmOrderId,
            questions,
            Number(sellerPhone)
          );
          break;
        case JobTypes.SELLER_ENGAGEMENT_MESSAGE:
          await this.deltaMachineService.handleSellerEngagementJob(
            dmOrderId,
            sellerPhone
          );
          break;
        case JobTypes.SEND_PRODUCT_APPROVED_MESSAGE:
          await this.deltaMachineService.handleProductApprovedMessageJob(
            dmOrderId,
            sellerPhone
          );
          break;
        case JobTypes.VALIDATE_PROMO_CODE_USAGE:
          await this.deltaMachineService.handleValidatePromoCodeUsage(
            dmOrderId
          );
          break;
        case JobTypes.UPDATE_PRODUCT_SYNC_STATUS:
          await this.deltaMachineService.updateProductSyncStatus(dmOrderId);
          break;
        case JobTypes.RESERVATION_ORDER_VERIFICATION:
          await this.deltaMachineService.handleReservationOrderBullMqJob(
            dmOrderId
          );
          break;
        case JobTypes.EXPIRE_OFFER_FEED:
          await this.feedService.deactivateOfferFeeds();
          break;
        case JobTypes.FBS_SELLER_AUTO_CONFIRM_AVAILABILITY:
          await this.deltaMachineService.handleFbsSellerAutoDeliveredToIC(
            dmOrderId
          );
          break;
        default:
          break;
      }
      return true;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          exception.message
        );
      }
    }
  }

  async handleInvoiceBullJobs(
    orderId: string,
    type: InvoiceJobType,
    reqType: InvoiceFormats
  ) {
    try {
      await this.deltaMachineService.handleInvoiceGenerationJob(
        orderId,
        type,
        reqType
      );
      return true;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_INVOICE,
          exception.message
        );
      }
    }
  }
  async handleDailyReportBullJobs() {
    try {
      await this.deltaMachineService.handleDailyReportJob();
      return true;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_INVOICE,
          exception.message
        );
      }
    }
  }
}
