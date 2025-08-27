import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile/profile.service';
@Component({
  selector: 'app-pre-listing-walkthrough',
  templateUrl: './pre-listing-walkthrough.component.html',
  styleUrls: ['./pre-listing-walkthrough.component.scss']
})
export class PreListingWalkthroughComponent {
  activeStepper: string = 'stepper1';
  siteLang: string = 'ar';
  productID: any;
  skip_pre_listing = false;
  constructor(private router: Router, private profileService : ProfileService) { 
    this.profileService.checkUserPrefernences();
    this.productID = localStorage.getItem('productIDCon') || null;
    const lang = JSON.parse(localStorage.getItem('defaultLang'));
    this.siteLang = JSON.parse(lang) || this.siteLang;
    this.skip_pre_listing = JSON.parse(localStorage.getItem('skip_pre_listing')) || false;

  }


  goToSpp(text) {

    this.router.navigate(['/select-devices']);
  }
  goback(step)
{
  if(step ==='stepper2'){
  this.activeStepper = 'stepper1';
  }
  if(step ==='stepper3'){
    this.activeStepper = 'stepper2';
    }
}
}
