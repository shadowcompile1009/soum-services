import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BidsAndItemsService } from 'src/app/services/bids-and-items/bids-and-items.service';
import {
  BuyModalPrice,
  CommonService
} from 'src/app/services/common/common.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product;
  @Input() userDetail;
  @Output() favoEmitter = new EventEmitter();
  constructor(
    private router: Router,
    public translate: TranslateService,
    private bidsAndItemsService: BidsAndItemsService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.bidsAndItemsService.sendRouter(true);
  }
  checkGrade(grade) {
    if (grade) {
      if (grade.includes('Like New')) {
        return 'excellent';
      }
      if (grade.includes('Lightly Used')) {
        return 'great';
      }
      if (grade.includes('Fair')) {
        return 'good';
      }
      if (grade.includes('Extensive Use')) {
        return 'extensive';
      }
    }
  }
  getOverAllPrice(product): BuyModalPrice {
    return this.commonService.calculatePriceForBuyModal(product, 'calculate');
  }
  favorite(product) {
    this.favoEmitter.emit(product);
  }
  async navigateTo(route: string, product: any) {
    let options: NavigationExtras = {};
    if (!this.userDetail) {
      this.commonService.handleNavigationChange();
      this.commonService.isLoggedIn = false;
    } else {
      if (route === '/product-detail' && product) {
        options.queryParams = {
          product: product._id
        };
      }
      if (route === '/order' && product) {
        options.queryParams = {
          order: product._id
        };
      }
      this.router.navigate([route], options);
    }
  }
}
