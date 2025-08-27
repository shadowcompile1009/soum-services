import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';

@Component({
  selector: 'app-cancel-listing',
  templateUrl: './cancel-listing.component.html',
  styleUrls: ['./cancel-listing.component.scss']
})
export class CancelListingComponent implements OnInit {
  showModal = true;

  constructor(private eventService: EventsService, private router: Router) {}
  cancel() {
    localStorage.removeItem('selectedBrand');
    localStorage.removeItem('selectedDevice');
    localStorage.removeItem('selectedModel');
    localStorage.removeItem('selectedVarient');
    this.router.navigate(['/products']);
  }
  triggerOpenModalEvent() {
    this.eventService.subscribe(EventsKey.openCancel, (data: any) => {
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
