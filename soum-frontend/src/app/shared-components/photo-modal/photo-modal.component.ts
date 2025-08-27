import { Component, OnInit } from '@angular/core';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.scss']
})
export class PhotoModalComponent implements OnInit {
  showSecond = false;
  showThird = false;
  showModal = true;
  showFirst = true;
  showThanks = false;
  empty: boolean = false;
  constructor(private eventService: EventsService) {}

  ngOnInit(): void {
    this.triggerOpenModalEvent();
  }

  triggerOpenModalEvent() {
    this.eventService.subscribe(EventsKey.openSellModal, (data: any) => {
      this.empty = true;
    });
  }

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

  hideModal() {
    this.showModal = false;
  }
}
