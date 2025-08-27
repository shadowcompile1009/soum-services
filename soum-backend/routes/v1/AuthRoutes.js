var express = require("express");
var router = express.Router();
var Middleware = require("../../middleware/auth");
const AuthController = require("../../controllers/Api/v1/AuthController");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 2, // limit each IP to 2 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  headers: true,
});

// router.post('/register', Middleware.without_login, AuthController.register);
router.post(
  "/complete-registration",
  Middleware.verifyToken,
  AuthController.FillUserInfo
);
// router.post('/check-mobile', Middleware.without_login, AuthController.CheckMobileNumber);
// router.post('/login', Middleware.without_login, limiter, AuthController.login);
// router.post('/send-otp', Middleware.without_login, limiter, AuthController.sendCodeDirectly);
// router.post('/otp_verify', Middleware.without_login, AuthController.otpVerify);
// router.post('/send_code', Middleware.without_login, limiter, AuthController.send_code);
// router.post('/resend_code', Middleware.without_login, limiter, AuthController.resend_code);
// router.post('/login-signup', Middleware.without_login, AuthController.loginOrSignup);

// router.post('/set_password', Middleware.verifyToken, AuthController.set_password);
// router.post('/reset_password', Middleware.verifyToken, AuthController.reset_password);
// router.post('/change_password', Middleware.verifyToken, AuthController.change_password);
// router.post('/forgot_password', Middleware.without_login, AuthController.forgot_password);
router.get("/logout", Middleware.verifyToken, AuthController.Logout);
//router.post('/login', AuthController.login)
module.exports = router;

// var express = require('express');
// var router = express.Router();
// //var Middleware = require('../middlewares/UserMiddleware');

// //Controllers
// var Brand = require('../../controllers/Api/v1/BrandController');

// /*routes*/
// router.get('/:category_id', Brand.AllBrandList);
// router.post('/', Brand.AddBrand);
// module.exports = router;
