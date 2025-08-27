import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { endpoint } from 'src/app/constants/endpoint';
import { router } from 'src/app/constants/router';
import { Entries } from 'src/app/models/interface';
import { ApiService } from '../api.service';
import { StorageService } from '../core/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private spinner: NgxSpinnerService,
    private toastNotification: ToastrService,
    private storage: StorageService,
    private router: Router,
    private apiService: ApiService
  ) { }


  //  Success toastee notification  **  //
  successToaster(msg, maxShown: any = '1') {
    this.toastNotification.success(msg);
  }

  //  warning toaster notification  **  //
  warningToast(msg) {
    this.toastNotification.warning(msg)
  }
  //  info toaster notification  **  //
  infoToast(msg) {
    this.toastNotification.info(msg)
  }
  //  Error toaster notification  **  //
  errorToast(msg) {
    this.toastNotification.error(msg)
  }

  errorHandler(error: any) {
    console.log('error ====>>>', error);
    this.dismissSpinner();
    if (error.error.code == 422) {
      this.toastNotification.error(error.error.message)
    } else if (error.error.code == 401) {
      this.toastNotification.error(error.error.message)
    } else if (error.error.code == 500) {
      this.toastNotification.error(error.error.message)
    } else if (error.error.code == 403) {
      this.toastNotification.error(error.error.message)
    } else {
      this.toastNotification.error(error?.error?.message)

    }

  }

  presentSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.dismissSpinner();
    }, 5000);
  }

  dismissSpinner() {
    this.spinner.hide();
  }

  logout() {
    this.apiService.secondEnvgetApi(endpoint.logout).subscribe(
      (res) => {
        if (res) {
          this.storage.clearStorageForLogout().then(
            () => {
              this.router.navigate(['/login']);
            }
          );
        }
      },
      (error) => {
        this.storage.clearStorageForLogout().then(
          () => {
            this.router.navigate(['/login']);
          }
        );
      }
    );
  }

  calculateEntries(list: Array<any>, current_page: number, limit: number, totalResult: number): Entries {
    if (list?.length === totalResult) {
      let pages = {
        1: []
      };
      let arr = [];
      let page = 1;
      for (let i = 0; i < list?.length; i++) {
        arr.push(list[i]);
        if (arr.length == limit) {
          pages[page] = arr;
          page += 1;
          arr = [];
        } else {
          if (i == list?.length - 1) {
            pages[page] = arr;
            page += 1;
            arr = [];
          }
        }
      }
      list = pages[current_page];
    }
    return {
      from: limit * (current_page - 1) + 0 + 1,
      to: limit * (current_page - 1) + (list?.length - 1) + 1,
      total: totalResult,
    };
  }

  getAddressFromV2(userId: string) {
    return this.apiService.secondEnvgetApi(endpoint.getAddressFromV2(userId));
  }
}
