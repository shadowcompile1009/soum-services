import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from './services/common/common.service';
import { InitService } from './services/core/init/init.service';
import { LocalizeService } from './services/core/localization/localize.service';
import { storageKeys } from './services/core/storage/storage-keys';
import { StorageService } from './services/core/storage/storage.service';
import { SharingDataService } from './services/sharing-data/sharing-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentColor: any;
  currentUrl: string;
  title = 'soum';
  subscriptions: Subscription[] = [];

  constructor(
    private localize: LocalizeService,
    private router: Router,
    private initService: InitService,
    private commonService: CommonService,
    private storageService: StorageService,
    public dialog: MatDialog,
    private sharingServ: SharingDataService
  ) {
    localStorage.setItem('enviroment', storageKeys.enviroment.toString());
    this.sharingServ.prepareStorageDataToShare();
    this.localize.setDefaultLanguage();
    this.initService.initializeApp();

    this.subscriptions.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url;
          if (this.currentUrl.includes('?')) {
            this.currentUrl = this.currentUrl.split('?')[0];
          }
          this.commonService.currentUrl = this.currentUrl;
        }
      })
    );

    this.storageService.removeItem(storageKeys.productToBuy);
    this.storageService.removeItem(storageKeys.productToBid);
    this.storageService.removeItem(storageKeys.filterByCategory);
    this.storageService.removeItem(storageKeys.filterByModel);
    this.commonService.downloadAppAppearance();
  }
}
