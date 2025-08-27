import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { REGEX } from 'src/app/constants/regex.constants';
import {
  AuthorizationService,
  SendOtp
} from 'src/app/services/auth/authorization.service';
import { CommonService } from 'src/app/services/common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  countries: { name: string; iso2: string; dialCode: string }[];
  mobileNumberMaxLength = 10;

  constructor(
    private authService: AuthorizationService,
    private commonService: CommonService,
    private router: Router,
    private _location: Location
  ) {
    this.countries = environment.countryCode;
    this.forgotPasswordForm = new FormGroup({
      mobileNumber: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(REGEX.saudiMobile)
        ])
      )
    });
  }

  ngOnInit(): void {
    if (this.authService.loginForm) {
      this.forgotPasswordForm.patchValue({
        countryCode: this.authService?.loginForm?.value?.countryCode,
        mobileNumber: this.authService?.loginForm?.value?.mobileNumber
      });
    }

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'forgot-password'
    };
    window['dataLayer'].push(productGTM);
  }

  forgotPassword() {
    this.commonService.presentSpinner();
    this.forgotPasswordForm.value.mobileNumber =
      this.forgotPasswordForm.value.mobileNumber.toString().replace(/^0+/, '');
    let payload = new SendOtp({
      mobileNumber: this.forgotPasswordForm.value.mobileNumber,
      countryCode: '966'
    });
    this.authService.forgotPassword(payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.authService.forgotPasswordForm = this.forgotPasswordForm;
          this.router.navigate(['/verify-mobile'], {
            queryParams: { type: 'forgot-password' }
          });
        }
      },
      (error) => {
        this.commonService.errorHandler(error, true);
      }
    );
  }

  back() {
    this.authService.forgotPasswordForm = null;
    this._location.back();
  }
}
