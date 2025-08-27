import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import firebase from 'firebase';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-select-brand',
  templateUrl: './select-brand.component.html',
  styleUrls: ['./select-brand.component.scss']
})
export class SelectBrandComponent implements OnInit {
  brands: any;
  showModal = false;
  deviceCatID: any = null;
  apiHit: boolean;
  deviceName: string;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private sellerService: SellerService,
    private modalService: ModalService
  ) {
    this.deviceCatID = JSON.parse(localStorage.getItem('selectedDevice'));
    this.deviceName = this.deviceCatID?.category_name;
  }

  ngOnInit(): void {
    this.getBrands();
    this.openSuccesbidModal();

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Select-brand'
    };
    window['dataLayer'].push(productGTM);
  }
  openSuccesbidModal() {
    this.modalService.openCancelListing({
      value: true
    });
  }
  showmodal() {
    this.showModal = true;
    this.openSuccesbidModal();
  }
  checkDataBeforePageLoad() {
    if (
      !this.sellerService.uploadProductData.product_images.length &&
      !this.sellerService.selectedDevice
    ) {
      this.router.navigate(['/upload-photo', 'product']);
    }
  }

  goBack() {
    this.router.navigate(['/select-devices']);
  }

  getBrands() {
    this.apiHit = false;
    const cat_ID = this.sellerService?.selectedDevice?.category_id
      ? this.sellerService?.selectedDevice?.category_id
      : this.deviceCatID?.category_id;
    this.commonService.getBrands(cat_ID).subscribe(
      (res) => {
        this.apiHit = true;
        if (res) {
          this.brands = res.brandList;
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );

    this.sellerService.selectedDevice = this.deviceCatID;
    if (this.deviceCatID && this.deviceCatID.category_id) {
      this.sellerService.uploadProductData.category_id =
        this.deviceCatID.category_id;
    }
  }

  proceedToSelectModel(selectedBrand: any) {
    this.sellerService.selectedBrand = selectedBrand;
    this.sellerService.uploadProductData.brand_id = selectedBrand.brand_id;

    // test store it in localStorage
    localStorage.setItem('selectedBrand', JSON.stringify(selectedBrand));
    firebase
      .analytics()
      .logEvent('user_selects_brand', { brand_id: selectedBrand.brand_id });
    this.router.navigate(['/select-model']);
  }
}
