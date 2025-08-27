import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { REGEX } from 'src/app/constants/regex';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

declare var $: any;

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent implements OnInit {
  isEdit = false;
  addedName = '';
  bannerId = '';
  selectedImage: File;
  addedImg: File;
  addedValue = '';
  addedPosition = 'upper';
  banners: any;
  pageName = 'home';
  lang = 'en';
  addedLang = 'en';
  addedType = 'spp';
  addedPage = 'spp';
  paginationNextLabel = '';
  lowerBanners = [];
  middleBanners = [];
  upperBanners = [];
  paginationPreviousLabel = '';
  currentPage = 1;
  limit = 10;
  totalResult: number;
  bannerType: string;
  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };
  addAdminForm: FormGroup;

  editAdminForm: FormGroup;
  adminToUpdate: any;
  showErrorCollectiondId: boolean;
  collectionsToBeReOrdered: Array<any> = [];

  constructor(
    private dashboardService: DashboardService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private commonService: CommonService,
    private toastNotification: ToastrService
  ) {
    this.getAllBanners('upper');
    this.getAllBanners('middle');
    this.getAllBanners('lower');
  }

  ngOnInit(): void {}

  choosepage(page) {
    this.pageName = page;
    this.getAllBanners('upper');
    this.getAllBanners('middle');
    this.getAllBanners('lower');
  }
  selectBannerType(type) {
    this.addedType = type;
  }
  selectBannerPage(type) {
    this.addedPage = type;
  }
  selectLag(lang) {
    this.addedLang = lang;
  }
  selectLagForPage(lang) {
    this.lang = lang;
    this.getAllBanners('upper');
    this.getAllBanners('middle');
    this.getAllBanners('lower');
  }
  addBanner() {
    this.showErrorCollectiondId = false;
    const payload = new FormData();
    const banner = {
      banner_name: this.addedName,
      banner_page: this.addedPage,
      banner_position: this.addedPosition,
      banner_type: this.addedType,
      banner_value: this.addedValue,
      banner_image: this.selectedImage,
      lang: this.addedLang,
    };
    payload.append('banner_name', this.addedName);
    payload.append('banner_page', this.addedPage);
    payload.append('banner_position', this.addedPosition);
    payload.append('banner_type', this.addedType);
    payload.append('banner_value', this.addedValue);
    payload.append('banner_image', this.selectedImage);
    payload.append('lang', this.addedLang);
    payload.append('type', this.pageName === 'cars' ? this.pageName : null);


    if (this.addedImg && this.addedName) {
      this.commonService.presentSpinner();
      this.dashboardService.addBanner(payload).subscribe(
        (res) => {
          if (res) {
            this.closeModal('banner-modal');
            this.getAllBanners('upper');
            this.getAllBanners('middle');
            this.getAllBanners('lower');
          }
          this.commonService.dismissSpinner();
        },
        (error) => {
          this.showErrorCollectiondId = true;
          this.commonService.errorHandler(error);
          this.commonService.dismissSpinner();
        }
      );
    } else {
      this.toastNotification.error('Please enter missing data!');
    }
  }

  editBanner() {
    this.showErrorCollectiondId = false;
    const payload = new FormData();
    payload.append('banner_name', this.addedName);
    payload.append('banner_page', this.addedPage);
    payload.append('banner_position', this.addedPosition);
    payload.append('banner_type', this.addedType);
    payload.append('banner_value', this.addedValue);
    payload.append('banner_image', this.selectedImage);
    payload.append('lang', this.addedLang);
    payload.append('type', this.pageName === 'cars' ? this.pageName : null)
    if (this.addedName) {
      this.commonService.presentSpinner();
      this.dashboardService.editBanner(this.bannerId, payload).subscribe(
        (res) => {
          if (res) {
            this.closeModal('banner-modal');
            this.getAllBanners('upper');
            this.getAllBanners('middle');
            this.getAllBanners('lower');
          }
          this.commonService.dismissSpinner();
        },
        (error) => {
          this.showErrorCollectiondId = true;
          this.commonService.errorHandler(error);
          this.commonService.dismissSpinner();
        }
      );
    } else {
      this.toastNotification.error('Please enter missing data!');
    }
  }

  getAllBanners(position) {
    this.commonService.presentSpinner();
    this.dashboardService
      .getBanners(this.pageName, this.lang, position)
      .subscribe(
        (res) => {
          if (res) {
            if (position == 'upper') {
              this.upperBanners = res.body.responseData;
            } else if (position == 'middle') {
              this.middleBanners = res.body.responseData;
            } else if (position == 'lower') {
              this.lowerBanners = res.body.responseData;
            }
            this.commonService.dismissSpinner();
          }
        },
        (error) => {
          this.commonService.dismissSpinner();
          this.commonService.errorHandler(error);
        }
      );
  }
  action(id) {
    const options = {
      title: 'Are you Sure you want to delete this banner?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.deleteBanner(id);
      } else {
      }
    });
  }
  selectPage(event) {
    this.currentPage = event;
    this.getAllBanners('upper');
    this.getAllBanners('middle');
    this.getAllBanners('lower');
  }

  deleteBanner(id: string) {
    this.dashboardService.deleteBanner(id).subscribe(
      (res) => {
        if (res) {
          this.getAllBanners('upper');
          this.getAllBanners('middle');
          this.getAllBanners('lower');
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  selectImage(files: FileList) {
    if (files.length) {
      this.selectedImage = files.item(0);
    }
  }

  openModal(id: string, adminToUpdate: any) {
    $(`#${id}`).modal('show');
    if (!adminToUpdate) {
      this.selectedImage = null;
      this.addedImg = null;
      this.addedValue = '';
      this.addedName = '';
    } else {
      this.isEdit = true;
      this.bannerId = adminToUpdate._id;
      this.addedName = adminToUpdate.banner_name;
      this.addedPage = adminToUpdate.banner_page;
      this.addedPosition = adminToUpdate.banner_position;
      this.addedType = adminToUpdate.banner_type;
      this.addedValue = adminToUpdate.banner_value;
      this.addedLang = adminToUpdate.lang;
    }
  }

  closeModal(id) {
    $(`#${id}`).modal('hide');
    this.selectedImage = null;
    this.addedImg = null;
    this.addedValue = '';
    this.addedName = '';
    this.isEdit = false;
  }

  addAdmin() {
    const payload = new FormData();

    this.dashboardService.addAdmin(payload).subscribe(
      (res) => {
        this.closeModal('add-admin');
        if (res) {
          this.getAllBanners('upper');
          this.getAllBanners('middle');
          this.getAllBanners('lower');
        }
      },
      (error) => {
        this.closeModal('add-admin');
        this.commonService.errorHandler(error);
      }
    );
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  editAdmin() {
    const payload = new FormData();
    Object.keys(this.editAdminForm.value).forEach((key) => {
      if (key == 'profilePic') {
        if (this.selectedImage) {
          payload.append(key, this.selectedImage);
        }
      } else {
        if (this.editAdminForm.value[key]) {
          payload.append(key, this.editAdminForm.value[key]);
        }
      }
    });

    this.dashboardService.editAdmin(this.adminToUpdate._id, payload).subscribe(
      (res) => {
        this.closeModal('edit-banner');
        if (res) {
          this.getAllBanners('upper');
          this.getAllBanners('middle');
          this.getAllBanners('lower');
        }
      },
      (error) => {
        this.closeModal('edit-banner');
        this.commonService.errorHandler(error);
      }
    );
  }

  getCollectionsToBeReOrdered(position) {
    this.collectionsToBeReOrdered = [];
    let list = [];
    if (position == 'upper') {
      list = this.upperBanners;
    } else if (position == 'middle') {
      list = this.middleBanners;
    } else if (position == 'lower') {
      list = this.lowerBanners;
    }
    list.forEach((collection) => {
      this.collectionsToBeReOrdered.push({ ...collection });
    });
  }

  changeOrderForCollection() {
    const payload = [];
    this.collectionsToBeReOrdered.forEach((collection, index) => {
      payload.push({ id: collection?._id, position: index + 1 });
    });
    if (!payload.length) {
      return;
    }
    this.collectionsToBeReOrdered = [];
    this.commonService.presentSpinner();
    this.dashboardService.updateBannerPosition(payload).subscribe(
      (res) => {
        if (res) {
          this.collectionsToBeReOrdered = [];
          this.commonService.dismissSpinner();
          this.getAllBanners('upper');
          this.getAllBanners('middle');
          this.getAllBanners('lower');
        }
      },
      (error) => {
        this.collectionsToBeReOrdered = [];
        this.commonService.errorHandler(error);
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.collectionsToBeReOrdered,
      event.previousIndex,
      event.currentIndex
    );
  }
}
