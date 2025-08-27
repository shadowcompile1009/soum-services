const AdminModel = require('../../models/AdminModel');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const Helper = require('../../config/helper');
const Messages = require('../../config/messages');
const { check, validationResult, Result } = require("express-validator");
const mongoose = require('mongoose');
const helper = require('../../config/helper');
var AdminUpload = Helper.upload_space("profileImages").single('profilePic');
module.exports = {
    addAdmin: (req, res) => {
        try {
            AdminUpload(req, res, function (err, result) {
                if (err) {
                    console.log("rrr", err)
                    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
                } else {
                    //console.log(req)
                    /*const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return Helper.response(res, 400, "Parameter Missing", { errors: errors.array() });
                    }*/
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(req.body.password, salt);

                    AdminModel.findOne({ email: req.body.email, status: { $ne: "Delete" } }, (err, adminResult) => {
                        //console.log(err,adminResult)
                        if (err) {
                            return Helper.response(res, 500, "Internal server error")
                        }
                        else if (!adminResult) {
                            var adminObject = {
                                name: req.body.name,
                                email: req.body.email,
                                password: hash,
                                role: 'superadmin',
                                email_verified: true,
                                phoneNumber: req.body.phoneNumber,
                                isBetaAdmin: Boolean(req.body.isBetaAdmin.toString() === 'true'),
                            }
                            if (typeof req.file !== "undefined") {
                                const fileUrl = new URL(req.file.location);
                                adminObject.profilePic = ENV.AWS_CDN_ENDPOINT + fileUrl.pathname;
                            }
                            //Administrator
                            let admin = new AdminModel(adminObject);
                            admin.save((error, result) => {
                                if (error) {
                                    return Helper.response(res, 500, "Internal server error")
                                }
                                else {
                                    return Helper.response(res, 200, "Administrator added successfully.")
                                }

                            })
                        }
                        else {
                            return Helper.response(res, 400, "Email already exist")
                        }

                    })
                }
            });
        } catch (err) {
            return Helper.response(res, 500, "Something went wrong!");
        }
    },


    login: (req, res) => {
        try {
            //console.log(req)
            var query = { email: req.body.email, status: "Active" }
            // const userData = req.body.userId;
            //console.log("query====>", query)
            AdminModel.findOne(query, (error, adminData) => {
                //console.log("118=============>", error, adminData)
                if (error) {
                    return Helper.response(res, 500, "Internal server error.");
                }
                else if (!adminData) {
                    return Helper.response(res, 400, "Invalid credentials.");
                }
                else {
                    const check = bcrypt.compareSync(req.body.password, adminData.password);
                    //console.log(check)

                    if (check) {

                        var token = jwt.sign({ id: adminData._id, iat: Math.floor(Date.now() / 1000) - 30 }, process.env.JWT_SECRET_KEY_ADMIN, { expiresIn: '30d' });
                        AdminModel.findOneAndUpdate({ _id: adminData._id }, { $set: { token: token , lastLoginDate : Date.now() } }, { new: true }).exec(function (err, adminData) {
                            if (err) {
                                return res.status(500).json({ code: 500, message: 'Server Error' });
                            } else {
                                let result = {
                                    adminId: adminData._id,
                                    token: token,
                                    name: adminData.name,
                                    email: adminData.email,
                                    role: adminData.role,
                                    profilePic: adminData.profilePic,
                                    isBetaAdmin: adminData.isBetaAdmin || false,
                                };
                                //console.log(result)
                                var data = { "AdminData": result };
                                return Helper.response(res, 200, "login succesfully.", data);
                            }
                        })
                    } else {

                        return Helper.response(res, 400, "invalid credential")
                    }
                }
            })
        } catch (error) {
            return Helper.response(res, 500, "Something went wrong!");
        }
    },

    change_password: (req, res) => {
        try {
            AdminModel.findOne({ _id: req.admin._id, status: "Active" }, (error, result) => {
                if (error) {
                    return Helper.response(res, 500, "Internal server error.");
                }
                else if (!result) {
                    return Helper.response(res, 400, "admin not found");
                }
                else {
                    var OldPassword = bcrypt.compareSync(req.body.oldPassword, result.password)
                    if (OldPassword) {
                        if (req.body.newPassword == req.body.confirmPassword) {
                            var newPassword = bcrypt.hashSync(req.body.newPassword)
                            AdminModel.findOneAndUpdate({ _id: result._id }, { $set: { password: newPassword } }, { new: true },
                                (err, passwordChanged) => {
                                    if (err) {
                                        return Helper.response(res, 500, "Internal server error.");
                                    }
                                    else {
                                        return Helper.response(res, 200, "Password changed successfully")
                                    }
                                })
                        } else {
                            return Helper.response(res, 400, "Password and confirm password not same")
                        }
                    } else {
                        return Helper.response(res, 400, "Enter old wrong password");
                    }
                }
            })
        } catch (error) {
            return Helper.response(res, 500, "Something went wrong!");
        }
    },

    forgot_password: (req, res) => {
        try {
            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    console.log(err)
                }
                const token = buffer.toString("hex")
                var query = { email: req.body.email, status: "Active" };
                AdminModel.findOne(query, (err, result) => {
                    if (err) {
                        return Helper.response(res, 500, "Internal server error");
                    }
                    else if (!result) {
                        return Helper.response(res, 400, "User not found");
                    }
                    else {
                        let otp = Helper.generate_otp();
                        let time = new Date().getTime();
                        //admin.resetToken = token
                        // commonFunction.sendSMS(req.body.email, `Welcome to Soum_App. Your One Time Password is:- ${otp} . Please verify your otp for reset password.`, (smsErr, smsResult) => {
                        //     console.log("341==========>", smsErr, smsResult)
                        //     if (smsErr) {
                        //         response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        //     }     
                        //     else {
                        AdminModel.findOneAndUpdate({ email: result.email, status: "Active" }, { $set: { resetToken: token, emailOtp : otp } }, { new: true }, async (error, otpUpdate) => {
                            if (error) {
                                return Helper.response(res, 500, "Internal server error");
                            }
                            else {
                                result = {
                                    _id: otpUpdate._id,
                                    //userType: otpUpdate.userType,
                                    //otp: otpUpdate.otp,
                                    //mobileNumber: otpUpdate.mobileNumber,
                                    //otpVerification: otpUpdate.otpVerification
                                };
                                await helper.sendMailWithSendGrid(ENV.EMAIL_SENDER, otpUpdate.email, "Soum Admin Restore Account", `Dear soum admin kindly find your otp : ${ otpUpdate.emailOtp }`, null);
                                var url = "/reset-password?token=" + token; //process.env.ADMIN_URL +
                                return Helper.response(res, 200, "Mail send successfully", { "url": url });
                            }
                        })
                        //    }
                        // })

                    }
                })
            })
        } catch (error) {
            return Helper.response(res, 500, "Something went wrong!");
        }
    },

    reset_password: (req, res) => {
        try {
            //console.log("===================>", req)
            AdminModel.findOne({ resetToken: req.body.token, status: "Active" }, (err, result) => {
                //console.log("reset======>", err, result)
                if (err) {
                    return Helper.response(res, 500, "Internal server error.");
                }
                else if (!result) {
                    return Helper.response(res, 400, 'Admin not found');
                }
                else {
                    if (req.body.newPassword == req.body.confirmPassword && result.emailOtp == req.body.code ) {
                        req.body.password = bcrypt.hashSync(req.body.newPassword);
                        AdminModel.findOneAndUpdate({ _id: result._id, }, { $set: { password: req.body.password, resetToken: '', emailOtp : '' } }, { new: true }, (updateErr, updateResult) => {
                            //console.log("uppdateerr", updateResult)
                            if (updateErr) {
                                return Helper.response(res, 500, "Internal server error.");
                            }
                            else {
                                return Helper.response(res, 200, "password updated succesfully");

                            }
                        })
                    }
                    else {
                        return Helper.response(res, 400, "Invalide provided info");
                    }
                }
            })
        }
        catch (error) {
            return Helper.response(res, 500, "Something went wrong!");
        }
    },

    editAdmin: (req, res) => {
        try {
            AdminUpload(req, res, function (err, result) {
                if (err) {
                    console.log("rrr", err)
                    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
                } else {
                    const { name, email, phoneNumber } = req.body
                    const AdminData = AdminModel.findOne({ _id: req.params.adminId, status: "Active" }, { _id: 1, name: 1, email: 1, profilePic: 1, phoneNumber: 1 })
                    AdminData.exec((err, admin) => {
                        if (err || !admin) {
                            return res.status(400).json({ code: 400, message: "Admin not found" })
                        }
                        admin.name = name;
                        admin.email = email;
                        admin.phoneNumber = phoneNumber;
                        if (typeof req.file !== "undefined") {
                            const fileUrl = new URL(req.file.location);
                            const cdnUrl =  ENV.AWS_CDN_ENDPOINT + fileUrl.pathname;
                            admin.profilePic = cdnUrl;
                        }
                        admin.save()
                            .then(result => {
                                var resss = { AdminData: result }
                                Helper.response(res, 200, "User list fetched successfully", resss);
                            })
                    })
                }
            })
        } catch (err) {
            Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }

    },

    deleteAdmin: (req, res) => {
        try {
            const adminId = AdminModel.findOne({ _id: req.params.adminId })
            adminId.exec((err, admin) => {
                if (err || !admin) {
                    return res.status(400).json({ code: 400, message: "Admin not found" })
                }
                admin.status = "Delete"
                admin.save()
                    .then(result => {
                        Helper.response(res, 200, "Admin removed successfully");
                    })
            })
        } catch (err) {
            Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }
    },

    adminlist: (req, res) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            AdminModel.paginate({ status: { $ne: "Delete" } }, { page: page, limit: limit })
                .then((result) => {
                    var adminList = result.docs;
                    var totalResult = result.total;
                    if (adminList.length > 0) {
                        adminList.map(function (item) {
                            // if (item.profilePic) {
                            //   item.profilePic = process.env.SERVER_URL + "/uploads/" + item.profilePic;
                            // }
                        });

                        var resss = { adminList: adminList, totalResult: totalResult, limit: limit }
                        Helper.response(res, 200, "admin list fetched successfully", resss);
                        //return res.status(200).json({ code: 200, message: "admin list fetched successfully",resss })
                    } else {
                        Helper.response(res, 200, "admin list fetched successfully", { adminList: [] });
                    }
                })
        } catch (err) {
            Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }

    },

    //admin logout API
    "Logout": (req, res) => {
        try {
            var admin_id = req.admin._id
            AdminModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(admin_id) }, { $set: { token: "" } }, { new: true }).exec(function (err, adminResult) {
                if (err) {
                    Helper.response(res, 500, Messages.api.fail[LOCALE]);
                } else {
                    Helper.response(res, 200, "Logout successfully.");
                }
            });
        } catch (error) {
            Helper.response(res, 500, Messages.api.fail[LOCALE]);
        }
    }

}
