import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthorizationService,
  ChangePassword
} from 'src/app/services/auth/authorization.service';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  newPassword: boolean;
  confirmPassword: boolean;
  oldPassword: boolean;

  constructor(
    private commonService: CommonService,
    private authService: AuthorizationService,
    private router: Router,
    private _location: Location
  ) {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      newPassword: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(5)])
      ),
      confirmPassword: new FormControl(
        '',
        Validators.compose([Validators.required])
      )
    });
  }

  ngOnInit(): void {
    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Change-password'
    };
    window['dataLayer'].push(productGTM);
  }

  goBack() {
    this._location.back();
  }

  showPassword(type: 'newPassword' | 'cPassword' | 'oldPassword') {
    switch (type) {
      case 'newPassword':
        this.newPassword = !this.newPassword;
        break;

      case 'cPassword':
        this.confirmPassword = !this.confirmPassword;
        break;

      case 'oldPassword':
        this.oldPassword = !this.oldPassword;
        break;
    }
  }

  changePassword() {
    this.commonService.presentSpinner();
    let payload = new ChangePassword(this.changePasswordForm.value);
    this.authService.changePassword(payload).subscribe(
      async (res) => {
        this.commonService.dismissSpinner();
        if (res) {
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
          this.router.navigate(['/profile']);
        }
      },
      (error) => {
        this.commonService.errorHandler(error, true);
      }
    );
  }
}
