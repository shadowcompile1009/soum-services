import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { REGEX } from 'src/app/constants/regex';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';  
import {StorageService} from '../../../services/core/storage/storage.service';
declare var $: any;
@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent implements OnInit {
  admins: any;
  paginationNextLabel: string = "";
  paginationPreviousLabel: string = "";
  currentPage: number = 1;
  limit: number = 10;
  totalResult: number;
  entries: Entries = {
    from: 0,
    to: 0,
    total: 0
  };
  addAdminForm: FormGroup;
  selectedImage: File;
  editAdminForm: FormGroup;
  adminToUpdate: any;

  constructor(
    private dashboardService: DashboardService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private commonService: CommonService,
    private storage: StorageService
  ) {
    this.getAllAdmins();
    this.addAdminForm = new FormGroup({
      profilePic: new FormControl('', Validators.compose([Validators.required])),
      name: new FormControl('', Validators.compose([Validators.required, Validators.pattern(REGEX.name)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(REGEX.email)])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])),
      confirmPassword: new FormControl('', Validators.compose([Validators.required])),
      phoneNumber: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      isBetaAdmin: new FormControl(false)
    });

    this.editAdminForm = new FormGroup({
      profilePic: new FormControl('', Validators.compose([])),
      name: new FormControl('', Validators.compose([Validators.required, Validators.pattern(REGEX.name)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(REGEX.email)])),
      phoneNumber: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)]))
    });
  }

  ngOnInit(): void {
  }

  getAllAdmins() {
    this.dashboardService.getAllAdmins(this.currentPage, this.limit).subscribe(
      (res) => {
        if (res) {
          this.admins = res.body.adminList;
          this.limit = res.body.limit;
          this.totalResult = res.body.totalResult;
          this.entries = this.commonService.calculateEntries(this.admins, this.currentPage, this.limit, this.totalResult);
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }
  action(id) {
    let options ={
      title: 'Are you Sure you want to delete this admin?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
      // console.log('Okay' , id);
    
     this.deleteAdmin(id);
      } else {
     // console.log('Cancel');
      }
    });
  }
  selectPage(event) {
    this.currentPage = event;
    this.getAllAdmins();
  }

  deleteAdmin(admin_id: string) {
    this.dashboardService.deleteAdmin(admin_id).subscribe(
      (res) => {
        if (res) {
          this.getAllAdmins();
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    )
  }

  selectImage(files: FileList) {
    console.log(files)
    if (files.length) {
      this.selectedImage = files.item(0);
    }
  }

  openModal(id: string, adminToUpdate: any) {
    if (adminToUpdate) {
      this.adminToUpdate = adminToUpdate;
      this.editAdminForm.patchValue({
        name: adminToUpdate.name,
        email: adminToUpdate.email,
        phoneNumber: adminToUpdate.phoneNumber,
      });
    }
    $(`#${id}`).modal('show');
    this.addAdminForm.reset();
    this.selectedImage = null;
    this.addAdminForm.patchValue({isBetaAdmin: false})
  }

  closeModal(id) {
    $(`#${id}`).modal('hide');
    this.addAdminForm.reset();
    this.editAdminForm.reset();
    this.adminToUpdate = null;
    this.selectedImage = null;
  }

  addAdmin() {
    this.commonService.presentSpinner();
    let payload = new FormData();
    Object.keys(this.addAdminForm.value).forEach(
      (key) => {
        if (key == 'profilePic') {
          if (this.selectedImage) {
            payload.append(key, this.selectedImage);
          }
        } else {
          if (key !== 'confirmPassword') {
            payload.append(key, this.addAdminForm.value[key]);
          }
        }
      }
    );
    this.dashboardService.addAdmin(payload).subscribe(
      (res) => {
        this.closeModal('add-admin');
        this.commonService.dismissSpinner();
        if (res) {
          this.getAllAdmins();
        }
      },
      (error) => {
        this.closeModal('add-admin');
        this.commonService.errorHandler(error);
        this.commonService.dismissSpinner();
      }
    )
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  editAdmin() {
    this.commonService.presentSpinner();
    let payload = new FormData();
    Object.keys(this.editAdminForm.value).forEach(
      (key) => {
        if (key == 'profilePic') {
          if (this.selectedImage) {
            payload.append(key, this.selectedImage);
          }
        } else {
          if (this.editAdminForm.value[key]) {
            payload.append(key, this.editAdminForm.value[key]);
          }
        }
      }
    );

    this.dashboardService.editAdmin(this.adminToUpdate._id, payload).subscribe(
      (res) => {
        this.closeModal('edit-admin');
        this.commonService.dismissSpinner();
        if (res) {
          this.getAllAdmins();
        }
      },
      (error) => {
        this.closeModal('edit-admin');
        this.commonService.errorHandler(error);
        this.commonService.dismissSpinner()
      }
    )
  }
}
