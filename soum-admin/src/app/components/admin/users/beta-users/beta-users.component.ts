import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-beta-users',
  templateUrl: './beta-users.component.html',
  styleUrls: ['./beta-users.component.scss']
})
export class BetaUsersComponent implements OnInit {
  userList: any;
  limit: any = 100;
  totalResult: any;
  currentPage: number = 1;
  userToUpdate: any = {};
  updateUserForm: FormGroup;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  usersExportXlxs: Array<any> = [];
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
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentPage = JSON.parse(localStorage.getItem('betUser_page_number')) || 1;
    this.getUserListing();
    this.createSearchForm();
  }

  createSearchForm() {
    this.searchForm = this.fb.group({ word: [''] });
  }

  get word() { return this.searchForm.get('word'); }

  getUserListing() {
    this.notMatchSearch = false;
    this.commonService.presentSpinner();
    this.usersService.getBetaUserLists(this.currentPage, this.limit, this.searchValue).subscribe(
      (res) => {
        this.userList = res.body.userList;
        this.commonService.dismissSpinner();
        this.notMatchSearch = this.userList && this.userList.length < 1 ? true : false;

        this.limit = res.body.limit;
        this.totalResult = res.body.totalResult;
        this.entries = this.commonService.calculateEntries(
          this.userList,
          this.currentPage,
          this.limit,
          this.totalResult
        );
      },
      (error) => {
        this.userList = [];
        this.notMatchSearch = true;
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  selectPage(event) {
    this.currentPage = event;
    this.getUserListing();
    localStorage.setItem('betUser_page_number', event);
  }

    // filter users
    filterBy() {
      this.notMatchSearch = false;
      this.searchValue = this.word.value;
      this.currentPage = 1;
      this.getUserListing();
      this.searchForm.get('word').setValue('');
    }
}
