import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-post-listing-walkthrough',
  templateUrl: './post-listing-walkthrough.component.html',
  styleUrls: ['./post-listing-walkthrough.component.scss']
})
export class PostListingWalkthroughComponent implements OnInit {

  activeStepper: string = 'stepper1';
  skip_post_listing: boolean = false;
  siteLang: string = 'ar';
  productID: any;

  constructor(private router: Router, private profileService: ProfileService, private translate: TranslateService) { 
    const lang = JSON.parse(localStorage.getItem('defaultLang'));
    this.siteLang = JSON.parse(lang) || this.siteLang;
    this.skip_post_listing = JSON.parse(localStorage.getItem('skip_post_listing')) || false;
  }

  ngOnInit() {
    this.productID = localStorage.getItem('productIDCon') || null;

    if(!this.productID) {
      this.router.navigate(['/']);
    }
  }
  
  
  goToProductDetails() {
    if(!this.skip_post_listing) {
      this.profileService.updateUserPrefernences({skip_post_listing: true}).subscribe((data:any) => {
        this.profileService.checkUserPrefernences();
      })
    }
    
    // this.router.navigate(['/product-detail'], {
    //   queryParams: { product: this.productID, type: 'new' }
    // });

    this.router.navigate(['bids-and-items'], {queryParams: {'tab': 'bought-sold'}});
    localStorage.removeItem('productIDCon');
  }
}
