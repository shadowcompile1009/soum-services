import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})
export class ConditionComponent implements OnInit {
  showModal = true;

  constructor(
    private eventService: EventsService,
    private router: Router,
    public translate: TranslateService
  ) {}
  cancel() {
    this.router.navigate(['/products']);
  }
  triggerOpenModalEvent() {
    this.eventService.subscribe(EventsKey.openGrade, (data: any) => {
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
