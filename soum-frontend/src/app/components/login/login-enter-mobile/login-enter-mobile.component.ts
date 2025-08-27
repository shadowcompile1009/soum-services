import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { REGEX } from 'src/app/constants/regex.constants';
import { AuthorizationService } from 'src/app/services/auth/authorization.service';
import { CommonService } from 'src/app/services/common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-enter-mobile',
  templateUrl: './login-enter-mobile.component.html',
  styleUrls: ['./login-enter-mobile.component.scss']
})
export class LoginEnterMobileComponent implements OnInit {
  loginForm: FormGroup;
  countries: { name: string; iso2: string; dialCode: string }[];
  mobileNumberMaxLength = 11;
  value;
  constructor(
    private commonService: CommonService,
    private router: Router,
    private authService: AuthorizationService,
    public translate: TranslateService
  ) {
    this.countries = environment.countryCode;
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

  ngOnInit(): void {
    if (this.authService.loginForm) {
      this.loginForm.patchValue({
        mobileNumber: this.authService.loginForm
          ? this.authService?.loginForm?.value?.mobileNumber
          : ''
      });
    }

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
    if (
      this.loginForm.value.mobileNumber &&
      !this.loginForm.value.mobileNumber.startsWith('02')
    ) {
      this.loginForm.value.mobileNumber =
        this.loginForm.value.mobileNumber.replace(/^0+/, '');
    }

    enteredNumber = this.authService.validateRegisterNumber(
      this.loginForm.value.mobileNumber
    );

    this.authService
      .validaMobileNumber(enteredNumber.code, enteredNumber.number)
      .subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          if (res) {
            this.authService.loginForm = this.loginForm;
            this.router.navigate(['/login/verify-user']);
          }
        },
        (error) => {
          this.commonService.errorHandler(error, true);
        }
      );
  }

  goBack() {
    this.authService.loginForm = null;
    this.router.navigate(['/login/continue']);
  }

  submitOnEnter(event) {
    if (event.keyCode === 13) {
      this.navigateToEnterPassword(event);
    }
  }
}
