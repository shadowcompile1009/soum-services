import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthorizationService,
  ResetPassword
} from 'src/app/services/auth/authorization.service';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  password: boolean;
  confirmPassword: boolean;

  constructor(
    private authService: AuthorizationService,
    private commonService: CommonService,
    private router: Router,
    private _location: Location
  ) {
    this.resetPasswordForm = new FormGroup({
      // newPassword: new FormControl('', Validators.compose([Validators.required, Validators.pattern(REGEX.password)])),
      newPassword: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(5)])
      ),
      confirmPassword: new FormControl(
        '',
        Validators.compose([Validators.required])
      )
    });
    if (!authService.token) {
      //write your code here
    }
  }

  ngOnInit(): void {
    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Rest-password'
    };
    window['dataLayer'].push(productGTM);
  }

  showPassword(type: 'password' | 'cPassword') {
    switch (type) {
      case 'password':
        this.password = !this.password;
        break;

      case 'cPassword':
        this.confirmPassword = !this.confirmPassword;
        break;
    }
  }

  resetPassword() {
    this.commonService.presentSpinner();
    let payload = new ResetPassword(this.resetPasswordForm.value);
    this.authService.resetPassword(payload).subscribe(
      async (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.authService.token = '';
          this.commonService.presentAlert({
            header: await this.commonService.getTranslatedString(
              'alertPopUpTexts.congratulations'
            ),
            message: res.message,
            button1: {
              text: await this.commonService.getTranslatedString(
                'alertPopUpTexts.ok'
              ),
              handler: () => {
                return true;
              }
            }
          });
          this.router.navigate(['/login/enter-mobile']);
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  back() {
    this._location.back();
  }
}
