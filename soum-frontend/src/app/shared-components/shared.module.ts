import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard';
import { ReferAndEarnComponent } from '../components/dashboard/profile/refer-and-earn/refer-and-earn.component';
import { PipesModule } from '../pipes/pipes.module';
import { AlertPopupComponent } from './alert-popup/alert-popup.component';
import { BannerBreadcrumbComponent } from './banner-breadcrumb/banner-breadcrumb.component';
import { BidInfoComponent } from './bid-info/bid-info.component';
import { BidModalComponent } from './bid-modal/bid-modal.component';
import { BuyInfoComponent } from './buy-info/buy-info.component';
import { BuyModalComponent } from './buy-modal/buy-modal.component';
import { CancelListingComponent } from './cancel-listing/cancel-listing.component';
import { ConditionComponent } from './condition/condition.component';
import { DeleteListingModalComponent } from './delete-listing-modal/delete-listing-modal.component';
import { HeaderComponent } from './header/header.component';
import { InvoiceArComponent } from './invoice-ar/invoice-ar.component';
import { InvoiceEnComponent } from './invoice-en/invoice-en.component';
import { PhotoModalComponent } from './photo-modal/photo-modal.component';
import { PhotoSliderComponent } from './photo-slider/photo-slider.component';
import { ProductModelComponent } from './product-model/product-model.component';
import { ProductsHeaderComponent } from './products-header/products-header.component';
import { RedirectMessageLoginComponent } from './redirect-message-login/redirect-message-login.component';
import { RedirectPageComponent } from './redirect-page/redirect-page.component';
import { ReferralCodeComponent } from './referral-code/referral-code.component';
import { ReferralPopupComponent } from './referral-popup/referral-popup.component';
import { SaveDraftModalComponent } from './save-draft-modal/save-draft-modal.component';
import { SellModalComponent } from './sell-modal/sell-modal.component';
import { SetBatteryComponent } from './set-battery/set-battery.component';
import { SetExpiryComponent } from './set-expiry/set-expiry.component';
import { SuccessfulBidComponent } from './successful-bid/successful-bid.component';
import { UploadOptionsComponent } from './upload-options/upload-options.component';
import { DownloadAppComponent } from './download-app/download-app.component';
import { RenewExpiredComponent } from './renew-expired/renew-expired.component';
import { DeleteItemComponent } from './delete-item/delete-item.component';
import { PopupNewAddressComponent } from './popup-new-address/popup-new-address.component';
import { HotDealsComponent } from '../components/hot-deals/hot-deals.component';
import { ProductCatalogCard } from 'src/app/shared-components/product-catalog-card/product-catalog-card.component';
@NgModule({
  declarations: [
    BidModalComponent,
    BuyModalComponent,
    AlertPopupComponent,
    InvoiceArComponent,
    InvoiceEnComponent,
    SuccessfulBidComponent,
    ReferralCodeComponent,
    SellModalComponent,
    CancelListingComponent,
    BuyInfoComponent,
    BidInfoComponent,
    SetExpiryComponent,
    SetBatteryComponent,
    PhotoModalComponent,
    UploadOptionsComponent,
    ConditionComponent,
    ReferralPopupComponent,
    PhotoSliderComponent,
    SaveDraftModalComponent,
    DeleteListingModalComponent,
    PhotoSliderComponent,
    RedirectMessageLoginComponent,
    ReferAndEarnComponent,
    HeaderComponent,
    ProductModelComponent,
    BannerBreadcrumbComponent,
    RedirectPageComponent,
    ProductsHeaderComponent,
    DownloadAppComponent,
    RenewExpiredComponent,
    DeleteItemComponent,
    PopupNewAddressComponent,
    HotDealsComponent,
    ProductCatalogCard
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    PipesModule,
    ClipboardModule
  ],
  exports: [
    BidModalComponent,
    BuyModalComponent,
    SuccessfulBidComponent,
    SellModalComponent,
    AlertPopupComponent,
    InvoiceArComponent,
    InvoiceEnComponent,
    CancelListingComponent,
    SaveDraftModalComponent,
    InvoiceEnComponent,
    BuyInfoComponent,
    BidInfoComponent,
    SetExpiryComponent,
    SetBatteryComponent,
    PhotoModalComponent,
    UploadOptionsComponent,
    ConditionComponent,
    ReferralCodeComponent,
    ReferralPopupComponent,
    DeleteListingModalComponent,
    PhotoSliderComponent,
    HeaderComponent,
    ProductModelComponent,
    BannerBreadcrumbComponent,
    RedirectPageComponent,
    ProductsHeaderComponent,
    DownloadAppComponent,
    RenewExpiredComponent,
    DeleteItemComponent,
    HotDealsComponent,
    ProductCatalogCard
  ]
})
export class SharedModule {}
