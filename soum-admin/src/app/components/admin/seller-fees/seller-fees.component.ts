import { CommonService } from './../../../services/common/common.service';
import { ProductsService } from './../../../services/products/products.service';
import { Entries } from './../../../models/interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seller-fees',
  templateUrl: './seller-fees.component.html',
  styleUrls: ['./seller-fees.component.scss']
})

export class SellerFeesComponent implements OnInit {
  productList: any = [];
  limit: number = 100;
  currentPage: number = 1;
  totalResult: any;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  sellerFeesStatus: boolean = true;
  currency;
  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };

  constructor(
    private productService: ProductsService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.currentPage = JSON.parse(localStorage.getItem('sellerPayments_page_number')) || 1;
    this.getSellerFeesList();
    this.currency = JSON.parse(localStorage.getItem('region')).currency;

  }

  selectPage(event) {
    localStorage.setItem('sellerPayments_page_number', event);
    this.currentPage = event;
    this.getSellerFeesList();
  }

  getSellerFeesList() {
    this.commonService.presentSpinner();
    this.productService
      .getAllSellerFees(this.limit, this.currentPage, this.sellerFeesStatus)
      .subscribe(
        (res) => {
          if (res) {
            this.productList = res.body.responseData.result.data;
            this.commonService.dismissSpinner();
            this.limit = this.limit;
            this.totalResult = res.body.responseData.result.totalResult;
            this.entries = this.commonService.calculateEntries(
              this.productList,
              this.currentPage,
              this.limit,
              this.totalResult
            );
          }
        },
        (error) => {
          this.productList = [];
          this.commonService.dismissSpinner();
          this.commonService.errorHandler(error);
        }
      );
  }

}
