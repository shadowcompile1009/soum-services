import { UserStatusDef } from './../../../constants/user';
import { User } from './../../../models/user';
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
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { ExportDataXlsxService } from 'src/app/services/export-data-xlsx/export-data-xlsx.service';
declare var $: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  userList: any[] = [];
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
  filterUserBy: string = '';
  filterParams: any = '';
  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };

  constructor(
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private usersService: UsersService,
    private commonService: CommonService,
    private router: Router,
    private xlsxService: ExportDataXlsxService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentPage =
      JSON.parse(localStorage.getItem('user_page_number')) || 1;
    this.updateUserForm = new FormGroup({
      name: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(REGEX.name),
        ])
      ),
      isBetaUser: new FormControl({
        value: false,
      }),
      isKeySeller: new FormControl({value: false}),
      isMerchant: new FormControl({value: false}),
      isUAE: new FormControl({value: false}),
      isCompliant: new FormControl({value: false}),
    });
    this.getUsers();
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

  filterByInActiveUsers(filterString: any) {
    if(this.filterUserBy === filterString) {
      return;
    }
    this.filterUserBy = filterString;
    this.filterParams = filterString? [filterString.target.value]+'=true' : '';
    this.getUsers();
  }

  getUsers() {
    this.notMatchSearch = false;
    this.commonService.presentSpinner();

    this.usersService.getUsers(this.currentPage, this.limit, this.searchValue, this.filterParams).subscribe(
      (res) => {
        this.userList = res.body.responseData.result.data;
        this.commonService.dismissSpinner();
          this.notMatchSearch =
            this.userList && this.userList.length < 1 ? true : false;

        this.userList.forEach((user) => {
          user.checkStatus =
            user.status.toLowerCase() == 'active' ? true : false;
        });
        this.limit = res.body.limit || this.limit;
        this.totalResult = res.body.responseData.result.totalResult;
        this.entries = this.commonService.calculateEntries(
          this.userList,
          this.currentPage,
          this.limit,
          this.totalResult
        );
      },
      (error) => {
        this.userList = [];
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  selectPage(event) {
    this.currentPage = event;
    this.getUsers();
    // console.log(event);
    localStorage.setItem('user_page_number', event);
  }
  action(id) {
    let options = {
      title: 'Are you Sure you want to delete this user?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        // console.log('Okay' , id);
        this.deleteUser(id);
      } else {
        //  console.log('Cancel');
      }
    });
  }
  changeUserStatus(user: any) {
    this.commonService.presentSpinner();
    this.usersService
      .changeUserStatus(
        user._id,
        new UserStatus(user.checkStatus ? UserStatusDef.ACTIVE : UserStatusDef.INACTIVE)
      )
      .subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          this.getUsers();
        },
        (error) => {
          this.commonService.dismissSpinner();
          this.commonService.errorToast(error.error.message);
        }
      );
  }

  deleteUser(user: any) {
    this.commonService.presentSpinner();
    this.usersService.deleteUser(user._id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        this.getUsers();
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorToast(error.error.message);
      }
    );
  }

  isDeletedUser(user: User) {
    return user.status === UserStatusDef.DELETE;
  }

  editUser(user: any) {
    $('#edit-user').modal('show');
    user.isBetaUser = user.isBetaUser || false;
    user.isKeySeller = user.isKeySeller || false;
    user.isMerchant = user.isMerchant || false;
    user.isUAE = user?.sellerType?.isUAE || false;
    user.isCompliant = user?.sellerType?.isCompliant || false;
    this.userToUpdate = user;
    this.updateUserForm.patchValue(this.userToUpdate);
  }

  closeModal(id: string) {
    $(`#${id}`).modal('hide');
    this.userToUpdate = {};
    this.updateUserForm.reset();
  }

  updateUser() {
    this.commonService.presentSpinner();
    this.usersService
      .updateUserV2(
        this.userToUpdate._id,
        new UpdateUser(
          this.updateUserForm.value.name,
          this.updateUserForm.value.isBetaUser,
          this.updateUserForm.value.isKeySeller,
          this.updateUserForm.value.isMerchant,
          this.updateUserForm.value.isCompliant,
          this.updateUserForm.value.isUAE
        )
      )
      .subscribe(
        (res) => {
          this.closeModal('edit-user');
          this.commonService.dismissSpinner();
          this.getUsers();
        },
        (error) => {
          this.commonService.dismissSpinner();
          this.commonService.errorToast(error.error.message);
        }
      );
  }

  getUserDetails(user_id: string) {
    this.commonService.presentSpinner();
    this.usersService.getUserDetail(user_id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res && res.body && res.body.userData) {
          this.router.navigate(['/admin/users/user-details', user_id], {
            state: { user: res.body.userData },
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
    this.usersExportXlxs = [];
    this.userList.forEach((user) => {
      const orderObj = {
        Name: user?.name || '--',
        'Mobile Number': user?.mobileNumber || '--',
        'Country Code': user?.countryCode || '--',
        'Secret Key': user?.secretKey || '--',
        Status: user?.status || '--',
        'check Status': user?.checkStatus || '--',
      };
      this.usersExportXlxs.push(orderObj);
    });
    this.xlsxService.exportAsExcelFile(this.usersExportXlxs, 'Users');
  }


    // filter users
    filterBy() {
      this.notMatchSearch = false;
      this.filterUserBy = '';
      this.filterParams = '';
      this.searchValue = this.word.value;
      this.currentPage = 1;
      this.getUsers();
      this.searchForm.get('word').setValue('');
    }
}
