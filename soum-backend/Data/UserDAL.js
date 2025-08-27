
const UserModel = require('../models/UserModel');
const DuplicateUserModel = require('../models/DuplicateUserModel');
const AddressModel = require('../models/AddressModel');
const OrderModel = require('../models/OrderModel');
const ProductModel = require('../models/ProductModel');
const mongoose = require('mongoose');
const moment = require("moment");
const { UserStatus } = require('../constants/user');
const { getSearchablePhone } = require('../utils/phone');
const NotificationModel = require('../models/NotificationModel');
const BidModel = require('../models/BidModel');
const PromocodesModel = require('../models/PromocodesModel');
const UserAction = require('../models/UserActionModel');
const referralLog = require('../models/log/ReferralLog');
const subscriptionModel = require('../models/SubscriptionModel');
const activityModel = require('../models/ActivityModel');

async function GetUserProfileById(userId) {
    return await UserModel.findById({ _id: userId }, {
        user_id: "$_id",
        name: 1,
        lastName: 1,
        email: 1,
        mobileNumber: 1,
        profilePic: 1,
        countryCode: 1,
        countryCode: 1,
        secretKey: 1,
        language: 1,
        address: 1,
        cards: 1,
        token: 1,
        bankDetail: 1,
        referralCode: 1,
        isKeySeller: 1,
        rates: 1,
        rates_scan: 1,
        listings: 1,
        preferences: 1,
        bio: 1,
    }, { lean: true });
}

async function GetFullUser(userId, status = 'Active') {
    return await UserModel.findById({ _id: userId, status, otpVerification: true });
}

async function GetUserWithNewAddressFormat(userId, status = 'Active') {
  return await UserModel.findById({ _id: userId, status, otpVerification: true })
    .populate({
      path: 'addresses',
      model: AddressModel
    })
    .exec();
}

async function FilterUser(userId, projection, status = 'Active') {
    return await UserModel.findById({ _id: userId, status }, projection, { lean: true });
}

async function UpdateUser(user) {
    return await UserModel.updateOne({ _id: user._id }, user, { lean: true });
}


async function FindNotDeletedUserByMobile(countryCode, mobileNumber) {
  const isDeleted = await UserModel.findOne(
    {
      countryCode: countryCode,
      mobileNumber: getSearchablePhone(mobileNumber),
      status: UserStatus.DELETED,
    },
    {},
    { lean: true }
  );
  if (isDeleted && isDeleted.status === UserStatus.DELETED) {
    const dateDiff = moment().diff(isDeleted.deleted_date, "d");
    if (dateDiff > 7) {
      return isDeleted;
    }
  } else {
    return await UserModel.findOne(
      {
        countryCode: countryCode,
        mobileNumber: getSearchablePhone(mobileNumber),
        status: { $ne: UserStatus.DELETED },
      },
      {},
      { lean: true }
    );
  }
}
async function FindInactiveUserByMobile(
  countryCode,
  mobileNumber
) {
  return await UserModel.findOne(
    {
      countryCode: countryCode,
      mobileNumber: getSearchablePhone(mobileNumber),
      status: { $in: [UserStatus.INACTIVE, UserStatus.DELETED, UserStatus.DUPLICATE] },
    },
    {},
    { lean: true },
  );
}

async function FindUserByMobile(countryCode, mobileNumber, status = 'Active') {
    return await UserModel.findOne({
        countryCode: countryCode,
        mobileNumber: mobileNumber,
        status,
        otpVerification: true
    }, {}, { lean: true });
}

async function CreateNewUser(UserData) {
    return await UserModel.create(UserData);
}

async function GetAnyUser(countryCode, mobileNumber) {
    return await UserModel.findOne({
        countryCode: countryCode,
        mobileNumber: mobileNumber
    }, {}, { lean: true });
}

async function checkValidUserCode(referralCode, userId) {
    return await UserModel.exists({
        _id: { $ne: mongoose.Types.ObjectId(userId) },
        referral_code: referralCode,
        status: 'Active',
        otpVerification: true
    });
}


async function checkUsedReferralCodeBefore(userId) {
  return await UserModel.exists({
      _id: mongoose.Types.ObjectId(userId),
      referralCodeUsed : true,
  });
}

async function UpdateReferralCode(userId, code) {
    return await UserModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { $set: { referralCode: code } });
}
// Admin extract
async function GetAllUsers(date) {
    var aggrUser = [
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
          address: "$address.address",
          city: "$address.city",
          postal_code: "$address.postal_code",
        },
      },
    ];

    return await UserModel.aggregate(aggrUser);
}


async function UpdateUserBankdetail(id, bankD) {
  return await UserModel.updateOne(
    { _id: id }, 
    {
      $set: {
      "bankDetail": bankD,
      "cleaned": "yes"
    }
  });
}

async function UpdateUserCleanedStatus(id) {
  return await UserModel.updateOne(
    { _id: id }, 
    {
      $set: {
      "cleaned": "clean"
    }
  });
}

async function GetUserBankDetails() {
    return await UserModel.find(
      {
        cleaned: { $nin : ["yes", "clean"] },
      },
      {
        user_id: "$_id",
        secretKey: 1,
        bankDetail: 1,
      },
      { lean: true }
    ).limit(100);
}

async function GetReplicatedUsers() {
  var aggregate = [
    {
      $group: {
        _id: "$mobileNumber",
        root: {
          $first: "$$ROOT",
        },
        count: {
          $sum: 1,
        },
      },
    },
    { $match: { status: { $ne: UserStatus.DUPLICATE }, count: { $gt: 1 } } },
    {
      $replaceRoot: {
        newRoot: "$root",
      },
    },
    {
      $project: {
        mobileNumber: 1,
        status: 1,
        createdDate: 1,
        updatedDate: 1,
      },
    },
  ];
  return await UserModel.aggregate(aggregate).allowDiskUse(true);
}

async function CreateTempDuplicateUser(UserData) {
  const user = await DuplicateUserModel.findOne({
    mobileNumber: UserData.mobileNumber,
  }).exec();
  if (!user) {
    return await DuplicateUserModel.create(UserData);
  }
}

async function GetUsersByMobile(mobileNumber) {
  return await UserModel.find(
    {
      mobileNumber: mobileNumber,
    },
    {
      status: 1,
      mobileNumber: 1,
    },
    { lean: true }
  ).sort({ createdDate: 1 });
}

async function GetRandomUsers() {
  const randomN = Math.floor(Math.random() * 1000 + 1)
  return await UserModel.find().limit(100).skip(randomN);
}

module.exports = {
    GetUserProfileById,
    GetFullUser,
    UpdateUser,
    FilterUser,
    FindNotDeletedUserByMobile,
    FindUserByMobile,
    FindInactiveUserByMobile,
    CreateNewUser,
    GetAnyUser,
    GetAllUsers,
    checkValidUserCode,
    UpdateReferralCode,
    GetUserWithNewAddressFormat,
    GetUserBankDetails,
    UpdateUserBankdetail,
    UpdateUserCleanedStatus,
    checkUsedReferralCodeBefore,
    GetReplicatedUsers,
    GetUsersByMobile,
    CreateTempDuplicateUser,
    GetRandomUsers,
}