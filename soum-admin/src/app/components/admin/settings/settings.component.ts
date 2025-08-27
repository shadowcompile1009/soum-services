import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { CommonService } from 'src/app/services/common/common.service';
import { SettingResponse, SettingService, SettingType } from '../../../services/setting/setting.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settingsArray: SettingType[];
  selectedSetting: SettingType;
  selectedSettingId: string;
  settingCategoryDropdown: string = 'Global';
  addUpdateSettingForm: FormGroup;
  constructor(
    private settingService: SettingService,
    private commonService: CommonService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
  ) {
    this.generateSettingForm();
  }

  ngOnInit(): void {
    this.getSettings();
  }

  getSettings() {
    this.settingService.getAllSettings().subscribe((res: HttpResponse<SettingResponse>) => {
      if (res.body) {
        this.settingsArray = res.body.responseData as SettingType[];
        this.selectedSetting = this.settingsArray[0];
        this.selectedSettingId = this.settingsArray[0]._id;
      } else {
        this.settingsArray = [];
      }
    });
  }

  resetForm() {
    this.addUpdateSettingForm.reset();
    this.selectedSetting = null;
    this.selectedSettingId = null;
  }

  createPossibleValue(value: string, selected: boolean) {
    return new FormGroup({
      option: new FormControl(value, Validators.compose([Validators.required])),
      isSelected: new FormControl(selected)
    });
  }

  generateSettingForm(setting: SettingType = null) {
    this.selectedSetting = setting;
    this.selectedSettingId = setting?._id;
    this.addUpdateSettingForm = new FormGroup({
      _id: new FormControl(setting?._id),
      status: new FormControl(setting?.status || 'Enabled'),
      name: new FormControl(setting?.name || '', Validators.compose([Validators.required])),
      description: new FormControl(setting?.description || ''),
      type: new FormControl(setting?.type || 'string', Validators.compose([Validators.required])),
      category: new FormControl(setting?.setting_category || 'Global', Validators.compose([Validators.required])),
      value: new FormControl(setting?.value || ''),
      possible_values: setting?.possible_values ? new FormArray(setting?.possible_values?.map((value: any) => {
        return this.createPossibleValue(value.option, setting?.value === value.option)
      })) : new FormArray([])
    });
  }

  get settingPossibleValues() {
    return this.addUpdateSettingForm.get('possible_values') as FormArray;
  }

  addPossibleValue() {
    this.settingPossibleValues.push(this.createPossibleValue('', false));
  }

  removeOption(index: number) {
    this.settingPossibleValues.removeAt(index);
  }

  saveSetting() {
    let values = { ...this.addUpdateSettingForm.value };
    if (this.selectedSetting) {
      if(values.description === 'Payment Option') {
        this.confirmPaymentOption(values);
        return;
      }
      this.updateSetting(values);
    } else {
      this.addSetting(values);
    }
  }

  addSetting(setting: SettingType) {
    this.commonService.presentSpinner();
    this.settingService.addSetting(setting).subscribe(
      (addResponse) => {
        this.commonService.dismissSpinner();
        if (addResponse) {
          this.getSettings();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  deleteSetting(id) {
    let options = {
      title: 'Are you Sure you want to delete this setting?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((confirm: boolean) => {
      if (confirm) {
        this.commonService.presentSpinner();
        this.settingService.deleteSetting(id).subscribe(
          (deleteResponse) => {
            this.commonService.dismissSpinner();
            if (deleteResponse) {
              this.getSettings();
            }
          },
          (error) => {
            this.commonService.dismissSpinner();
            this.commonService.errorHandler(error);
          }
        )
      }
    });
  }

  confirmPaymentOption (settings) {
    let options = {
      title: `Are you sure you want to change this payment option in the ${settings.value.split(',').length == 2 ? 'website and mobile app' : settings.value.includes('Web') ? 'website' : 'mobile app'} ?`,
      confirmLabel: 'Yes',
      declineLabel: 'No'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((confirm: boolean) => {
      if (confirm) {
        this.updateSetting(settings);
      }
    });
  }

  updateSetting(setting: SettingType) {
    this.commonService.presentSpinner();
    this.settingService.updateSetting(setting).subscribe(
      (updateResponse) => {
        this.commonService.dismissSpinner();
        if (updateResponse) {
          this.getSettings();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }
}
