import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common/common.service';
import { StorageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { REGEX } from 'src/app/constants/regex';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  payload;
  token;
  constructor(
    private router: Router,
    private commonService: CommonService,
    private translate: TranslateService,
    private storage: StorageService,
    private apiService: ApiService
  ) {
    this.changePasswordForm = new FormGroup({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(REGEX.email),
        ])
      ),
      newPassword: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(16),
        ])
      ),
      code: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(6)])
      ),
      confirmPassword: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });
  }

  ngOnInit(): void {}
  getCode() {
    let emailpayload = new EmailPayload(this.changePasswordForm.value);
    this.commonService.presentSpinner();
    this.apiService.postApi(endpoint.forgetPassword, emailpayload, 1).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
        

          this.token = res.body.url.substring(
            res.body.url.indexOf('=') + 1
          );
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.changePasswordForm.reset();
        this.commonService.errorHandler(error);
      }
    );
  }

  changePassword() {
    this.commonService.presentSpinner();
    this.payload = new ChangePassword(this.changePasswordForm.value);
    this.payload.token = this.token;
    this.apiService.postApi(endpoint.resetPassword, this.payload, 1).subscribe(
      (res) => {
        this.changePasswordForm.reset();
        this.commonService.successToaster(res.body.message);
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.changePasswordForm.reset();
        this.commonService.errorHandler(error);
      }
    );
  }
}

export class ChangePassword {
  newPassword: string;
  code: string;
  token: string;
  confirmPassword: string;

  constructor(payload: {
    token: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    if (payload) {
      this.code = payload.code;
      this.token = payload.token;
      this.newPassword = payload.newPassword;
      this.confirmPassword = payload.confirmPassword;
    }
  }
}
export class EmailPayload {
  email: string;

  constructor(payload: { email: string }) {
    if (payload) {
      this.email = payload.email;
    }
  }
}
