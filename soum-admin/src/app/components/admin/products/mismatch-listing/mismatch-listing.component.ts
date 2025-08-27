import { Component, OnInit } from '@angular/core';
import { Entries } from 'src/app/models/interface';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { MatDialog } from '@angular/material/dialog';
import { DeleteListingCommentPopupComponent } from '../delete-listing-comment-popup/delete-listing-comment-popup.component';
import { ExportDataXlsxService } from 'src/app/services/export-data-xlsx/export-data-xlsx.service';
import { CommonService } from '../../../../services/common/common.service';
import { ProductsService } from '../../../../services/products/products.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mismatch-listing',
  templateUrl: './mismatch-listing.component.html',
  styleUrls: ['./mismatch-listing.component.scss'],
})
export class MismatchListingComponent implements OnInit {
  productList: any = [];
  limit: number = 100;
  currentPage: number = 1;
  totalResult: any;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  sortByMostRecent: boolean = false;
  searchForm: FormGroup;
  searchValue: string = '';
  mismatchProductsExportXlxs: Array<any> = [];
  ProductsExportXlxs: Array<any> = [];
  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };
 currency;
  constructor(
    private commonService: CommonService,
    private productService: ProductsService,
    private dialoge: MatDialog,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private fb: FormBuilder,
    private xlsxService: ExportDataXlsxService
  ) {}

  ngOnInit(): void {
    this.currentPage =
      JSON.parse(localStorage.getItem('MisMatchListing_page_number')) || 1;
    this.getProductList();
    this.createSearchForm();

    this.productService.loadFrontLiners.subscribe((res) => {
      if (res) {
        this.getProductList();
        this.productService.loadFrontLiners.next(false)
      }
    });
    this.currency = JSON.parse(localStorage.getItem('region')).currency;

  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      word: [''],
    });
  }

  get word() {
    return this.searchForm.get('word');
  }

  selectPage(event) {
    localStorage.setItem('MisMatchListing_page_number', event);
    this.currentPage = event;
    this.getProductList();
  }

  getProductList() {
    this.commonService.presentSpinner();
    this.productService
      .getAllMisMtachListings(
        this.limit,
        this.currentPage,
        this.searchValue,
        this.sortByMostRecent ? 'sortByMostRecent=true' : ''
      )
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
    this.dialoge.open(DeleteListingCommentPopupComponent, {
      data: { productID: productId, actionType: 'delete', deleteFrom: 'MisMatchListing' },
    });
  }

  filterProductByMostRecent() {
    this.sortByMostRecent = !this.sortByMostRecent;
    this.currentPage = 1;
    this.getProductList();
  }

  // function to download Mismatch Products as xlxs file
  downloadOrderXlxs() {
    this.commonService.presentSpinner();
    this.mismatchProductsExportXlxs = [];
    this.productService.getAllMisMtachListings(-1, -1, '', this.sortByMostRecent? 'sortByMostRecent=true' : '').subscribe(res => {
      this.ProductsExportXlxs = res.body.responseData.result.data;
      this.ProductsExportXlxs?.forEach((product, index) => {
        const orderObj = {
          No: index,
          'link to pictures': product?.pictures.toString(),
          'Product ID': product?.product_id,
          'Phone Number': product?.phone_number,
           Model: product?.model?.model_name,
          'Buy Now Price': product?.buy_now_price,
          'New device Price': product?.new_device_price,
           Discount: product?.discount,
          'Listing Date': new Date(product?.listing_date).toLocaleDateString('en-GB'),
          'Product Link': `${window.location.origin}/admin/products/products-details/${product?.product_id}`,
        };
        this.mismatchProductsExportXlxs.push(orderObj);
      });
      this.commonService.dismissSpinner();
      this.xlsxService.exportAsExcelFile(this.mismatchProductsExportXlxs, 'mismatchProducts');
    }, err => {
      this.commonService.dismissSpinner();
    })
  }

    // filter products
    filterBy() {
      this.searchValue = this.word.value;
      this.currentPage = 1;
      this.getProductList();
      this.searchForm.get('word').setValue('');
    }

}
