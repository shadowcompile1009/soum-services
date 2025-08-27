import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StorageKeys } from './services/core/storage/storage-keys';
import { StorageService } from './services/core/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUrl: string;

  constructor(
    private router: Router,
    private title: Title,
    private titleCase: TitleCasePipe,
    private translate: TranslateService,
    private storage: StorageService
  ) {
    const savedData = this.storage.getSavedData();
    if(savedData && savedData[StorageKeys.defaultLang]) {
      this.translate.setDefaultLang(savedData[StorageKeys.defaultLang]);
    } else {
      this.translate.setDefaultLang('en');
    }
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url;
          if (this.currentUrl.includes("?")) {
            this.currentUrl = this.currentUrl.split("?")[0]
          }
          let path = this.currentUrl.split('/');
          // + (path[path.length - 1] ? '\t|\t' + this.titleCase.transform(path[path.length - 1]) : '')
          this.title.setTitle('Soum-Admin');
        }
      }
    );
  }
}
