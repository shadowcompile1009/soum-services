import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import moment from 'moment';
import mongoose from 'mongoose';
import { APIConstants } from '../constants/apiConstants';
import { UserStatus } from '../enums/UserStatus';
import { AddressDocument } from '../models/Address';
import { BankDocument } from '../models/Bank';
import { UserLegacyDocument } from '../models/LegacyUser';
import { AddressRepository } from '../repositories/addressRepository';
import { BankRepository } from '../repositories/bankRepository';
import { DeltaMachineRepository } from '../repositories/deltaMachineRepository';
import { SettingRepository } from '../repositories/settingRepository';
import { UserRepository } from '../repositories/userRepository';
import { _get, decrypt } from '../util/common';
import {
  CheckUserOTPRequest,
  CheckUserOTPResponse,
  CreateNewUserRequest,
  CreateNewUserResponse,
  GetDmUserRequest,
  GetDmUserResponse,
  GetDmUsersRequest,
  GetDmUsersResponse,
  GetDmUsersResponse_DmUser,
  GetLegacyUserViaLocalPhoneRequest,
  GetLegacyUserViaLocalPhoneResponse,
  GetPermissionsRequest,
  GetPermissionsResponse,
  GetSellerBadgeRequest,
  GetSellerBadgeResponse,
  GetUserRequest,
  GetUserResponse,
  GetUsersByPhoneRequest,
  GetUsersByPhoneResponse,
  GetUsersByPhoneResponse_User,
  GetUsersRequest,
  GetUsersResponse,
  GetUsersResponse_User,
  SetUserOTPRequest,
  SetUserOTPResponse,
  UpdateInactiveUserRequest,
  UpdateInactiveUserResponse,
  UpdatePenaltyFlagRequest,
  UpdatePenaltyFlagResponse,
} from './proto/v2.pb';
import { AddNewUser } from './recommendation';

const userRepository = new UserRepository();
const bankRepository = new BankRepository();
const deltaMachineRepository = new DeltaMachineRepository();
const settingRepository = new SettingRepository();

const getUserAddress = async (userId: string) => {
  const addressRepository = new AddressRepository();
  const [errAddress, addressResult] = await addressRepository.getUserAddress(
    userId
  );
  if (errAddress) {
    return null;
  }
  const address = (addressResult.result as AddressDocument[])[0];
  return {
    street: address?.street,
    district: address?.district,
    city: address?.city,
    postalCode: address?.postal_code,
    latitude: address?.latitude,
    longitude: address?.longitude,
  };
};

export const GetPermissions = async (
  call: ServerUnaryCall<GetPermissionsRequest, GetPermissionsResponse>,
  callback: sendUnaryData<GetPermissionsResponse>
) => {
  const apiConstants = APIConstants;
  const response: GetPermissionsResponse = { permissions: [] };
  for (const [, value] of Object.entries(apiConstants)) {
    const tempObj = {
      key: value?.KEY,
      description: value?.DESCRIPTION,
    };
    response.permissions.push(tempObj);
  }
  callback(null, response);
};

export const GetUser = async (
  call: ServerUnaryCall<GetUserRequest, GetUserResponse>,
  callback: sendUnaryData<GetUserResponse>
) => {
  try {
    const user = await userRepository.getUserById(call.request.id);
    const address = await getUserAddress(call.request.id);
    const bankBIC = decryptWrapper(
      _get(user, 'bankDetail.bankBIC', ''),
      _get(user, 'secretKey', '')
    );
    const [, bankRes] = await bankRepository.getBankDetailViaCode(bankBIC);
    const bank = bankRes?.result as BankDocument;
    const response = {
      id: user?._id,
      name: user?.lastName ? user?.name + ' ' + user?.lastName : user?.name,
      phoneNumber: `+${user?.countryCode}${user?.mobileNumber}`,
      bankDetail: {
        accountId: decryptWrapper(
          _get(user, 'bankDetail.accountId', ''),
          _get(user, 'secretKey', '')
        ),
        bankBIC,
        accountHolderName: user?.bankDetail?.accountHolderName,
        bankName: user?.bankDetail?.bankName,
        isNonSaudiBank: bank?.isNonSaudiBank,
      },
      address,
      email: user?.email,
      isKeySeller: user.isKeySeller,
      isMerchant: user.isMerchant,
      activeListings: user?.listings?.active_listings || 0,
      soldListings: user?.listings?.sold_listings || 0,
      avatar: user.profilePic || '',
      activatedDate: user.createdDate.toISOString(),
      bio: user.bio || '',
      isCompliant: user?.sellerType?.isCompliant,
    };
    callback(null, response);
  } catch (error) {
    console.log(error);
    callback(
      new Error(`Error on loading user with id: ${call.request.id}`),
      null
    );
  }
};

