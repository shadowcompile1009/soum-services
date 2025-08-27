import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';

@Component({
  selector: 'app-upload-options',
  templateUrl: './upload-options.component.html',
  styleUrls: ['./upload-options.component.scss']
})
export class UploadOptionsComponent implements OnInit {
  showModal = true;
  @Output() takePhoto = new EventEmitter();
  @Output() selectPhoto = new EventEmitter();
  subscriptions: Subscription[] = [];

  constructor(private eventService: EventsService, private router: Router) {}

  ngOnInit(): void {
    this.triggerOpenModalEvent();
  }

  triggerOpenModalEvent() {
    this.subscriptions.push(
      this.eventService.subscribe(EventsKey.openCancel, (data: any) => {
        this.showModal = true;
      })
    );
  }

  hideBidModal() {
    this.showModal = false;
  }

  handleTakePhoto() {
    this.takePhoto.emit();
  }

  handleOpenLibrary() {
    this.selectPhoto.emit();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
