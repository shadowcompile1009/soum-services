import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { endpoint } from 'src/app/constants/endpoint';
import { router } from 'src/app/constants/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common/common.service';
import { StorageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  QrCodeForm: FormGroup;
  QrCode: string;
  show2FA: boolean;
  show2FAQrCode: boolean;
  @ViewChild('ngOtpInput') ngOtpInputRef: any;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private storage: StorageService,
    private apiService: ApiService
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.compose([Validators.required])),
      password: new FormControl('', Validators.compose([Validators.required]))
    });

    this.QrCodeForm = new FormGroup({
      mfaCode: new FormControl('', Validators.compose([Validators.required])),
      userId: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  ngOnInit(): void {
  }

  login() {
    this.commonService.presentSpinner();
    let obj = {
      "username": this.loginForm.value.username,
      "password": this.loginForm.value.password,
    }

    this.apiService.secondEnvpostApi(endpoint.twoFALogin, obj, 1).subscribe(res => {
      this.show2FA = true;
      this.QrCodeForm.patchValue({ userId: res.body.responseData.userId })
      if (res && res.body.responseData && !res.body.responseData.isMFAEnabled) {
        this.getNewQrCode();
        this.show2FAQrCode = true;
      } else {
        this.show2FAQrCode = false;
      }

      this.commonService.dismissSpinner();
    }, (error) => {
      this.commonService.errorToast(error.error.message)
    });
  }

  onOtpChange(event) {

    if (event.length === 6) {
      this.commonService.presentSpinner();
      this.QrCodeForm.patchValue({ mfaCode: event });
      const url = this.show2FAQrCode ? endpoint.verifyEnableMfa : endpoint.loginEnableMfa;
      this.apiService.secondEnvpostApi(url, this.QrCodeForm.value, 1).subscribe(res => {
        if (res && res.body && res.body.responseData) {
          if (this.show2FAQrCode) {
            this.commonService.successToaster('QrCode Scanned Successfully');
            this.reloadCurrentPage();
          } else {
            this.commonService.successToaster(res.body.message);
            this.storage.set(StorageKeys.loginDetails, res.body.responseData);
            this.storage.set(StorageKeys.token, res.body.responseData.token);
            this.router.navigate([router.systemSetting]);
          }
        }
        this.commonService.dismissSpinner();
      }, (error) => {
        this.ngOtpInputRef.setValue('');
        this.commonService.errorToast(error.error.message)
      });
    }

  }

  getNewQrCode() {
    this.commonService.presentSpinner();
    let obj = {
      "userId": this.QrCodeForm.value.userId,
    }
    this.apiService.putSecondApi(endpoint.getTwoFAQrCode, obj, 1).subscribe(res => {
      if (res && res.body.responseData) {
        this.QrCode = res.body.responseData.qrCode;
      }
      this.commonService.dismissSpinner();
    }, (error) => {
      this.commonService.errorToast(error.error.message)
    });
  }

  reloadCurrentPage() {
    window.location.reload();
  }

}
