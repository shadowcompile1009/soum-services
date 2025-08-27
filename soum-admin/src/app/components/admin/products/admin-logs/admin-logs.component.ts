import { CommonService } from './../../../../services/common/common.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-logs',
  templateUrl: './admin-logs.component.html',
  styleUrls: ['./admin-logs.component.scss']
})


export class AdminLogsComponent {
  currency;
  logsAdmin = [];

  productId: string;
  constructor(
    private router: Router,
    private _location: Location,
    private productServ: ProductsService,
    private activatedRoute: ActivatedRoute,
    private commonServ: CommonService) 
    { 
      this.getProductId();
      this.currency = JSON.parse(localStorage.getItem('region')).currency;

    }

  getProductId() {
    this.activatedRoute.params.subscribe((params) => {
      if (params && params.id) {
        this.productId = params.id;
        this.logsPrductPrice(this.productId);
      } else {
        this._location.back();
      }
    });
  }

  goBack() {
    this._location.back()
  }


  logsPrductPrice(productID: string) {
    this.commonServ.presentSpinner();
    this.productServ.logsProductPrice(productID).subscribe((res) => {
      if(res.body.responseData.length>0) {
        this.prepareLogsAmdin(res.body.responseData)
      } else{
        this.logsAdmin=null;
       this.commonServ.dismissSpinner();
      }
    }, err => {
      console.log('err ----------> ', err);
      this.commonServ.dismissSpinner();
    })
  }

  prepareLogsAmdin(logs) {
    let logsArr = [];
    this.logsAdmin = [];
    logs.forEach((log: any) => {
      const objLog = {
        adminName: log?.userId?.name, 
        type: log?.description.indexOf("Buy")>=0 ? "Buy" : "Bid", 
        from: log?.description.split('from ')[1].split(' ')[0], 
        to: log?.description.split('to ')[1].split(' ')[0], 
        date: log?.description.split('at ')[1]
      }
      logsArr.push(objLog)
    });
    setTimeout(() => {
      this.commonServ.dismissSpinner();
      this.logsAdmin = logsArr;
    }, 1000);
  }

  back(url){
    this.router.navigate([url])
  }
}
