import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { AesEncryptDescryptService } from 'src/app/services/core/crypto-js/aes-encrypt-descrypt.service';
import {
  AddBank,
  ProfileService
} from "src/app/services/profile/profile.service";
import { REGEX } from '../../constants/regex.constants';
@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-detail-add.component.html',
  styleUrls: ['./bank-detail-add.component.scss']
})
export class BankDetailAddComponent implements OnInit, OnDestroy {
  addBankForm: FormGroup;
  bankList: Array<any>;
  updateBankDetail: boolean;
  bankDetail: any;
  showHideHintIBAN: boolean = false;
  subscriptions: Subscription[] =[];
  ibanContainArabic: boolean = false;
  ibanContainSA: boolean = false;
  regx_accountID = /[0-9B-RT-Z]{2}[0-9A-Z]{18}[0-9]{2}$/i;
  regex_SA = /[SA]{1,}$/i;
  constructor(
    private _location: Location,
    private router: Router,
    private profileService: ProfileService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private encryptService: AesEncryptDescryptService,
    public translate: TranslateService
  ) {
    this.addBankForm = new FormGroup({
      accountHolderName: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      accountId: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regx_accountID)
        ])
      ),
      bankBIC: new FormControl(null, Validators.compose([Validators.required]))
    });

    let state = this.router.getCurrentNavigation().extras.state;
    if (state && state.bankList) {
      this.bankList = state.bankList;
    } else {
      this.profileService.getProfileData().then(() => {
        this.getBanks();
      });
    }
    this.getParams();
  }


  onAccountIdChange(event) {
    console.log(event.target.value);
  }

  ngOnInit(): void {
    console.log('from bank details component add bank');
    this.bankDetail =
      this.profileService.profileData &&
      this.profileService.profileData.bankDetail
        ? this.profileService.profileData.bankDetail
        : null;
  }

  getParams() {
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe((query) => {
        if (query && query.action) {
          this.checkDataOnPageEnter();
        } else if (query && query.accountHolderName) {
          if (this.profileService.profileData) {
            this.addBankForm.patchValue({
              accountHolderName: query.accountHolderName,
              accountId: query.accountId.slice(2),
              bankBIC: query.bankBIC
            });
          } else {
            this.profileService.getProfileData().then(() => {
              this.addBankForm.patchValue({
                accountHolderName: query.accountHolderName,
                accountId: query.accountId.slice(2),
                bankBIC: query.bankBIC
              });
            });
          }
          this.updateBankDetail = true;
        } else {
          // implement part of code here
        }
      })
    );
  }

  checkDataOnPageEnter() {
    // implement part of code here
  }

  getBanks() {
    this.profileService.getBanks().subscribe(
      (res) => {
        if (res) {
          this.bankList = res.bankList;
        } else {
          this.bankList = [];
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  goBack() {
    this._location.back();
  }

  checkValidityIBAN() {
    this.ibanContainArabic = REGEX.ibanNotConatinArabicCharacters.test(this.addBankForm.value.accountId);
    this.ibanContainSA = REGEX.regex_SA.test(this.addBankForm.value.accountId);
  }

  addBank() {
    let selectedBank = this.bankList.find((bank) => {
      return bank.bankCode == this.addBankForm.value.bankBIC;
    });
    let payload = new AddBank({
      accountHolderName: this.addBankForm.value.accountHolderName,
      accountId: `SA${this.addBankForm.value.accountId.toUpperCase()}`,
      bankBIC: this.addBankForm.value.bankBIC,
      bankName: selectedBank ? selectedBank.bankName : ''
    });

    this.profileService.addBankAccount(payload).subscribe(
      (res) => {
        if (res) {
          firebase.analytics().logEvent('user_adds_bank');
          this.profileService.getProfileData().then((profileData) => {
            if (profileData) {
              this.goBack();
              this.updateBankDetail = false;
            }
          });
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  showHintIBAN() {
    this.showHideHintIBAN = true;
  }

  hideHintIBAN() {
    this.showHideHintIBAN = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
