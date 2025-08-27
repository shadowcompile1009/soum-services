import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AlertControllerInterface,
  CommonService
} from 'src/app/services/common/common.service';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';

@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.scss']
})
export class AlertPopupComponent implements OnInit {
  alertControllerData: AlertControllerInterface;
  subscriptions: Subscription[] = [];

  constructor(
    private events: EventsService,
    private commonService: CommonService
  ) {
    this.subscriptions.push(
      this.events.subscribe(
        EventsKey.alertController,
        (data: AlertControllerInterface) => {
          if (data) {
            this.alertControllerData = data;
            document.getElementById('alertController').style.display = 'block';
            this.commonService.dismissSpinner();
          }
        }
      )
    );
  }

  ngOnInit(): void {
    // Do nothing
  }

  closeAlertController() {
    document.getElementById('alertController').style.display = 'none';
    return true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
