import { Component, OnInit } from '@angular/core';
import { Entries } from 'src/app/models/interface';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { CommonService } from '../../../../services/common/common.service';
import { ProductsService } from '../../../../services/products/products.service';

@Component({
  selector: 'app-onhold-listing',
  templateUrl: './onhold-listing.component.html',
  styleUrls: ['./onhold-listing.component.scss']
})
export class OnholdListingComponent implements OnInit {

  productList: any = [];
  limit: number = 100;
  currentPage: number = 1;
  totalResult: any;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };
  currency;
  constructor(
    private commonService: CommonService,
    private productService: ProductsService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService
  ) {}

  ngOnInit(): void {
    this.currentPage =
      JSON.parse(localStorage.getItem('FraudListing_page_number')) || 1;
    this.getProductList();
    this.currency = JSON.parse(localStorage.getItem('region')).currency;

  }

  selectPage(event) {
    localStorage.setItem('FraudListing_page_number', event);
    this.currentPage = event;
    this.getProductList();
  }

  getProductList() {
    this.commonService.presentSpinner();
    this.productService
      .getAllOnholdListings(this.limit, this.currentPage)
      .subscribe(
        (res) => {
          if (res) {
            this.productList = res.body.responseData.result.data;
            this.commonService.dismissSpinner();
            this.limit = this.limit;
            this.totalResult = res.body.responseData.result.totalResult || 0;
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

  OpenDeleteListingModel(productId: string) {
    let options = {
      title: 'Are you sure you want to delete this listing?',
      confirmLabel: 'Yes',
      declineLabel: 'No',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.deleteListingAndSendFeedback(productId);
      } else {
        //  console.log('Cancel');
      }
    });
  }

  deleteListingAndSendFeedback(productID: string) {
    this.commonService.presentSpinner();
    this.productService
      .deleteOrRejectListingProduct(productID, "delete", 'Product Is Fraud')
      .subscribe(
        (res) => {
          this.commonService.successToaster(
            'Fraud Listing deleted successfully'
          );
          this.getProductList();
          setTimeout(() => {
            this.commonService.dismissSpinner();
          }, 1500);
        },
        (err) => {
          this.commonService.dismissSpinner();
          this.commonService.errorToast('Something went wrong');
        }
      );
  }

  approveProduct(product: any) {
    this.productService
      .approveProduct(product.product_id, { isApproved: product.isApproved })
      .subscribe(
        (res) => {
          if (res) {
            if (product.isApproved) {
              this.commonService.successToaster('Product Approved!');
            } else {
              this.commonService.errorToast('Product Disapproved!');
            }
            this.getProductList();
          }
        },
        (error) => {
          product.isApproved = !product.isApproved;
          this.commonService.errorHandler(error);
        }
      );
  }
}
