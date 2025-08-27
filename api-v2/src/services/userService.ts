import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import mongoose from 'mongoose';
import Container, { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { UserStatus } from '../enums/UserStatus';
import { getOfferCountForUser } from '../grpc/bid';
import { getCache } from '../libs/redis';
import { AddressDocument, LegacyUserAddressInput } from '../models/Address';
import { DeltaMachineStatusDocument } from '../models/DeltaMachineStatus';
import {
  PreferencesType,
  UpdateUserInput,
  UserLegacyDocument,
} from '../models/LegacyUser';
import { OrderRepository } from '../repositories';
import { AddressRepository } from '../repositories/addressRepository';
import { DeltaMachineRepository } from '../repositories/deltaMachineRepository';
import { NotificationRepository } from '../repositories/notificationRepository';
import { ProductRepository } from '../repositories/productRepository';
import { SettingRepository } from '../repositories/settingRepository';
import { UserRepository } from '../repositories/userRepository';
import { DeltaMachineService } from '../services/deltaMachineService';
import { decryptMobilePhone, encryptMobilePhone } from '../util/authentication';
import { calculatePercentage, decryptIBAN } from '../util/common';
import logger from '../util/logger';
import { errorTemplate, returnedDataTemplate } from '../util/queryHelper';
import { syncOrderRequest } from '../util/searchTools';

@Service()
export class UserService {
  deltaMachineService: DeltaMachineService;
  @Inject()
  public userRepository: UserRepository;
  @Inject()
  public notificationRepository: NotificationRepository;
  @Inject()
  public addressRepository: AddressRepository;
  @Inject()
  public productRepository: ProductRepository;
  @Inject()
  public error: ErrorResponseDto;
  @Inject()
  public deltaMachineRepository?: DeltaMachineRepository;
  @Inject()
  settingRepository: SettingRepository;
  @Inject()
  orderRepository: OrderRepository;

  constructor() {
    this.deltaMachineService = Container.get(DeltaMachineService);
  }

  async signUp(
    username: any,
    email_address: any,
    password: any,
    first_name: any,
    last_name: any
  ) {
    try {
      return await this.userRepository.addUser(
        username,
        email_address,
        password,
        first_name,
        last_name
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_SIGN_UP
      );
    }
  }
  async addUserAddress(
    userId: string,
    address: LegacyUserAddressInput
  ): Promise<
    [
      boolean,
      { code: number; result: AddressDocument | string; message?: string }
    ]
  > {
    try {
      const [errUser, userDoc] = await this.userRepository.getUserAddress(
        userId,
        '_id name address addresses'
      );
      if (errUser) {
        this.error.errorCode = userDoc.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = userDoc.result.toString();
        this.error.message = userDoc.message;
        throw this.error;
      }
      const user = userDoc.result as UserLegacyDocument;
      const checkAddressExisting =
        await this.addressRepository.checkSameExistingUserAddress(
          user._id,
          address
        );
      if (checkAddressExisting) {
        return [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: checkAddressExisting,
          },
        ];
      }
      const [errNewAddress, newAddress] =
        await this.addressRepository.createAddress(user._id, address);
      if (errNewAddress) {
        return [errNewAddress, newAddress];
      } else {
        const addressDoc = newAddress.result as AddressDocument;
        user.addresses.push(addressDoc._id);
        user.address = {
          address_id: mongoose.Types.ObjectId(addressDoc._id),
          address: (addressDoc.street + ' ' + addressDoc.district).trim(),
          city: addressDoc.city.trim(),
          postal_code: addressDoc.postal_code.trim(),
          address_type: '',
          latitude: addressDoc.latitude,
          longitude: addressDoc.longitude,
          nationalAddress: addressDoc.nationalAddress,
        };
        await this.userRepository.findByIdAndUpdate(user._id, {
          addresses: user.addresses,
          address: user.address,
        });
        return [
          false,
          { code: Constants.SUCCESS_CODE.SUCCESS, result: addressDoc },
        ];
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_ADDRESS,
          exception.message
        );
      }
    }
  }
  async updateUserAddress(
    userId: string,
    addressId: string,
    updatedAddress: LegacyUserAddressInput
  ): Promise<[boolean, AddressDocument | string]> {
    try {
      // update old address
      const [errUser, userDoc] = await this.userRepository.getUserAddress(
        userId,
        '_id name address'
      );
      if (errUser) {
        this.error.errorCode = userDoc.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = userDoc.result.toString();
        this.error.message = userDoc.message;
        throw this.error;
      }
      const user = userDoc.result as UserLegacyDocument;
      user.address = {
        address_id: mongoose.Types.ObjectId(addressId),
        address: (updatedAddress.district + ' ' + updatedAddress.street).trim(),
        city: updatedAddress.city.trim(),
        postal_code: updatedAddress.postal_code.trim(),
        address_type: '',
        latitude: updatedAddress.latitude,
        longitude: updatedAddress.longitude,
        nationalAddress: updatedAddress.nationalAddress,
      };
      await this.userRepository.findByIdAndUpdate(user._id, {
        address: user.address,
      });

      const [error, result] = await this.addressRepository.updateAddress(
        addressId,
        updatedAddress
      );

      if (error) {
        return [error, result.message];
      } else {
        return [false, result.result];
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.ADDRESS_FAILURE,
        exception.message
      );
    }
  }
  async removeUserAddress(
    userId: string,
    addressId: string
  ): Promise<[boolean, any]> {
    try {
      const [errUser, userDoc] = await this.userRepository.getUserAddress(
        userId,
        '_id name address addresses'
      );
      if (errUser) {
        return [errUser, userDoc.result.toString()];
      }
      const user = userDoc.result as UserLegacyDocument;
      user.addresses = user.addresses.filter(
        item => item.toString() !== addressId
      );
      user.address = null;
      await this.userRepository.findByIdAndUpdate(userId, {
        addresses: user.addresses,
        address: user.address,
      });
      return await this.addressRepository.removeUserAddress(addressId);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.ADDRESS_FAILURE,
        exception.message
      );
    }
  }
  async resetPasswordSMS(phone_number: string) {
    try {
      return await this.userRepository.resetPasswordSMS(phone_number, true);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        'Fail to send reset password via SMS'
      );
    }
  }

  async verifyResetPasswordToken(token: string, password: string) {
    try {
      return await this.userRepository.verifyResetPasswordToken(
        token,
        password
      );
    } catch (exception) {
      if (exception.name === 'JsonWebTokenError') {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.INVALID_RESET_PASSWORD_TOKEN
        );
      }
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAIL_TO_VERIFY_RESET_TOKEN
      );
    }
  }

  async getUserAddresses(userId: string) {
    return await this.userRepository.getUserById(userId, 'addresses');
  }

  async getUserInfo(
    userId: string,
    fields?: string
  ): Promise<[boolean, string | UserLegacyDocument | any]> {
    if (mongoose.isValidObjectId(userId)) {
      const user = await this.userRepository.getLeanUserById(userId, fields);

      if (fields?.toLowerCase()?.includes('mobilenumber')) {
        user.mobileNumber = encryptMobilePhone(user?.mobileNumber);
      }
      const returnData = {
        ...user,
        preferences: {
          skip_pre_listing: user?.preferences?.skip_pre_listing || false,
          skip_post_listing: user?.preferences?.skip_post_listing || false,
          is_filter_onboarded: user?.preferences?.is_filter_onboarded || false,
          is_wallet_first_visit: user?.preferences?.is_wallet_first_visit,
          is_new_badge_alert: user?.preferences?.is_new_badge_alert || false,
          is_cancellation_alert:
            user?.preferences?.is_cancellation_alert || false,
          is_penalized_alert: user?.preferences?.is_penalized_alert || false,
          is_express_delivery_onboarded:
            user?.preferences?.is_express_delivery_onboarded || false,
          isFullfiller: true,
        },
      };

      return [false, returnData];
    }

    return [true, 'Invalid User Id'];
  }

  async gtmSignUpDetails(userId: string): Promise<[boolean, string | any]> {
    const [error, result] = await this.getUserInfo(userId);
    if (error) {
      return [error, result];
    }
    return [
      false,
      {
        user_id: userId,
        name: result.name,
        email: result.name,
        address: result.address,
        phone: `${result.countryCode}-${result.mobileNumber}`,
      },
    ];
  }

  async updateUserPreferences(userId: string, preferences: PreferencesType) {
    return await this.userRepository.updateUserPreferences(userId, preferences);
  }

  async updateUser(
    id: string,
    email_address: string,
    password: string,
    first_name: string,
    last_name: string
  ) {
    try {
      return await this.userRepository.updateUser(
        id,
        email_address,
        password,
        first_name,
        last_name
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_USER
      );
    }
  }
  async updateCustomer(id: string, updateUserInput: UpdateUserInput) {
    try {
      return await this.userRepository.updateCustomer(id, updateUserInput);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.MESSAGE.FAILED_TO_UPDATE_USER
      );
    }
  }
  async addProductToWishList(user_id: string, followed_product_id: string) {
    const session = await mongoose.startSession();
    try {
      // start transaction
      session.startTransaction();

      if (!user_id || !followed_product_id) {
        this.error.errorCode = Constants.ERROR_CODE.UNAUTHORIZED;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS;
        throw this.error;
      }
      const product = (await this.productRepository.findProductById(
        followed_product_id
      )) as any;
      if (!product) {
        this.error.errorCode = Constants.ERROR_CODE.UNAUTHORIZED;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND;
        throw this.error;
      }

      const [err, updatedWishlist] = (await this.userRepository.addToWishList(
        user_id,
        followed_product_id,
        product.product_name,
        session
      )) as any;
      if (err) {
        // transaction rollback
        await session.abortTransaction();
        session.endSession();
        return [err, updatedWishlist];
      }

      const [error, addedFollower] =
        (await this.productRepository.addFollowingUser(
          followed_product_id,
          user_id,
          updatedWishlist.username,
          updatedWishlist.role,
          session
        )) as any;
      if (error) {
        // transaction rollback
        await session.abortTransaction();
        session.endSession();
        return [error, addedFollower];
      }

      await session.commitTransaction();
      // end transaction
      session.endSession();

      return [false, 'Added to wishlist successfully'];
    } catch (exception) {
      // transaction rollback
      await session.abortTransaction();
      session.endSession();

      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_ADD_PRODUCT_TO_WISHLIST
      );
    }
  }
  async getListUserAddress(userId: string) {
    return await this.addressRepository.getUserAddress(userId);
  }

  async getUser(userId: string) {
    try {
      const [err, data] = await this.userRepository.getUserAddress(
        userId,
        '_id hasOptedForSF'
      );
      if (err) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_USER,
          ''
        );
      }
      return data.result as UserLegacyDocument;
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_USER,
        exception.message
      );
    }
  }

  async deleteUser(userId: string): Promise<[boolean, UserLegacyDocument]> {
    try {
      const result = await this.userRepository.findByIdAndUpdate(userId, {
        status: UserStatus.DELETE,
        deleted_date: Date.now(),
        updated_date: Date.now(),
      });
      await this.notificationRepository.removeUserDeviceToken(userId);
      return [false, result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_REMOVE_USER_ACCOUNT,
        exception.message
      );
    }
  }

  async getUsers(
    page: number,
    size: number,
    isGetBetaUser?: boolean,
    isGetKeySeller?: boolean,
    isGetInactiveUser?: boolean,
    isMerchant?: string,
    queryString?: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const [err, data] = await this.userRepository.getUsers(
        page,
        size,
        isGetBetaUser,
        isGetKeySeller,
        isGetInactiveUser,
        isMerchant,
        queryString
      );

      if (err) {
        return [err, data];
      }

      return [false, data];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_USER,
        exception.message
      );
    }
  }

  async updateUserStatus(
    userId: string,
    status: string,
    isBlockUser: boolean
  ): Promise<
    [
      boolean,
      { code: number; result: UserLegacyDocument | string; message?: string }
    ]
  > {
    try {
      const [err, result] = await this.userRepository.updateUserStatus(
        userId,
        status,
        isBlockUser
      );

      if (err) {
        return [
          true,
          {
            code: result.code,
            result: result.result,
            message: result.message,
          },
        ];
      }

      return [
        false,
        { code: 200, result: result.result as UserLegacyDocument },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_REMOVE_USER_ACCOUNT,
        exception.message
      );
    }
  }

  async decryptPhoneNumber(
    encryptedValue: string
  ): Promise<[boolean, { code: number; result: string; message?: string }]> {
    try {
      const decryptedData = decryptMobilePhone(encryptedValue);

      if (!decryptedData) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_DECRYPT_PHONE_NUMBER,
          Constants.MESSAGE.FAILED_TO_DECRYPT_PHONE_NUMBER
        );
      }

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        decryptedData,
        Constants.MESSAGE.DECRYPT_MOBILE_NUMBER_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_REMOVE_USER_ACCOUNT,
        exception.message
      );
    }
  }
  async calculateRatesForUsers(): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const users: UserLegacyDocument[] =
        await this.userRepository.getUsersByConditions(
          {
            status: 'Active',
            $or: [{ rates_scan: false }, { rates_scan: null }],
          },
          50
        );

      if (!users || users?.length === 0) {
        return [
          true,
          {
            code: 200,
            result: [],
            message: Constants.MESSAGE.CALCULATE_RATES_NO_USER,
          },
        ];
      }

      const [sResult, orderStatuses] =
        await this.deltaMachineRepository.getStatusList();
      if (sResult) {
        return [
          true,
          {
            code: 400,
            result: null,
            message: Constants.MESSAGE.CALCULATE_RATES_NO_STATUS,
          },
        ];
      }

      const [, rateRule] = await this.settingRepository.getSettingByKey(
        'seller_rate_rules'
      );
      const sellerRateRule = JSON.parse(rateRule?.value);

      const [, badgeRateRule] = await this.settingRepository.getSettingByKey(
        'badge_rate_rules'
      );
      const sellerBadgeRateRule = JSON.parse(badgeRateRule?.value);

      const orderStatusRefund: string = (
        orderStatuses.result as DeltaMachineStatusDocument[]
      ).find(
        status =>
          status.name === (sellerRateRule?.orderStatusRefund || 'refunded')
      )?.id;

      const orderStatusRefundToBuyer: string = (
        orderStatuses.result as DeltaMachineStatusDocument[]
      ).find(
        status =>
          status.name ===
          (sellerRateRule?.orderStatusRefundToBuyer || 'refund-to-buyer')
      )?.id;

      const orderStatusComplete: string = (
        orderStatuses.result as DeltaMachineStatusDocument[]
      ).find(
        status =>
          status.name === (sellerRateRule?.orderStatusComplete || 'transferred')
      )?.id;

      const orderStatusPayoutSeller: string = (
        orderStatuses.result as DeltaMachineStatusDocument[]
      ).find(
        status =>
          status.name ===
          (sellerRateRule?.orderStatusPayoutSeller || 'payout-to-seller')
      )?.id;
      let listingsTobeResynced = [];
      const [, nctReasons] =
        await this.deltaMachineRepository.getNCTReasonList();

      for (const user of users) {
        let refundedOrdersWithNCTCount = 0;
        const orderAndListings =
          await this.userRepository.getOrdersAndActiveListingsForUserId(
            user._id
          );

        const activeListings = orderAndListings[0]?.listings.filter(
          product =>
            product.status === 'Active' &&
            product.sell_status === 'Available' &&
            product.isApproved &&
            !product.isExpired &&
            moment(product.expiryDate) > moment()
        );

        const successPurchases = orderAndListings[0]?.purchases.filter(
          purchase => purchase.transaction_status === 'Success'
        );
        const completedOrders = orderAndListings[0]?.DM_Orders?.filter(
          (order: any) =>
            order?.statusId?.toString() === orderStatusComplete?.toString() ||
            order?.statusId?.toString() === orderStatusPayoutSeller?.toString()
        );
        const numOfDMOrders = orderAndListings[0]?.DM_Orders?.length || 0;

        if (numOfDMOrders) {
          const refundedOrders = orderAndListings[0]?.DM_Orders?.filter(
            (order: any) =>
              order?.statusId?.toString() === orderStatusRefund?.toString() ||
              order?.statusId?.toString() ===
                orderStatusRefundToBuyer?.toString()
          );

          for (const rfOrder of refundedOrders) {
            try {
              const dmRefundedOrderWithNCT =
                await this.deltaMachineService.findDmoNCTReasonByOrderId(
                  rfOrder?._id
                );

              if (dmRefundedOrderWithNCT?.id) {
                if (
                  (nctReasons?.result as any).find(
                    (element: any) =>
                      element?.id?.toString() ===
                      dmRefundedOrderWithNCT?.nctReasonId?.toString()
                  )?.sellerWithdrawal
                ) {
                  refundedOrdersWithNCTCount += 1;
                }
              }
            } catch (err) {
              logger.error('🚀 ~ RATE SCAN', err);
            }
          }
          const cancellationRate =
            refundedOrdersWithNCTCount !== 0
              ? parseFloat(
                  calculatePercentage(
                    refundedOrdersWithNCTCount,
                    completedOrders?.length + refundedOrders?.length || 1
                  ).toFixed(2)
                )
              : 0;
          const completionRate = parseFloat(
            calculatePercentage(
              completedOrders?.length +
                refundedOrders?.length -
                refundedOrdersWithNCTCount,
              completedOrders?.length + refundedOrders?.length || 1
            ).toFixed(2)
          );

          const isBadge: boolean =
            numOfDMOrders <=
              (parseInt(sellerBadgeRateRule?.badgeRule[0]?.numberOfOrder) ||
                4) &&
            completionRate ===
              (parseInt(sellerBadgeRateRule?.badgeRule[0]?.completionRate) ||
                100)
              ? true
              : numOfDMOrders >=
                  (parseInt(sellerBadgeRateRule?.badgeRule[1]?.numberOfOrder) ||
                    5) &&
                completionRate >=
                  (parseInt(
                    sellerBadgeRateRule?.badgeRule[1]?.completionRate
                  ) || 80)
              ? true
              : false;
          const isPreviouslyCancellationAlerted: boolean =
            user?.rates?.cancellation_rate >=
              (parseInt(sellerBadgeRateRule?.cancelAlertRate) || 33) || false;
          const isPreviouslyBadgeAlerted: boolean =
            orderAndListings[0]?.rates?.reliability_badge;

          await this.userRepository.saveUserRates(
            user._id,
            numOfDMOrders,
            activeListings?.length || 0,
            completedOrders?.length || 0,
            successPurchases?.length || 0,
            cancellationRate,
            completionRate,
            isBadge,
            isPreviouslyBadgeAlerted,
            isPreviouslyCancellationAlerted
          );
        } else {
          await this.userRepository.saveUserRates(
            user._id,
            numOfDMOrders,
            activeListings?.length || 0,
            completedOrders?.length || 0,
            successPurchases?.length || 0
          );
        }
        listingsTobeResynced = activeListings;
      }

      return [
        false,
        {
          code: 200,
          result: listingsTobeResynced,
          message: Constants.MESSAGE.CALCULATE_RATES_SUCCESSFULLY,
        },
      ];
    } catch (exception) {
      logger.error('🚀 RATE SCAN exception', exception);
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CALCULATE_RATES,
          exception.message
        );
      }
    }
  }

  async addToTempSellers(user_ids: string[]) {
    try {
      await this.userRepository.addToActiveSellers(user_ids as string[]);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_SELLER_WITH_PRODUCTS,
        exception.message
      );
    }
  }

  async addNumberToSignupWaitList(mobileNumber: string) {
    try {
      return await this.userRepository.addNumberToSignupWaitList(mobileNumber);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_ADD_NUMBER_TO_WAITLIST,
        exception.message
      );
    }
  }

  async updateGuaranteeFeatureTags(userIds: string[]) {
    try {
      return this.userRepository.updateGuaranteeFeatureTags(userIds);
    } catch (exception) {
      console.log(exception);
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.UNPROCESSABLE_ENTITY,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_GUARANTEE_FEATURE_TAGS,
        exception.message
      );
    }
  }

  async isActiveMerchant(userId: string): Promise<boolean> {
    const user = await this.userRepository.getUserById(
      userId,
      '_id isMerchant isBlock status'
    );

    return user && user.isMerchant && !user.isBlock && user.status === 'Active';
  }

  async syncOrdersToTypesense(
    userId: string,
    limit?: number
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      // get all un-synced orders of the users
      const [error, getResult] =
        await this.orderRepository.getUnsyncedOrdersByUserId(userId, limit);

      if (error) {
        return [
          false,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: getResult.result,
            message: 'Failed to retrieve orders to sync Typesense',
          },
        ];
      }

      // Send to kafka
      await syncOrderRequest('multi', getResult.result);

      // Update syncedDate
      const syncedOrderIds = getResult.result?.map(order => order._id);
      await this.orderRepository.updateManyByIds(syncedOrderIds, {
        synced_at: new Date(),
      });

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: getResult.result,
          message: Constants.MESSAGE.SYNC_ORDER_SUCCESS,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: exception,
          message: exception.message,
        },
      ];
    }
  }

  async getUserData(userId: string) {
    if (mongoose.isValidObjectId(userId)) {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        return null;
      }
      let sellerIBAN = '';
      if (user.bankDetail?.accountId) {
        sellerIBAN = decryptIBAN(user.bankDetail.accountId, user.secretKey);
      }
      const [errAddress, data] = await this.getListUserAddress(userId);
      let userAddress = '';
      if (!errAddress) {
        const userAddresses = data.result as AddressDocument[];
        if (userAddresses.length) {
          const address = userAddresses.pop();
          if (address?.street) {
            userAddress = `${address?.street}
              ${address?.district || ''}
              ${address?.postal_code || ''}
              ${address?.city || ''}`;
          }
        }
      }
      const returnData = {
        userAddress,
        userBankName: user?.bankDetail?.bankName || '',
        userIBAN: sellerIBAN || '',
        isBusiness: user?.bankDetail?.hasVatRegisteredStore || false,
        isVATRegistered: user?.bankDetail?.hasVatRegisteredStore || false,
        userVATRegisteredNumber: user?.bankDetail?.storeVatNumber || '',
        userVATRegisteredName: user?.bankDetail?.vatRegisteredName || '',
      };
      return returnData;
    }
    return null;
  }

  async calculateRatesForMerchant(
    userId: string,
    range: string
  ): Promise<number> {
    try {
      const users: UserLegacyDocument[] =
        await this.userRepository.getUsersByConditions({
          _id: mongoose.Types.ObjectId(userId),
          status: 'Active',
        });
      const merchant = users?.[0];

      const [, orderStatuses] =
        await this.deltaMachineRepository.getStatusList();
      const [, rateRule] = await this.settingRepository.getSettingByKey(
        'seller_rate_rules'
      );
      const sellerRateRule = JSON.parse(rateRule?.value);

      // Define order status IDs
      const orderStatusComplete: string = (
        orderStatuses.result as DeltaMachineStatusDocument[]
      ).find(
        status =>
          status.name === (sellerRateRule?.orderStatusComplete || 'transferred')
      )?.id;
      const orderAndListings =
        await this.userRepository.getOrdersAndActiveListingsForUserId(
          merchant._id,
          range
        );
      const completedOrders = orderAndListings[0]?.DM_Orders?.filter(
        (order: any) =>
          order?.statusId?.toString() === orderStatusComplete?.toString()
      );
      const numOfDMOrders = orderAndListings[0]?.DM_Orders?.length || 0;

      let completionRate = 0;
      if (numOfDMOrders) {
        completionRate = parseFloat(
          calculatePercentage(completedOrders?.length, numOfDMOrders).toFixed(2)
        );
      }

      return completionRate;
    } catch (exception) {
      logger.error('🚀 RATE SCAN exception', exception);
      return 0;
    }
  }

  async getUserOrderCount(
    userId: string
  ): Promise<{ [key: string]: string | number }> {
    const key = `user_${userId}_order_count`;
    const cacheData = (await getCache(key)) as {
      [key: string]: string | number;
    };
    if (!_isEmpty(cacheData)) {
      return cacheData;
    }
    return await this.deltaMachineService.cacheUserOrdersCount(userId);
  }
  async getUserOrderAndOffersCount(userId: string) {
    const [offerCount, orderCount, pendingOrderCount] = await Promise.all([
      getOfferCountForUser({ userId }),
      this.getUserOrderCount(userId),
      this.orderRepository.getRecentlyBoughtProductsCount(userId),
    ]);
    return {
      ...orderCount,
      inProgressCount: Number(orderCount.inProgressCount) + pendingOrderCount,
      offers: offerCount.count,
    };
  }

  async getUsersForInspector(queryString?: string) {
    try {
      const users = await this.userRepository.getUsersForInspector(queryString);

      return (users || []).map(elem => {
        return {
          id: elem.id,
          userId: elem.userId,
          mobileNumber: elem.mobileNumber,
          name: elem.name,
        };
      });
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_USER,
        exception.message
      );
    }
  }
}
