import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/internal/operators/map';
import { CommonService } from '../../common/common.service';
import { ApiEndpoints } from '../http-wrapper/api-endpoints.constant';
import { HttpWrapperService } from '../http-wrapper/http-wrapper.service';
import { storageKeys } from '../storage/storage-keys';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalizeService {
  constructor(
    private translate: TranslateService,
    private storage: StorageService,
    private httpWrapper: HttpWrapperService,
    private commonService: CommonService,
    private router: Router
  ) {}

  setDefaultLanguage() {
    const savedData = this.storage.getSavedData();
    if (savedData && savedData[storageKeys.defaultLang]) {
      this.translate.setDefaultLang(savedData[storageKeys.defaultLang]);
    } else {
      this.translate.setDefaultLang('ar');
    }
  }

  setLanguage(language: string) {
    if (this.commonService.isLoggedIn) {
      return this.httpWrapper
        .put(ApiEndpoints.setLanguage, { language: language })
        .pipe(
          map((res) => {
            return res;
          })
        )
        .toPromise()
        .catch((error) => {
          this.translate.setDefaultLang(language);
          this.router.navigate(['/products']);
        });
    } else {
      this.translate.setDefaultLang(language);
      window.location.reload();
    }
  }

  async changeLanguage(defaultLanguage: string) {
    let lang = localStorage.getItem(storageKeys.defaultLang);
    const savedLang = lang
      ? JSON.parse(JSON.parse(localStorage.getItem(storageKeys.defaultLang)))
      : 'ar';
    if (savedLang == defaultLanguage) {
      return;
    }

    await this.translate.setDefaultLang(defaultLanguage);
    this.storage.set(storageKeys.defaultLang, defaultLanguage);
    if (this.commonService.isLoggedIn) {
      this.commonService.presentSpinner();
      this.setLanguage(defaultLanguage).then((res) => {
        this.commonService.dismissSpinner();
        window.location.reload();
      });
    } else {
      this.translate.setDefaultLang(defaultLanguage);
      window.location.reload();
    }
  }
}
