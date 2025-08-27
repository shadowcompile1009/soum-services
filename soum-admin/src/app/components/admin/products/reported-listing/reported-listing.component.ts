import { Component, OnInit } from '@angular/core';
import { Entries } from 'src/app/models/interface';
import { DeleteListingCommentPopupComponent } from '../delete-listing-comment-popup/delete-listing-comment-popup.component';
import { ProductsService } from '../../../../services/products/products.service';
import { CommonService } from '../../../../services/common/common.service';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-reported-listing',
  templateUrl: './reported-listing.component.html',
  styleUrls: ['./reported-listing.component.scss']
})

export class ReportedListingComponent implements OnInit {
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

  constructor(
    private productService: ProductsService,
    private commonService: CommonService ,
    private dialoge: MatDialog,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService
  ) {}

  ngOnInit(): void {
    this.currentPage =
      JSON.parse(localStorage.getItem('ReportListing_page_number')) || 1;
    this.getProductList();

    this.productService.loadFrontLiners.subscribe((res) => {
      if (res) {
        this.getProductList();
        this.productService.loadFrontLiners.next(false);
      }
    })
  }

  selectPage(event) {
    localStorage.setItem('ReportListing_page_number', event);
    this.currentPage = event;
    this.getProductList();
  }

  getProductList() {
    this.commonService.presentSpinner();
    this.productService
      .getAllReportedListings(this.limit, this.currentPage)
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


  OpenDeleteListingModel(productId: string) {
    let options ={
      title: 'Are you sure you want to delete this listing?',
      confirmLabel: 'Yes',
      declineLabel: 'No'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
       this.openDeleteModelListing(productId);
      } else {
      //  console.log('Cancel');
      }
    });
  }

  openDeleteModelListing(productId: string) {
    this.dialoge.open(DeleteListingCommentPopupComponent, {data: {'productID': productId, "deleteFrom": "MisMatchListing"}});
  }

}
