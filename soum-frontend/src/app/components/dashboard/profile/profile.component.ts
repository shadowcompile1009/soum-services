import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import firebase from 'firebase';
import { ClipboardService } from 'ngx-clipboard';
import { REGEX } from 'src/app/constants/regex.constants';
import { BidsAndItemsService } from 'src/app/services/bids-and-items/bids-and-items.service';
import { CommonService } from 'src/app/services/common/common.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import {
  EditProfile,
  ProfileService,
  ReferralCode
} from 'src/app/services/profile/profile.service';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';
import { PopupNewAddressComponent } from 'src/app/shared-components/popup-new-address/popup-new-address.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  title: string = 'ProfileComponent';
  nameEdit: boolean;
  userDetails: any;
  bidProductId: string;
  profileData: any;
  editProfileForm: FormGroup;
  cards: any[];
  httpWrapper: any;
  sellProducts: any;
  showBids: boolean;
  productToRenew: any;
  bids: any[];
  showHistoryBuys = false;
  showHistorySold = false;
  productToDelete: string;
  BoughtProducts = [];
  SoldProducts = [];
  sampleBoughtProduct: any;
  SoldPrductDisputed = [];
  BoughtProductsDisputed = [];
  notifyUser = false;
  tokenData: any = null;
  showReferral: boolean = false;
  validName: boolean = true;
  validatName: boolean = true;
  validNamePromo: boolean = true;
  commonService: CommonService;
  storage: StorageService;
  profileService: ProfileService;
  bidsAndItemService: BidsAndItemsService;
  sharingServ: SharingDataService;

  address: any = null;
  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private clipboardService: ClipboardService,
    private injector: Injector,
    public dialog: MatDialog
  ) {
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.storage = this.injector.get<StorageService>(StorageService);
    this.profileService = this.injector.get<ProfileService>(ProfileService);
    this.bidsAndItemService =
      this.injector.get<BidsAndItemsService>(BidsAndItemsService);
    this.sharingServ =
      this.injector.get<SharingDataService>(SharingDataService);

    this.sharingServ.userData.subscribe(
      (data: any) => (this.tokenData = data ? data : null)
    );
    if (!this.tokenData) {
      this.commonService.isLoggedIn = false;
      this.commonService.handleNavigationChange();
      return;
    }

    this.getProfileData();
    this.getNewAddressV2();
    firebase.analytics().logEvent('view_profile');
    this.editProfileForm = new FormGroup({
      name: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(5)])
      )
    });
  }

  validationName() {
    this.validateName(this.editProfileForm?.get('name').value);
    this.validName = !REGEX.newName.test(
      this.editProfileForm?.get('name').value
    );
    if (
      !this.validName ||
      this.editProfileForm?.get('name').value.includes('@')
    ) {
      this.editProfileForm?.controls['name'].setErrors({ invalidName: true });
    }
  }

  copy(text: string) {
    this.clipboardService.copy(text);
    this.commonService.showPopUpForYourCopy();
  }

  ngOnInit(): void {
    const savedData = this.storage.getSavedData();
    if (savedData[storageKeys.userDetails]) {
      this.userDetails = savedData[storageKeys.userDetails];
      this.getBoughtProducts();
      this.getSoldProducts();
    } else {
      this.router.navigate(['/products']);
    }

    // show Bought/Sold History when return from page tracking order
    const state = history.state || null;
    if (state.showHistoryBuys) {
      this.showHistoryBuys = true;
    } else if (state.showHistorySold) {
      this.showHistorySold = true;
    }

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Profile'
    };
    window['dataLayer'].push(productGTM);
  }

  checkUserAddressStatus() {
    const { userHaveOldAddress, userHaveNewAddress } =
      this.commonService.checkUserAddressStatus();
    if (!userHaveNewAddress && userHaveOldAddress) {
      setTimeout(() => {
        this.dialog.open(PopupNewAddressComponent, {
          data: { closeInSamePage: true }
        });
      }, 1000);
    }
  }

  validateName(name) {
    this.validatName = this.commonService.validateDescAndComment(name);
    this.validNamePromo = this.commonService.validateDescAndCommentPromo(name);
  }

  getBoughtProducts() {
    this.bidsAndItemService.getBoughtProducts().subscribe(
      (res) => {
        if (res) {
          this.notifyUser = res.productList.find((x) => !x.isUserNotified)
            ? true
            : false;
          const productList = this.calculateSellPriceForOrder(res.productList);
          productList.find((el) => {
            if (el.dispute == 'Yes') {
              this.BoughtProductsDisputed.push(el);
            } else {
              this.BoughtProducts.push(el);
            }
          });
        } else {
          this.BoughtProducts = [];
        }

        this.BoughtProductsDisputed.length > 0 &&
          this.BoughtProductsDisputed.sort(function (a, b) {
            if (new Date(a.updated_at) > new Date(b.updated_at)) return 1;
            if (new Date(a.updated_at) < new Date(b.updated_at)) return -1;
            return 0;
          });

        this.BoughtProducts.push(...this.BoughtProductsDisputed);
        this.BoughtProducts.reverse();
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  getSoldProducts() {
    this.bidsAndItemService.getSoldProducts().subscribe(
      (res) => {
        if (res) {
          this.notifyUser = res.productList.find((x: any) => !x.isUserNotified)
            ? true
            : false;
          const productList = this.calculateSellPriceForOrder(res.productList);
          productList.find((el) => {
            if (el.dispute == 'Yes') {
              this.SoldPrductDisputed.push(el);
            } else {
              this.SoldProducts.push(el);
            }
          });
        } else {
          this.SoldProducts = [];
        }
        this.SoldProducts.push(...this.SoldPrductDisputed);
        this.SoldProducts.reverse();
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  calculateSellPriceForOrder(orderList) {
    for (let i = 0; i < orderList.length; i++) {
      if (orderList[i].buy_type === 'Bid') {
        orderList[i].product?.bidding.forEach((bid) => {
          if (bid.bid_status == 'accepted') {
            orderList[i].calculated_sell_price = bid.bid_price;
          }
        });
      } else {
        orderList[i].calculated_sell_price = orderList[i].product?.sell_price;
      }
    }
    return orderList;
  }

  showPopUpForYourProduct(
    action: 'cannotBuy' | 'cannotBid' | 'cannotWishlist'
  ) {
    this.commonService.showPopUpForYourProduct(action);
  }

  getMySellProducts() {
    let day30 = 30 * 24 * 60 * 60 * 1000;
    let day28 = 28 * 24 * 60 * 60 * 1000;
    this.bidsAndItemService.getMySellProducts().subscribe(
      (res) => {
        if (res) {
          this.sellProducts = res.productList;
          this.sellProducts.forEach((sellProduct) => {
            let uploadDate = new Date(sellProduct.createdDate);
            let dateOfExpiry = new Date(uploadDate.getTime() + day30);
            let aboutToExpireStartDate = new Date(uploadDate.getTime() + day28);
            sellProduct.uploadDate = uploadDate;
            sellProduct.dateOfExpiry = dateOfExpiry;
            sellProduct.aboutToExpireStartDate = aboutToExpireStartDate;
            sellProduct.currentDate = new Date();
            if (new Date().getTime() >= sellProduct.dateOfExpiry.getTime()) {
              sellProduct.expired = true;
              sellProduct.aboutToExpire = false;
            } else {
              sellProduct.expired = false;
              if (new Date() >= sellProduct.aboutToExpireStartDate) {
                sellProduct.aboutToExpire = true;
              } else {
                sellProduct.aboutToExpire = false;
              }
            }
          });
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  getProfileData() {
    this.profileService.getProfileData().then((res) => {
      if (res) {
        this.profileData = res || {};
        this.cards = this.profileService.cards;
      }
    });
  }

  getNewAddressV2() {
    this.profileService.getNewUserAddressFormat().subscribe(
      (data) => {
        this.address =
          data.responseData.length > 0
            ? data.responseData[data.responseData.length - 1]
            : null;
        if (this.address) {
          localStorage.setItem('userAddress', JSON.stringify(this.address));
        }
        const checkNewAddress = this.commonService.checkExistAddress();
        this.checkUserAddressStatus();
        if (!checkNewAddress) {
          this.address = null;
          return;
        }
      },
      (err) => {
        this.commonService.errorHandler(err);
      }
    );
  }

  deleteAddress() {
    this.commonService.presentSpinner();
    this.profileService
      .deleteAddressV2(this.profileData._id, this.address._id)
      .subscribe(
        (res) => {
          if (res) {
            this.commonService.dismissSpinner();
            localStorage.removeItem('userAddress');
            this.getProfileData();
            this.getNewAddressV2();
          }
        },
        (error) => {
          this.commonService.errorHandler(error);
          this.commonService.dismissSpinner();
        }
      );
  }

  navigateTo(route: string, product: any, state?: string) {
    let options: NavigationExtras = {};
    if (route === '/product-detail' && product) {
      options.queryParams = {
        product: product._id
      };
    }
    if (route == '/order-details' && product) {
      if (product.dispute == 'Yes') {
        return;
      }

      options.queryParams = {
        order: product._id,
        state: state
      };

      options.state = {
        product: product
      };
    }
    this.router.navigate([route], options);
  }

  showHistoryBuysFun() {
    if (this.notifyUser) this.bidsAndItemService.markOrdersNotified();
    this.notifyUser = false;
    this.showHistoryBuys = !this.showHistoryBuys;
  }

  showHistorySoldFun() {
    if (this.notifyUser) this.bidsAndItemService.markOrdersNotified();
    this.notifyUser = false;
    this.showHistorySold = !this.showHistorySold;
  }

  toggleEditName() {
    // checking this part when update the name
    this.nameEdit = !this.nameEdit;
    this.validNamePromo = true;
    this.validatName = true;
    if (this.nameEdit) {
      this.editProfileForm.patchValue({
        name: this.profileData?.name || ''
      });
    } else {
      this.editProfileForm.patchValue({
        name: ''
      });
    }
  }

  logout() {
    this.commonService.logOut();
  }

  deleteCard(card_id: string) {
    this.profileService.deleteCard(card_id).subscribe(
      (res) => {
        if (res) {
          this.getProfileData();
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  showAllBid(bids: Array<any>, product_id: string) {
    this.showBids = !this.showBids;
    if (product_id) {
      this.bidProductId = product_id;
    } else {
      this.bidProductId = '';
    }
    this.bids = bids;
    this.bids.forEach((bid) => {
      if (bid) {
        let bidEndDate = new Date(
          new Date(bid.bid_date).getTime() + 5 * 24 * 60 * 60 * 1000
        );
        bid.bidEndDate = this.datePipe.transform(bidEndDate, 'dd/MM/yyyy');
        bid.isExpired = bidEndDate < new Date() ? true : false;
      }
    });
  }

  renewProductListing(product_id: string) {
    this.productToRenew = product_id;
    this.commonService.renewProduct();
  }

  renew(product_id: string, days: number) {
    this.commonService.presentSpinner();
    this.bidsAndItemService.renewProduct(product_id, days).then((res) => {
      this.commonService.dismissSpinner();
      if (res) {
        this.getMySellProducts();
      }
    });
  }

  editProfile(type: 'name') {
    if (this.validNamePromo && this.validatName) {
      switch (type) {
        case 'name':
          if (this.editProfileForm.controls['name'].valid) {
            this.profileService
              .editProfile(new EditProfile(this.editProfileForm.value.name))
              .subscribe(
                (res) => {
                  this.toggleEditName(); // if !result, this will never be toggled
                  if (res) {
                    this.getProfileData();
                  }
                },
                (error) => {
                  this.commonService.errorHandler(error);
                }
              );
          }
          break;

        default:
          break;
      }
    }
  }

  goToAddBankDetails() {
    this.profileService.getBanks().subscribe(
      (res) => {
        if (res) {
          this.router.navigate(['/add-bank'], {
            state: { bankList: res.bankList }
          });
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  editBank() {
    this.router.navigate(['/add-bank'], {
      queryParams: this.profileData.bankDetail
    });
  }

  deleteBankDetail() {
    this.commonService.presentSpinner();
    this.profileService.deleteBankDetail().subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.getProfileData();
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }
  navigateToAddress() {
    this.router.navigate(['/add-address']);
  }
  goToUpdateAddress() {
    this.router.navigate(['/add-address']);
  }

  showModalReferralCode() {
    if (this.profileData && this.profileData.referralCode) {
      // implement part of code here
    } else {
      const ref = new ReferralCode(
        this.commonService.appSetting.referral_discount_type,
        this.commonService.appSetting.referral_fixed_amount,
        this.commonService.appSetting.referral_percentage
      );
      this.profileService.generateReferralCode(ref).subscribe(
        (response) => {
          this.profileService.getProfileData().then((res) => {
            if (res) {
              this.profileData = res || {};
              this.cards = this.profileService.cards;
              this.router.navigate(['/refer-and-earn']);
            }
          });
        },
        (error) => {
          this.commonService.errorHandler(error);
        }
      );
    }
  }

  openReferAndEarnPage() {
    if (!this.profileData?.referralCode) {
      this.showModalReferralCode();
      return;
    }
    this.router.navigate(['/refer-and-earn']);
  }
}
