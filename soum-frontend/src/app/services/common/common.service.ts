import { Injectable, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as phoneValidation from 'libphonenumber-js';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { DownloadAppComponent } from 'src/app/shared-components/download-app/download-app.component';
import { RedirectMessageLoginComponent } from 'src/app/shared-components/redirect-message-login/redirect-message-login.component';
import { ReferralPopupComponent } from 'src/app/shared-components/referral-popup/referral-popup.component';
import { environment } from 'src/environments/environment';
import { EventsKey } from '../core/events/events-key.constant';
import { EventsService } from '../core/events/events.service';
import { ApiEndpoints } from '../core/http-wrapper/api-endpoints.constant';
import { HttpWrapperService } from '../core/http-wrapper/http-wrapper.service';
import { StorageService } from '../core/storage/storage.service';
import { SharingDataService } from '../sharing-data/sharing-data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  isLoggedIn: boolean = false;
  currentUrl: string;
  loginRequested: { commands: Array<any>; extras?: NavigationExtras };
  countNotificatios: BehaviorSubject<number> = new BehaviorSubject(0);
  paymentType: BehaviorSubject<string> = new BehaviorSubject('');
  appSetting: any = [];
  referralTimer;
  downloadAppTimer;
  empty: boolean = false;

  httpWrapper: HttpWrapperService;
  ngxSpinner: NgxSpinnerService;
  storage: StorageService;
  translate: TranslateService;
  sharingServ: SharingDataService;

  constructor(
    private events: EventsService,
    private router: Router,
    private imageCompress: NgxImageCompressService,
    public dialog: MatDialog,
    private injector: Injector,
    private http: HttpClient
  ) {
    this.httpWrapper =
      this.injector.get<HttpWrapperService>(HttpWrapperService);
    this.ngxSpinner = this.injector.get<NgxSpinnerService>(NgxSpinnerService);
    this.storage = this.injector.get<StorageService>(StorageService);
    this.translate = this.injector.get<TranslateService>(TranslateService);
    this.sharingServ =
      this.injector.get<SharingDataService>(SharingDataService);

    this.getSystemConfiguration();
  }
  private settSub = new BehaviorSubject<any>(this.appSetting);

  public observableSett = this.settSub.asObservable();
  sendAppSettings(quessettings) {
    this.settSub.next(quessettings);
  }

  validateDescAndComment(value: string) {
    const valid =
      /[0-9]{4,}|05[0-9]{5,}|zero[-*+ &*$#@!<,>.;?_/]{1,}five{1,}|صفر[-*+ &*$#@!<,>.;?_/]{1,}(خمسه|خمسة){1,}|@|Instagram|insta|insta|snapchat|snap|add me on|contact me|إنستجرام|انستا|ضيفونى|للتواصل|اتواصل|ضيفوني|أنستجرام|انستجرام|سناب|سناب|بشات|([\u0660-\u0669]{1,}[-*+/?.>"':;^%$# @!~`]{0,}){6,}|([0-9]{1,}[-*+/?.>"':;^%$# @!~`]{0,}){7,}/gi.test(
        value
      );
    return !valid;
  }
  validateDescAndCommentPromo(value: string) {
    const valid =
      /100 riyal|discount|code|١٠٠ ريال|promo|Promo|100|riyal|riyals|referral|برومو|كود|خصم|100 ريال/gi.test(
        value
      );
    return !valid;
  }

  getCategories() {
    return this.httpWrapper.get(ApiEndpoints.category);
  }

  getBrands(category_id: string) {
    return this.httpWrapper.get(ApiEndpoints.brand(category_id));
  }

  getModels(category_id: string, brand_id: string) {
    return this.httpWrapper.get(ApiEndpoints.model(category_id, brand_id));
  }

  async validateListing(userId: string): Promise<boolean> {
    return this.httpWrapper
      .getV2(ApiEndpoints.validateListing(userId))
      .pipe(
        map((res) => {
          if (res.status === 'success') {
            return true;
          }

          return false;
        })
      )
      .toPromise()
      .catch((error) => {
        // For now, use the message and title from frontend
        this.errorHandlerV2(
          error,
          'alertPopUpTexts.productListing',
          'alertPopUpTexts.productListingInterval'
        );

        return false;
      });
  }

  async errorHandlerWithDefaultState(presentAlert?: boolean) {
    this.presentAlert({
      header: await this.getTranslatedString('alertPopUpTexts.oops'),
      message: await this.getTranslatedString(
        'alertPopUpTexts.somethingWentWrong'
      ),
      button1: {
        text: await this.getTranslatedString('alertPopUpTexts.ok'),
        handler: () => {
          this.router.navigate(['/products']);
        }
      }
    });
  }

  async errorHandlerV2(
    error: any,
    titleMsg?: string,
    bodyMsg?: string,
    cbFunc?: any
  ) {
    let errorCode = error?.status;
    if (!errorCode) {
      errorCode = error?.error?.code || -999;
    }
    const title = await this.getTranslatedString(
      titleMsg ? titleMsg : 'alertPopUpTexts.oops'
    );
    const messageBody = await this.getTranslatedString(
      bodyMsg ? bodyMsg : 'alertPopUpTexts.somethingWentWrong'
    );
    if (errorCode) {
      switch (errorCode) {
        case 401:
          if (error.url.includes(ApiEndpoints.logout)) {
            this.logoutByClearingStorage();
          } else {
            this.logout();
          }
          this.presentAlert({
            header: await this.getTranslatedString('alertPopUpTexts.oops'),
            message: error.url.includes(ApiEndpoints.logout)
              ? await this.getTranslatedString(
                  'alertPopUpTexts.sessionTimedOut'
                )
              : await this.getTranslatedString(
                  'alertPopUpTexts.sessionTimedOut2'
                ),
            button1: {
              text: await this.getTranslatedString('alertPopUpTexts.ok'),
              handler: cbFunc
                ? cbFunc
                : () => {
                    if (error.error.refresh) {
                      window.location.reload();
                    }
                  }
            }
          });
          break;
        case 400:
          this.presentAlert({
            header: title,
            message: messageBody,
            button1: {
              text: await this.getTranslatedString('alertPopUpTexts.ok'),
              handler: () => {
                this.empty = true;
              }
            }
          });
          break;
      }
    }
  }

  async errorHandler(error: any, presentAlert?: boolean) {
    if (error && error.error && error.error.code) {
      switch (error.error.code) {
        case 401:
          if (error.url.includes(ApiEndpoints.logout)) {
            this.logoutByClearingStorage();
          } else {
            this.logout();
          }
          this.presentAlert({
            header: await this.getTranslatedString('alertPopUpTexts.oops'),
            message: error.url.includes(ApiEndpoints.logout)
              ? await this.getTranslatedString(
                  'alertPopUpTexts.sessionTimedOut'
                )
              : await this.getTranslatedString(
                  'alertPopUpTexts.sessionTimedOut2'
                ),
            button1: {
              text: await this.getTranslatedString('alertPopUpTexts.ok'),
              handler: () => {
                if (error.error.refresh) {
                  window.location.reload();
                }
              }
            }
          });
          break;

        default:
          this.presentAlert({
            header: await this.getTranslatedString('alertPopUpTexts.oops'),
            message: error.error.message,
            button1: {
              text: await this.getTranslatedString('alertPopUpTexts.ok'),
              handler: () => {
                if (error.error.refresh) {
                  this.router.navigate(['/products']);
                }
              }
            }
          });
          break;
        // }
      }
    }
  }
  async logOut() {
    this.presentAlert({
      header: await this.getTranslatedString('alertPopUpTexts.logout'),
      message: await this.getTranslatedString('alertPopUpTexts.logouttext'),

      button1: {
        text: await this.getTranslatedString(`alertPopUpTexts.no`),
        handler: () => {
          this.empty = true;
        }
      },
      button2: {
        text: await this.getTranslatedString(`alertPopUpTexts.yes`),
        handler: () => {
          this.logout().then((res) => {
            window['dataLayer'] = window['dataLayer'] || [];
            window['dataLayer'].push({
              event: 'authentication',
              userId: undefined || null,
              authType: 'SignOut'
            });
            this.router.navigate(['/login/continue']);
          });
        }
      }
    });
  }

  presentSpinner() {
    this.ngxSpinner.show();
  }

  dismissSpinner() {
    this.ngxSpinner.hide();
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  presentAlert(options: AlertControllerInterface) {
    this.events.publish(EventsKey.alertController, options);
  }

  async getSystemConfiguration() {
    return this.httpWrapper
      .getV2(ApiEndpoints.appSettingV2)
      .pipe(
        map((res) => {
          if (res && res.responseData) {
            if (res.responseData instanceof Array) {
              const responseData = res.responseData;
              for (var key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                  this.appSetting[responseData[key].name] =
                    responseData[key].value;
                }
              }
              res = { ...this.appSetting };
            } else {
              this.appSetting = res.responseData;
              res = this.appSetting;
            }
            if (res?.enable_cloudianry === 'false') {
              res.MPP_cloudaniry_img_link = res.digitalocean_link_replacement;
            }
            this.sendAppSettings(res);
            sessionStorage.setItem('appSetting', JSON.stringify(res));
            return res;
          }
        })
      )
      .toPromise()
      .catch((error) => {
        this.errorHandler(error);
      });
  }

  async rejectBid() {
    this.presentAlert({
      header: await this.getTranslatedString('alertPopUpTexts.messageRejecBid'),
      message: await this.getTranslatedString('alertPopUpTexts.rejectBidtext'),
      button1: {
        text: await this.getTranslatedString(`alertPopUpTexts.ok`),
        handler: () => {
          this.empty = true;
        }
      }
    });
  }

  async acceptBid() {
    this.presentAlert({
      header: await this.getTranslatedString(
        'alertPopUpTexts.messageAcceptBid'
      ),
      message: await this.getTranslatedString('alertPopUpTexts.acceptBidtext2'),
      button1: {
        text: await this.getTranslatedString(`alertPopUpTexts.ok`),
        handler: () => {
          this.empty = true;
        }
      }
    });
  }

  async removeBidAfterAccept() {
    this.presentAlert({
      header: await this.getTranslatedString(
        'alertPopUpTexts.messageRemoveBidAfterAccept'
      ),
      message: await this.getTranslatedString('alertPopUpTexts.removeBidText2'),
      button1: {
        text: await this.getTranslatedString(`alertPopUpTexts.ok`),
        handler: () => {
          this.empty = true;
        }
      }
    });
  }

  getNotificationCount() {
    return this.httpWrapper.get(ApiEndpoints.getNotificationCount);
  }

  changeTheme(color: string) {
    document.documentElement.style.setProperty('--primary-color', `#${color}`);
  }

  calculatePriceForBuyModal(
    product: any,
    action: 'calculate' | 'reset'
  ): BuyModalPrice {
    if (this.appSetting) {
      return action == 'calculate' && product
        ? new BuyModalPrice(product, this.appSetting)
        : null;
    } else {
      this.errorHandlerWithDefaultState();
    }
  }

  calculatePriceForBuyModalWhenBidAccepted(
    product: any,
    action: 'calculate' | 'reset'
  ): BuyModalPriceWhenBidAccepted {
    if (this.appSetting) {
      return action == 'calculate' && product
        ? new BuyModalPriceWhenBidAccepted(product, this.appSetting)
        : null;
    } else {
      this.errorHandlerWithDefaultState();
    }
  }

  replaceBetween(origin, startIndex, endIndex, insertion) {
    return (
      origin.substring(0, startIndex) + insertion + origin.substring(endIndex)
    );
  }

  async logout() {
    return this.httpWrapper
      .get(ApiEndpoints.logout)
      .pipe(
        map((res) => {
          if (res) {
            this.storage.clearStorageForLogout();
            localStorage.removeItem('token');
            localStorage.removeItem('loginDetails');
            localStorage.removeItem('userDetails');
            localStorage.removeItem('userAddress');

            this.sharingServ.userData.next(null);
            this.isLoggedIn = false;
            this.router.navigate(['/login/continue']);
          }
          return res;
        })
      )
      .toPromise()
      .catch((error) => {
        this.errorHandler(error);
      });
  }

  async logoutByClearingStorage() {
    this.storage.clearStorageForLogout();
    this.isLoggedIn = false;
    this.router.navigate(['/login/continue']);
  }

  validateMobileNumber(control: FormControl) {
    let isValidNumber: any;
    let stringNumber = control.value.mobileNumber
      ? control.value.mobileNumber.toString()
      : '';
    let upperCaseCountryCode: any = environment.countryCode
      .find((country) => {
        return country.dialCode === control.value.countryCode;
      })
      .iso2.toUpperCase();
    let parseNumber: any = phoneValidation.parseNumber(
      stringNumber,
      upperCaseCountryCode
    );
    isValidNumber = phoneValidation.isValidNumber(parseNumber);
    if (isValidNumber) {
      return null;
    } else {
      return { isInValidNumber: true };
    }
  }

  async showPopUpForYourProduct(
    action: 'cannotBuy' | 'cannotBid' | 'cannotWishlist'
  ) {
    this.presentAlert({
      header: await this.getTranslatedString('alertPopUpTexts.sorry'),
      message: await this.getTranslatedString(`alertPopUpTexts.${action}`),
      button1: {
        text: await this.getTranslatedString(`alertPopUpTexts.ok`),
        handler: () => {
          this.empty = true;
        }
      }
    });
  }

  async showPopUpForYourCopy() {
    this.presentAlert({
      header: await this.getTranslatedString('alertPopUpTexts.copy'),
      message: await this.getTranslatedString('alertPopUpTexts.copyText'),
      button1: {
        text: await this.getTranslatedString(`alertPopUpTexts.ok`),
        handler: () => {
          this.empty = true;
        }
      }
    });
  }

  async presentModalForNotLogin() {
    this.presentAlert({
      header: await this.getTranslatedString('alertPopUpTexts.sorry'),
      message: await this.getTranslatedString('alertPopUpTexts.notLoggedIn'),
      button1: {
        text: await this.getTranslatedString(`alertPopUpTexts.ok`),
        handler: () => {
          this.empty = true;
        }
      }
    });
  }

  // not used function we used the address from profile services
  getAddressList() {
    return this.httpWrapper
      .get(ApiEndpoints.getAddress)
      .pipe(
        map((res) => {
          if (res.addressList.length) {
            return res.addressList;
          } else {
            return [];
          }
        })
      )
      .toPromise()
      .catch((error) => {
        this.errorHandler(error);
      });
  }

  async getTranslatedString(text: string, value?: Object) {
    return this.translate
      .get(text, value)
      .pipe(
        map((txt) => {
          return txt;
        })
      )
      .toPromise();
  }

  compressImnage(file: any) {
    return this.imageCompress.compressFile(file, 1, 200, 50);
  }

  async removeProductModal() {
    this.presentAlert({
      header: await this.getTranslatedString('alertPopUpTexts.removeProduct'),
      message: await this.getTranslatedString(
        'alertPopUpTexts.removeProductMsg'
      ),
      button1: {
        text: await this.getTranslatedString('alertPopUpTexts.yes'),
        handler: () => {
          this.events.publish(EventsKey.removeItem, '');
          console.log('remove item handler called');
          return true;
        },
        cssClass: 'remove-item-btn'
      },
      button2: {
        text: await this.getTranslatedString('alertPopUpTexts.cancel'),
        handler: () => {
          this.empty = true;
        },
        cssClass: ''
      }
    });
  }

  async renewProduct() {
    this.presentAlert({
      header: await this.getTranslatedString('alertPopUpTexts.renewProduct'),
      message: await this.getTranslatedString(
        'alertPopUpTexts.renewProductMsg'
      ),
      button1: {
        text: await this.getTranslatedString('alertPopUpTexts.yes'),
        handler: () => {
          this.events.publish(EventsKey.renewItem, '');
          return true;
        },
        cssClass: ''
      },
      button2: {
        text: await this.getTranslatedString('alertPopUpTexts.cancel'),
        handler: () => {
          this.empty = true;
        },
        cssClass: 'remove-item-btn'
      }
    });
  }

  async renewDetailedProduct() {
    this.presentAlert({
      header: await this.getTranslatedString('alertPopUpTexts.renewProduct'),
      message: await this.getTranslatedString(
        'alertPopUpTexts.renewProductMsg'
      ),
      button1: {
        text: await this.getTranslatedString('alertPopUpTexts.yes'),
        handler: () => {
          this.events.publish(EventsKey.renewDetailedItem, '');
          return true;
        },
        cssClass: ''
      },
      button2: {
        text: await this.getTranslatedString('alertPopUpTexts.cancel'),
        handler: () => {
          this.empty = true;
        },
        cssClass: 'remove-item-btn'
      }
    });
  }

  async removeBid() {
    this.presentAlert({
      header: await this.getTranslatedString('alertPopUpTexts.removeBid'),
      message: await this.getTranslatedString('alertPopUpTexts.removeBidMsg'),
      button1: {
        text: await this.getTranslatedString('alertPopUpTexts.yes'),
        handler: () => {
          this.events.publish(EventsKey.removeBid, '');
          return true;
        },
        cssClass: 'remove-item-btn'
      },
      button2: {
        text: await this.getTranslatedString('alertPopUpTexts.cancel'),
        handler: () => {
          this.empty = true;
        },
        cssClass: ''
      }
    });
  }

  async handleNavigationChange(route?: string) {
    this.dialog.open(RedirectMessageLoginComponent, {
      height: '65%',
      width: '340px',
      panelClass: 'custom-dialog-container',
      data: { route: route ? route : null }
    });
  }

  // set SA Automatically
  validateIBAN(control: FormControl) {
    if (control.value && control.value.length == 24) {
      return null;
    } else {
      return { invalidIBAN: true };
    }
  }

  activeReferralPopup() {
    this.referralTimer = setTimeout(() => {
      this.dialog.open(ReferralPopupComponent, {
        height: '380px',
        width: '300px',
        panelClass: 'custom-dialog-container'
      });
    }, 90 * 1000);
    sessionStorage.setItem('referralPopup', 'active');
  }

  activeDownloadApp() {
    this.downloadAppTimer = setTimeout(() => {
      this.dialog.open(DownloadAppComponent, {
        width: '370px',
        height: '510px',
        panelClass: 'custom-dialog-download-app'
      });
    }, 20 * 1000);
    sessionStorage.setItem('downloadAppPopup', 'active');
  }

  ReferralPopupAppearance() {
    if (sessionStorage.getItem('referralPopup')) return;
    this.activeReferralPopup();
  }
  downloadAppAppearance() {
    if (sessionStorage.getItem('downloadAppPopup')) return;
    this.activeDownloadApp();
  }

  getInvoiceLinkForOrder(orderID: any, typeUser: any) {
    return this.httpWrapper.getFullURL(
      ApiEndpoints.getInvoiceOrderLink(orderID, typeUser)
    );
  }

  async presentModalForExpireProducts() {
    this.presentAlert({
      header: await this.getTranslatedString(
        'alertPopUpTexts.titleExpireProduct'
      ),
      message: await this.getTranslatedString(
        'alertPopUpTexts.messageExpireProduct'
      ),
      button1: {
        text: await this.getTranslatedString(`alertPopUpTexts.ok`),
        handler: () => {
          this.empty = true;
        }
      }
    });
  }

  // check user have new address or not
  checkExistAddress() {
    const address = localStorage.getItem('userAddress')
      ? JSON.parse(localStorage.getItem('userAddress'))
      : null;
    if (address) {
      if (
        address.city &&
        address.district &&
        address.street &&
        address.postal_code
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getCurrentLocation():Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(res => {
        resolve({longitude: res.coords.longitude, latitude: res.coords.latitude})
      })
    })
  }

  // check user have new address || old address || not have address
  checkUserAddressStatus() {
    const userDetailsAuth = localStorage.getItem('userDetails') || null;
    if (userDetailsAuth) {
      const userDetails = JSON.parse(userDetailsAuth);
      const loggedUser = JSON.parse(userDetails);
      const oldUserAddress =
        loggedUser.address && JSON.parse(loggedUser.address) ? true : false;
      const NewAddressUser = this.checkExistAddress();
      return {
        userHaveOldAddress: oldUserAddress,
        userHaveNewAddress: NewAddressUser
      };
    }
  }
}

