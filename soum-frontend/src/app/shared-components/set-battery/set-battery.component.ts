import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';

@Component({
  selector: 'app-set-battery',
  templateUrl: './set-battery.component.html',
  styleUrls: ['./set-battery.component.scss']
})
export class SetBatteryComponent implements OnInit {
  showModal = true;
  @Input() question;
  objAnswer;
  @Output() emitDate = new EventEmitter();
  showThanks = false;
  subscriptions: Subscription[] = [];

  public translate: TranslateService;
  constructor(
    translate: TranslateService,
    private eventService: EventsService
  ) {
    this.translate = translate;
    this.triggerOpenModalEvent();
  }
  selectDay(answer, i) {
    var obj = {
      answer: answer,
      i: i
    };
    this.objAnswer = obj;
    this.emitDate.emit(this.objAnswer);
    this.showModal = false;
  }
  triggerOpenModalEvent() {
    this.subscriptions.push(
      this.eventService.subscribe(EventsKey.openSetBattery, (data: any) => {
        this.showModal = true;
      })
    );
  }
  ngOnInit(): void {
    this.triggerOpenModalEvent();
  }
  hideBidModal() {
    this.showModal = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