export const GetUsers = async (
  call: ServerUnaryCall<GetUsersRequest, GetUsersResponse>,
  callback: sendUnaryData<GetUsersResponse>
) => {
  try {
    let users = await userRepository.getUsersByIds(call.request.userIds);

    if (call.request.limitUsersWithBank) {
      users = users.filter(user => user.bankDetail && user.status === 'Active');
    }
    const response: GetUsersResponse = {
      users: users.map(user => {
        const getUserResponse: GetUsersResponse_User = {
          id: user._id,
          name: user.name,
          phoneNumber: `+${user.countryCode}${user.mobileNumber}`,
          bankDetail: {
            accountId: decryptWrapper(
              _get(user, 'bankDetail.accountId', ''),
              _get(user, 'secretKey', '')
            ),
            bankBIC: decryptWrapper(
              _get(user, 'bankDetail.bankBIC', ''),
              _get(user, 'secretKey', '')
            ),
            accountHolderName: user?.bankDetail?.accountHolderName,
            bankName: user?.bankDetail?.bankName,
            isNonSaudiBank: false,
          },
          isKeySeller: user.isKeySeller,
          isMerchant: user.isMerchant,
        };
        return getUserResponse;
      }),
    };

    callback(null, response);
  } catch (error) {
    console.log(error);
    callback(new Error(`Error on getting userlist`), null);
  }
};

export const GetDmUser = async (
  call: ServerUnaryCall<GetDmUserRequest, GetDmUserResponse>,
  callback: sendUnaryData<GetDmUserResponse>
) => {
  try {
    const [err, result] = await deltaMachineRepository.getUserById(
      call.request.userId
    );

    if (err) throw new Error('Unable to get DM User');

    if (typeof result === 'boolean' || typeof result.result === 'string') {
      throw new Error('Invalid DeltaMachineUser Document');
    }

    const dmUser = result.result;

    const response = {
      id: dmUser?._id,
      username: dmUser?.username,
      firstName: dmUser?.firstName,
      lastName: dmUser?.lastName,
      status: dmUser?.status,
      email: dmUser?.email,
      phoneNumber: dmUser?.phoneNumber,
    };

    callback(null, response);
  } catch (error) {
    callback(new Error(`Error on getting DM User: ${error}`), null);
  }
};

export const GetDmUsers = async (
  call: ServerUnaryCall<GetDmUsersRequest, GetDmUsersResponse>,
  callback: sendUnaryData<GetDmUsersResponse>
) => {
  try {
    const [err, data] = await deltaMachineRepository.getUserByIds(
      call.request.userIds
    );
    if (err) throw new Error('Unable to get DM User');

    if (typeof data === 'boolean' || typeof data.result === 'string') {
      throw new Error('Invalid DeltaMachineUser Document');
    }
    const users = data.result;
    const response: GetDmUsersResponse = {
      users: users.map(user => {
        const getDmUserResponse: GetDmUsersResponse_DmUser = {
          id: user._id,
          username: user.username,
          phoneNumber: user.phoneNumber,
        };
        return getDmUserResponse;
      }),
    };

    callback(null, response);
  } catch (error) {
    console.log(error);
    callback(new Error(`Error on getting DM user list`), null);
  }
};

export const GetUsersByPhone = async (
  call: ServerUnaryCall<GetUsersByPhoneRequest, GetUsersByPhoneResponse>,
  callback: sendUnaryData<GetUsersByPhoneResponse>
) => {
  try {
    const users = await userRepository.getUsersByPhoneNumber(
      call.request.phoneNumber
    );
    if (users === undefined) {
      return callback(null, null);
    }
    const response: GetUsersByPhoneResponse = {
      users: users.map(user => {
        const getUserResponse: GetUsersByPhoneResponse_User = {
          id: user._id,
          name: user.name,
          phoneNumber: `+${user.countryCode}${user.mobileNumber}`,
          bankDetail: {
            accountId: decryptWrapper(
              _get(user, 'bankDetail.accountId', ''),
              _get(user, 'secretKey', '')
            ),
            bankBIC: decryptWrapper(
              _get(user, 'bankDetail.bankBIC', ''),
              _get(user, 'secretKey', '')
            ),
            accountHolderName: user?.bankDetail?.accountHolderName,
            bankName: user?.bankDetail?.bankName,
            isNonSaudiBank: false,
          },
        };
        return getUserResponse;
      }),
    };

    callback(null, response);
  } catch (error) {
    console.log(error);
    callback(new Error(`Error on getting userlist`), null);
  }
};

