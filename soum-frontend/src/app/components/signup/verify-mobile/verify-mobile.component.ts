import { Location } from '@angular/common';
import { Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Config } from 'ng-otp-input/lib/models/config';
import { CountdownConfig } from 'ngx-countdown';
import { Subscription } from 'rxjs';
import {
  AuthorizationService,
  SendOtp,
  VerifyOtp
} from 'src/app/services/auth/authorization.service';
import { CommonService } from 'src/app/services/common/common.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';

@Component({
  selector: 'app-verify-mobile',
  templateUrl: './verify-mobile.component.html',
  styleUrls: ['./verify-mobile.component.scss']
})
export class VerifyMobileComponent {
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  otp: any;
  otp1;
  otp2;
  otp3;
  otp4;
  otp5;
  otp6;
  config: Config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '0'
  };
  forgotPassword: boolean;
  disableResendCode = true;
  configCountdown: CountdownConfig = {
    leftTime: 90,
    formatDate: ({ date }) => `${date / 1000}`
  };
  subscriptions: Subscription[] = [];

  sharingServ: SharingDataService;
  translate: TranslateService;
  storage: StorageService;
  commonService: CommonService;
  authService: AuthorizationService;

  constructor(
    private _location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private injector: Injector
  ) {
    this.sharingServ =
      this.injector.get<SharingDataService>(SharingDataService);
    this.translate = this.injector.get<TranslateService>(TranslateService);
    this.storage = this.injector.get<StorageService>(StorageService);
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.authService =
      this.injector.get<AuthorizationService>(AuthorizationService);

    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe((params) => {
        if (params && params.type && params.type == 'forgot-password') {
          if (this.authService.forgotPasswordForm) {
            this.forgotPassword = true;
          } else {
            this.router.navigate(['/login/continue']);
          }
        } else {
          this.forgotPassword = false;
          if (!this.authService.signupForm) {
            this.router.navigate(['/login/continue']);
          }
        }
      })
    );
  }

  onOtpChange(event: any) {
    this.otp = event;
  }

  resendOtp() {
    if (this.disableResendCode) {
      return;
    }
    this.commonService.presentSpinner();
    let payload = new SendOtp({
      countryCode: '',
      mobileNumber: ''
    });
    let enteredNumber,
      enteredSignNumber = null;
    if (this.forgotPassword) {
      enteredNumber = this.authService.validateRegisterNumber(
        this.authService.forgotPasswordForm.value.mobileNumber
      );
      payload = new SendOtp({
        countryCode: enteredNumber.code,
        mobileNumber: enteredNumber.number
      });
    } else {
      enteredSignNumber = this.authService.validateRegisterNumber(
        this.authService.signupForm.value.mobileNumber
      );
      payload = new SendOtp({
        countryCode: enteredSignNumber.code,
        mobileNumber: enteredSignNumber.number
      });
    }
    this.otp1 = this.otp2 = this.otp3 = this.otp4 = this.otp5 = this.otp6 = '';
    this.authService.resendOtp(payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          //write your code here
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  goBack() {
    this._location.back();
  }

  getOTP(num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }
  verifyOtpAndContinue() {
    this.otp =
      this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6;
    this.otp = this.getOTP(this.otp, 6);
    this.commonService.presentSpinner();
    let payload = new VerifyOtp({
      countryCode: '',
      mobileNumber: '',
      otp: this.otp
    });
    let enteredNumber,
      enteredSignNumber = null;
    if (this.forgotPassword) {
      enteredNumber = this.authService.validateRegisterNumber(
        this.authService.forgotPasswordForm.value.mobileNumber
      );
      payload = new VerifyOtp({
        countryCode: enteredNumber.code,
        mobileNumber: enteredNumber.number,
        otp: this.otp
      });
    } else {
      enteredSignNumber = this.authService.validateRegisterNumber(
        this.authService.signupForm.value.mobileNumber
      );
      payload = new VerifyOtp({
        countryCode: enteredSignNumber.code,
        mobileNumber: enteredSignNumber.number,
        otp: this.otp
      });
    }
    this.authService.verifyOtp(payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          if (this.forgotPassword) {
            this.authService.token = res.UserData.token;
            this.router.navigate(['/reset-password']);
          } else {
            let enteredNumber = null;
            enteredNumber = this.authService.validateRegisterNumber(
              res.UserData.mobileNumber
            );
            let userData = {
              token: res.UserData.token,
              userId: res.UserData._id,
              mobileNumber: enteredNumber.number,
              countryCode: enteredNumber.code
            };
            this.sharingServ.userData.next(userData);
            this.storage.set(storageKeys.userDetails, userData);
            window['dataLayer'] = window['dataLayer'] || [];
            window['dataLayer'].push({
              event: 'authentication',
              userId: userData.userId,
              authType: 'Signup'
            });
            this.router.navigate(['/signup/password']);
          }
        } else {
          this.otp1 =
            this.otp2 =
            this.otp3 =
            this.otp4 =
            this.otp5 =
            this.otp6 =
              '';
        }
      },
      (error) => {
        this.commonService.errorHandler(error, true);
      }
    );
  }
  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  checkOtpInputs(event: any, previousElement: any, nextElement: any) {
    if (
      !this.otp1 ||
      !this.otp2 ||
      !this.otp3 ||
      !this.otp4 ||
      !this.otp5 ||
      !this.otp6
    ) {
      if (event.code !== 'Backspace' && nextElement !== null) {
        nextElement.focus();
      }

      if (event.code === 'Backspace' && previousElement !== null) {
        previousElement.focus();
        previousElement.value = '';
      }
    } else {
      this.verifyOtpAndContinue();
    }
  }
  handleTimer(event) {
    if (event && event.action === 'done') {
      this.disableResendCode = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
