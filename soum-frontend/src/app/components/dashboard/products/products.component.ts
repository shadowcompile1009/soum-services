import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import {
  BuyModalPrice,
  CommonService
} from 'src/app/services/common/common.service';
import { LocalizeService } from 'src/app/services/core/localization/localize.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { HomeService } from 'src/app/services/home/home.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { SellerService, UploadProduct } from 'src/app/services/seller/seller.service';
import { environment } from 'src/environments/environment';
import { FilterByCategory } from '../../filter/filter.component';
declare var $: any;
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  currentCityLocation;
  categories: any = [];
  selectedCategory: any;
  products: any = [];
  productsPage = 1;
  page = 1;
  direction = '';
  limitPerPage = 12;
  totalModals;
  currentExploreScroll;
  exploreProducts: any = [];
  userDetail: any;
  profileData: any;
  filterApplied: boolean;
  sortingApplied: boolean;
  arabic: boolean;
  apiHit: boolean;
  appSetting;
  subscriptionInterval: Subscription[] = [];
  totalExploreProducts: number;
  exploreHasNextPage: boolean;
  toggleExplore: boolean;
  showMoreProducts: boolean;
  carouselOptions = {
    rtl: false,
    loop: false,
    autoplay: false,
    center: false,
    dots: true,
    items: 4,
    margin: 10,
    stagePadding: 15,
    width: 70
  };

  constructor(
    private router: Router,
    private commonService: CommonService,
    private homeService: HomeService,
    private storage: StorageService,
    public translate: TranslateService,
    private localizeService: LocalizeService,
    private profileService: ProfileService,
    private sellerService: SellerService
  ) {
    this.checkCurrentCityAddress();
    this.getCategories();
    this.getExploreProducts();
    this.getDefaultLanguage();
  }
