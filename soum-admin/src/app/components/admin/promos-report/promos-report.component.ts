import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { ReferralReportService } from 'src/app/services/referral/referral-report.service';

@Component({
  selector: 'app-promos-report',
  templateUrl: './promos-report.component.html',
  styleUrls: ['./promos-report.component.scss']
})
export class PromosReportComponent implements OnInit {
  currentPage: number = 1;
  limit: any = 10;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  notMatchSearch: boolean;
  referralList: any;
  totalResult: any;
  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };
  searchForm: FormGroup;
  searchValue: string = '';
  constructor(
    private commonService: CommonService,
    private referralService : ReferralReportService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.currentPage = JSON.parse(localStorage.getItem('referral_page_number')) || 1;
    this.getReferralLogs();
    this.createSearchForm();
  }

  getReferralLogs() {
    this.notMatchSearch = false;
    this.commonService.presentSpinner();

    this.referralService
      .getReferralReports(this.currentPage, this.limit, this.searchValue)
      .subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          this.referralList = res.body.promoList;
          this.notMatchSearch =
            this.referralList && this.referralList.length < 1 ? true : false;
          this.limit = res.body.limit;
          this.totalResult = res.body.totalResult;
          this.entries = this.commonService.calculateEntries(
            this.referralList,
            this.currentPage,
            this.limit,
            this.totalResult
          );
        },
        (error) => {
          this.referralList = [];
          this.commonService.dismissSpinner();
          this.commonService.errorHandler(error);
        }
      );
  }

  selectPage(event) {
    this.currentPage = event;
    this.getReferralLogs();
    // console.log(event);
    localStorage.setItem('referral_page_number', event);
  }

  filterBy() {
    console.log(this.word.value);
    this.notMatchSearch = false;
    this.searchValue = this.word.value;
    this.currentPage = 1;
    this.getReferralLogs();
    this.searchForm.get('word').setValue('');
  }

  get word() {
    return this.searchForm.get('word');
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      word: [''],
    });
  }
}