// Decrypt function throwing Malformed UTF-8 data error. So wrapping it up here
const decryptWrapper = (text: string, key: string) => {
  try {
    return decrypt(text, key);
  } catch (error) {
    return text;
  }
};

export const GetLegacyUserViaLocalPhone = async (
  call: ServerUnaryCall<
    GetLegacyUserViaLocalPhoneRequest,
    GetLegacyUserViaLocalPhoneResponse
  >,
  callback: sendUnaryData<GetLegacyUserViaLocalPhoneResponse>
) => {
  try {
    const mobileNumber = call.request.mobileNumber;
    const [, settingRes] = await settingRepository.getSettingsObjectByKeys([
      'region',
      'allowed_uae_numbers',
    ]);
    const countryCode = JSON.parse(settingRes.region)?.code;
    const region = JSON.parse(settingRes.region)?.region;
    let isAllowed = 0;
    if (region === 'AE') {
      const allowedUAENumbers = settingRes?.allowed_uae_numbers
        ? JSON.parse(settingRes?.allowed_uae_numbers)
        : '';
      isAllowed = allowedUAENumbers.split(',').indexOf(mobileNumber);
    }
    const user = await userRepository.getUserByMobile(
      countryCode,
      mobileNumber
    );
    if (!user) {
      return callback(null, {
        isValid: false,
        countryCode: countryCode,
        mobileNumber: mobileNumber,
        userType: null,
        userId: null,
        userStatus: null,
        otpVerification: false,
        isActive: false,
        isDeleted: false,
        isMerchant: false,
        language: '',
        ratesScan: false,
        profilePic: '',
        name: '',
        cards: [],
        isAllowedMobileNumber: isAllowed !== -1,
        region,
        listings: undefined,
      });
    }
    const dateDiff = moment().diff(user.deleted_date, 'd');
    return callback(null, {
      isValid: true,
      countryCode: countryCode,
      mobileNumber: mobileNumber,
      userType: user?.userType,
      userId: user?._id?.toString(),
      userStatus: user?.status,
      otpVerification: user?.otpVerification,
      isActive: user?.status === UserStatus.ACTIVE,
      isDeleted: user?.status === UserStatus.DELETE && dateDiff < 7,
      isMerchant: user?.isMerchant,
      language: user?.language,
      ratesScan: user?.rates_scan,
      profilePic: user?.profilePic,
      listings: {
        activeListings: user?.listings?.active_listings,
        completedSales: user?.listings?.completed_sales,
        purchasedProducts: user?.listings?.purchased_products,
        soldListings: user?.listings?.sold_listings,
      },
      name: user?.name,
      cards: user?.cards,
      isAllowedMobileNumber: isAllowed !== -1,
      region,
      isKeySeller: user?.isKeySeller,
    } as GetLegacyUserViaLocalPhoneResponse);
  } catch (error) {
    console.log(error);
    callback(new Error(`Error on getting user by mobile number`), null);
  }
};

export const CreateNewUser = async (
  call: ServerUnaryCall<CreateNewUserRequest, CreateNewUserResponse>,
  callback: sendUnaryData<CreateNewUserResponse>
) => {
  try {
    const mobileNumber = call.request.mobileNumber;
    const countryCode = call.request.countryCode;

    const [err, data] = await userRepository.signUpWithMobile(
      countryCode,
      mobileNumber
    );
    if (err) callback(new Error(`Fail to create new user ` + data), null);
    const newUser = data as UserLegacyDocument;
    try {
      AddNewUser({
        userId: newUser?._id,
        name: newUser?.name,
      }).then(response => {
        if (!response.status) {
          console.log('Error while adding new user to recommendation service');
        }
      });
    } catch (error) {
      console.log(
        'Error while adding new user to recommendation service: ',
        error
      );
    }
    return callback(null, {
      userId: newUser?._id,
      userStatus: newUser?.status,
      language: newUser?.language,
      ratesScan: newUser?.rates_scan,
      profilePic: newUser?.profilePic,
      listings: {
        activeListings: newUser?.listings?.active_listings,
        completedSales: newUser?.listings?.completed_sales,
        purchasedProducts: newUser?.listings?.purchased_products,
        soldListings: newUser?.listings?.sold_listings,
      },
    });
  } catch (error) {
    console.log(error);
    callback(
      new Error(`Error on getting user by mobile number ` + error),
      null
    );
  }
};

