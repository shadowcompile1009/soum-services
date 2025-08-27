import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';

@Component({
  selector: 'app-delete-item',
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.scss']
})
export class DeleteItemComponent implements OnInit {
  showModal = true;
  @Input() product;
  arabic = false;
  @Output() deletePush = new EventEmitter();
  translate: TranslateService;
  constructor(
    private eventService: EventsService,
    private events: EventsService,
    private injector: Injector
  ) {
    this.translate = this.injector.get<TranslateService>(TranslateService);
  }
  getDefaultLanguage() {
    let defaultLanguage = this.translate.getDefaultLang();
    switch (defaultLanguage) {
      case 'en':
        this.arabic = false;

        break;

      case 'ar':
        this.arabic = true;
        break;
    }
  }
  deleteItem() {
    this.showModal = false;
    this.deletePush.emit(this.product._id);
    this.events.publish(EventsKey.removeItem, '');
  }
  triggerOpenModalEvent() {
    this.eventService.subscribe(EventsKey.openDeleteItem, (data: any) => {
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
