import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-completed-successfully-reg',
  templateUrl: './completed-successfully-reg.component.html',
  styleUrls: ['./completed-successfully-reg.component.scss']
})
export class CompletedSuccessfullyRegComponent implements OnInit {
  constructor(private router: Router, private commonService: CommonService) {}

  ngOnInit(): void {
    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Completed Successfully Register'
    };
    window['dataLayer'].push(productGTM);
    clearTimeout(this.commonService.referralTimer);
  }
  showMainPAge() {
    this.commonService.isLoggedIn = true;
    let previousLocation = sessionStorage.getItem('redirectURL');
    if (!previousLocation) {
      this.router.navigate(['/products']);
    } else {
      this.router.navigateByUrl(previousLocation);
      sessionStorage.removeItem('redirectURL');
    }
  }
  showprofile() {
    this.router.navigate(['/profile']);
  }
}