export class BuyModalPrice {
  amount: number;
  commission: number;
  commission_seller?:number;
  commission_seller_key?:number;
  shippingCharges: number;
  VAT: number;
  coupon?: number;
  totalAmount: number;
  constructor(product: any, appSetting: any) {
    this.amount = Number(Number(product.sell_price).toFixed(2));

    if (appSetting && appSetting.buyer_commission_percentage) {
      this.commission = Number(
        Number(
          (appSetting.buyer_commission_percentage * this.amount) / 100
        ).toFixed(2)
      );
    }
    this.commission_seller= Number(
      Number(
        (appSetting.seller_commission_percentage * this.amount) / 100
      ).toFixed(2)
    );
    this.commission_seller_key= Number(
      Number(
        (appSetting.business_seller_commission_percentage * this.amount) / 100
      ).toFixed(2)
    );
    this.shippingCharges = Number(
      Number(
        (appSetting.shipping_charge_percentage * this.amount) / 100
      ).toFixed(2)
    );
    this.VAT = Number(
      Number((appSetting.vat_percentage * this.commission) / 100).toFixed(2)
    );
    this.totalAmount = Number(
      Number(
        this.amount + this.commission + this.shippingCharges + this.VAT
      ).toFixed(2)
    );
  }
}


export class BuyModalPriceWhenBidAccepted {
  amount: number;
  commission: number;
  shippingCharges: number;
  VAT: number;
  totalAmount: number;

  constructor(product: any, appSetting: any) {
    if (appSetting && appSetting.buyer_commission_percentage) {
      this.commission = Number(
        Number(
          (appSetting.buyer_commission_percentage * product.pay_amount) / 100
        ).toFixed(2)
      );
    }
    this.shippingCharges = Number(
      Number(
        (appSetting.shipping_charge_percentage * product.pay_amount) / 100
      ).toFixed(2)
    );
    this.VAT = Number(
      Number((appSetting.vat_percentage * this.commission) / 100).toFixed(2)
    );

    this.amount = Number(
      (
        Number(product.pay_amount) -
        (Number(this.commission) +
          Number(this.shippingCharges) +
          Number(this.VAT))
      ).toFixed(2)
    );
    this.totalAmount = Number(Number(product.pay_amount).toFixed(2));
  }
}

export interface AlertControllerInterface {
  header?: string;
  message: string;
  button1: {
    text: string;
    handler?: any;
    cssClass?: string;
  };
  button2?: {
    text: string;
    cssClass?: string;
    handler?: any;
  };
}
