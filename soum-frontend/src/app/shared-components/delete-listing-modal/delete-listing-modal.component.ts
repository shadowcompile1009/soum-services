import { Component, OnInit } from '@angular/core';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';

@Component({
  selector: 'app-delete-listing-modal',
  templateUrl: './delete-listing-modal.component.html',
  styleUrls: ['./delete-listing-modal.component.scss']
})
export class DeleteListingModalComponent implements OnInit {
  showModal = true;

  constructor(
    private eventService: EventsService,
    private events: EventsService
  ) {}
  deleteDraft() {
    this.showModal = false;
    this.events.publish(EventsKey.removeItem, '');
  }
  triggerOpenModalEvent() {
    this.eventService.subscribe(EventsKey.openDeleteModal, (data: any) => {
      this.showModal = true;
    });
  }
  ngOnInit(): void {
    this.triggerOpenModalEvent();
  }
  hideBidModal() {
    this.showModal = false;
  }
}
