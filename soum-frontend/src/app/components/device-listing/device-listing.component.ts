import { AfterViewInit, Component, HostListener, Injector, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { HomeService } from 'src/app/services/home/home.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { environment } from 'src/environments/environment';
import { Filter, FilterByModel } from '../filter/filter.component';
import firebase from 'firebase';
import { BidsAndItemsService } from 'src/app/services/bids-and-items/bids-and-items.service';
import { TranslateService } from '@ngx-translate/core';
import { interval, Subject, Subscription } from 'rxjs';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';
import { takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/shared-components/product-model/product-model.interface';

@Component({
  selector: 'app-device-listing',
  templateUrl: './device-listing.component.html',
  styleUrls: ['./device-listing.component.scss']
})
export class DeviceListingComponent implements OnInit, OnDestroy, AfterViewInit {
  productList: Product[] = [];
  product: any;
  userMobileNumber: string;
  loggedUserId: string;
  model: any;
  modelName: any;
  userDetail: any;
  brand: any;
  filterApplied: boolean;
  sortingApplied: boolean;
  queryParams: any;
  apiHit: boolean;
  category: any;
  profileData: any;
  sortModelProductBy: any;
  pageTitle: any = '';
  subscriptions: Subscription[] = [];
  empty: boolean = false;
  homeService: HomeService;
  commonService: CommonService;
  storage: StorageService;
  profileService: ProfileService;
  bidService: BidsAndItemsService;
  translate: TranslateService;
  sharingServ: SharingDataService;
  bannerData;
  direction = '';
  limitPerPage = 20;
  page = 1;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    // implement code here
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private injector: Injector
  ) {
    this.homeService = this.injector.get<HomeService>(HomeService);
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.storage = this.injector.get<StorageService>(StorageService);
    this.profileService = this.injector.get<ProfileService>(ProfileService);
    this.bidService =
      this.injector.get<BidsAndItemsService>(BidsAndItemsService);
    this.translate = this.injector.get<TranslateService>(TranslateService);
    this.sharingServ =
      this.injector.get<SharingDataService>(SharingDataService);

    firebase.analytics().logEvent('product_list_view');
    const savedData = this.storage.getSavedData();
    this.sortModelProductBy = savedData?.filterByModel?.filterData?.sort
      ? savedData?.filterByModel?.filterData?.sort
      : 'low';
    this.sharingServ.userData.subscribe((data) => {
      this.userMobileNumber = data ? data.mobileNumber : null;
      this.loggedUserId = data ? data.userId : null;
    });

    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe((params) => {
        if (params && params.model) {
          this.queryParams = params;
          this.model = params.model;
          this.modelName = params.model_name;
          this.brand = params.brand;
          this.category = params.category;
          this.getProductsByModel();
        } else {
          this.router.navigate(['/products']);
        }
      })
    );

    if (this.commonService.isLoggedIn) {
      const saved_Data = this.storage.getSavedData();
      this.userDetail = saved_Data[storageKeys.userDetails] || {};
    } else {
      this.userDetail = null;
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.profileService.observableprofile.subscribe((sett) => {
        this.profileData = sett;
      })
    );
    this.bidService.sendRouter(false);
    // Add GTM
    window['dataLayer'] = window['dataLayer'] || [];
    window['dataLayer'].push({
      event: 'pageview',
      pagePath: this.router.url,
      pageTitle: 'Devices'
    });
    this.getRandomText();
  }

  ngAfterViewInit() {
    this.scrollToElement();
  }

  scrollToElement() {
    const scrollY =
      JSON.parse(localStorage.getItem(storageKeys.devicesScrollPos)) || 0;
    const stopSignal$ = new Subject();
    const interval$ = interval(250);
    if (scrollY > 0) {
      interval$.pipe(takeUntil(stopSignal$)).subscribe((i) => {
        const windowScroll =
          window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({ top: scrollY, behavior: 'auto' });
        this.storage.removeItem(storageKeys.devicesScrollPos);
        if (windowScroll > 0) {
          stopSignal$.next('done');
        }
      });
    }
  }

  getProductsByModel(apiHitAfterFaviourite?: any) {
    apiHitAfterFaviourite ? (this.apiHit = false) : null;
    this.commonService.presentSpinner();
    const savedData = this.storage.getSavedData();
    let payload: Filter = {};
    if (
      savedData &&
      savedData[storageKeys.filterByModel] &&
      savedData[storageKeys.filterByModel].category === this.category
    ) {
      let filterPayload = new FilterByModel(
        savedData[storageKeys.filterByModel]
      ).filterData;
      payload = filterPayload;
      this.filterApplied =
        filterPayload.grade.length ||
        (filterPayload.price &&
          (filterPayload.price.from > 0 ||
            filterPayload.price.to < environment.filterMaxRange))
          ? true
          : false;
      if (this.filterApplied) {
        payload.brand.push(this.brand);
        payload.model.push(this.model);
      }
      this.sortingApplied = filterPayload.sort ? true : false;
    } else {
      this.filterApplied = false;
      this.sortingApplied = false;
    }
    payload.sort = this.sortModelProductBy;
    payload.userCity = sessionStorage.getItem('currentCityLocation');
    this.homeService
      .getProductsByModel(this.model, this.limitPerPage, this.page, payload)
      .subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          if (res && Array.isArray(res.responseData)) {
            this.productList = [...this.productList, ...res.responseData];
            this.pageTitle =
              this.translate?.getDefaultLang() == 'en'
                ? this.productList[0]?.modelName
                : this.productList[0]?.arModelName;
          } else {
            this.pageTitle = '';
          }
          this.apiHit = true;
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

  navigateToFilter() {
    this.router.navigate(['/filter'], {
      queryParams: { modelCategory: this.category }
    });
  }

  getRandomText() {
    let header, sub_header;
    const id = Math.floor(Math.random() * 4) + 1;
    this.translate.get(`labels.mppBanner${id}`).subscribe((text) => {
      header = text;
    });
    this.translate.get(`labels.mppSubBanner${id}`).subscribe((text) => {
      sub_header = text;
    });
    this.bannerData = { header, sub_header };
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
