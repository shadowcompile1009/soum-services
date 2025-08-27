import { Location } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { REGEX } from 'src/app/constants/regex.constants';
import {
  AuthorizationService,
  SetPassword
} from 'src/app/services/auth/authorization.service';
import { CommonService } from 'src/app/services/common/common.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import firebase from 'firebase';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';

@Component({
  selector: 'app-signup-password',
  templateUrl: './signup-password.component.html',
  styleUrls: ['./signup-password.component.scss']
})
export class SignupPasswordComponent implements OnInit {
  password: boolean;
  confirmPassword: boolean;
  signupForm: FormGroup = new FormGroup({
    countryCode: new FormControl(
      '966',
      Validators.compose([Validators.required])
    ),
    mobileNumber: new FormControl(
      '',
      Validators.compose([Validators.required])
    ),
    name: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern(REGEX.name)])
    )
  });

  constructor(
    private authSerivce: AuthorizationService,
    private commonService: CommonService,
    private router: Router,
    private zone: NgZone,
    private _location: Location,
    private storage: StorageService,
    private sharingServ: SharingDataService
  ) {
    this.zone.run(() => {
      if (this.authSerivce.signupForm) {
        this.signupForm = new FormGroup({
          countryCode: new FormControl(
            '966',
            Validators.compose([Validators.required])
          ),
          mobileNumber: new FormControl(
            '',
            Validators.compose([Validators.required])
          ),
          name: new FormControl(
            '',
            Validators.compose([
              Validators.required,
              Validators.pattern(REGEX.name)
            ])
          )
        });
        this.signupForm.patchValue(authSerivce.signupForm.value);
      } else {
        this.router.navigate(['/login/continue']);
      }
    });
  }

  ngOnInit(): void {
    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Signup'
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

  goBack() {
    this._location.back();
  }

  doSignup() {
    this.commonService.presentSpinner();
    const payload = new SetPassword({
      name: this.signupForm.value.name,
      password: this.signupForm.value.password
    });
    this.authSerivce.setPassword(payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          // No need for checking here.
          const savedData = this.storage.getSavedData(); // It would be bettrer to specify the type of SaveData
          let userData = savedData[storageKeys.userDetails];
          userData.name = this.signupForm.value.name;
          this.sharingServ.userData.next(userData);
          this.storage.set(storageKeys.userDetails, userData);
          this.commonService.isLoggedIn = true;

          // User registered successfully, the evant is lunched.
          firebase.analytics().logEvent('user_registeres');
          // Event Ends

          if (this.commonService.loginRequested) {
            if (this.commonService.loginRequested.extras) {
              if (
                this.commonService.loginRequested.extras.state &&
                this.commonService.loginRequested.extras.state.user_id ==
                  res.userId &&
                this.commonService.loginRequested.extras.state.type == 'bid'
              ) {
                this.commonService.showPopUpForYourProduct('cannotBid');
                this.router.navigate(['/successfully/registered']);
                this.commonService.loginRequested = null;
                return;
              }
              const saved_Data = this.storage.getSavedData();
              if (saved_Data[storageKeys.productToBuy]) {
                if (
                  saved_Data[storageKeys.productToBuy].user_id == res.userId
                ) {
                  this.commonService.showPopUpForYourProduct('cannotBuy');
                  this.router.navigate(['/successfully/registered']);
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
          } else {
            this.router.navigate(['/successfully/registered']);
          }
          this.authSerivce.signupForm = null;
          this.authSerivce.loginForm = null;
          this.authSerivce.forgotPasswordForm = null;
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }
}
