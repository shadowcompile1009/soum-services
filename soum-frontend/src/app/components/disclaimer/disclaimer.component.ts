import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { CommonService } from 'src/app/services/common/common.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent implements OnInit {
  customOptions = {
    loop: false,
    autoplay: true,
    autoplayTimeout: 5000,
    center: true,
    dots: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  };
  showModal = false;
  howToSellFirst = true;
  constructor(
    private router: Router,
    private storage: StorageService,
    private commonService: CommonService,
    private modalService: ModalService
  ) {
    this.openSuccessModal();
  }

  validateListingConditions(userId: string): Promise<boolean> {
    this.apiHit = false;
    return this.commonService.validateListing(userId).then((res) => {
      this.apiHit = true;
      return res;
    });
  }

  ngOnInit(): void {
    firebase.analytics().logEvent('user_clicks_sell_now_btn');
  }

  async navigateTo(route: string) {
    if (route === '/select-devices') {
      const savedData = this.storage.getSavedData();
      if (
        savedData &&
        savedData[storageKeys.userDetails] &&
        this.commonService.isLoggedIn
      ) {
        try {
          this.commonService.presentSpinner();
          const validListingAction = await this.validateListingConditions(
            savedData.userDetails.userId
          );
          this.commonService.dismissSpinner();
          if (!validListingAction) {
            return;
          }

          this.router.navigate([route]);
        } catch {
          this.commonService.dismissSpinner();
        }
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/products']);
    }
  }

  showSecond = false;
  showFirst = true;
  showThird = false;
  showForth = false;
  selectedCategory: any;
  products: any = [];
  userDetail: any;
  filterApplied: boolean;
  sortingApplied: boolean;
  arabic: boolean;
  apiHit: boolean;
  carouselOptions = {
    rtl: false,
    loop: false,
    autoplay: false,
    center: false,
    dots: true,
    items: 4,
    margin: 10,
    stagePadding: 15,
    width: 70
  };

  hideThird() {
    this.showModal = true;
    this.openSuccessModal();
  }
  openSuccessModal() {
    this.modalService.openSellModal({
      value: 'showFirstSell'
    });
  }
}
