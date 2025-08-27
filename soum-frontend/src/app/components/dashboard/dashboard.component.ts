import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentRoute: string = '/products';
  userDetails: any = null;

  notificationCount: number = 0;
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private commonService: CommonService,
    private sharingServ: SharingDataService
  ) {
    if (this.commonService.isLoggedIn || this.router.url == '/privacy-policy') {
      this.subscriptions.push(
        this.router.events.subscribe((event: any) => {
          if (event instanceof NavigationEnd || event?.url?.includes('/bids-and-items')) {
            this.currentRoute = event.url;
            if (this.currentRoute.includes('?')) {
              this.currentRoute = this.currentRoute.split('?')[0];
            }
          }
        })
      );
    } else {
      // implement part of code here
    }
  }

  ngOnInit(): void {
    this.sharingServ.userData.subscribe((data) => {
      this.userDetails = data ? data : null;
    });
    if (this.userDetails) {
      this.getNotificationCount();
      this.subscriptions.push(
        this.commonService.countNotificatios.subscribe(
          (count) => {
            this.notificationCount = count;
          },
          (err) => {
            console.log(err);
          }
        )
      );
    }
  }

  getNotificationCount() {
    this.subscriptions.push(
      this.commonService.getNotificationCount().subscribe(
        (count) => {
          this.commonService.countNotificatios.next(count.notificationCount);
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }

  navigateTo(route: string, flow?: string) {
    this.currentRoute = route;
    const userDetails = localStorage.getItem('userDetails');
    if (
      (route == '/disclaimer' ||
        route == '/profile' ||
        route == '/bids-and-items' ||
        route == '/notifications') &&
      !userDetails
    ) {
      this.commonService.handleNavigationChange(route);
      this.commonService.isLoggedIn = false;
    } else {
      this.router.navigate([route], {
        queryParams: route == '/bids-and-items' ? { tab: 'bought-sold' } : null
      });
    }
  }

  scrollTop() {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
