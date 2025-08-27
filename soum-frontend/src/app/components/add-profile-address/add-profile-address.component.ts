import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { CommonService } from 'src/app/services/common/common.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import {
  AddAddress,
  ProfileService
} from 'src/app/services/profile/profile.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import cities from 'src/assets/SA-cities/new-cities.json';

@Component({
  selector: 'app-add-profile-address',
  templateUrl: './add-profile-address.component.html',
  styleUrls: ['./add-profile-address.component.scss']
})
export class AddProfileAddressComponent implements OnInit {
  address: any = null;
  showModal = false;
  userDetails: any;
  addressForm: FormGroup;
  previousAddress: any;
  cities: { name_ar: string; name_en: string }[];
  copy_cities: any[] = [];
  empty: boolean = false;
  searchValue: any = '';
  showCitiesModal: boolean = false;
  language: any;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private storage: StorageService,
    private sellerService: SellerService,
    private _location: Location,
    private profileService: ProfileService,
    private modalService: ModalService
  ) {
    // new address form
    this.addressForm = new FormGroup({
      street: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      district: new FormControl('', [
        Validators.required,
        Validators.required,
        Validators.minLength(3)
      ]),
      city: new FormControl('', [Validators.required]),
      postal_code: new FormControl('', [
        Validators.required,
        Validators.maxLength(5),
        Validators.minLength(5)
      ]),
      address_type: new FormControl('', []),
      latitude: new FormControl('', []),
      longitude: new FormControl('', []),
      is_verified: new FormControl(true, [])
    });

    this.getUserDetails();
    this.getAddressList();
    this.openSuccesbidModal();
    if (this.sellerService.uploadProductData.pick_up_address) {
      // add code here
    }
    this.cities = cities;
    this.cities.sort((a, b) => {
      return a.name_en.localeCompare(b.name_en);
    });
    this.copy_cities = this.cities;

    this.language = JSON.parse(JSON.parse(localStorage.getItem('defaultLang')));

    const state = this.router.getCurrentNavigation().extras.state;
    if (state && state.updateAddress) {
      this.address = false;
    }
  }

  checkDataOnPageEnter() {
    if (
      !this.sellerService.uploadProductData.product_images.length &&
      !this.sellerService.selectedDevice &&
      !this.sellerService.selectedBrand &&
      !this.sellerService.selectedModel &&
      !this.sellerService.uploadProductData.sell_price &&
      !this.sellerService.uploadProductData.bid_price &&
      !this.sellerService.uploadProductData.description
    ) {
      this.router.navigate(['/select-devices']);
    }
  }

  ngOnInit(): void {
    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Pick-up-address'
    };
    window['dataLayer'].push(productGTM);
  }

  goBack() {
    this._location.back();
  }

  getUserDetails() {
    //getting user details to get address
    const savedData = this.storage.getSavedData();
    if (savedData && savedData[storageKeys.userDetails]) {
      this.userDetails = savedData[storageKeys.userDetails];
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

  getAddressList() {
    const userAddress = localStorage.getItem('userAddress');
    const checkNewAddress = this.commonService.checkExistAddress();
    if (!checkNewAddress) {
      this.address = null;
    } else {
      this.address = userAddress ? JSON.parse(userAddress) : null;
    }
  }

  addAddress() {
    //navigate to dd address page
    this.router.navigate(['profile/add-address']);
  }

  checkForAddress() {
    if (this.addressForm.valid) {
      this.commonService.presentSpinner();
      if (this.previousAddress) {
        const userAddressv2 = JSON.parse(localStorage.getItem('userAddress'));
        this.profileService
          .updateAddressV2(
            this.userDetails.userId,
            userAddressv2._id,
            new AddAddress(this.addressForm.value)
          )
          .subscribe(
            (res) => {
              this.commonService.dismissSpinner();
              if (res) {
                this.getAddressAfterAddOrUpdate();
              }
            },
            (error) => {
              this.commonService.errorHandler(error);
              this.commonService.dismissSpinner();
            }
          );
      } else {
        this.profileService
          .addNewAddressV2(
            this.userDetails.userId,
            new AddAddress(this.addressForm.value)
          )
          .subscribe(
            (res) => {
              firebase.analytics().logEvent('user_adds_address');
              this.commonService.dismissSpinner();
              if (res) {
                this.getAddressAfterAddOrUpdate();
              }
            },
            (error) => {
              this.commonService.errorHandler(error);
              this.commonService.dismissSpinner();
            }
          );
      }
    } else {
      this.addProduct(this.address);
    }
  }

  getAddressAfterAddOrUpdate() {
    this.commonService.presentSpinner();
    this.profileService.getNewUserAddressFormat().subscribe(
      (address) => {
        this.commonService.dismissSpinner();
        this.address = address.responseData
          ? address.responseData[address.responseData.length - 1]
          : '';
        if (this.address) {
          localStorage.setItem('userAddress', JSON.stringify(this.address));
        }
        this.addProduct(this.address);
      },
      (err) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(err);
      }
    );
  }

  async addProduct(address?: any) {
    if (!address) {
      this.commonService.presentAlert({
        header: await this.commonService.getTranslatedString(
          'alertPopUpTexts.noAddressSelected'
        ),
        message: await this.commonService.getTranslatedString(
          'alertPopUpTexts.selectAddress'
        ),
        button1: {
          text: await this.commonService.getTranslatedString(
            'alertPopUpTexts.ok'
          ),
          handler: () => {
            this.empty = true;
          }
        }
      });
      return;
    }
    this.sellerService.uploadProductData.pick_up_address = address._id;
    let previousLocation = sessionStorage.getItem('redirectURL');
    if (!previousLocation) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigateByUrl(previousLocation);
      sessionStorage.removeItem('redirectURL');
    }
  }

  //  accept only numbers for inputs
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  updateAddress() {
    const existAddress = this.commonService.checkExistAddress();
    if (!existAddress) {
      this.address = null;
      this.addressForm.reset();
      return;
    }
    this.addressForm.patchValue(this.address);
    this.previousAddress = { ...this.address };
    this.address = null;
  }

  cancel() {
    this.address = this.previousAddress;
    this.previousAddress = null;
    this.addressForm.reset();
  }

  // ----------------------------------- handling new address ----------------------------------
  removeStreetName() {
    this.addressForm.get('street').setValue('');
  }

  openCitiesModal() {
    this.showCitiesModal = true;
  }

  closeCitiesModal() {
    this.showCitiesModal = false;
  }

  selectCity(cityName) {
    this.searchValue = cityName;
    this.addressForm.get('city').setValue(cityName);
    this.showCitiesModal = false;
  }

  clearSearchFilter() {
    this.searchValue = '';
    this.addressForm.get('city').setValue(null);
    this.copy_cities = this.cities;
  }

  filterByCityName() {
    if (this.searchValue == '') {
      this.copy_cities = [];
      this.copy_cities = this.cities;
    } else {
      this.copy_cities = [];
      this.copy_cities = this.cities.filter((city) =>
        city[this.language == 'en' ? 'name_en' : 'name_ar']
          .trim()
          .toLowerCase()
          .includes(this.searchValue.trim().toLowerCase())
      );
    }
  }
}
