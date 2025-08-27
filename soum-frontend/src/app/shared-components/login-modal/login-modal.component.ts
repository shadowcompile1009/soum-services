import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CountdownConfig } from 'ngx-countdown';
import { Subscription } from 'rxjs';
import { REGEX } from 'src/app/constants/regex.constants';
import {
  AuthorizationService,
  SendOtp,
  VerifyOtp
} from 'src/app/services/auth/authorization.service';
import { CommonService } from 'src/app/services/common/common.service';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  otp;
  otp1;
  otp2;
  otp3;
  otp4;
  otp5;
  otp6;
  formValue;
  showModal = true;
  loginForm: FormGroup;
  forgotPassword: boolean;
  disableResendCode = true;
  mobileNumberMaxLength = 11;
  showOtpSection: boolean = false;
  subscriptions: Subscription[] = [];
  @Output() closeModal = new EventEmitter();
  @Output() loggedIn = new EventEmitter();

  configCountdown: CountdownConfig = {
    leftTime: 90,
    formatDate: ({ date }) => `${date / 1000}`
  };

  constructor(
    private router: Router,
    private storage: StorageService,
    private commonService: CommonService,
    private eventService: EventsService,
    private authService: AuthorizationService,
    private sharingService: SharingDataService,
    public translate: TranslateService
  ) {}
  triggerOpenModalEvent() {
    this.subscriptions.push(
      this.eventService.subscribe(EventsKey.openLoginModal, (data: any) => {
        console.log(data);
      })
    );
  }

  ngOnInit(): void {
    this.initializeForm();
    this.triggerOpenModalEvent();
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      mobileNumber: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(REGEX.saudiMobile)
        ])
      )
    });

    this.loginForm.controls['mobileNumber'].valueChanges.subscribe(
      (event: string) => {
        if (event == '' || event == null || event == undefined) {
          //write your code here
        } else {
          if (event && (event + '').startsWith('02')) {
            this.loginForm.controls['mobileNumber'].setValidators([
              Validators.required,
              Validators.pattern(REGEX.egyptianMobile)
            ]);
            this.mobileNumberMaxLength = 13;
          } else if (event && (event + '').startsWith('84')) {
            this.loginForm.controls['mobileNumber'].setValidators([
              Validators.required,
              Validators.pattern(REGEX.vietnamMobile)
            ]);
            this.mobileNumberMaxLength = 11;
          } else if (event && (event + '').startsWith('94')) {
            this.loginForm.controls['mobileNumber'].setValidators([
              Validators.required,
              Validators.pattern(REGEX.sirlankaMobile)
            ]);
            this.mobileNumberMaxLength = 11;
          } else if (event && (event + '').startsWith('1')) {
            this.loginForm.controls['mobileNumber'].setValidators([
              Validators.required,
              Validators.pattern(REGEX.devMobile)
            ]);
            this.mobileNumberMaxLength = 11;
          } else {
            this.loginForm.controls['mobileNumber'].setValidators([
              Validators.required,
              Validators.pattern(REGEX.saudiMobile)
            ]);
            this.mobileNumberMaxLength = 10;
          }
        }
      }
    );
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
    this.commonService.dismissSpinner();
    if (this.forgotPassword) {
      // enteredNumber = this.authService.validateRegisterNumber(this.authService.forgotPasswordForm.value.mobileNumber);
      // payload = new VerifyOtp({
      //   countryCode: enteredNumber.code,
      //   mobileNumber: enteredNumber.number,
      //   otp: this.otp,
      // });
    } else {
      enteredSignNumber = this.authService.validateRegisterNumber(
        this.authService.loginForm.value.mobileNumber
      );
      payload = new VerifyOtp({
        countryCode: enteredSignNumber.code,
        mobileNumber: enteredSignNumber.number,
        otp: this.otp
      });
    }
    this.authService.verifyLoginSignupOtp(payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          if (this.forgotPassword) {
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
            this.sharingService.userData.next(userData);
            this.storage.set(storageKeys.userDetails, userData);
            window['dataLayer'] = window['dataLayer'] || [];
            window['dataLayer'].push({
              event: 'authentication',
              userId: userData.userId,
              authType: 'Signup'
            });
            this.showModal = false;
            this.loggedIn.emit();
            // window.location.reload();
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

  navigateToEnterPassword(event) {
    event.preventDefault();
    this.commonService.presentSpinner();
    let enteredNumber = null;

    enteredNumber = this.authService.validateRegisterNumber(
      this.loginForm.value.mobileNumber
    );
    this.authService
      .validateLoginSignup(enteredNumber.code, enteredNumber.number)
      .subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          if (res) {
            this.showOtpSection = true;
            this.authService.loginForm = this.loginForm;
          }
        },
        (error) => {
          this.commonService.errorHandler(error, true);
        }
      );
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

  navigateTo(route: string) {
    if (route === '/select-devices') {
      const savedData = this.storage.getSavedData();
      if (
        savedData &&
        savedData[storageKeys.userDetails] &&
        this.commonService.isLoggedIn
      ) {
        this.router.navigate([route]);
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/products']);
    }
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
    // if (this.forgotPassword) {
    //   enteredNumber = this.authService.validateRegisterNumber(this.authService.forgotPasswordForm.value.mobileNumber);
    //   payload = new SendOtp({
    //     countryCode: enteredNumber.code,
    //     mobileNumber: enteredNumber.number,
    //   });
    // } else {
    //   enteredSignNumber = this.authService.validateRegisterNumber(this.authService.signupForm.value.mobileNumber);
    //   payload = new SendOtp({
    //     countryCode: enteredSignNumber.code,
    //     mobileNumber: enteredSignNumber.number,
    //   });
    // }
    this.otp1 = this.otp2 = this.otp3 = this.otp4 = this.otp5 = this.otp6 = '';
    this.showModal = false;
    // this.authService.resendOtp(payload).subscribe((res) => {
    //   this.commonService.dismissSpinner();
    //   if (res) {
    //     //write your code here
    //   }
    // }, error => {this.commonService.errorHandler(error);});
  }

  handleTimer(event) {
    if (event && event.action === 'done') {
      this.disableResendCode = false;
    }
  }

  hideBidModal() {
    this.showModal = false;
    this.closeModal.emit();
  }

  submitOnEnter(event) {
    if (event.keyCode === 13) {
      this.navigateToEnterPassword(event);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
