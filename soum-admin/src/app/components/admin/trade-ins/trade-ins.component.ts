import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products/products.service';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { UsersService } from 'src/app/services/users/users.service';
declare var $: any;

@Component({
  selector: 'app-trade-ins',
  templateUrl: './trade-ins.component.html',
  styleUrls: ['./trade-ins.component.scss']
})
export class TradeInsComponent implements OnInit {

  productList: any[] = [];
  limit: any = 100;
  totalResult: any;
  currentPage: number = 0;
  userToUpdate: any = {};
  productType = [];
  TotalCounter: any;
  AvailableCounter: any;
  SoldCounter: any;
  LockedCounter: any;
  AvailableAndExpiredCounter: any;
  AvailableAndNotExpiredCounter: any;

  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  usersExportXlxs: Array<any> = [];
  searchForm: FormGroup;
  searchValue: string = '';
  notMatchSearch: boolean = false;
  filterUserBy: string = '';
  filterParams: any = '';
  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };

  constructor(
    private productService: ProductsService,
    private usersService: UsersService,
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getProductList();
    this.createSearchForm();
  }


  createSearchForm() {
    this.searchForm = this.fb.group({
      word: [''],
    });
  }

  get word() {
    return this.searchForm.get('word');
  }

  getProductList(productTypeParam?) {
    this.notMatchSearch = false;
    this.commonService.presentSpinner();
    this.productService.getTradeInProducts(this.currentPage, this.limit, this.searchValue)
      .subscribe(
        (res) => {
          if (res) {

            this.productList = res.body.responseData.items;
            this.commonService.dismissSpinner();
            this.notMatchSearch =
              this.productList && this.productList.length < 1 ? true : false;
            this.limit = res.body.responseData.limit;
            this.totalResult = res.body.responseData.total;

            this.entries = {
              from: this.currentPage + 1,
              to: this.productList.length,
              total: this.productList.length
            }

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
    this.getProductList();
    localStorage.setItem('user_page_number', event);
  }

  getItemDetails(productId: string) {
    this.router.navigate(['/admin/trade-in/details', productId]);
  }

  // filter users
  filterBy() {
    this.notMatchSearch = false;
    this.filterUserBy = '';
    this.filterParams = '';
    this.searchValue = this.word.value;
    this.currentPage = 1;
    this.getProductList();
    this.searchForm.get('word').setValue('');
  }

}
