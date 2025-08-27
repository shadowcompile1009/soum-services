import { Component, OnInit } from '@angular/core';
import { Entries } from 'src/app/models/interface';
import { ProductsService } from '../../../../services/products/products.service';
import { CommonService } from '../../../../services/common/common.service';
import { ProductImagesComponent } from '../products-details/products-details.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deleted-listing',
  templateUrl: './deleted-listing.component.html',
  styleUrls: ['./deleted-listing.component.scss'],
})
export class DeletedListingComponent implements OnInit {
  productList: any = [];
  limit: number = 30;
  currentPage: number = 1;
  totalResult: any;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
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
 currency;
  constructor(
    private productService: ProductsService,
    private commonService: CommonService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.currentPage =
      JSON.parse(localStorage.getItem('DletingListing_page_number')) || 1;
    this.getProductList();
    this.currency = JSON.parse(localStorage.getItem('region')).currency;

  }

  selectPage(event) {
    localStorage.setItem('DletingListing_page_number', event);
    this.currentPage = event;
    this.getProductList();
  }

  getProductList() {
    this.commonService.presentSpinner();
    this.productService
      .getAllDeletedListings(this.limit, this.currentPage)
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

  open(images: any) {
    const modalRef = this.modalService.open(ProductImagesComponent);
    modalRef.componentInstance.name = 'World';
    this.productService.sendListing(images)
  }
}
