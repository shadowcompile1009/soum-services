import { ExportDataXlsxService } from 'src/app/services/export-data-xlsx/export-data-xlsx.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-success-orders',
  templateUrl: './success-orders.component.html',
  styleUrls: ['./success-orders.component.scss']
})
export class SuccessOrdersComponent implements OnInit {

  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };
  limit: any = 100;
  totalResult: any;
  currentPage: number = 1;
  orderList: Array<any> = [];
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  dispute: string = 'Success';
  searchValue: string = '';
  orderExportXlxs: Array<any> = [];
  searchForm: FormGroup;
  notMatchSearch: boolean = false;
  currency;
  constructor(
    private commonService: CommonService,
    private productsService: ProductsService,
    private router: Router,
    private xlsxService: ExportDataXlsxService,
    private fb: FormBuilder
  ) {
    this.currentPage = JSON.parse(localStorage.getItem('success_order_page_number')) || 1;
    this.getOrders();
  }

  ngOnInit(): void {
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

  filterBy() {
    this.notMatchSearch = false;
    this.searchValue = this.word.value;
    this.dispute=this.word.value == '' ? 'Success' : '';
    this.currentPage = 1;
    this.getOrders();
    this.searchForm.get('word').setValue('');
  }

  getOrders() {
    this.notMatchSearch = false;
    this.commonService.presentSpinner();
    this.productsService
      .getOrders(this.currentPage, this.limit, this.dispute, this.searchValue)
      .subscribe((res) => {
          this.commonService.dismissSpinner();
          if (res) {
            this.orderList = res.body.orderList || [];
            for(let i=0;i<this.orderList.length;i++){
              if(this.orderList[i].transaction_detail){
                this.orderList[i].transaction_detail = JSON.parse(this.orderList[i].transaction_detail);
              }
            }
            this.notMatchSearch =
              this.orderList && this.orderList.length < 1 ? true : false;
              this.limit = res.body.limit;
              this.totalResult = res.body.totalResult;
              this.entries = this.commonService.calculateEntries(
              this.orderList,
              this.currentPage,
              this.limit,
              this.totalResult
            );
          }
        },
        (error) => {
          this.orderList = [];
          this.commonService.dismissSpinner();
          this.commonService.errorHandler(error);
        }
      );
  }

  selectPage(event) {
    this.currentPage = event;
    this.getOrders();
    localStorage.setItem('success_order_page_number', event);
  }

  payoutReady(order: any) {
    this.commonService.presentSpinner();
    var obj = {
      "orders": [order._id]
    }
    this.productsService.readyPayout(obj).subscribe(
      (res) => {
        this.commonService.dismissSpinner();

        this.commonService.successToaster(res.body.message);
        this.getOrders();
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  viewOrderDetail(order: any) {
    this.commonService.presentSpinner();
    this.productsService.getOrderDetail(order._id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res && res.body) {
          this.router.navigate(['/admin/orders/order-details', order._id], {
            state: { order: res.body.OrderData },
          });
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  viewOrderPayout(order: any) {
    this.commonService.presentSpinner();
    this.productsService.getOrderPayout(order._id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res && res.body) {
          this.router.navigate(['/admin/orders/order-payout', order._id], {
            state: { payoutReady: order.isReadyToPayout, payout: res.body.orderData },
          });
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }
  // function to download orders as xlxs file
  downloadOrderXlxs() {
    this.orderExportXlxs = [];
    this.orderList.forEach((order) => {
      const orderObj = {
        'Order ID': order?.order_number || '--',
        'Product ID': order?.product?._id || '--',
        'Status': order?.transaction_status || '--',
        'Created Date':order?.created_at?.split('T')[0] || '--',
        'Seller Name': order?.seller?.name || '--',
        'Seller Phone': order?.seller?.mobileNumber || '--',
        'Seller City': order?.seller?.city || '--',
        'Seller Referral Cdoe': order?.seller?.referralCode || '--',
        'Buyer Name': order?.buyer?.name || '--',
        'Buyer Phone': order?.buyer?.mobileNumber || '--',
        'Buyer City': order?.buyer?.city || '--',
        'Order Model': order?.product?.model_id?.model_name || '--',
        'Buyer Referral Cdoe': order?.buyer?.referralCode || '--',
        'Grand Total for Buyer': this.convertNumbers(order?.grand_total) || '--',
        'Sell Price': (order?.buy_type == "Direct"? this.convertNumbers(order?.product?.sell_price) : this.convertNumbers(order?.product?.bidding[order?.product?.bidding?.length - 1]?.bid_price)) || '--',
      };
      this.orderExportXlxs.push(orderObj);
    });
    this.xlsxService.exportAsExcelFile(this.orderExportXlxs, 'Orders');
  }

  convertNumbers(number) {
    return Number(Number(number).toFixed(2))
  }
}
