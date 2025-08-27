import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { NotificationService } from 'src/app/services/notifications/notification.service';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  listNotificatios: any[] = [];
  listNotificationRead: any[] = [];
  listNotificationNotRead: any[] = [];
  notificationCount: number = 0;
  apiHit: boolean = true;
  subscriptions: Subscription[] = [];

  constructor(
    private notificationServ: NotificationService,
    private commonService: CommonService,
    private router: Router,
    private _location: Location,
    private sharingServ: SharingDataService
  ) {}

  ngOnInit(): void {
    let userData: any = null;
    this.sharingServ.userData.subscribe((data: any) => {
      userData = data ? data : null;
    });
    if (userData) {
      this.getNotificationList();
      this.getNotificationCount();
    }

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Notifications'
    };
    window['dataLayer'].push(productGTM);
  }

  getNotificationList() {
    this.apiHit = false;
    this.subscriptions.push(
      this.notificationServ.getNotificationList().subscribe(
        (list) => {
          this.apiHit = true;
          this.listNotificatios = [];
          this.listNotificatios = list.notificationList?.notificationList;
          this.listNotificatios.forEach((el) => {
            el.isRead
              ? this.listNotificationRead.push(el)
              : this.listNotificationNotRead.push(el);
          });
        },
        (err) => {
          this.apiHit = true;
          console.log('err : ', err);
        }
      )
    );
  }

  getNotificationCount() {
    this.subscriptions.push(
      this.commonService.getNotificationCount().subscribe(
        (count) => {
          this.notificationCount = count.notificationCount;
          this.commonService.countNotificatios.next(count.notificationCount);
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }

  clearAllNotification() {
    this.subscriptions.push(
      this.notificationServ.clearAllNotification().subscribe(
        (res) => {
          this.notificationCount = 0;
          this.commonService.countNotificatios.next(0);
          this.listNotificationNotRead &&
            this.listNotificationNotRead.forEach((notification: any) => {
              notification.isRead = true;
            });
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }

  goBack() {
    this._location.back();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
