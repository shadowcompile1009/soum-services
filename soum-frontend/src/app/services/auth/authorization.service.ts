import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { REGEX } from 'src/app/constants/regex.constants';
import { CommonService } from '../common/common.service';
import { ApiEndpoints } from '../core/http-wrapper/api-endpoints.constant';
import {
  HttpInputData,
  HttpWrapperService
} from '../core/http-wrapper/http-wrapper.service';
import { storageKeys } from '../core/storage/storage-keys';
import { StorageService } from '../core/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  loginForm: any;
  signupForm: any;
  token: string;
  forgotPasswordForm: any;

  constructor(
    private httpWrapper: HttpWrapperService,
    private commonService: CommonService,
    private storage: StorageService,
    private router  : Router
  ) {}

  async login(payload: LoginPayload) {
    return this.httpWrapper
      .post(ApiEndpoints.login, payload)
      .pipe(
        map((res) => {
          if (res) {
            this.handleLogin(res.UserData);
            return res.UserData;
          }
        })
      )
      .toPromise()
      .catch((error) => {
        this.commonService.isLoggedIn = false;
        this.commonService.errorHandler(error, true);
      });
  }

  handleLogin(userData: any) {
    this.storage.set(storageKeys.userDetails, userData);
    this.commonService.isLoggedIn = true;
  }

  sendOtp(payload: SendOtp) {
    return this.httpWrapper.post(ApiEndpoints.sendOtp, payload);
  }

  resendOtp(payload: SendOtp) {
    return this.httpWrapper.post(ApiEndpoints.resendOtp, payload);
  }

  verifyOtp(payload: VerifyOtp) {
    return this.httpWrapper.post(ApiEndpoints.verifyOtp, payload);
  }

  setPassword(payload: SetPassword) {
    return this.httpWrapper.post(ApiEndpoints.setPassword, payload);
  }

  // FORGOT PASSWORD FLOW

  forgotPassword(payload: SendOtp) {
    return this.httpWrapper.post(ApiEndpoints.forgotPassword, payload);
  }

  resetPassword(payload: ResetPassword) {
    const httpInput = new HttpInputData();
    let httpHeader = new HttpHeaders();
    httpHeader = httpHeader.set('token', this.token);
    httpInput.headers = httpHeader;
    return this.httpWrapper.post(
      ApiEndpoints.resetPassword,
      payload,
      httpInput
    );
  }

  changePassword(payload: ChangePassword) {
    return this.httpWrapper.post(ApiEndpoints.changePassword, payload);
  }

  validaMobileNumber(countryCode: string, mobileNumber: string) {
    return this.httpWrapper.post(ApiEndpoints.validateMobileNumber, {
      countryCode: countryCode,
      mobileNumber: mobileNumber.toString()
    });
  }

  validateLoginSignup(countryCode: string, mobileNumber: string) {
    return this.httpWrapper.post(ApiEndpoints.signInUpOtp, {
      countryCode: countryCode,
      mobileNumber: mobileNumber.toString()
    });
  }

  verifyLoginSignupOtp(payload: VerifyOtp) {
    return this.httpWrapper.post(ApiEndpoints.login_signup, payload);
  }

  validateRegisterNumber(mobileNumber: string) {
    if(mobileNumber){
    let countryCode = null;
    if (
      mobileNumber.match(REGEX.saudiMobile) ||
      mobileNumber.match(REGEX.devMobile)
    ) {
      countryCode = { code: '966', number: mobileNumber };
    }
    if (!countryCode) {
      const countryCodeLength =
        mobileNumber.length - (mobileNumber.startsWith('02') ? 11 : 9);
      // countryCode = mobileNumber.substr(0, countryCodeLength)
      countryCode = {
        code: mobileNumber.substr(0, countryCodeLength),
        number: mobileNumber.substr(2, mobileNumber.length)
      };
    }
    return countryCode;
  }

else{
  this.router.navigate(['/products'])
}
}
}
export class LoginPayload {
  countryCode: string;
  mobileNumber: string = '';
  password: string = '';
  constructor(payload: {
    countryCode: any;
    mobileNumber: string;
    password: string;
  }) {
    (this.countryCode = payload.countryCode.code),
      (this.mobileNumber = payload.mobileNumber.toString() || '');
    this.password = payload.password || '';
  }
}

export class SendOtp {
  countryCode: string;
  mobileNumber: string;
  constructor(payload: { countryCode: string; mobileNumber: string }) {
    this.countryCode = payload.countryCode;
    this.mobileNumber = payload.mobileNumber.toString();
  }
}

export class VerifyOtp {
  countryCode: string;
  mobileNumber: string;
  otp: string;

  constructor(payload: {
    countryCode: any;
    mobileNumber: string;
    otp: string;
  }) {
    this.countryCode = payload.countryCode;
    this.mobileNumber = payload.mobileNumber.toString();
    this.otp = payload.otp;
  }
}

export class SetPassword {
  name: string;
  password: string;

  constructor(payload: { name: string; password: string }) {
    this.name = payload.name;
    this.password = payload.password;
  }
}

export class ResetPassword {
  newPassword: string;
  confirmPassword: string;

  constructor(payload: { newPassword: string; confirmPassword: string }) {
    this.newPassword = payload.newPassword;
    this.confirmPassword = payload.confirmPassword;
  }
}

export class ChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;

  constructor(payload: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    this.oldPassword = payload.oldPassword;
    this.newPassword = payload.newPassword;
    this.confirmPassword = payload.confirmPassword;
  }
}
