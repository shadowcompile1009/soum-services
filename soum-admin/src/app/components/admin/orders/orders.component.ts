import { FormGroup, FormBuilder } from '@angular/forms';
import { ExportDataXlsxService } from './../../../services/export-data-xlsx/export-data-xlsx.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
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
  dispute: string = '';
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
    this.currentPage =
      JSON.parse(localStorage.getItem('order_page_number')) || 1;
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
    this.currentPage = 1;
    this.getOrders();
    this.searchForm.get('word').setValue('');
  }
  downloadBuyer(order){
   const invoiceLink = this.productsService.downloadBuyer(order._id);
    window.open(invoiceLink);
  }
  downloadSellerCredit(order){
    const invoiceLink = this.productsService.downloadSellerCredit(order._id);
     window.open(invoiceLink);
   }
   downloadcreBuyer(order){
    const invoiceLink = this.productsService.downloadBuyerCredit(order._id);
     window.open(invoiceLink);
   }
  downloadSeller(order){
    const invoiceLink = this.productsService.downloadSeller(order._id);
    window.open(invoiceLink);
  }
  public downloadPDF(order) {

   
  }
  getOrders(event?: any) {
    this.notMatchSearch = false;
    if (event) {
      this.currentPage = 1;
    }
    this.commonService.presentSpinner();
    this.productsService
      .getOrders(this.currentPage, this.limit, this.dispute, this.searchValue)
      .subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          if (res) {
            this.orderList = res.body.orderList || [];
            for(let i=0;i<this.orderList.length;i++){
              if(this.orderList[i].transaction_detail){
                this.orderList[i].transaction_detail = JSON.parse(this.orderList[i].transaction_detail);
              }
              this.orderList[i].calculated_sell_price = this.orderList[i]?.buy_amount;
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
    localStorage.setItem('order_page_number', event);
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
    // this.router.navigate(['/admin/orders/order-payout', order._id],{
    //   state: { payoutReady: order.isReadyToPayout , payout:};
    this.productsService.getOrderPayoutDetails(order._id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res && res.body) {
          this.router.navigate(['/admin/orders/order-payout', order._id], {
            state: { payoutReady: order.isReadyToPayout, payout: res.body.responseData },
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
        'Product Name': order?.product?.model_id?.model_name || '--',
        Device: order?.product?.category_id?.category_name || '--',
        Brand: order?.product?.brand_id?.brand_name || '--',
        Model: order?.product?.model_id?.model_name || '--',
        Variant: order?.product?.varient || '--',
        'Sell Price': order?.grand_total || '--',
        'Tracking Status': order?.status || '--',
        'Cteate Date': order?.created_at?.split('T')[0] || '--',
        'Delivery Date': order?.delivery_time?.split('T')[0] || '--',
        Commission: order?.commission || '--',
        Dispute: order?.dispute || '--',
        'Buy Amount': order?.buy_amount || '--',
        'Buy Type': order?.buy_type || '--',
        'Shipping Charge': order?.shipping_charge || '--',
        'Transaction ID': order?.transaction_id || '--',
        'Transaction Status': order?.transaction_status || '--',
        'Transaction Time stamp':order?.transaction_detail?.timestamp || '--',
        'Source Platform':order?.sourcePlatform || '--',
        'Seller Mobile Number': order?.seller?.mobileNumber || '--',
        'Seller Name': order?.seller?.name || '--',
        'Buyer Mobile Number': order?.buyer?.mobileNumber || '--',
        'Buyer Name': order?.buyer?.name || '--',
        'Payment Received From Buyer': order?.paymentReceivedFromBuyer || '--',
        'Payment Made To Seller': order?.paymentReceivedFromSeller || '--',
        'Payment Type': order?.payment_type || '--',
      };
      this.orderExportXlxs.push(orderObj);
    });
    this.xlsxService.exportAsExcelFile(this.orderExportXlxs, 'Orders');
  }
}
