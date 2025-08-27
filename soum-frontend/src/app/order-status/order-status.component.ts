import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../services/common/common.service';
import { storageKeys } from '../services/core/storage/storage-keys';
import { StorageService } from '../services/core/storage/storage.service';
import * as satismeter from 'satismeter-loader';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit {
  orderID;
  productID;
  paymentStatus = '';
  paymentType = '';
  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private router: Router,
    private storage: StorageService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.checkLoginState();
    this.callSatisMeter();
  }

  checkLoginState() {
    if (this.commonService.isLoggedIn) {
      this.subscriptions.push(
        this.activatedRoute.queryParams.subscribe((param) => {
          if (
            param &&
            (param.status === 'Success' || param.status === 'Pending')
          ) {
            this.paymentStatus = param.status;
            this.orderID = param.orderID;
          } else if (param && param.status === 'Fail') {
            this.paymentStatus = param.status;
            this.paymentType = localStorage.getItem('paymentType');
            this.productID = param.productID;
          }
        })
      );
    } else {
      this.router.navigate(['/login/continue']);
    }
  }

  navigateTo(route: string) {
    if (route === '/order') {
      this.router.navigate(['/order'], {
        queryParams: { order: this.productID }
      });
    } else if (route === '/order-details') {
      this.router.navigate([route], { queryParams: { order: this.orderID } });
    } else {
      this.router.navigate([route]);
    }
  }

  callSatisMeter() {
    if (this.paymentStatus !== 'Success') return;
    const savedData = this.storage.getSavedData();
    const userDetails = savedData[storageKeys.userDetails];
    const currentDate = new Date().toLocaleDateString();

    satismeter({
      writeKey: '0HOzTfHjo9Uuqdvn',
      userId: userDetails.userId,
      traits: {
        name: userDetails.name,
        createdAt: currentDate
      }
    });
  }

  ngOnDestroy(): void {
    localStorage.removeItem('paymentType');
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
