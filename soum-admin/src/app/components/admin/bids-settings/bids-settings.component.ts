import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common/common.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-bids-settings',
  templateUrl: './bids-settings.component.html',
  styleUrls: ['./bids-settings.component.scss'],
})
export class BidsSettingsComponent implements OnInit {
  tabName: string = 'bid_settings';

  submitted = false;
  settingsForm: FormGroup;
  bidsettings;
  referanceOptions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.initializeSettingsForm();
    this.getBidSettings();
    this.getBiddingReferancevalues();
  }

  initializeSettingsForm() {
    this.settingsForm = this.fb.group({
      activeBiddingToggle: [null],
      applePay: [null],
      tabby: [null],
      visaMaster: [null],
      stcPay: [null],
      tamara: [null],
      mada: [null],
      startBidding: [''],
      biddingBase: [null],
      biddingExperationTime: [''],
    });
  }

  getBiddingReferancevalues() {
    this.usersService.getBidsReferances().subscribe((res) => {
      this.referanceOptions = res.body;
    });
  }
  getBidSettings() {
    this.commonService.presentSpinner();
    this.usersService.getBidSettings().subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res && res.body) {
          this.bidsettings = res.body;
          this.updateBidSettingsValues();
        }
      },
      () => {
        this.commonService.dismissSpinner();
      }
    );
  }

  updateBidSettingsValues() {
    this.settingsForm.patchValue({
      activeBiddingToggle: this.bidsettings?.value,
      applePay: this.bidsettings?.availablePayment[0]?.value,
      tabby: this.bidsettings?.availablePayment[1]?.value,
      visaMaster: this.bidsettings?.availablePayment[2]?.value,
      stcPay: this.bidsettings?.availablePayment[3]?.value,
      tamara: this.bidsettings?.availablePayment[4]?.value,
      mada: this.bidsettings?.availablePayment[5]?.value,
      startBidding: this.bidsettings?.config[0].value,
      biddingBase: this.bidsettings?.config[1]?.value,
      biddingExperationTime: this.bidsettings?.config[2]?.value,
    });
  }

  choosepage(page: string) {
    this.tabName = page;
  }

  numbersOnly(event) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      return false;
    }
  }

  onSubmit() {
    for (const iterator of this.bidsettings.availablePayment) {
      switch (iterator.name) {
        case 'applePay':
          iterator.value = this.settingsForm.value.applePay;

          break;
        case 'tabby':
          iterator.value = this.settingsForm.value.tabby;

          break;
        case 'visaMaster':
          iterator.value = this.settingsForm.value.visaMaster;

          break;
        case 'stcPay':
          iterator.value = this.settingsForm.value.stcPay;

          break;
        case 'tamara':
          iterator.value = this.settingsForm.value.tamara;

          break;
        case 'mada':
          iterator.value = this.settingsForm.value.mada;

          break;

        default:
          iterator.value = false;

          break;
      }
    }
    for (const iterator of this.bidsettings.config) {
      switch (iterator.name) {
        case 'startBidding':
          iterator.value = this.settingsForm.value.startBidding;

          break;
        case 'biddingBase':
          iterator.value = this.settingsForm.value.biddingBase;

          break;
        case 'biddingExperationTime':
          iterator.value = this.settingsForm.value.biddingExperationTime;

          break;
        default:
          iterator.value = false;

          break;
      }
    }
    const payload = {
      name: this.bidsettings.name,
      display: this.bidsettings.display,
      description: this.bidsettings.description,
      type: this.bidsettings.type,
      configurable: this.bidsettings.configurable,
      value: this.settingsForm.value.activeBiddingToggle,
      availablePayment: this.bidsettings.availablePayment,
      config: this.bidsettings.config,
    };
    this.usersService.postBidSettings(this.bidsettings.id, payload).subscribe(
      (res) => {
        this.commonService.successToaster('Settings Updated Successfully');
        this.getBidSettings();
      },
      () => {
        this.commonService.errorToast('error please try again');
      }
    );
  }
}
