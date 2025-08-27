import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import mongoose, { ClientSession, FilterQuery, LeanDocument } from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { UserStatus } from '../enums/UserStatus';
import { mappingMongoError } from '../libs/mongoError';
import { sendSMSViaProvider } from '../libs/provider';
import { getCache, setCache } from '../libs/redis';
import { ActivityUser } from '../models/ActivityUser';
import { Admin } from '../models/Admin';
import { ProductModel } from '../models/LegacyProducts';
import {
  LegacyUser,
  PreferencesType,
  UpdateUserInput,
  UserLegacyDocument,
} from '../models/LegacyUser';
import { SignupWaitList } from '../models/SignupWaitList';
import { User } from '../models/User';
import { getDataRangeAnalytics, validatePassword } from '../util/common';
import { lookup } from '../util/queryHelper';
interface Payload {
  id?: string;
  iat: any;
  expiresIn: number;
  ip: any;
  email_address: string;
  username?: string;
  phone?: string;
}

@Service()
export class UserRepository {
  async getAllUsersForReport(
    date?: Date
  ): Promise<[boolean, { code: number; message: string; result: any }]> {
    try {
      const aggregation = [
        {
          $match: {
            status: 'Active',
          },
        },
        {
          $match: {
            $or: [
              {
                createdDate: {
                  $gte: date,
                },
              },
              {
                lastLoginDate: {
                  $gte: date,
                },
              },
            ],
          },
        },
        {
          $project: {
            name: 1,
            email: 1,
            mobileNumber: 1,
            countryCode: 1,
            language: 1,
            loginWith: 1,
            status: 1,
            userType: 1,
            createdDate: 1,
            lastLoginDate: 1,
            address: '$address.address',
            city: '$address.city',
            postal_code: '$address.postal_code',
          },
        },
      ];

      const users = await LegacyUser.aggregate(aggregation).allowDiskUse(true);

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          message: Constants.MESSAGE.GET_USERS_FOR_REPORT_SUCCESSFULLY,
          result: users,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          message: exception.message,
          result: [],
        },
      ];
    }
  }

  // eslint-disable-next-line max-len
  async getQuantityActiveUsersForReport(
    date?: Date
  ): Promise<[boolean, { code: number; message: string; result: string }]> {
    try {
      const aggregation = [
        {
          $match: {
            status: 'Active',
          },
        },
        {
          $match: {
            $or: [
              {
                createdDate: {
                  $gte: date,
                },
              },
              {
                lastLoginDate: {
                  $gte: date,
                },
              },
            ],
          },
        },
        { $count: 'totalActiveUsers' },
      ];

      const activeUsers = await LegacyUser.aggregate(aggregation);

      let quantityActiveUsers;

      if (activeUsers) {
        quantityActiveUsers = activeUsers[0].totalActiveUsers.toString();

        return [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            message: Constants.MESSAGE.GET_QUANTITY_ACTIVE_USERS_SUCCESSFULLY,
            result: quantityActiveUsers,
          },
        ];
      }

      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          message: Constants.MESSAGE.FAILED_TO_GET_QUANTITY_ACTIVE_USERS,
          result: Constants.MESSAGE.FAILED_TO_GET_QUANTITY_ACTIVE_USERS,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.MESSAGE.FAILED_TO_GET_QUANTITY_ACTIVE_USERS,
          message: exception.message,
        },
      ];
    }
  }

  async verifyAdminUser(
    email: string,
    userName: string,
    password: string,
    ip: string
  ): Promise<[boolean, { code: number; message: string; result: any }]> {
    try {
      const user = await Admin.findOne({
        email: email,
      })
        .select('_id email password profilePic role name phoneNumber')
        .exec();
      // Check password
      if (!bcrypt.compareSync(password, user.password)) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.INVALID_PASSWORD,
            message: Constants.MESSAGE.PASSWORD_IS_INVALID,
          },
        ];
      }

      // Create a token
      const token = jwt.sign(
        {
          iat: moment().subtract(30, 's').unix(),
          expiresIn: Constants.EXPIRES,
          ip: ip,
          email_address: user.email,
          id: user._id,
        },
        process.env.JWT_SECRET_KEY_ADMIN
      );
      // Save the token
      user.token = token;
      await user.save();

      const data = {
        token: token,
        expiresIn: Constants.EXPIRES,
        expiryDate: moment().add(Constants.EXPIRES, 's').format(),
        email_address: user.email,
        first_name: user.name,
        last_name: user.name,
      };

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          message: Constants.MESSAGE.LOGIN_SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {}
  }
  async verifyLoginUser(
    countryCode: any,
    phoneNumber: any,
    password: any,
    ip: any
  ): Promise<[boolean, { code: number; message: string; result: any }]> {
    try {
      if (_isEmpty(password)) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_LOGIN,
            message: Constants.MESSAGE.PASSWORD_IS_REQUIRED,
          },
        ];
      }
      const user = await LegacyUser.findOne({
        $and: [{ countryCode: countryCode }, { mobileNumber: phoneNumber }],
      })
        .select(
          '_id mobileNumber countryCode password userType loginWith language token status'
        )
        .exec();
      if (!user) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.USER_NOT_FOUND,
            message: Constants.MESSAGE.USER_IS_NOT_FOUND,
          },
        ];
      }
      if (_isEmpty(user.password)) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_LOGIN,
            message: Constants.MESSAGE.PASSWORD_USER_NOT_SET,
          },
        ];
      }
      // Check password
      if (!bcrypt.compareSync(password, user.password)) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.INVALID_PASSWORD,
            message: Constants.MESSAGE.PASSWORD_IS_INVALID,
          },
        ];
      }

      // Create a token
      const token = jwt.sign(
        {
          iat: moment().subtract(30, 's').unix(),
          expiresIn: Constants.EXPIRES,
          ip: ip,
          language: user.language,
          country_code: user.countryCode,
          phone: user.mobileNumber,
          id: user._id,
        },
        process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY
      );

      const data = {
        token: token,
        expiresIn: Constants.EXPIRES,
        expiryDate: moment().add(Constants.EXPIRES, 's').format(),
        country_code: user.countryCode,
        phone_number: user.mobileNumber,
        email: user.email,
        language: user.language,
      };

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          message: Constants.MESSAGE.LOGIN_SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_VERIFY_LOGIN_USER,
          message: exception.message,
        },
      ];
    }
  }

  async addUser(
    username: any,
    email_address: any,
    password: any,
    first_name: any,
    last_name: any
  ) {
    try {
      const conditionFindExistingUser = {
        $or: [{ username: username }, { email_address: email_address }],
      };
      const existingUser = await User.findOne(conditionFindExistingUser).exec();
      if (existingUser) {
        return [true, Constants.ERROR_MAP.USERNAME_EXISTS];
      }

      if (!password) {
        return [true, Constants.ERROR_MAP.NO_PASSWORD];
      }

      // Create new state
      let user = new User({
        username: username,
        password: password,
        email_address: email_address,
        first_name: first_name,
        last_name: last_name,
      });

      user = await user.save();
      user.password = '###';
      const totalUsers: number = (await getCache('usersCount')) as number;
      if (totalUsers) {
        await setCache(`usersCount`, totalUsers + 1, 60 * 60 * 24);
      }
      return [false, user];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_ADD_USER];
    }
  }

  async addVerifiedPhoneViaOTP(token: string, phone: string) {
    try {
      if (!token) {
        return [true, Constants.ERROR_MAP.UNAUTHORIZED_USER];
      }
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY
      ) as any;

      const modifier = {
        phone: phone,
      };

      return await User.findOneAndUpdate(
        { username: decoded.username },
        { $set: modifier },
        {
          fields: { username: 1, first_name: 1, last_name: 1, phone: 1 }, // TODO: Will check
          new: true,
        }
      );
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_ADD_VERIFIED_PHONE];
    }
  }

  async verifyToken(token: any, ip: any, isAdminRule: boolean) {
    try {
      if (!token) {
        return [true, Constants.ERROR_MAP.UNAUTHORIZED_USER];
      }

      const decoded = jwt.verify(
        token,
        isAdminRule
          ? process.env.JWT_SECRET_KEY_ADMIN
          : process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY
      ) as any;

      // Get expired date
      const dateNow = moment().unix();
      const expiryDate = +decoded.iat + Constants.EXPIRES;

      // if (decoded.ip !== ip) {
      //   return [true, Constants.ERROR_MAP.UNAUTHORIZED_USER];
      // }

      // Check expiration
      if (dateNow < expiryDate) {
        const user = isAdminRule
          ? await Admin.findById(decoded.id).lean().exec()
          : await LegacyUser.findById(decoded.id).lean().exec();

        if (!user) {
          return [true, Constants.ERROR_MAP.USER_NOT_FOUND];
        }

        // Get user
        const payload: Payload = {
          iat: moment().subtract(30, 's').unix(),
          expiresIn: Constants.EXPIRES,
          ip: ip,
          email_address: user.email,
          id: user._id,
        };

        // Create a token
        const token = jwt.sign(
          payload,
          isAdminRule
            ? process.env.JWT_SECRET_KEY_ADMIN
            : process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY
        );

        const data = {
          token: token,
          expiresIn: Constants.EXPIRES,
          expiryDate: moment().add(Constants.EXPIRES, 's').format(),
          username: user.name,
          email_address: user.email,
          first_name: user.name,
          last_name: user.name,
        };
        return [false, data];
      } else {
        return [true, Constants.ERROR_MAP.UNAUTHORIZED_USER];
      }
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_VERIFY_TOKEN];
    }
  }

  async addUserWithPhoneNumber(phone_number: string) {
    try {
      // Create new state
      const user = new User({
        phone_number: phone_number,
        is_phone_verified: true,
      });
      const newUser = await user.save();
      return [false, newUser];
    } catch (exception) {
      // phone number's been registered with another user
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, Constants.ERROR_MAP.FAILED_TO_ADD_USER];
      }
    }
  }

  async updateUser(
    id: string,
    email_address: string,
    password: string,
    first_name: string,
    last_name: string
  ) {
    try {
      const existingUser = await User.findById(id).exec();
      if (!existingUser) {
        return [true, Constants.ERROR_MAP.USER_NOT_FOUND];
      }
      if (email_address && existingUser.email_address === email_address) {
        return [true, Constants.ERROR_MAP.EMAIL_EXISTS];
      }
      existingUser.email_address = email_address || existingUser.email_address;

      if (password) {
        if (!validatePassword(password)) {
          return [true, Constants.ERROR_MAP.INVALID_FORMAT_PASSWORD];
        }

        existingUser.password = password;
      }

      existingUser.first_name = first_name;
      existingUser.last_name = last_name || existingUser.last_name;

      await existingUser.save();
      return [false, Constants.MESSAGE.USER_SUCCESSFULLY_UPDATED];
    } catch (exception) {
      // email address's been registered with another user
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, Constants.ERROR_MAP.FAILED_TO_UPDATE_USER];
      }
    }
  }

  async updateCustomer(id: string, updateUserInput: UpdateUserInput) {
    try {
      const existingUser = await LegacyUser.findById(id).exec();
      if (!existingUser || existingUser.status !== UserStatus.ACTIVE) {
        return [true, Constants.MESSAGE.FAILED_TO_UPDATE_USER];
      }

      if (updateUserInput.name) {
        existingUser.name = updateUserInput.name;
      }

      if (updateUserInput.rating) {
        existingUser.rating = updateUserInput.rating;
      }

      if (typeof updateUserInput.isMerchant == 'boolean') {
        existingUser.isMerchant = updateUserInput.isMerchant;
      }

      if (typeof updateUserInput.isBetaUser == 'boolean') {
        existingUser.isBetaUser = updateUserInput.isBetaUser;
      }

      if (typeof updateUserInput.isKeySeller == 'boolean') {
        existingUser.isKeySeller = updateUserInput.isKeySeller;
      }

      if (typeof updateUserInput.isUAE == 'boolean') {
        existingUser.sellerType.isUAE = updateUserInput.isUAE;
      }

      if (typeof updateUserInput.isCompliant == 'boolean') {
        existingUser.sellerType.isCompliant = updateUserInput.isCompliant;
      }

      if (updateUserInput.hasOptedForSF) {
        existingUser.hasOptedForSF = updateUserInput.hasOptedForSF;
      }

      if (updateUserInput.isSFPaid) {
        existingUser.isSFPaid = updateUserInput.isSFPaid;
      }

      await existingUser.save();
      return [false, existingUser];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, Constants.MESSAGE.FAILED_TO_UPDATE_USER];
      }
    }
  }

  async updateUserPreferences(
    id: string,
    preferences: PreferencesType
  ): Promise<[boolean, string | UserLegacyDocument]> {
    try {
      const existingUser = await LegacyUser.findById(id).exec();
      if (!existingUser) {
        return [true, Constants.ERROR_MAP.USER_NOT_FOUND];
      }

      if (typeof preferences.skip_pre_listing == 'boolean') {
        existingUser.preferences.skip_pre_listing =
          preferences.skip_pre_listing;
      }

      if (typeof preferences.skip_post_listing == 'boolean') {
        existingUser.preferences.skip_post_listing =
          preferences.skip_post_listing;
      }

      if (typeof preferences.is_wallet_first_visit == 'boolean') {
        existingUser.preferences.is_wallet_first_visit =
          preferences.is_wallet_first_visit;
      }

      if (typeof preferences.is_new_badge_alert == 'boolean') {
        existingUser.preferences.is_new_badge_alert =
          preferences.is_new_badge_alert;
      }

      if (typeof preferences.is_cancellation_alert == 'boolean') {
        existingUser.preferences.is_cancellation_alert =
          preferences.is_cancellation_alert;
      }
      if (typeof preferences.is_penalized_alert == 'boolean') {
        existingUser.preferences.is_penalized_alert =
          preferences.is_penalized_alert;
      }
      if (typeof preferences?.is_express_delivery_onboarded == 'boolean') {
        existingUser.preferences.is_express_delivery_onboarded =
          preferences.is_express_delivery_onboarded;
      }
      if (typeof preferences?.is_filter_onboarded == 'boolean') {
        existingUser.preferences.is_filter_onboarded =
          preferences.is_filter_onboarded;
      }

      await existingUser.save();

      return [false, existingUser];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, Constants.ERROR_MAP.FAILED_TO_UPDATE_USER];
      }
    }
  }

  async findUserViaPhoneNumber(
    phone_number: string,
    ip: any,
    isAdminRule: boolean
  ) {
    try {
      const user = await User.findOne({ phone_number: phone_number })
        .select(
          '_id username password email_address first_name last_name is_phone_verified'
        )
        .exec();
      if (!user) {
        return [false, null];
      }
      // Create a token
      const token = jwt.sign(
        {
          iat: moment().subtract(30, 's').unix(),
          expiresIn: Constants.EXPIRES,
          ip: ip,
          email_address: user.email_address,
          username: user.username,
          id: user._id,
        },
        isAdminRule
          ? process.env.JWT_SECRET_KEY_ADMIN
          : process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY
      );

      const data = {
        token: token,
        expiresIn: Constants.EXPIRES,
        expiryDate: moment().add(Constants.EXPIRES, 's').format(),
        username: user.username,
        email_address: user.email_address,
        first_name: user.first_name,
        last_name: user.last_name,
      };
      return [false, data];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_VERIFY_LOGIN_USER];
    }
  }

  async getUserById(id: string, fields?: string): Promise<UserLegacyDocument> {
    const query = LegacyUser.findById(id).populate('addresses');
    if (fields) {
      query.select(fields);
    }
    const userDoc = await query.exec();
    if (userDoc) {
      return userDoc;
    }
    return undefined;
  }

  async getUsersByIds(
    ids: string[],
    fields?: string
  ): Promise<UserLegacyDocument[]> {
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    const query = LegacyUser.find({ _id: { $in: validIds } });
    if (fields) {
      query.select(fields);
    }
    const userDoc = await query.exec();
    if (userDoc) {
      return userDoc;
    }

    return undefined;
  }

  async getUsersByPhoneNumber(
    phoneNumber: string,
    fields?: string
  ): Promise<UserLegacyDocument[]> {
    if (phoneNumber.charAt(0) === '+') {
      phoneNumber = phoneNumber.substring(4);
    }
    const query = LegacyUser.find({
      mobileNumber: phoneNumber,
    });
    if (fields) {
      query.select(fields);
    }
    const userDoc = await query.exec();
    if (userDoc) {
      return userDoc;
    }

    return undefined;
  }

  async getLeanUserById(
    id: string,
    fields?: string
  ): Promise<LeanDocument<UserLegacyDocument>> {
    const query = LegacyUser.findById(id).populate('addresses');
    if (fields) {
      query.select(fields);
    }
    const userDoc = await query.lean().exec();
    if (userDoc) {
      return userDoc;
    }

    return undefined;
  }

  async getUserAddress(
    id: string,
    fields: string
  ): Promise<
    [
      boolean,
      { code: number; result: string | UserLegacyDocument; message?: string }
    ]
  > {
    try {
      const userDoc = await LegacyUser.findById(id).select(fields).exec();
      if (userDoc) {
        return [
          false,
          { code: Constants.SUCCESS_CODE.SUCCESS, result: userDoc },
        ];
      }

      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.USER_NOT_FOUND,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_USER,
          message: exception.message,
        },
      ];
    }
  }

  async addToWishList(
    id: string,
    followed_product_id: string,
    product_name: string,
    session: ClientSession
  ) {
    try {
      const user = await User.findOne({
        _id: id,
        deleted_date: null,
      })
        .session(session)
        .exec();
      if (!user) return [true, Constants.ERROR_MAP.USER_NOT_FOUND];
      if (!user.wishlist) user.wishlist = [] as any;
      const matchedInWishList = user.wishlist.findIndex(
        (item: any) => item.followed_product_id === followed_product_id
      );
      if (matchedInWishList < 0) {
        user.wishlist.push({
          followed_product_id: followed_product_id,
          product_name: product_name,
          followed_date: moment().toDate(),
        });
      }
      await user.save({ session: session });

      return [
        false,
        {
          username: user.username,
          role: user.role,
          msg: 'Added to wishlist',
        },
      ];
    } catch (error) {
      return [true, Constants.ERROR_MAP.FAILED_TO_ADD_PRODUCT_TO_WISHLIST];
    }
  }

  async findByIdAndUpdate(userId: string, updateValue: any) {
    return await LegacyUser.findByIdAndUpdate(userId, updateValue, {
      new: true,
    }).exec();
  }

  async findOneAndUpdate(filters: any, updateValue: any) {
    return await LegacyUser.findOneAndUpdate(filters, updateValue, {
      new: true,
    })
      .lean()
      .exec();
  }

  async resetPasswordSMS(phone_number: string, isAdminRule: boolean) {
    try {
      const user = await User.findOne({ phone_number: phone_number }).exec();
      if (!user) {
        return [true, Constants.ERROR_MAP.USER_NOT_FOUND];
      }
      // Create a token
      const token = jwt.sign(
        {
          expiresIn: moment()
            .add(Constants.PASSWORD_RESET_EXPIRATION, 's')
            .format(),
          id: user._id,
        },
        isAdminRule
          ? process.env.JWT_SECRET_KEY_ADMIN
          : process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY
      );
      user.reset_password_token = token;
      await user.save();

      const result = sendSMSViaProvider(
        token,
        Constants.providers.TWILIO,
        user.phone_number,
        Constants.templates.PASSWORD_RESET_SMS
      );
      return [false, result];
    } catch (exception) {
      throw exception;
    }
  }

  async verifyResetPasswordToken(token: string, password: string) {
    try {
      if (token === '' || !token) {
        return [true, Constants.ERROR_MAP.INVALID_RESET_PASSWORD_TOKEN];
      }
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY
      ) as any;
      const user = await User.findById(decoded.id).exec();
      if (!user) {
        return [true, Constants.ERROR_MAP.USER_NOT_FOUND];
      }
      if (user.reset_date) {
        return [true, Constants.ERROR_MAP.ALREADY_RESET_PASSWORD];
      }
      const dateNow = moment().format();
      if (decoded.expiresIn < dateNow) {
        return [true, Constants.ERROR_MAP.RESET_PASSWORD_LINK_EXPIRED];
      } else {
        if (!validatePassword(password)) {
          return [true, Constants.ERROR_MAP.INVALID_FORMAT_PASSWORD];
        }
        user.password = password;
        user.updated_date = moment().toDate();
        user.reset_date = moment().toDate();
        await user.save();
        return [false, 'Password reset completed'];
      }
    } catch (exception) {
      throw exception;
    }
  }

  async getUsersViaListofPhone(phone_numbers: string[]) {
    try {
      const data = await User.find({
        phone_number: {
          $in: phone_numbers,
        },
      })
        .select('_id')
        .exec();
      if (data.length === 0) {
        return [true, Constants.ERROR_MAP.USER_NOT_FOUND];
      }
      return [false, data];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_GET_USER_PHONE_NUMBER];
    }
  }
  async findNotDeletedUserByMobile(
    countryCode: string,
    mobileNumber: string
  ): Promise<[boolean, { code: number; message?: string; result: any }]> {
    try {
      const data = await LegacyUser.findOne({
        countryCode: countryCode,
        mobileNumber: mobileNumber,
        status: { $ne: 'Delete' },
      })
        .lean()
        .exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.USER_NOT_FOUND,
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          message: Constants.MESSAGE.LOGIN_SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.USER_NOT_FOUND,
          message: exception.message,
        },
      ];
    }
  }

  async getBidder(
    userId: string
  ): Promise<
    [
      boolean,
      { code: number; result: UserLegacyDocument | string; message?: string }
    ]
  > {
    try {
      const bidder = await LegacyUser.findById(userId)
        .select('_id name countryCode mobileNumber language')
        .exec();

      if (!bidder) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.USER_NOT_FOUND,
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: bidder,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_SEND_SMS_TO_BIDDER,
          message: exception.message,
        },
      ];
    }
  }

  async updateBankDetailUser(
    userId: string,
    iban: string,
    bankName: string,
    bankBIC: string = null,
    accountHolderName: string = null
  ): Promise<
    [
      boolean,
      { code: number; result: UserLegacyDocument | string; message?: string }
    ]
  > {
    try {
      const user = await LegacyUser.findById(userId).exec();
      if (!user) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.USER_NOT_FOUND,
          },
        ];
      }
      if (iban) {
        user.bankDetail = { ...user.bankDetail, accountId: iban };
      }
      if (bankName) {
        user.bankDetail = { ...user.bankDetail, bankName: bankName };
      }
      if (bankBIC) {
        user.bankDetail = { ...user.bankDetail, bankBIC: bankBIC };
      }
      if (accountHolderName) {
        user.bankDetail = {
          ...user.bankDetail,
          accountHolderName: accountHolderName,
        };
      }
      await user.save();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: 'Update bank detail successfully',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_USER,
          message: exception.message,
        },
      ];
    }
  }

  async findAndGetUserViaMobilePhone(
    countryCode: string,
    mobileNumber: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: string | LeanDocument<UserLegacyDocument>;
        message?: string;
      }
    ]
  > {
    try {
      const userDoc = await LegacyUser.findOne({
        countryCode: countryCode,
        mobileNumber: mobileNumber,
      })
        .lean()
        .exec();

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: userDoc,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_USER_PHONE_NUMBER,
          message: exception.message,
        },
      ];
    }
  }
  async getIBANInformation(
    buyerId: string
  ): Promise<
    [
      boolean,
      { code: number; result: UserLegacyDocument | string; message?: string }
    ]
  > {
    try {
      const user = await LegacyUser.findById(buyerId).exec();
      if (!user) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.USER_NOT_FOUND,
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: user,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_USER,
          message: exception.message,
        },
      ];
    }
  }
  getAddress(user: UserLegacyDocument) {
    if (!user) return '';
    if (user.addresses) {
      return [
        user.addresses[0]?.street,
        user.addresses[0]?.district,
        user.addresses[0]?.city,
        user.addresses[0]?.postal_code,
      ].join(',');
    } else {
      return [
        user.address?.address,
        user.address?.city,
        user.address?.postal_code,
      ].join(',');
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
      const matchedCondition: any = {};
      const andArray: any = [];
      if (isGetBetaUser) {
        andArray.push({ isBetaUser: true });
        matchedCondition.$and = andArray;
      }

      if (isGetKeySeller) {
        andArray.push({ isKeySeller: true });
        matchedCondition.$and = andArray;
      }

      if (isGetInactiveUser) {
        andArray.push({ status: 'Inactive' });
        matchedCondition.$and = andArray;
      }

      if (isMerchant !== '') {
        const _isMerchant = isMerchant === 'true' ? true : false;
        andArray.push({ isMerchant: _isMerchant });
        matchedCondition.$and = andArray;
      }

      if (queryString) {
        const orArray = [];
        const queryText = queryString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        orArray.push({ name: { $regex: new RegExp(`.*${queryText}.*`, 'i') } });
        const splitNumberArray = queryText.split(/[ -]+/g);
        const phoneNumber = splitNumberArray.slice(-1)[0];
        // Try to search phone number when at least 5 chars in length
        // When searching model 'iphone 12' 12 is not used to search for phone number

        if (phoneNumber && phoneNumber.length >= 5) {
          orArray.push({
            mobileNumber: { $regex: new RegExp(`.*${phoneNumber}.*`, 'gi') },
          });
        }

        if (mongoose.isValidObjectId(queryText)) {
          orArray.push({ _id: mongoose.Types.ObjectId(queryText) });
        }
        matchedCondition.$or = orArray;
      }
      const aggregate: Array<Record<string, any>> = [
        {
          $match: matchedCondition,
        },
        {
          $skip: (page - 1) * size,
        },
        {
          $limit: size,
        },
        {
          $project: {
            _id: 1,
            user_id: '$_id',
            name: 1,
            countryCode: 1,
            mobileNumber: {
              $concat: [
                {
                  $substr: [
                    '**********',
                    0,
                    { $subtract: [{ $strLenCP: '$mobileNumber' }, 4] },
                  ],
                },
                {
                  $substr: [
                    '$mobileNumber',
                    { $subtract: [{ $strLenCP: '$mobileNumber' }, 4] },
                    4,
                  ],
                },
              ],
            },
            status: 1,
            cards: 1,
            addresses: 1,
            profilePic: 1,
            lastLoginDate: 1,
            updatedDate: 1,
            isBetaUser: 1,
            isKeySeller: 1,
            isMerchant: 1,
            sellerType: 1,
          },
        },
      ];
      const data: any = await LegacyUser.aggregate(aggregate);
      let totalRecord = await getCache('usersCount');
      if (_isEmpty(totalRecord)) {
        totalRecord = await LegacyUser.count(matchedCondition);
        await setCache(`usersCount`, totalRecord, 60 * 60 * 24);
      }

      if (!data || data.length === 0) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_USER,
            message: Constants.MESSAGE.USER_IS_NOT_FOUND,
          },
        ];
      }
      const returnedData = {
        totalResult: totalRecord,
        data: data,
      };

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: returnedData,
        },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_USER,
            message: exception.message,
          },
        ];
      }
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
      let user: UserLegacyDocument;
      if (isBlockUser) {
        user = await LegacyUser.findByIdAndUpdate(
          userId,
          {
            $set: {
              status: status,
              isBlock: isBlockUser && status === 'Inactive',
              blockTimestamp: new Date(),
            },
          },
          { new: true }
        );

        if (status === 'Inactive') {
          await ProductModel.updateMany(
            { user_id: new mongoose.Types.ObjectId(userId) },
            {
              $set: {
                status: 'Delete',
                reason: 'Deleted by blocking users',
                deletedDate: new Date(),
              },
            },
            {
              new: true,
            }
          );
        }
      } else {
        user = await LegacyUser.findByIdAndUpdate(
          userId,
          {
            $set: {
              status: status,
            },
          },
          { new: true }
        );
      }

      if (!user) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.USER_NOT_FOUND,
            message: Constants.MESSAGE.USER_IS_NOT_FOUND,
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: user,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_USER,
          message: exception.message,
        },
      ];
    }
  }
  async getUsersByConditions(
    conditions: FilterQuery<UserLegacyDocument>,
    limit?: number,
    select?: string
  ): Promise<UserLegacyDocument[]> {
    const query = LegacyUser.find(conditions).sort({ updated_date: -1 });
    if (select) {
      query.select(select);
    }

    if (Number.isInteger(limit)) {
      query.limit(limit);
    }

    return query.exec();
  }
  async getOrdersAndActiveListingsForUserId(
    userId: mongoose.Types.ObjectId,
    range: string = null
  ): Promise<
    mongoose.Aggregate<
      {
        _id: string;
        DM_Orders: Array<any>;
        listings: Array<any>;
        purchases: Array<any>;
        rates: any;
      }[]
    >
  > {
    let dateRangeMatch = {};
    if (range) {
      const { startDate, endDate } = getDataRangeAnalytics(range);
      dateRangeMatch = {
        created_at: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }
    const aggregate: Array<Record<string, any>> = [
      {
        $match: {
          status: 'Active',
          _id: userId,
        },
      },
      {
        $lookup: {
          from: 'orders',
          let: {
            id: '$_id', //localField
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$transaction_status', 'Success'] },
                    {
                      $eq: [
                        '$$id', //localField variable it can be used only in $expr
                        '$seller', //seller
                      ],
                    },
                  ],
                },
                ...dateRangeMatch,
              },
            },
          ],
          as: 'orders',
        },
      },
      {
        $lookup: {
          from: 'orders',
          let: {
            id: '$_id', //localField
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$transaction_status', 'Success'] },
                    {
                      $eq: [
                        '$$id', //localField variable it can be used only in $expr
                        '$buyer', //seller
                      ],
                    },
                  ],
                },
                ...dateRangeMatch,
              },
            },
          ],
          as: 'purchases',
        },
      },
      lookup('DeltaMachineOrders', 'orders._id', 'orderId', 'DM_Orders'),
      lookup('products', '_id', 'user_id', 'listings'),
      {
        $project: {
          _id: 1,
          rates: 1,
          DM_Orders: 1,
          'listings.status': 1,
          'listings.sell_status': 1,
          'listings.isApproved': 1,
          'listings.isExpired': 1,
          'listings.expiryDate': 1,
          purchases: 1,
        },
      },
    ];

    return LegacyUser.aggregate(aggregate);
  }

  async saveUserRates(
    userId: mongoose.Types.ObjectId,
    numOfDMOrders: number,
    numOfActiveListings: number,
    numOfCompletedOrders: number,
    numOfPurchasedProducts: any,
    cancellationRate?: number,
    completionRate?: number,
    isBadge?: boolean,
    isPreviouslyBadgeAlerted?: boolean,
    isPreviouslyCancellationAlerted?: boolean
  ) {
    typeof cancellationRate === 'number' &&
      (await this.updateUserPreferences(userId.toString(), {
        is_new_badge_alert: isBadge && !isPreviouslyBadgeAlerted ? true : false,
        is_cancellation_alert:
          cancellationRate >= 33 && !isPreviouslyCancellationAlerted
            ? true
            : false,
      }));

    return LegacyUser.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          ...(typeof cancellationRate === 'number' &&
            typeof completionRate === 'number' && {
              rates: {
                cancellation_rate: cancellationRate,
                completion_rate: completionRate,
                reliability_badge: isBadge,
              },
            }),
          rates_scan: true,
          listings: {
            sold_listings: numOfDMOrders,
            active_listings: numOfActiveListings,
            completed_sales: numOfCompletedOrders,
            purchased_products: numOfPurchasedProducts,
          },
        },
      }
    );
  }
  async updateRatesScan(user_id: string, rates_scan: boolean) {
    try {
      return await LegacyUser.findByIdAndUpdate(user_id, {
        $set: { rates_scan: rates_scan, updated_date: new Date() },
      });
    } catch (exception) {
      // email address's been registered with another user
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, Constants.ERROR_MAP.FAILED_TO_UPDATE_USER];
      }
    }
  }
  async addToActiveSellers(users: string[]) {
    try {
      users.forEach(async (user_id: any) => {
        if (mongoose.Types.ObjectId.isValid(user_id._id)) {
          await ActivityUser.updateOne(
            {
              user_id: user_id,
            },
            {
              $set: {
                user_id: mongoose.Types.ObjectId(user_id._id),
                created_date: moment().toDate(),
                updated_date: moment().toDate(),
              },
            },
            { upsert: true }
          );
        }
      });
      return [false, 'created succesful'];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_ADD_USER];
    }
  }

  async addNumberToSignupWaitList(mobileNumber: string) {
    try {
      const waitlist = new SignupWaitList({
        mobile_number: mobileNumber,
      });
      await waitlist.save();
      return [false, null];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_ADD_NUMBER_TO_WAITLIST];
    }
  }
  async getUserByMobile(
    countryCode: string,
    mobileNumber: string
  ): Promise<LeanDocument<UserLegacyDocument>> {
    try {
      return await LegacyUser.findOne({
        countryCode: countryCode,
        mobileNumber: mobileNumber,
      })
        .lean()
        .exec();
    } catch (exception) {
      return null;
    }
  }

  async signUpWithMobile(
    countryCode: string,
    mobileNumber: string
  ): Promise<[boolean, UserLegacyDocument | string]> {
    try {
      const user = new LegacyUser({
        mobileNumber: mobileNumber,
        countryCode: countryCode,
        otpVerification: true,
      });
      const newUser = await user.save();
      return [false, newUser];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, exception];
      }
    }
  }

  async updateGuaranteeFeatureTags(userIds: string[]) {
    const existing = await LegacyUser.find({ 'tags.name': 'soumChoice' });
    const existingUserIds = existing.map(item => item.id);

    await LegacyUser.updateMany(
      { _id: { $in: existingUserIds } },
      { $pull: { tags: { name: 'soumChoice' } } },
      { multi: true }
    );

    await LegacyUser.updateMany(
      { _id: { $in: userIds } },
      { $push: { tags: { name: 'soumChoice' } } },
      { multi: true }
    );

    return ProductModel.updateMany(
      { user_id: { $in: [...new Set([...userIds, ...existingUserIds])] } },
      { $unset: { search_sync: 1 } }
    );
  }

  async updateAskSellerNotificationNudgeReceived(
    id: string,
    sellerReceivedNudgeNotification: boolean
  ) {
    try {
      const existingUser = await LegacyUser.findById(id).exec();
      if (!existingUser) {
        return [true, Constants.ERROR_MAP.USER_NOT_FOUND];
      }
      if (
        existingUser.sellerReceivedNudgeNotification ===
        sellerReceivedNudgeNotification
      ) {
        return [false, Constants.MESSAGE.USER_SUCCESSFULLY_UPDATED];
      }
      existingUser.sellerReceivedNudgeNotification =
        sellerReceivedNudgeNotification;
      await existingUser.save();
      return [false, Constants.MESSAGE.USER_SUCCESSFULLY_UPDATED];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, Constants.ERROR_MAP.FAILED_TO_UPDATE_USER];
      }
    }
  }

  async getUsersForInspector(queryString?: string) {
    try {
      const aggregate: Array<Record<string, any>> = [
        {
          $match: {
            mobileNumber: { $regex: new RegExp(`.*${queryString}.*`, 'gi') },
          },
        },
        {
          $limit: 10,
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            userId: '$_id',
            name: 1,
            mobileNumber: 1,
          },
        },
      ];
      return LegacyUser.aggregate(aggregate);
    } catch (exception) {
      return [];
    }
  }
}
