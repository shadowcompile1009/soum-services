import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';
import { ClipboardService } from 'ngx-clipboard';

import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'referral-code',
  templateUrl: './referral-code.component.html',
  styleUrls: ['./referral-code.component.scss']
})
export class ReferralCodeComponent implements OnInit {
  showModal = true;
  profileData: any;
  constructor(
    private router: Router,
    private eventService: EventsService,
    private profileService: ProfileService,
    private clipboardService: ClipboardService
  ) {
    this.triggerOpenModalEvent();
  }

  triggerOpenModalEvent() {
    this.eventService.subscribe(EventsKey.openReferralCode, (data: any) => {
      this.showModal = true;
    });
  }

  ngOnInit(): void {
    this.profileData = this.profileService.profileData;
  }
  hideBidModal() {
    this.showModal = false;
    this.router.navigate(['/profile'], {});
  }

  copy(text: string) {
    this.clipboardService.copy(text);
  }
}
