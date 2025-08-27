import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { REGEX } from 'src/app/constants/regex.constants';
import { AuthorizationService } from '../auth/authorization.service';
import { CommonService } from '../common/common.service';
import { ApiEndpoints } from '../core/http-wrapper/api-endpoints.constant';
import { HttpWrapperService } from '../core/http-wrapper/http-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileData: any = [];
  cards: Array<any> = [];
  addresses: Array<any> = [];

  constructor(
    private httpWrapper: HttpWrapperService,
    private commonService: CommonService,
    private router: Router,
    private authSerivce: AuthorizationService
  ) {}
  private profSub = new BehaviorSubject<any>(this.profileData);
  public observableprofile = this.profSub.asObservable();
  senddata(quessettings) {
    this.profSub.next(quessettings);
  }
  async getProfileData() {
    return this.httpWrapper
      .get(ApiEndpoints.profile)
      .pipe(
        map((res) => {
          if (res && res.UserData) {
            this.senddata(res.UserData);
            this.profileData = res.UserData || {};
            if (!this.profileData.name) {
              this.authSerivce.signupForm = new FormGroup({
                countryCode: new FormControl(
                  this.profileData.countryCode,
                  Validators.compose([Validators.required])
                ),
                mobileNumber: new FormControl(
                  this.profileData.mobileNumber,
                  Validators.compose([Validators.required])
                ),
                name: new FormControl(
                  '',
                  Validators.compose([
                    Validators.required,
                    Validators.pattern(REGEX.name)
                  ])
                ),
                password: new FormControl(
                  '',
                  Validators.compose([
                    Validators.required,
                    Validators.minLength(5)
                  ])
                ),
                confirmPassword: new FormControl(
                  '',
                  Validators.compose([Validators.required])
                )
              });
              this.router.navigate(['/signup/password']);
            }
            localStorage.setItem('mobileNumber', res.UserData.mobileNumber);
            return res.UserData;
          }
        })
      )
      .toPromise()
      .catch((error) => {
        this.commonService.errorHandler(error);
      });
  }

  async getAddresses() {
    return this.httpWrapper
      .get(ApiEndpoints.getAddress)
      .pipe(
        map((res) => {
          if (res && res.addressList) {
            this.addresses = res.addressList;
            return res;
          }
        })
      )
      .toPromise()
      .catch((error) => {
        this.commonService.errorHandler(error);
      });
  }

  addAddress(payload: AddAddress) {
    return this.httpWrapper.post(ApiEndpoints.addAddress, payload);
  }

  updateAddress(payload: AddAddress, address_id: string) {
    return this.httpWrapper.put(
      ApiEndpoints.updateAddress(address_id),
      payload
    );
  }

  deleteAddress(address_id: string) {
    return this.httpWrapper.delete(ApiEndpoints.deleteAddress(address_id));
  }

  async getCards() {
    return this.httpWrapper
      .get(ApiEndpoints.getCards)
      .pipe(
        map((res) => {
          if (res && res.cardList) {
            this.cards = res.cardList;
            return res;
          }
        })
      )
      .toPromise()
      .catch((error) => {
        this.commonService.errorHandler(error);
      });
  }

  addCard(payload: AddCard) {
    return this.httpWrapper.post(ApiEndpoints.addCard, payload);
  }

  deleteCard(card_id: string) {
    return this.httpWrapper.delete(ApiEndpoints.deleteCard(card_id));
  }

  editProfile(payload: EditProfile) {
    return this.httpWrapper.put(ApiEndpoints.editProfile, payload);
  }

  generateReferralCode(payload: ReferralCode) {
    return this.httpWrapper.post(ApiEndpoints.generateReferralCode, payload);
  }

  addBankAccount(payload: AddBank) {
    return this.httpWrapper.post(ApiEndpoints.addBank, payload);
  }

  getBanks() {
    return this.httpWrapper.get(ApiEndpoints.bankList);
  }

  deleteBankDetail() {
    return this.httpWrapper.delete(ApiEndpoints.deleteBankDetail);
  }

  // this function to save user address in storage after login and signup
  getNewUserAddress() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const loggedUser = JSON.parse(userDetails) || null;
    loggedUser &&
      this.httpWrapper
        .getV2(ApiEndpoints.getNewAddressv2(loggedUser?.userId))
        .subscribe(
          (address) => {
            const userAddress =
              address.responseData.length > 0
                ? address.responseData[address.responseData.length - 1]
                : '';
            if (userAddress) {
              localStorage.setItem('userAddress', JSON.stringify(userAddress));
            }
          },
          (err) => {
            this.commonService.errorHandler(err);
          }
        );
  }

  // this function to get new user
  getNewUserAddressFormat() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const loggedUser = JSON.parse(userDetails) || null;
    return this.httpWrapper.getV2(
      ApiEndpoints.getNewAddressv2(loggedUser?.userId)
    );
  }

  addNewAddressV2(userId: string, payload: any) {
    return this.httpWrapper.postV2(
      ApiEndpoints.addNewAddressv2(userId),
      payload
    );
  }

  updateAddressV2(userId: string, addressId: string, payload: any) {
    return this.httpWrapper.putV2(
      ApiEndpoints.updateAddressv2(userId, addressId),
      payload
    );
  }

  deleteAddressV2(userId: string, addressId: string) {
    return this.httpWrapper.deleteV2(
      ApiEndpoints.deleteAddressv2(userId, addressId)
    );
  }

    // function to check the user listed products before or not => get User Preference
    getUserPrefernences() {
      return this.httpWrapper.getV2(ApiEndpoints.checkUserListedBefore);
    }
  
    // function to update the user Preference
    updateUserPrefernences(data: any) {
      return this.httpWrapper.putV2(ApiEndpoints.checkUserListedBefore, data);
    }

    // function to get after and before update
    checkUserPrefernences() {
      this.getUserPrefernences().subscribe((data:any) => {
        localStorage.setItem('skip_post_listing', JSON.stringify(data?.responseData?.preferences?.skip_post_listing));
        localStorage.setItem('skip_pre_listing', JSON.stringify(data?.responseData?.preferences?.skip_pre_listing));
      })
    }
}

