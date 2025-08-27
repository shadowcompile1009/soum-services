import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { REGEX } from 'src/app/constants/regex';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import {
  UpdateUser,
  UsersService,
  UserStatus,
} from 'src/app/services/users/users.service';

declare var $: any;
@Component({
  selector: 'app-bids',
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.scss'],
})
export class BidsComponent implements OnInit {
  bidList: any;
  limit: any = 100;
  totalResult: any;
  currentPage: number = 1;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
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
    private usersService: UsersService,
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.currentPage = JSON.parse(localStorage.getItem('bid_page_number')) || 1;
    this.getBidsListing();
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


  getBidsListing() {
    this.notMatchSearch = false;
    this.commonService.presentSpinner();
    this.usersService.getBidsLists(this.currentPage, this.limit, this.searchValue).subscribe(
      (res) => {
        this.bidList = res.body.BidsData.bidsList;
        this.commonService.dismissSpinner();
        this.notMatchSearch =
          this.bidList && this.bidList.length < 1 ? true : false;

        this.limit = res.body.BidsData.limit;
        this.totalResult = res.body.BidsData.totalResult;
        this.entries = this.commonService.calculateEntries(
          this.bidList,
          this.currentPage,
          this.limit,
          this.totalResult
        );
      },
      (error) => {
        this.bidList = [];
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  selectPage(event) {
    this.currentPage = event;
    this.getBidsListing();
    localStorage.setItem('bid_page_number', event);
  }

  // filter bids
  filterBy() {
    this.notMatchSearch = false;
    this.searchValue = this.word.value;
    this.currentPage = 1;
    this.getBidsListing();
    this.searchForm.get('word').setValue('');
  }
}
