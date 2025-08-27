import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { UsersService } from 'src/app/services/users/users.service';
import { LogDetailsComponent } from './log-details/log-details.component';

declare var $: any;

@Component({
  selector: 'app-bid-logs',
  templateUrl: './bid-logs.component.html',
  styleUrls: ['./bid-logs.component.scss'],
})
export class BidLogsComponent implements OnInit {
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

  constructor(
    private usersService: UsersService,
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private dialoge: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentPage = JSON.parse(localStorage.getItem('bid_page_number')) || 1;
    this.getBidsLogs();
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

  getBidsLogs() {
    this.notMatchSearch = false;
    this.commonService.presentSpinner();
    const newPageNumber = (this.currentPage-1) *100;
    this.usersService.getBidsLogs(newPageNumber, this.limit, this.searchValue).subscribe(
      (res) => {
        console.log('res', res);
        
        this.bidList = res.body.items;
        this.commonService.dismissSpinner();
        this.notMatchSearch =
        this.bidList && this.bidList.length < 1 ? true : false;
        this.limit = res.body.limit;
        this.totalResult = res.body.total;

          this.entries = this.commonService.calculateEntries(
            this.bidList,
            1,
            this.limit,
            this.bidList.length
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
    this.getBidsLogs();
    localStorage.setItem('bid_page_number', event);
  }

  // filter bids
  filterBy() {
    this.notMatchSearch = false;
    this.searchValue = this.word.value;
    this.currentPage = 1;
    this.getBidsLogs();
    this.searchForm.get('word').setValue('');
  }

  openDetailsModal(id: string) {
    this.dialoge.open(LogDetailsComponent, {
      data: { id: id },
      width: '800px',
      height: '450px',
      disableClose: false,
    });
  }
}
