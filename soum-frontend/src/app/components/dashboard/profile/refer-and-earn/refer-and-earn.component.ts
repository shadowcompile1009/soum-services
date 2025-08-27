import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { CommonService } from 'src/app/services/common/common.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-refer-and-earn',
  templateUrl: './refer-and-earn.component.html',
  styleUrls: ['./refer-and-earn.component.scss']
})
export class ReferAndEarnComponent {
  refferalCode: any = 'Waiting ... ';
  profileData: any;

  constructor(
    private clipboardService: ClipboardService,
    private _location: Location,
    private profileService: ProfileService,
    private commonService: CommonService
  ) {
    this.getProfileData();
  }

  getProfileData() {
    this.profileService.getProfileData().then((res) => {
      if (res) {
        this.profileData = res || {};
        this.refferalCode = this.profileData?.referralCode
          ? this.profileData?.referralCode
          : 'No RefferalCode';
      }
    });
  }

  goback() {
    this._location.back();
  }

  copy(value) {
    this.clipboardService.copy(value);
    this.commonService.showPopUpForYourCopy();
  }
}
