import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';

@Component({
  selector: 'soum-tabby-model',
  templateUrl: './tabby-model.component.html',
  styleUrls: ['./tabby-model.component.scss']
})
export class TabbyModelComponent implements OnInit {
  showSecond = false;
  showThird = false;
  showModal = true;
  showFirst = true;
  showThanks = false;
  @Output() closeTabbyModel: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(
    private eventService: EventsService,
    public translate: TranslateService
  ) {}
  triggerOpenModalEvent() {
    this.eventService.subscribe(EventsKey.openSellModal, (data: any) => {});
  }
  goNextForth() {}
  goNextThird() {
    this.showSecond = false;
    this.showFirst = false;
    this.showThird = true;
  }
  goNextSecond() {
    this.showSecond = true;
    this.showFirst = false;
  }
  gobackFirst() {
    this.showSecond = false;
    this.showFirst = true;
    this.showThird = false;
  }
  gobackSecond() {
    this.showSecond = true;
    this.showFirst = false;
    this.showThird = false;
  }
  ngOnInit(): void {
    this.triggerOpenModalEvent();
  }
  hideBidModal() {
    this.showModal = false;
    this.closeTabbyModel.emit(false);
  }

  getCurrentModel() {
    // {{translate?.getDefaultLang() == 'ar' ? 'assets/images/newSign/e-tabby.PNG' : 'assets/images/newSign/a-tabby.png'}}
    return this.translate.getDefaultLang() == 'ar'
      ? 'assets/images/newSign/a-tabby.png'
      : 'assets/images/newSign/e-tabby.PNG';
  }
}