export const UpdateInactiveUser = async (
  call: ServerUnaryCall<UpdateInactiveUserRequest, UpdateInactiveUserResponse>,
  callback: sendUnaryData<UpdateInactiveUserResponse>
) => {
  try {
    const userId = call.request.userId;
    const verifiedFlag = call.request.otpVerification;

    await userRepository.findByIdAndUpdate(userId, {
      status: UserStatus.ACTIVE,
      otpVerification: verifiedFlag,
      deleted_date: null,
    });
    return callback(null, {});
  } catch (error) {
    console.log(error);
    callback(
      new Error(`Error on getting user by mobile number ` + error),
      null
    );
  }
};

export const UpdatePenaltyFlag = async (
  call: ServerUnaryCall<UpdatePenaltyFlagRequest, UpdatePenaltyFlagResponse>,
  callback: sendUnaryData<UpdatePenaltyFlagResponse>
) => {
  try {
    const userId = call.request.sellerId;
    await userRepository.findByIdAndUpdate(userId, {
      'preferences.is_penalized_alert': true,
    });
    return callback(null, {});
  } catch (error) {
    console.log(error);
    callback(new Error(`Error on updating penalty flag`), null);
  }
};

export const GetSellerBadge = async (
  call: ServerUnaryCall<GetSellerBadgeRequest, GetSellerBadgeResponse>,
  callback: sendUnaryData<GetSellerBadgeResponse>
) => {
  try {
    const userId = call.request.userId;
    const user = await userRepository.getUserById(userId);
    const [, settings]: any = await settingRepository.getSettingsObjectByKeys([
      'guarantee_feature',
    ]);
    const guaranteeAr = settings?.guarantee_feature?.split(',') || [];
    const highCompletionRate = user?.rates?.completion_rate || 0;
    return callback(null, {
      activateTenDaysGuarantee: guaranteeAr?.includes(userId),
      isSFPaid: false,
      hasHighFRate: highCompletionRate > 95,
    });
  } catch (error) {
    console.log(error);
    callback(new Error(`Error on getting seller badges`), null);
  }
};

export const SetUserOTP = async (
  call: ServerUnaryCall<SetUserOTPRequest, SetUserOTPResponse>,
  callback: sendUnaryData<SetUserOTPResponse>
) => {
  try {
    const countryCode = call.request.countryCode;
    const mobileNumber = call.request.mobileNumber;
    const otp = call.request.otp;

    let filter: any = { mobileNumber };
    if (countryCode) filter = { ...filter, countryCode: countryCode };

    const user = await userRepository.findOneAndUpdate(filter, {
      otp: otp,
      otpTime: Date.now() + 3 * 60 * 1000, // Expire after 3 mins
    });

    if (!user) {
      return callback(null, { status: false });
    }

    return callback(null, { status: true });
  } catch (error) {
    console.log(error);
    callback(error, { status: false });
  }
};

export const CheckUserOTP = async (
  call: ServerUnaryCall<CheckUserOTPRequest, CheckUserOTPResponse>,
  callback: sendUnaryData<CheckUserOTPResponse>
) => {
  try {
    const { userId, otp } = call.request;
    const currentTimestamp = Date.now();
    const user = await userRepository.getUserById(userId);

    if (!user) {
      return callback(null, { status: false });
    }

    const otpExpirationTimestamp =
      user.otpTime instanceof Date ? user.otpTime.getTime() : user.otpTime;
    const isOtpValid =
      user.otp === otp &&
      Number(currentTimestamp) < Number(otpExpirationTimestamp);

    if (!isOtpValid) {
      return callback(null, { status: false });
    }

    await userRepository.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      {
        otp: '',
        otpTime: '',
      }
    );

    return callback(null, { status: true });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return callback(error, { status: false });
  }
};
