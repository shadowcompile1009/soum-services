import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from 'ng-otp-input/lib/models/config';

import {
  AuthorizationService,
  SendOtp,
  VerifyOtp
} from 'src/app/services/auth/authorization.service';
import { CommonService } from 'src/app/services/common/common.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { CountdownConfig } from 'ngx-countdown';
import { MatDialog } from '@angular/material/dialog';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';
@Component({
  selector: 'app-login-enter-password',
  templateUrl: './login-enter-password.component.html',
  styleUrls: ['./login-enter-password.component.scss']
})
export class LoginEnterPasswordComponent implements OnInit {
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

  sharingServ: SharingDataService;
  translate: TranslateService;
  profileService: ProfileService;
  storage: StorageService;
  commonService: CommonService;

  constructor(
    private _location: Location,
    private authService: AuthorizationService,
    private router: Router,
    public dialog: MatDialog,
    private injector: Injector
    
  ) { 
 
    this.sharingServ =
      this.injector.get<SharingDataService>(SharingDataService);
    this.translate = this.injector.get<TranslateService>(TranslateService);
    this.profileService = this.injector.get<ProfileService>(ProfileService);
    this.storage = this.injector.get<StorageService>(StorageService);
    this.commonService = this.injector.get<CommonService>(CommonService);
  }

  ngOnInit(): void {

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Login'
    };
    window['dataLayer'].push(productGTM);
    clearTimeout(this.commonService.referralTimer);

    let enteredNumber = null;
    enteredNumber = this.authService.validateRegisterNumber(
    this.authService?.loginForm?.value?.mobileNumber
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
    let enteredNumber = null;
    enteredNumber = this.authService.validateRegisterNumber(
      this.authService?.loginForm?.value?.mobileNumber
    );
    if (this.authService.loginForm) {
      if (this.forgotPassword) {
        payload = new SendOtp({
          countryCode: enteredNumber.code,
          mobileNumber: enteredNumber.number
        });
      } else {
        payload = new SendOtp({
          countryCode: enteredNumber.code,
          mobileNumber: enteredNumber.number
        });
      }
    }
    this.otp1 = this.otp2 = this.otp3 = this.otp4 = this.otp5 = this.otp6 = '';
    this.authService.resendOtp(payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
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
    let enteredSignNumber = null;
    enteredSignNumber = this.authService.validateRegisterNumber(
      this.authService?.loginForm?.value?.mobileNumber
    );
    if (this.forgotPassword) {
      payload = new VerifyOtp({
        countryCode: enteredSignNumber.code,
        mobileNumber: enteredSignNumber.number,
        otp: this.otp
      });
    } else {
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
            this.router.navigate(['/products']);
          } else {
            let userData = {
              token: res.UserData.token,
              userId: res.UserData._id,
              name: res.UserData.name,
              mobileNumber: res.UserData.mobileNumber,
              countryCode: enteredSignNumber.code,
              address: JSON.stringify(res.UserData.address)
            };

            this.sharingServ.userData.next(userData);
            this.authService.token = res.UserData.token;
            this.storage.set(storageKeys.userDetails, userData);
            window['dataLayer'] = window['dataLayer'] || [];
            window['dataLayer'].push({
              event: 'authentication',
              userId: userData.userId,
              authType: 'SignIn'
            });
            this.initializeApp();

            let previousLocation = sessionStorage.getItem('redirectURL');
            if (!previousLocation) {
              this.router.navigate(['/products']);
            } else {
              this.router.navigateByUrl(previousLocation);
              sessionStorage.removeItem('redirectURL');
            }
            this.commonService.ReferralPopupAppearance();
            this.commonService.downloadAppAppearance();
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

  initializeApp() {
    this.commonService.getSystemConfiguration().then((res) => {
      if (res) {
        document.documentElement.style.setProperty(
          '--primary-color',
          `#${res.theme_color}`
        );
      } else {
        document.documentElement.style.setProperty(
          '--primary-color',
          `#01b9ff`
        );
      }
    });
    const savedData = this.storage.getSavedData();
    if (savedData[storageKeys.userDetails]) {
      this.profileService.getProfileData();
      this.profileService.checkUserPrefernences();
      this.profileService.getNewUserAddress();

      this.commonService.isLoggedIn = true;
    } else {
      this.commonService.isLoggedIn = false;
    }
  }

  actionIfLoginRequested(res: any) {
    if (this.commonService.loginRequested.extras) {
      if (
        this.commonService.loginRequested.extras.state &&
        this.commonService.loginRequested.extras.state.user_id == res.userId &&
        this.commonService.loginRequested.extras.state.type == 'bid'
      ) {
        this.commonService.showPopUpForYourProduct('cannotBid');
        this.router.navigate(['/profile']);
        this.commonService.loginRequested = null;
        return;
      }
      const savedData = this.storage.getSavedData();
      if (savedData[storageKeys.productToBuy]) {
        if (savedData[storageKeys.productToBuy].user_id == res.userId) {
          this.commonService.showPopUpForYourProduct('cannotBuy');
          this.router.navigate(['/profile']);
          this.commonService.loginRequested = null;
          this.storage.removeItem(storageKeys.productToBuy);
          return;
        }
      }
    }
    this.router
      .navigate(
        this.commonService.loginRequested.commands,
        this.commonService.loginRequested.extras
      )
      .then(() => {
        this.commonService.loginRequested = null;
      });
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
}
