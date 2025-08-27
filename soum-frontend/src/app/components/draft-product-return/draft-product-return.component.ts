import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { SellerService } from 'src/app/services/seller/seller.service';

@Component({
  selector: 'app-draft-product-return',
  templateUrl: './draft-product-return.component.html',
  styleUrls: ['./draft-product-return.component.scss']
})
export class DraftProductReturnComponent {
  showModal = false;
  howToSellFirst = true;
  constructor(
    private router: Router,
    private storage: StorageService,
    private commonService: CommonService,
    private sellerService: SellerService
  ) {}

  navigateTo(route: string) {
    if (route === '/bids-and-items') {
      const savedData = this.storage.getSavedData();
      if (
        savedData &&
        savedData[storageKeys.userDetails] &&
        this.commonService.isLoggedIn
      ) {
        this.sellerService.selectedProductTab = true;
        this.router.navigate([route]);
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/products']);
    }
  }
}