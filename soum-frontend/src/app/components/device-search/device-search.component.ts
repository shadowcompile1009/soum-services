import { Component, HostListener, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BidsAndItemsService } from 'src/app/services/bids-and-items/bids-and-items.service';
import { CommonService } from 'src/app/services/common/common.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { HomeService } from 'src/app/services/home/home.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';
import { Product } from 'src/app/shared-components/product-model/product-model.interface';
import { Filter } from '../filter/filter.component';

@Component({
  selector: 'app-device-search',
  templateUrl: './device-search.component.html',
  styleUrls: ['./device-search.component.scss']
})
export class DeviceSearchComponent implements OnInit, OnDestroy {

  productList: Product[] = [];
  product: any;
  userMobileNumber: string;
  loggedUserId: string;
  model: string;
  userDetail: any;
  category: any;
  subscriptions: Subscription[] = [];
  homeService: HomeService;
  commonService: CommonService;
  storage: StorageService;
  profileService: ProfileService;
  bidService: BidsAndItemsService;
  translate: TranslateService;
  sharingServ: SharingDataService;
  bannerData;
  direction = '';
  limitPerPage = 1000;
  page = 1;
  viewSearchResults: boolean;


  //search values
  searchInput = new FormControl('');
  modelsOptions = [];
  filteredOptions: Observable<string[]>;
  enableSearch = false;
  search_title;
  no_result_sub;
  showEmptyMessage: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private injector: Injector
  ) {
    this.homeService = this.injector.get<HomeService>(HomeService);
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.storage = this.injector.get<StorageService>(StorageService);
    this.profileService = this.injector.get<ProfileService>(ProfileService);
    this.bidService = this.injector.get<BidsAndItemsService>(BidsAndItemsService);
    this.translate = this.injector.get<TranslateService>(TranslateService);
    this.sharingServ = this.injector.get<SharingDataService>(SharingDataService);

    firebase.analytics().logEvent('product_list_view');
    const savedData = this.storage.getSavedData();
    this.sharingServ.userData.subscribe((data) => {
      this.userMobileNumber = data ? data.mobileNumber : null;
      this.loggedUserId = data ? data.userId : null;
    });

    if (this.commonService.isLoggedIn) {
      const saved_Data = this.storage.getSavedData();
      this.userDetail = saved_Data[storageKeys.userDetails] || {};
    } else {
      this.userDetail = null;
    }
    this.getFullModelList();
    this.viewSearchResults = false;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe((params) => {
        if (params && params.category) {
          this.category = params.category;
          this.viewSearchResults = false;
        }
      })
    );

    this.filteredOptions = this.searchInput.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.getTranslation();
  }

  getTranslation() {
    this.translate.get(`labels.search_results`).subscribe(text => {
      this.search_title = text;
    });

    this.translate.get(`labels.no_result_sub`).subscribe(text => {
      this.no_result_sub = text;
    });
  }

  // check filter value and filter the model list
  private _filter(value) {
    const filterValue = value.toLowerCase();
    return this.modelsOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  search(event) {
    this.onOptionSelected(event, true);
  }

  /**
   * check if option selected when try to search
   * @param event // event from dropdown
   * @param newWord // check if user type the model name by himself
   */
  onOptionSelected(event, newWord?) {
    let searchTerm = newWord ? event : event.option.value;
    const model = this.modelsOptions.find(obj => obj.name === searchTerm);
    if (model && model.id) {
      this.model = model.id;
      this.getProductsByModel();
      this.viewSearchResults = true;
    } else {
      this.productList = [];
      this.viewSearchResults = true;
    }
  }

  // load search products
  getProductsByModel() {
    // clear current search list 
    this.commonService.presentSpinner();
    let payload: Filter = {};
    payload.userCity = sessionStorage.getItem('currentCityLocation');
    this.homeService.getProductsByModel(this.model, this.limitPerPage, this.page, payload).subscribe((res) => {
      this.commonService.dismissSpinner();
      if (res) {
        this.productList = [...this.productList, ...res.responseData];
      } else {
        this.productList = [];
      }
    },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  async navigateTo(route: string, product: any) {
    let options: NavigationExtras = {};
    this.router.navigate([route], options);
  }

  // get full model list from setting api
  getFullModelList() {
    this.commonService.getSystemConfiguration().then((res) => {
      if (res) {
        let fullModelList = JSON.parse(res.full_model_list);
        fullModelList.forEach(element => {
          this.modelsOptions.push({ name: element.model_name, id: element._id })
        });
        fullModelList.forEach(element => {
          this.modelsOptions.push({ name: element.model_name_ar, id: element._id })
        });
      }
    });
  }

  // clear search field 
  clear(ctrl: FormControl) {
    ctrl.setValue(null);
  }

  onScrollDown(ev: any) {
    if (ev.currentScrollPosition > 640) {
      this.page += 1;
      this.getProductsByModel();
    }
    this.direction = 'scroll down';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

}
