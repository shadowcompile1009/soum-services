import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import firebase from 'firebase';

@Component({
  selector: 'app-select-devices',
  templateUrl: './select-devices.component.html',
  styleUrls: ['./select-devices.component.scss']
})
export class SelectDevicesComponent implements OnInit {
  categories: any;
  photos: any;
  apiHit: boolean;
  deviceName: string;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private sellerService: SellerService
  ) {}

  ngOnInit(): void {
    firebase.analytics().logEvent('listing_walk_through');
    this.getCategories();

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Select-devices'
    };
    window['dataLayer'].push(productGTM);
  }

  checkDataBeforePageLoad() {
    if (!this.sellerService.uploadProductData.product_images.length) {
      this.router.navigate(['/select-devices']);
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  getCategories() {
    this.apiHit = false;
    this.commonService.getCategories().subscribe(
      (res) => {
        this.apiHit = true;
        if (res && res.code == 200) {
          this.categories = res.categoryList;
        }
      },
      (error) => this.commonService.errorHandler(error)
    );
  }

  proceedToSelectBrand(selectedDevice: any) {
    console.log('proceedToSelectBrand ---------------> ', selectedDevice.category_id);
    this.sellerService.selectedDevice = selectedDevice;
    this.sellerService.uploadProductData.category_id =
      selectedDevice.category_id;

    // test store it in localStorage
    localStorage.setItem('selectedDevice', JSON.stringify(selectedDevice));
    this.router.navigate(['/select-brand']);
    firebase.analytics().logEvent('user_selects_device');
  }
}
