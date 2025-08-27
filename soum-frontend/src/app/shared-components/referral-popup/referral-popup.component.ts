import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-referral-popup',
  templateUrl: './referral-popup.component.html',
  styleUrls: ['./referral-popup.component.scss']
})
export class ReferralPopupComponent implements OnInit {
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ReferralPopupComponent>
  ) {}

  ngOnInit(): void {
    window['dataLayer'] = window['dataLayer'] || [];
    window['dataLayer'].push({
      event: 'referral_click_start'
    });
  }

  goToProfilePage() {
    window['dataLayer'] = window['dataLayer'] || [];
    window['dataLayer'].push({
      event: 'referral_click_continue'
    });
    let tokenData: any = localStorage.getItem('userDetails');

    if (tokenData) {
      this.router.navigate(['refer-and-earn']);
    } else {
      this.router.navigate(['/login/continue'], {
        state: { loggedUser: false }
      });
    }
    this.dialogRef.close();
  }

  dismissButton() {
    this.dialogRef.close();
  }
}
