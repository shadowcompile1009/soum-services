import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CommonService } from '../../common/common.service';
import { ProfileService } from '../../profile/profile.service';
import { storageKeys } from '../storage/storage-keys';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  constructor(
    private storage: StorageService,
    private commonService: CommonService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  initializeApp() {
    this.commonService.getSystemConfiguration().then((res) => {
      if (res) {
        document.documentElement.style.setProperty(
          '--primary-color',
          `#${res.theme_color}`
        );
        this.redirectToInfoSoum();
      } else {
        document.documentElement.style.setProperty(
          '--primary-color',
          `#01b9ff`
        );
      }
    });
    const savedData = this.storage.getSavedData();
    if (savedData[storageKeys.userDetails]) {
      this.profileService.getProfileData();
      this.commonService.isLoggedIn = true;
    } else {
      this.commonService.isLoggedIn = false;
    }
  }

  redirectToInfoSoum() {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const domain = window.location.href;
    const skipQuery = domain.indexOf('redirect=false') >= 0 ? true : false;
    const localOrQa = domain.indexOf('localhost') >= 0 || domain.indexOf('previews.soum.sa') >= 0 ? true : false;
    const redirectToInfoSoum = JSON.parse(sessionStorage.getItem('appSetting'))?.redirect_to_info_soum_sa;

    if (skipQuery) {
      return;
    } else if (!mobile && !localOrQa && redirectToInfoSoum) {
      this.router.navigate(['/redirect']);
    }
  }
}