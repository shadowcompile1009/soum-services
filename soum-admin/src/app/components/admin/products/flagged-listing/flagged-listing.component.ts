import { Component, OnInit } from '@angular/core';
import { Entries } from 'src/app/models/interface';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { CommonService } from '../../../../services/common/common.service';
import { ProductsService } from '../../../../services/products/products.service';
import { ProductImagesComponent } from '../products-details/products-details.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material';
import { DeleteListingCommentPopupComponent } from '../delete-listing-comment-popup/delete-listing-comment-popup.component';
import { LockedUserComponent } from '../locked-user/locked-user.component';

@Component({
  selector: 'app-flagged-listing',
  templateUrl: './flagged-listing.component.html',
  styleUrls: ['./flagged-listing.component.scss'],
})
export class FlaggedListingComponent implements OnInit {
  productList: any = [];
  limit: number = 50;
  currentPage: number = 1;
  totalResult: any;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  sortByParam: string = '';
  sortFlaggedListingList: any;
  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };
  customOptions = {
    responsiveClass: true,
    loop: false,
    autoplay: false,
    center: true,
    dots: true,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  };

  TOASTS = {
    PRODUCT_APPROVED: 'Product Approved!',
    PRODUCT_DISAPPROVED: 'Product Disapproved!'
  }
 currency;
  constructor(
    private commonService: CommonService,
    private productService: ProductsService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private modalService: NgbModal,
    private dialoge: MatDialog
  ) {
    this.productService.loadFrontLiners.subscribe((res) => {
      if (res) {
        this.getProductList();
        this.productService.loadFrontLiners.next(false);
      }
    })
  }

  ngOnInit(): void {
    this.currentPage =
      JSON.parse(localStorage.getItem('FraudListing_page_number')) || 1;
    this.getProductList();

    this.sortFlaggedListingList = document.getElementById('sortFlaggedListing') || null;
    document.addEventListener('click', () => this.hideSortList());
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
      .getAllFlaggedListings(this.limit, this.currentPage, this.sortByParam)
      .subscribe(
        (res) => {
          if (res) {
            this.productList = res?.body?.responseData?.result?.data;
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

  getPendingProductList() {
    this.commonService.presentSpinner();
    this.productService
      .getPendingFlaggedListings(this.limit, this.currentPage, this.sortByParam)
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

  showSortList() {
    this.sortFlaggedListingList.style.display = "block";
  }

  hideSortList() {
    this.sortFlaggedListingList.style.display = "none";
  }

  sortBy(word: string) {
    if(word == 'Pending'){
      this.getPendingProductList();
    }else {
      this.sortByParam = word;
      this.getProductList();
    }
  }

  OpenDeleteListingModel(productId: string) {
    let options = {
      title: 'Are you sure you want to delete this listing?',
      confirmLabel: 'Yes',
      declineLabel: 'No',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.openDeleteModelListing(productId);
      } else {
        //  console.log('Cancel');
      }
    });
  }

  openDeleteModelListing(productId: string) {
    this.dialoge.open(DeleteListingCommentPopupComponent, {data: {'productID': productId, actionType: 'delete', "deleteFrom": "FraudListingPage"}});
  }

  rejectListing(productId: string) {
    this.dialoge.open(DeleteListingCommentPopupComponent, {data: {'productID': productId, actionType: 'reject', "deleteFrom": "FraudListingPage"}});
  }

  approveProduct(product: any, index: number) {
    this.commonService.presentSpinner();
    this.productService
      .approveProduct(product.product_id, { isApproved: product.isApproved })
      .subscribe(
        (res) => {
          this.productList[index].isApproved = product.isApproved;
          if (res) {
            if (product.isApproved) {
              this.commonService.successToaster(this.TOASTS.PRODUCT_APPROVED);
            } else {
              this.commonService.errorToast(this.TOASTS.PRODUCT_DISAPPROVED);
            }
          }
          this.getProductList();
          this.commonService.dismissSpinner();
        },
        (error) => {
          product.isApproved = !product.isApproved;
          this.commonService.errorHandler(error);
          this.commonService.dismissSpinner()
        }
      );
  }


  updateFraudProductStatus(product: any, index: number) {
    this.commonService.presentSpinner();
    this.productService.updateFraudProductStatus(product.product_id, {verifyStatus: !product.is_verified_by_admin}).subscribe(res => {
      this.productList[index].is_verified_by_admin = !product.is_verified_by_admin;
      this.commonService.dismissSpinner()
    }, err => {
      this.commonService.dismissSpinner()
    })
  }

  open(images: any) {
    const modalRef = this.modalService.open(ProductImagesComponent);
    modalRef.componentInstance.name = 'World';
    this.productService.sendListing(images)
  }

  lockUnLockUser(user_id: string) {
    this.dialoge.open(LockedUserComponent, {data: {userID: user_id, blockUser: {isBlockUser: true, status: "Inactive"}}})
  }

}
