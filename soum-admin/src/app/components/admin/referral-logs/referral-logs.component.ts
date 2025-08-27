import { Component, OnInit } from '@angular/core';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { ReferralLogsService } from 'src/app/services/referral-logs/referral-logs.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-referral-logs',
  templateUrl: './referral-logs.component.html',
  styleUrls: ['./referral-logs.component.scss'],
})
export class ReferralLogsComponent implements OnInit {
  currentPage: number = 1;
  limit: any = 10;
  referralLogs: any;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  totalResult: any;
  searchForm: FormGroup;
  searchValue: string = '';

  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };
  notMatchSearch: boolean;
  constructor(
    private referralLogsService: ReferralLogsService,
    private commonService: CommonService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentPage =
      JSON.parse(localStorage.getItem('referral_log_page_number')) || 1;
    this.getReferralLogs();
    this.createSearchForm();
  }

  get word() {
    return this.searchForm.get('word');
  }

  getReferralLogs() {
    this.notMatchSearch = false;
    this.commonService.presentSpinner();

    this.referralLogsService
      .getReferralLogs(this.currentPage, this.limit, this.searchValue)
      .subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          this.referralLogs = res.body.logList;
          this.notMatchSearch =
            this.referralLogs && this.referralLogs.length < 1 ? true : false;
          this.limit = res.body.limit;
          this.totalResult = res.body.totalResult;
          this.entries = this.commonService.calculateEntries(
            this.referralLogs,
            this.currentPage,
            this.limit,
            this.totalResult
          );
        },
        (error) => {
          this.referralLogs = [];
          this.commonService.dismissSpinner();
          this.commonService.errorHandler(error);
        }
      );
  }

  selectPage(event) {
    this.currentPage = event;
    this.getReferralLogs();
    // console.log(event);
    localStorage.setItem('referral_log_page_number', event);
  }

  filterBy() {
    console.log(this.word.value);
    this.notMatchSearch = false;
    this.searchValue = this.word.value;
    this.currentPage = 1;
    this.getReferralLogs();
    this.searchForm.get('word').setValue('');
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      word: [''],
    });
  }

}
