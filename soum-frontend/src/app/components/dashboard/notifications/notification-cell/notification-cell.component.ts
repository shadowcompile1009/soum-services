import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { NotificationService } from 'src/app/services/notifications/notification.service';

@Component({
  selector: 'app-notification-cell',
  templateUrl: './notification-cell.component.html',
  styleUrls: ['./notification-cell.component.scss']
})
export class NotificationCellComponent {
  @Input('notificationData') notificationData: any = {};
  empty: boolean = false;
  is_BiddingDisabled: boolean = false;

  constructor(
    private router: Router,
    private notificationServ: NotificationService,
    private commonService: CommonService
  ) {
    const appSetting = JSON.parse(sessionStorage.getItem('appSetting'));
    this.is_BiddingDisabled = appSetting?.is_bidding_enabled || false;
  }

  // function to check activityType of notification
  navigateTo(notificationData: any, _id: string) {
    const activityType = notificationData?.activityType;
    if (activityType == "BuyerBidAccepted" || activityType == "BuyerBidRejected") {
      this.router.navigateByUrl("/bids-and-items?tab=bought-sold", {state: {fromNotification: true}});
      this.markNotificationAsRead(_id);
    } else if (activityType == 'Bidding') {
      this.router.navigateByUrl('/bids-and-items?tab=bought-sold');
      this.markNotificationAsRead(_id);
    } else if (
      activityType == 'AnswerQuestion' ||
      activityType == 'AskQuestion'
    ) {
      this.router.navigateByUrl(
        `product-detail?product=${notificationData.productData.productId}`
      );
      this.markNotificationAsRead(_id);
    } else if (activityType == 'ProductExpired') {
      this.router.navigateByUrl('/bids-and-items?tab=bought-sold');
      this.markNotificationAsRead(_id);
    } else {
      this.markNotificationAsRead(_id);
    }
    this.getNotificationCount();
  }

  // Function To Mark Notification As Read
  markNotificationAsRead(notificationID) {
    this.notificationServ.markNotificationAsRead(notificationID).subscribe(
      (res) => {
        this.empty = true;
      },
      (err) => {
        this.commonService.errorHandler(err);
      }
    );
  }

  getNotificationCount() {
    this.commonService.getNotificationCount().subscribe(
      (count) => {
        this.commonService.countNotificatios.next(count.notificationCount);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
