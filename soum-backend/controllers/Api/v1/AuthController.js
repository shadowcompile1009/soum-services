const UserModel = require("../../../models/UserModel");
const bcrypt = require("bcrypt-nodejs");
var moment = require("moment");
const jwt = require("jsonwebtoken");
const Helper = require("../../../config/helper.js");
const Messages = require("../../../config/messages.js");
const userDAL = require("../../../Data/UserDAL");
const settingDAL = require("../../../Data/SettingDAL");
const { getSearchablePhone } = require("../../../utils/phone");

const errorLogDAL = require("../../../Data/log/ErrorLogDAL");
const { UserStatus } = require("../../../constants/user");
const { AE, AE_NUMBERS_FOR_SIGNUP } = require("../../../enums/Settings");
const SettingDAL = require("../../../Data/SettingDAL");
const { MERCHANT_APP } = require("../../../enums/SourcePlatform");

async function send_code(req, res) {
  let { mobileNumber } = req.body;
  try {
    const region = await settingDAL.SettingValue("region");
    mobileNumber = getSearchablePhone(mobileNumber);
    const countryCode = region.code;
    const foundInactiveUser = await userDAL.FindInactiveUserByMobile(
      countryCode,
      mobileNumber
    );

    const isValid = await validateUserStatus(foundInactiveUser);
    if (!isValid) {
      return Helper.response(res, 400, Messages.api.fail[LOCALE]);
    }

    let foundUser = await userDAL.GetAnyUser(countryCode, mobileNumber);

    if (!foundUser) {
      var newUser = {
        mobileNumber: req.body.mobileNumber,
        countryCode: req.body.countryCode,
        secretKey: Helper.generateRandString(),
        language: LOCALE,
      };
      Helper.send_otp(
        req.body.countryCode,
        req.body.mobileNumber,
        LOCALE,
        async function (otpData) {
          var otpData = JSON.parse(otpData);
          if (otpData.error_code === undefined) {
            await userDAL.CreateNewUser(newUser);
            return Helper.response(res, 200, Messages.otp.send[LOCALE]);
          } else {
            return Helper.response(res, 400, Messages.otp.fail[LOCALE]);
          }
        }
      );
    } else {
      if (foundUser.status == "Delete" || foundUser.status == "Inactive") {
        foundUser.status = "Active";
        foundUser.otpVerification = false;
        await userDAL.UpdateUser(foundUser);
      }
      if (foundUser.otpVerification) {
        return Helper.response(res, 400, Messages.mobile.exists[LOCALE]);
      } else if (!foundUser.otpVerification) {
        Helper.send_otp(countryCode, mobileNumber, LOCALE, function (otpData) {
          var otpData = JSON.parse(otpData);
          if (otpData.error_code === undefined) {
            return Helper.response(res, 200, Messages.otp.send[LOCALE]);
          } else {
            return Helper.response(res, 400, Messages.otp.fail[LOCALE]);
          }
        });
      }
    }
  } catch (error) {
    await errorLogDAL.Log(error, "User-Auth", "send_code", 500, {
      countryCode,
      mobileNumber,
    });
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function otpVerify(req, res) {
  let { mobileNumber, shouldRemember } = req.body;
  try {
    const region = await settingDAL.SettingValue("region");
    mobileNumber = getSearchablePhone(mobileNumber);
    const countryCode = region.code;
    let foundUser = await userDAL.FindNotDeletedUserByMobile(
      countryCode,
      mobileNumber
    );
    if (!foundUser)
      return Helper.response(res, 400, Messages.user.not_exists[LOCALE]);

    if (foundUser.userType == "Dummy") {
      let userProfile = await GenerateTokenAndGetProfile(
        foundUser,
        shouldRemember
      );
      var result = { UserData: userProfile };
      return Helper.response(res, 200, Messages.otp.verified[LOCALE], result);
    }

    Helper.verify_otp(
      req.body.countryCode,
      req.body.mobileNumber,
      req.body.otp,
      async function (otpData) {
        var otpData = JSON.parse(otpData);
        if (otpData.response_status == "correct") {
          let userProfile = await GenerateTokenAndGetProfile(foundUser);
          let result = { UserData: userProfile };

          return Helper.response(
            res,
            200,
            Messages.otp.verified[LOCALE],
            result
          );
        } else {
          return Helper.response(res, 400, Messages.otp.incorrect[LOCALE]);
        }
      }
    );
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function loginOrSignup(req, res) {
  try {
    const region = await settingDAL.SettingValue("region");
    const countryCode = region.code;
    let { mobileNumber, otp, shouldRemember } = req.body;
    mobileNumber = getSearchablePhone(mobileNumber);
    let user = await userDAL.GetAnyUser(countryCode, mobileNumber);

    const isValid = await validateUserStatus(user);
    if (!isValid) {
      return Helper.response(res, 400, Messages.auth.account_not_found[LOCALE]);
    }

    if (req.headers["client-id"] === MERCHANT_APP) {
      if (!(user && user.isMerchant)) {
        return Helper.response(
          res,
          400,
          Messages.auth.account_not_found[LOCALE]
        );
      }
    }

    if (user && user.status === UserStatus.DELETED) {
      const dateDiff = moment().diff(user.deleted_date, "d");
      if (dateDiff < 7) {
        return Helper.response(
          res,
          400,
          Messages.auth.account_not_found[LOCALE]
        );
      }
    }

    if (user && user.userType == "Dummy") {
      if (user) {
        let userProfile = await GenerateTokenAndGetProfile(user);
        userProfile.isNewUser = false;
        if (user.status == UserStatus.DELETED) {
          const newUser = {
            _id: user._id,
            deleted_date: null,
            status: UserStatus.ACTIVE,
          };
          userProfile.isNewUser = true;
          await userDAL.UpdateUser(newUser);
        }
        let result = { UserData: userProfile };
        return Helper.response(res, 200, Messages.otp.verified[LOCALE], result);
      }
    }

    Helper.verify_otp(countryCode, mobileNumber, otp, async function (otpData) {
      const otpDataObj = JSON.parse(otpData);
      if (otpDataObj.response_status == "correct") {
        let isNewUser = false;
        if (!user) {
          var newUser = {
            mobileNumber: mobileNumber,
            countryCode: countryCode,
            secretKey: Helper.generateRandString(),
            language: LOCALE,
          };
          isNewUser = true;
          user = await userDAL.CreateNewUser(newUser);
        } else if (user && user.status == UserStatus.DELETED) {
          const newUser = {
            _id: user._id,
            deleted_date: null,
            status: UserStatus.ACTIVE,
          };
          isNewUser = true;
          await userDAL.UpdateUser(newUser);
        }

        let userProfile = await GenerateTokenAndGetProfile(
          user,
          shouldRemember
        );
        userProfile.isNewUser = isNewUser;
        let result = { UserData: userProfile };

        return Helper.response(res, 200, Messages.otp.verified[LOCALE], result);
      } else {
        return Helper.response(res, 400, Messages.otp.incorrect[LOCALE]);
      }
    });
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function validateUserStatus(user) {
  if (user && user.status == UserStatus.INACTIVE) {
    return false;
  }
  if (user && user.status == UserStatus.DUPLICATE) {
    return false;
  }
  if (user && user.status == UserStatus.DELETED) {
    const dateDiff = moment().diff(user.deleted_date, "d");
    if (dateDiff < 7) {
      return false;
    }
  }
  return true;
}

async function set_password(req, res) {
  try {
    let foundUser = await userDAL.GetFullUser(req.user._id);
    if (!foundUser)
      return Helper.response(res, 400, Messages.user.not_exists[LOCALE]);

    foundUser.password = bcrypt.hashSync(req.body.password);
    foundUser.name = req.body.name;
    await userDAL.UpdateUser(foundUser);

    var result = { userData: foundUser };
    return Helper.response(res, 200, Messages.password.set[LOCALE], result);
  } catch (error) {
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function FillUserInfo(req, res) {
  try {
    let foundUser = await userDAL.GetFullUser(req.user._id);
    if (!foundUser)
      return Helper.response(res, 400, Messages.user.not_exists[LOCALE]);

    if (req.body && req.body.name) {
      foundUser.name = req.body.name;
    }
    if (req.body && req.body.email) {
      foundUser.email = req.body.email;
    }
    await userDAL.UpdateUser(foundUser);

    var result = { userData: foundUser };
    return Helper.response(res, 200, Messages.user.updated[LOCALE], result);
  } catch (error) {
    await errorLogDAL.Log(error, "User-Auth", "FillUserInfo", 500, {
      userId: req.user._id,
    });
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function change_password(req, res) {
  try {
    var token = req.headers.token;
    let { newPassword, oldPassword, confirmPassword } = req.body;
    let foundUser = await userDAL.GetFullUser(req.user._id);

    if (!foundUser)
      return Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    if (bcrypt.compareSync(oldPassword, foundUser.password)) {
      if (newPassword == confirmPassword) {
        foundUser.password = bcrypt.hashSync(req.body.newPassword);
        foundUser.token = [];
        foundUser.token.push(token);
        await userDAL.UpdateUser(foundUser);
        return Helper.response(res, 200, Messages.password.success[LOCALE]);
      } else {
        return Helper.response(res, 400, Messages.password.same[LOCALE]);
      }
    } else {
      return Helper.response(res, 400, Messages.password.wrong[LOCALE]);
    }
  } catch (error) {
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function Logout(req, res) {
  try {
    var token = req.headers.token;
    let foundUser = await userDAL.GetFullUser(req.user._id);
    if (!foundUser)
      return Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    foundUser.token = [];
    await userDAL.UpdateUser(foundUser);
    return Helper.response(res, 200, Messages.logout.success[LOCALE]);
  } catch (error) {
    await errorLogDAL.Log(error, "User-Auth", "Logout", 500, {
      userId: req.user._id,
    });
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function login(req, res) {
  let { mobileNumber } = req.body;
  try {
    const region = await settingDAL.SettingValue("region");
    mobileNumber = getSearchablePhone(mobileNumber);
    const countryCode = region.code;

    const foundInactiveUser = await userDAL.FindInactiveUserByMobile(
      countryCode,
      mobileNumber
    );

    const isValid = await validateUserStatus(foundInactiveUser);
    if (!isValid) {
      return Helper.response(res, 400, Messages.api.fail[LOCALE]);
    }

    let foundUser = await userDAL.FindUserByMobile(countryCode, mobileNumber);
    if (!foundUser)
      return Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    if (foundUser.userType == "Dummy")
      return Helper.response(res, 200, Messages.otp.send[LOCALE]);

    Helper.send_otp(countryCode, mobileNumber, LOCALE, function (otpData) {
      var otpData = JSON.parse(otpData);
      if (otpData.error_code === undefined) {
        return Helper.response(res, 200, Messages.otp.send[LOCALE]);
      } else {
        return Helper.response(res, 400, Messages.otp.fail[LOCALE]);
      }
    });
  } catch (error) {
    await errorLogDAL.Log(error, "User-Auth", "Login", 500, {
      countryCode,
      mobileNumber,
    });
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function sendCodeDirectly(req, res) {
  let { mobileNumber } = req.body;
  mobileNumber = getSearchablePhone(mobileNumber);
  const region = await settingDAL.SettingValue("region");
  const countryCode = region.code;
  const user = await userDAL.GetAnyUser(countryCode, mobileNumber);
  if (region.region == AE) {
    const allowed_numbers = await settingDAL.SettingValue(
      AE_NUMBERS_FOR_SIGNUP
    );
    const isAllowed = allowed_numbers.split(",").indexOf(mobileNumber);
    if (isAllowed === -1) {
      return Helper.response(res, 400, Messages.auth.account_not_found[LOCALE]);
    }
  }

  if (req.headers["client-id"] === MERCHANT_APP) {
    if (!(user && user.isMerchant)) {
      return Helper.response(res, 400, Messages.auth.account_not_found[LOCALE]);
    }
  }
  const isValid = await validateUserStatus(user);
  if (!isValid) {
    return Helper.response(res, 400, Messages.auth.account_not_found[LOCALE]);
  }

  if (user && user.userType == "Dummy")
    return Helper.response(res, 200, Messages.otp.send[LOCALE]);
  try {
    await Helper.send_otp(
      countryCode,
      mobileNumber,
      LOCALE,
      await function (otpData) {
        var otpData = JSON.parse(otpData);
        if (otpData.error_code === undefined) {
          return Helper.response(res, 200, Messages.otp.send[LOCALE]);
        } else {
          return Helper.response(res, 400, Messages.otp.fail[LOCALE]);
        }
      }
    );
  } catch (error) {
    console.log(error);
    await errorLogDAL.Log(error, "User-Auth", "Login", 500, {
      countryCode,
      mobileNumber,
    });
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function CheckMobileNumber(req, res) {
  const { countryCode, mobileNumber } = req.body;
  try {
    let foundUser = await userDAL.FindUserByMobile(countryCode, mobileNumber);
    if (!foundUser)
      return Helper.response(res, 400, Messages.login.invalid[LOCALE]);
    return Helper.response(res, 200, "Success");
  } catch (error) {
    await errorLogDAL.Log(error, "User-Auth", "CheckMobileNumber", 500, {
      countryCode,
      mobileNumber,
    });
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function resend_code(req, res) {
  try {
    let { mobileNumber } = req.body;
    const region = await settingDAL.SettingValue("region");
    mobileNumber = getSearchablePhone(mobileNumber);
    const countryCode = region.code;
    if (region.region == AE) {
      const allowed_numbers = await settingDAL.SettingValue(
        AE_NUMBERS_FOR_SIGNUP
      );
      const isAllowed = allowed_numbers.split(",").indexOf(mobileNumber);
      if (isAllowed === -1) {
        return Helper.response(
          res,
          400,
          Messages.auth.account_not_found[LOCALE]
        );
      }
    }
    const user = await userDAL.GetUsersByMobile(countryCode, mobileNumber);
    // Only do the validations if it's an existing user
    if (user.length != 0) {
      const foundInactiveUser = await userDAL.FindInactiveUserByMobile(
        countryCode,
        mobileNumber
      );

      const isValid = await validateUserStatus(foundInactiveUser);
      if (!isValid) {
        return Helper.response(
          res,
          400,
          Messages.auth.account_not_found[LOCALE]
        );
      }

      let foundUser = await userDAL.FindNotDeletedUserByMobile(
        countryCode,
        mobileNumber
      );
      if (!foundUser)
        return Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    }
    Helper.send_otp(countryCode, mobileNumber, LOCALE, function (otpData) {
      var otpData = JSON.parse(otpData);
      if (otpData.error_code === undefined) {
        return Helper.response(res, 200, Messages.otp.send[LOCALE]);
      } else {
        return Helper.response(res, 400, Messages.otp.fail[LOCALE]);
      }
    });
  } catch (error) {
    await errorLogDAL.Log(error, "User-Auth", "resend_code", 500, {
      countryCode,
      mobileNumber,
    });
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function forgot_password(req, res) {
  try {
    let { mobileNumber } = req.body;
    const region = await settingDAL.SettingValue("region");
    mobileNumber = getSearchablePhone(mobileNumber);
    const countryCode = region.code;
    let foundUser = await userDAL.FindUserByMobile(countryCode, mobileNumber);
    if (!foundUser)
      return Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    Helper.send_otp(
      req.body.countryCode,
      req.body.mobileNumber,
      LOCALE,
      function (otpData) {
        var otpData = JSON.parse(otpData);
        if (otpData.error_code === undefined) {
          return Helper.response(res, 200, Messages.otp.send[LOCALE]);
        } else {
          return Helper.response(res, 400, Messages.otp.fail[LOCALE]);
        }
      }
    );
  } catch (error) {
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function GenerateTokenAndGetProfile(foundUser, shouldRemember) {
  const newToken = Helper.generate_jwt(foundUser._id, Boolean(shouldRemember));
  foundUser.token = [newToken];
  foundUser.otpVerification = true;
  foundUser.opt = "";
  foundUser.lastLoginDate = Date.now();
  await userDAL.UpdateUser(foundUser);
  let userProfile = await userDAL.GetUserProfileById(foundUser._id);
  userProfile.token = newToken;
  return userProfile;
}

module.exports = {
  login,
  Logout,
  sendCodeDirectly,
  send_code,
  resend_code,
  otpVerify,
  CheckMobileNumber,
  loginOrSignup,
  change_password,
  set_password,
  forgot_password,
  FillUserInfo,
  register: async (req, res) => {
    try {
      let { mobileNumber } = req.body;
      const region = await settingDAL.SettingValue("region");
      mobileNumber = getSearchablePhone(mobileNumber);
      const countryCode = region.code;
      const foundInactiveUser = await userDAL.FindInactiveUserByMobile(
        countryCode,
        mobileNumber
      );

      const isValid = await validateUserStatus(foundInactiveUser);
      if (!isValid) {
        return Helper.response(res, 400, Messages.api.fail[LOCALE]);
      }

      let foundUser = await userDAL.FindNotDeletedUserByMobile(
        countryCode,
        mobileNumber
      );

      if (foundUser) {
        return Helper.response(res, 400, Messages.mobile.exists[LOCALE]);
      }

      var otp = Math.floor(100000 + Math.random() * 9000);
      var obj = {
        mobileNumber: req.body.mobileNumber,
        countryCode: req.body.countryCode,
        otp: otp,
      };

      return new UserModel(obj).save((saveErr, saveRes) => {
        if (saveErr) {
          return Helper.response(res, 500, Messages.api.error[LOCALE]);
        } else {
          var result = { UserData: saveRes };
          return Helper.response(res, 200, Messages.otp.send[LOCALE], result);
        }
      });
    } catch (error) {
      return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },
  reset_password: (req, res) => {
    try {
      var token = req.headers.token;
      //console.log("===================>", req)
      UserModel.findOne(
        { _id: req.user._id, status: "Active" },
        (err, result) => {
          //console.log("reset======>", err, result)
          if (err) {
            return Helper.response(res, 500, Messages.api.error[LOCALE]);
          } else if (!result) {
            return Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
          } else {
            if (req.body.newPassword == req.body.confirmPassword) {
              req.body.password = bcrypt.hashSync(req.body.newPassword);
              var tokenArr = [];
              tokenArr.push(token);
              UserModel.findOneAndUpdate(
                { _id: result._id },
                { $set: { password: req.body.password, token: tokenArr } },
                { new: true },
                (updateErr, updateResult) => {
                  //console.log("uppdateerr", updateResult)
                  if (updateErr) {
                    return Helper.response(
                      res,
                      500,
                      Messages.api.error[LOCALE]
                    );
                  } else {
                    return Helper.response(
                      res,
                      200,
                      Messages.password.success[LOCALE]
                    );
                  }
                }
              );
            } else {
              return Helper.response(res, 400, Messages.password.same[LOCALE]);
            }
          }
        }
      );
    } catch (error) {
      return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },
  // not used
  edit_profile: (req, res) => {
    try {
      UserModel.findOne(
        { _id: req.body.userId, status: "Active" },
        (userErr, userRes) => {
          if (userErr) {
            return Helper.response(res, 500, Messages.api.error[LOCALE]);
          } else if (!userRes) {
            return Helper.response(res, 400, "Data not found");
          } else {
            UserModel.findOne(
              {
                mobileNumber: req.body.mobileNumber,
                status: "Active",
                _id: { $ne: userRes._id },
              },
              (error, result) => {
                if (error) {
                  return Helper.response(res, 500, Messages.api.error[LOCALE]);
                } else if (result) {
                  return Helper.response(res, 400, "Email already exist.");
                } else {
                  UserModel.findByIdAndUpdate(
                    { _id: userRes._id },
                    { $set: req.body },
                    { new: true },
                    (updateErr, updateRes) => {
                      if (updateErr) {
                        return Helper.response(
                          res,
                          500,
                          Messages.api.error[LOCALE]
                        );
                      } else {
                        res.send({
                          responseCode: 200,
                          responseMessage: "Successfully updated.",
                          responseResult: updateRes,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    } catch (error) {
      return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },
};
