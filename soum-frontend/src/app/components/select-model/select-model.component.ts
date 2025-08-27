import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import firebase from 'firebase';
import { ModalService } from 'src/app/services/modal/modal.service';
declare var $: any;

@Component({
  selector: 'app-select-model',
  templateUrl: './select-model.component.html',
  styleUrls: ['./select-model.component.scss']
})
export class SelectModelComponent implements OnInit {
  models: any;
  showModal = false;
  deviceCatID: any = null;
  brandID: any = null;
  apiHit: boolean;
  brandName: string;
  deviceName: string;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private sellerService: SellerService,
    private modalService: ModalService
  ) {
    this.deviceCatID = JSON.parse(localStorage.getItem('selectedDevice'));
    this.brandID = JSON.parse(localStorage.getItem('selectedBrand'));
    this.brandName = this.brandID?.brand_name;
    this.deviceName = this.deviceCatID?.category_name;
  }

  ngOnInit(): void {
    this.getModels();
    this.openSuccesbidModal();

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Select-model'
    };
    window['dataLayer'].push(productGTM);
  }

  checkDataBeforePageLoad() {
    if (
      !this.sellerService.uploadProductData.product_images.length &&
      !this.sellerService.selectedDevice &&
      !this.sellerService.selectedBrand
    ) {
      this.router.navigate(['/upload-photo', 'product']);
    }
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
  goBack() {
    this.router.navigate(['/select-brand']);
  }

  getModels() {
    this.apiHit = false;
    const cat_ID = this.sellerService?.selectedDevice?.category_id
      ? this.sellerService?.selectedDevice?.category_id
      : this.deviceCatID?.category_id;
    const brand_ID = this.sellerService?.selectedBrand?.brand_id
      ? this.sellerService?.selectedBrand?.brand_id
      : this.brandID?.brand_id;

    this.commonService.getModels(cat_ID, brand_ID).subscribe(
      (res) => {
        this.apiHit = true; // Can we handle if there is an exeption?
        if (res) {
          // No need for checking.
          this.models = res.modelList;
        }
      },
      (error) => this.commonService.errorHandler(error)
    );
    this.sellerService.selectedBrand = this.brandID;
    if (this.brandID && this.brandID.brand_id) {
      this.sellerService.uploadProductData.brand_id = this.brandID.brand_id;
    }
    this.sellerService.selectedDevice = this.deviceCatID;
    if (this.deviceCatID && this.deviceCatID.category_id) {
      this.sellerService.uploadProductData.category_id =
        this.deviceCatID.category_id;
    }
  }

  getBaseAttributeVariant(selectedModel: any) {
    this.apiHit = false;
    this.sellerService.getBaseAttributesByModelID(selectedModel._id).subscribe(res => {
      this.apiHit = true;
      if(res.responseData.variant) {
        localStorage.setItem('selectedVarient', JSON.stringify(res?.responseData?.variant));
        this.sellerService.selectedVarient = res?.responseData?.variant;
        this.sellerService.uploadProductData.varient = res?.responseData?.variant?.varientEn;
        this.sellerService.uploadProductData.varient_ar = res?.responseData?.variant?.varientAr;
        this.sellerService.uploadProductData.varient_id = res?.responseData?.variant?.id;
        this.sellerService.uploadProductData.variant_attributes_selections = [];
        this.router.navigate(['/selected-photos', 'product']);
        firebase.analytics().logEvent('user_selects_varient', { variant: res?.responseData?.variant?.id });
      } else {
        let navigationExtras: NavigationExtras = {state: {varients: selectedModel.varients}};
        if (selectedModel.questions) {
          navigationExtras.state.questions = selectedModel.questions;
        }
        firebase.analytics().logEvent('user_selects_model', { model: selectedModel._id });
        this.router.navigate(['/select-variant'], navigationExtras);
      }
    }, err => {
      this.apiHit = true;
    })
  };

  proceedToSelectVariant(selectedModel: any) {
    this.getBaseAttributeVariant(selectedModel);
    localStorage.setItem('selectedModel', JSON.stringify(selectedModel));
    this.sellerService.selectedModel = selectedModel;
    this.sellerService.uploadProductData.model_id = selectedModel._id;
  }
}