// TODO: commented until enable explore section --> it calculate scroll position to load more explore products
  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   let ExploreElementTitle = document.querySelector('.explore_more_wrapper');
  //   let footer = document.querySelector<HTMLElement>('#footer');
  //   if(!ExploreElementTitle.getBoundingClientRect().top) {
  //     ExploreElementTitle.classList.add('custom_title_wrapper');
  //     footer.style.display = 'none';
  //   } else {
  //     ExploreElementTitle.classList.remove('custom_title_wrapper');
  //     footer.style.display = 'block';
  //   }
  // }

  ngOnInit(): void {
    this.appSetting = JSON.parse(sessionStorage.getItem('appSetting'));
    this.sellerService.uploadProductData = new UploadProduct();
    localStorage.removeItem('selectedBrand');
    localStorage.removeItem('selectedDevice');
    localStorage.removeItem('selectedModel');
    localStorage.removeItem('selectedVarient');
    
    if (this.commonService.isLoggedIn) {
      const savedData = this.storage.getSavedData();
      this.userDetail = savedData[storageKeys.userDetails];
      this.openModalForProductToBuy();
      this.openModalForProductToBid();
    } else {
      this.userDetail = null;
    }
    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Products'
    };
    window['dataLayer'].push(productGTM);
  }

  // Language
  getDefaultLanguage() {
    let defaultLanguage = this.translate.getDefaultLang();
    switch (defaultLanguage) {
      case 'en':
        this.arabic = false;
        this.carouselOptions.rtl = false;
        break;

      case 'ar':
        this.arabic = true;
        this.carouselOptions.rtl = true;
        break;
    }
  }

  goToDeviceList(product: any) {
    this.router.navigate(['/devices'], {
      queryParams: {
        //  model_name: product.model_name,
        model: product.id,
        // brand: product.brand_id,
        category: this.selectedCategory.category_id
      }
    });
  }

  navigateTo(route: string) {
    if (this.selectedCategory) {
      this.router.navigate([route], {
        queryParams: { category: this.selectedCategory.category_id }
      });
    } else {
      this.router.navigate(['/products']);
    }
  }

  openModalForProductToBuy() {
    const savedData = this.storage.getSavedData();
    if (savedData && savedData[storageKeys.productToBuy]) {
      let product = { ...savedData[storageKeys.productToBuy] };
      this.storage.removeItem(storageKeys.productToBuy);
      this.openBuyModal(product);
    }
  }

  openBuyModal(product: any) {
    firebase.analytics().logEvent('buy_now');
  }

  openModalForProductToBid() {
    const savedData = this.storage.getSavedData();
    if (savedData && savedData[storageKeys.productToBid]) {
      this.openBidModal(savedData[storageKeys.productToBid]);
    }
  }

  openBidModal(product: any) {
    // implement part of code here
  }

  checkCurrentCityAddress(){
    this.profileService.observableprofile.subscribe((sett) => {
      this.profileData = sett;
    });
      if (this.profileData && this.profileData.address ) {
        sessionStorage.setItem('currentCityLocation', this.profileData.address.city);
      } else {
        this.getCurrentLocation();
      }
    
  }

  getCurrentLocation() {
    this.commonService.getCurrentLocation().then(res => {
      if(res){
        this.homeService.getCurrentUserCity(res).subscribe(cityObj => {
          this.currentCityLocation = cityObj.responseData.city;
          sessionStorage.setItem('currentCityLocation', this.currentCityLocation)
        });
      }
    });
  }

  getCategories() {    
    this.commonService.getCategories().subscribe(
      (res) => {
        if (res && res.code == 200) {
          this.categories = res.categoryList;
          const savedData = this.storage.getSavedData();
          if (
            savedData &&
            savedData[storageKeys.filterByCategory] &&
            savedData[storageKeys.filterByCategory].category
          ) {
            this.selectedCategory = this.categories.find((category) => {
              return (
                savedData[storageKeys.filterByCategory].category ==
                category.category_id
              );
            });
          } else {
            let lastSelectedCategory = null;
            if (savedData[storageKeys.lastSelectedCategory]) {
              lastSelectedCategory = this.categories.find((cat) => {
                return (
                  savedData[storageKeys.lastSelectedCategory].category_id ==
                  cat.category_id
                );
              });
            }

            this.selectedCategory = lastSelectedCategory
              ? lastSelectedCategory
              : this.categories[0];
          }
          this.getProducts();
        } else {
          this.apiHit = true;
        }
      },
      (error) => this.commonService.errorHandler(error)
    );
  }

  getProducts(showMore?: boolean) {
    const savedData = this.storage.getSavedData();
    let payload: any = {};
    if (
      savedData &&
      savedData[storageKeys.filterByCategory] &&
      savedData[storageKeys.filterByCategory].category ==
        this.selectedCategory.category_id
    ) {
      let filterPayload = new FilterByCategory(
        savedData[storageKeys.filterByCategory]
      ).filterData;
      payload = filterPayload;
      
      this.filterApplied =
        filterPayload.brand.length ||
        filterPayload.model.length ||
        filterPayload.grade.length ||
        (filterPayload.price && (filterPayload.price.from > 0 || filterPayload.price.to < environment.filterMaxRange)) ? true : false;
          
      this.sortingApplied = filterPayload.sort ? true : false;
    } else {
      this.filterApplied = false;
      this.sortingApplied = false;
    }

    // call v2 get products    
    this.homeService
    .getProductsV2(this.selectedCategory.category_id, payload)
      .subscribe(
        (res) => {
          this.apiHit = true;
          this.totalModals = res.responseData.length;          
          if (res) {
            this.products = !showMore ? res?.responseData?.slice(0, 20) : res?.responseData;            
            this.currentExploreScroll = this.products.length > 2 ? 1550 : 1090;
          } else {
            this.products = [];
          }
        },
        (error) => {
          this.commonService.errorHandler(error);
        }
      );
  }

  // call v2 get explore products    
  getExploreProducts(showStartProducts?: boolean, resetProducts?: boolean) {
    let payload: any = {page: showStartProducts ? 1 : this.page, size: showStartProducts ? this.totalExploreProducts : this.limitPerPage};
    this.homeService.getExploreProductsV2(payload).subscribe((res) => {
      this.apiHit = true;
      if (res) {  
        this.totalExploreProducts = res.responseData.totalDocs;
        this.exploreHasNextPage = res.responseData.hasNextPage;
        this.exploreProducts = resetProducts ? res.responseData.docs : [...this.exploreProducts, ...res.responseData.docs];          
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  onScrollDown(ev: any) {
    let activeScroll = ev.currentScrollPosition ? true : false;
    
    if (this.exploreHasNextPage && ev.currentScrollPosition > this.currentExploreScroll && activeScroll) {
      // increase scroll per loading products height 
      this.page += 1;
      this.currentExploreScroll = ev.currentScrollPosition + 480;
      this.getExploreProducts(false, false);
      this.toggleExplore = true;
    }
    this.direction = 'scroll down';
  }

  selectCategory(category: any) {
    this.apiHit = false;
    this.selectedCategory = category;
    this.storage.set(storageKeys.lastSelectedCategory, this.selectedCategory);

    const dataLayerCategoryInfo = {
      event: 'pageview',
      pagePath: 'products/' + category?.category_name?.toLowerCase(), // dynamic param
      pageTitle: category.category_name
    };

    window['dataLayer'] = window['dataLayer'] || [];
    window['dataLayer'].push(dataLayerCategoryInfo);
    this.showMoreProducts = false;
    this.getProducts(false);
    this.showLessProducts(true);
  }

  getOverAllPrice(product): BuyModalPrice {
    return this.commonService.calculatePriceForBuyModal(product, 'calculate');
  }

  addGtmSocialMedia(social: string) {
    const pageURL =
      social == 'twitter'
        ? 'https://twitter.com/soum_online?s=21'
        : 'https://www.instagram.com/soum_online/?utm_medium=copy_link';
    window['dataLayer'] = window['dataLayer'] || [];
    const socialGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: social == 'twitter' ? 'visit-twitier' : 'visit-instgram'
    };
    window['dataLayer'].push(socialGTM);
  }

  changeLanguage() {
    let defaultLanguage = 'en';
    if (this.arabic) {
      defaultLanguage = 'en';
    } else {
      defaultLanguage = 'ar';
    }
    this.localizeService.changeLanguage(defaultLanguage);
  }

  handleProductsChange(expandProducts) {
    this.showMoreProducts = !this.showMoreProducts;
    if (this.showMoreProducts) {
      this.getProducts(true);
    } else {
      this.getProducts(false);
    }
  }

  handleSppNavigation(id) {
    let options: NavigationExtras = {};
    options.queryParams = {
      product: id
    };
    this.router.navigate(['/product-detail'], options);
  }
  showAllProducts() {
    this.toggleExplore = true;
    this.getExploreProducts(true, true);
    window.scroll({
      top: 1700, 
      left: 0, 
      behavior: 'smooth'
    });
  }
  showLessProducts(scroll?: boolean) {
    this.page = 1;
    this.limitPerPage = 12;
    this.currentExploreScroll = this.products.length > 4 ? 3750 : 1550;
    this.toggleExplore = false;
    this.getExploreProducts(false,true);
    if (!scroll) {
      window.scroll({
        top: 500, 
        left: 0, 
        behavior: 'smooth'
      });
    }
  }

  navigateSearchPage() {
    this.router.navigate(['/devices-search'], {
      queryParams: {
        category: this.selectedCategory.category_id
      }
    });
  }
}
