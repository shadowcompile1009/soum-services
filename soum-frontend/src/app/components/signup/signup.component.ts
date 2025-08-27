import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { REGEX } from 'src/app/constants/regex.constants';
import {
  AuthorizationService,
  SendOtp
} from 'src/app/services/auth/authorization.service';
import { CommonService } from 'src/app/services/common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  value;
  countries: { name: string; iso2: string; dialCode: string }[];
  mobileNumberMaxLength = 11;

  constructor(
    private authSerivce: AuthorizationService,
    private router: Router,
    private commonService: CommonService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.countries = environment.countryCode;
    this.signupForm = new FormGroup({
      // countryCode: new FormControl(this.countries[0].dialCode, Validators.compose([Validators.required])),
      mobileNumber: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(REGEX.saudiMobile)
        ])
      ),
      name: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(REGEX.name)
        ])
      ),
      // password: new FormControl('', Validators.compose([Validators.required, Validators.pattern(REGEX.password)])),
      password: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(5)])
      ),
      confirmPassword: new FormControl(
        '',
        Validators.compose([Validators.required])
      )
    });

    this.signupForm.controls['mobileNumber'].valueChanges.subscribe(
      (event: string) => {
        if (event && (event + '').startsWith('02')) {
          this.signupForm.controls['mobileNumber'].setValidators([
            Validators.required,
            Validators.pattern(REGEX.egyptianMobile)
          ]);
          this.mobileNumberMaxLength = 13;
        } else if (event && (event + '').startsWith('84')) {
          this.signupForm.controls['mobileNumber'].setValidators([
            Validators.required,
            Validators.pattern(REGEX.vietnamMobile)
          ]);
          this.mobileNumberMaxLength = 11;
        } else if (event && (event + '').startsWith('94')) {
          this.signupForm.controls['mobileNumber'].setValidators([
            Validators.required,
            Validators.pattern(REGEX.sirlankaMobile)
          ]);
          this.mobileNumberMaxLength = 11;
        } else if (event && (event + '').startsWith('1')) {
          this.signupForm.controls['mobileNumber'].setValidators([
            Validators.required,
            Validators.pattern(REGEX.devMobile)
          ]);
          this.mobileNumberMaxLength = 11;
        } else {
          this.signupForm.controls['mobileNumber'].setValidators([
            Validators.required,
            Validators.pattern(REGEX.saudiMobile)
          ]);
          this.mobileNumberMaxLength = 11;
        }
      }
    );

    if (this.authSerivce.signupForm) {
      this.signupForm.patchValue({
        mobileNumber: this.authSerivce.signupForm
          ? this.authSerivce.signupForm.value.mobileNumber
          : ''
      });
    }

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

  proceedToMobileVerify() {
    this.commonService.presentSpinner();
    let enteredNumber;
    if (
      this.signupForm.value.mobileNumber &&
      !this.signupForm.value.mobileNumber.startsWith('02')
    ) {
      this.signupForm.value.mobileNumber =
        this.signupForm.value.mobileNumber.replace(/^0+/, '');
    }
    enteredNumber = this.authSerivce.validateRegisterNumber(
      this.signupForm.value.mobileNumber
    );

    const payload = new SendOtp({
      countryCode: enteredNumber.code,
      mobileNumber: enteredNumber.number
    });
    this.authSerivce.sendOtp(payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.authSerivce.signupForm = this.signupForm;
          this.router.navigate(['/verify-mobile']);
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

  goBack() {
    this.authSerivce.signupForm = null;
    this.router.navigate(['/login/continue']);
  }
}