export class AddAddress {
  street: string;
  city: string;
  postal_code: number;
  district: string;
  address_type: string;
  latitude: string;
  longitude: string;
  is_verified?: boolean;

  constructor(payload: {
    street: string;
    city: string;
    postal_code: number;
    district: string;
    address_type: string;
    latitude: string;
    longitude: string;
    is_verified?: boolean;
  }) {
    this.address_type = payload.address_type;
    this.street = payload.street;
    this.city = payload.city;
    this.postal_code = payload.postal_code;
    this.district = payload.district;
    this.latitude = payload.latitude;
    this.longitude = payload.longitude;
    this.is_verified = payload.is_verified;
  }
}

export class AddCard {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cardType: string;

  constructor(payload: {
    cardHolderName: string;
    cardNumber: string;
    expiryDate: string;
    cardType: string;
  }) {
    this.cardHolderName = payload.cardHolderName;
    this.cardNumber = payload.cardNumber;
    this.expiryDate = payload.expiryDate;
    this.cardType = payload.cardType;
  }
}

export class EditProfile {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class ReferralCode {
  promoType: string;
  discount: number;
  percentage: number;
  constructor(promoType: string, discount: number, percentage: number) {
    this.promoType = promoType;
    this.discount = discount;
    this.percentage = percentage;
  }
}
export class AddBank {
  accountHolderName: string;
  accountId: string;
  bankBIC: string;
  bankName: string;

  constructor(payload: {
    accountHolderName: string;
    accountId: string;
    bankBIC: string;
    bankName: string;
  }) {
    this.accountHolderName = payload.accountHolderName;
    this.accountId = payload.accountId;
    this.bankBIC = payload.bankBIC;
    this.bankName = payload.bankName;
  }
}
