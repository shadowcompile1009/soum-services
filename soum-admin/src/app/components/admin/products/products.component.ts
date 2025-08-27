import { Component, OnInit } from '@angular/core';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { ExportDataXlsxService } from 'src/app/services/export-data-xlsx/export-data-xlsx.service';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productList: any;
  productType = [];
  limit: any = 100;
  totalResult: any;
  TotalCounter: any;
  AvailableCounter: any;
  AvailableAndExpiredCounter: any;
  AvailableAndNotExpiredCounter: any;
  SoldCounter: any;
  LockedCounter: any;
  renewVal: number = 15;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  currentPage: number = 1;
  productsExportXlxs: Array<any> = [];
  searchForm: FormGroup;
  searchValue: string = '';
  notMatchSearch: boolean = false;
  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };
 currency;
  constructor(
    private productService: ProductsService,
    private commonService: CommonService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private xlsxService: ExportDataXlsxService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.currentPage =
      JSON.parse(localStorage.getItem('prod_page_number')) || 1;
    this.getProductList();
    this.createSearchForm();
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

  action(id) {
    let options = {
      title: 'Are you Sure you want to delete this product?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        // console.log('Okay' , id);
        //  (click)="deleteProduct(product?._id)"
        this.deleteProduct(id);
      } else {
        //  console.log('Cancel');
      }
    });
  }

  renewAll() {

    let options = {
      title: 'Are you Sure you want to Reneww All products?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
            this.productService
            .renewAll(this.currentPage, this.limit, this.searchValue, this.renewVal)
            .subscribe(
              (res) => {
                if (res) {
                  this.getProductList();
                }
              },
              (error) => {
                this.commonService.errorHandler(error);
              }
            );
      } else { }
    });


  }

  renew(product_id) {
    let options = {
      title: 'Are you Sure you want to Reneww this product?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
            this.productService.renewProduct(product_id, this.renewVal).subscribe(
              (res) => {
                if (res) { this.getProductList();}
              },
              (error) => {this.commonService.errorHandler(error);}
            );
      } else { }
    });
  }

  ChangingValue(val) {
    this.renewVal = val;
  }

  validRenew(sellStatus, expiryDate) {
    let currentDate = new Date().toISOString();
    let expireDate = new Date(expiryDate).toISOString();
    if (
      sellStatus == 'Expired' &&
      new Date(expireDate) < new Date(currentDate)
    ) {
      return true;
    } else {
      return false;
    }
  }

  getProductList(productTypeParam?) {
    this.notMatchSearch = false;
    this.commonService.presentSpinner();
    this.productService
      .getProducts(
        this.currentPage,
        this.limit,
        productTypeParam ? productTypeParam :this.productType,
        this.searchValue
      )
      .subscribe(
        (res) => {
          if (res) {
            this.productList = res.body.docs;
            this.commonService.dismissSpinner();
            this.notMatchSearch =
              this.productList && this.productList.length < 1 ? true : false;
            this.limit = res.body.limit;
            this.totalResult = res.body.total;
            this.TotalCounter = res.body.total;

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

  selectPage(event) {
    this.currentPage = event;
    if (this.productType.length) {
      let productTypeParams = [];
      for (const iterator of this.productType) {
        productTypeParams.push(`productTypes[]=${iterator}`);
      }
      const productTypeParam = productTypeParams.join('&');
      this.getProductList(productTypeParam);
    } else {
      this.getProductList();
    }
    localStorage.setItem('prod_page_number', event);
  }

  deleteProduct(product_id: string) {
    this.productService.deleteProduct(product_id).subscribe(
      (res) => {
        if (res) {
          this.getProductList();
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  approveProduct(product: any) {
    this.productService
      .approveProduct(product._id, { isApproved: product.isApproved })
      .subscribe(
        (res) => {
          if (res) {
            if (product.isApproved) {
              this.commonService.successToaster('Product approved!');
            } else {
              this.commonService.errorToast('Product disapproved!');
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

  // function to download orders as xlxs file
  downloadOrderXlxs() {
    this.productsExportXlxs = [];
    this.productList.forEach((product) => {
      const orderObj = {
        Name: product?.modelData?.model_name || '--',
        Device: product?.categoryData?.category_name || '--',
        Brand: product?.brandData?.brand_name || '--',
        Model: product?.modelData?.model_name || '--',
        Variant: product?.varient || '--',
        'Current Market Price': product?.modelData?.current_price || '--',
        'Buy Now Price': product?.sell_price || '--',
        'Bid Price': product?.bid_price || '--',
        'No. of Bids': product?.bid_count || '--',
        IsApproved: product?.isApproved || '--',
        'Seller Name': product?.sellerData?.name || '--',
        Status: product?.status || '--',
      };
      this.productsExportXlxs.push(orderObj);
    });
    this.xlsxService.exportAsExcelFile(this.productsExportXlxs, 'Products');
  }

  // filter products
  filterBy() {
    this.notMatchSearch = false;
    this.searchValue = this.word.value;
    this.currentPage = 1;
    this.getProductList();
    this.searchForm.get('word').setValue('');
  }

  getDurationDate(createdDate, expiryDate) {
    let date1 = new Date(expiryDate);
    let date2 = new Date(createdDate);
    let start = Math.floor(date1.getTime() / (3600 * 24 * 1000)); //days as integer from..
    let end = Math.floor(date2.getTime() / (3600 * 24 * 1000)); //days as integer from..
    let daysDiff = start - end; // exact dates
    return daysDiff;
  }

  getExpirationDate(expiryDate) {
    let date1 = new Date(expiryDate);
    let date2 = new Date();
    let start = Math.floor(date1.getTime() / (3600 * 24 * 1000)); //days as integer from..
    let end = Math.floor(date2.getTime() / (3600 * 24 * 1000)); //days as integer from..
    let daysDiff = start - end; // exact dates
    return daysDiff > 0 ? daysDiff : 0;
  }

  filterTypeProduct(type) {
    this.currentPage = 1;
    if (!this.productType.includes(type)) {
      this.productType.push(type);
    } else {
      this.productType = this.productType.filter(e => e !== type);
    }
    let productTypeParams = [];
    for (const iterator of this.productType) {productTypeParams.push(`productTypes[]=${iterator}`)}
    const productTypeParam = productTypeParams.join('&')
    this.getProductList(productTypeParam);
  }
}
