import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import {
  HttpBackend,
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  ErrorHandler,
  NgModule
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared-components/material-components/material.module';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as Sentry from '@sentry/angular';
import firebase from 'firebase/app';
import { NgOtpInputModule } from 'ng-otp-input';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ClipboardModule } from 'ngx-clipboard';
import { CookieService } from 'ngx-cookie-service';
import { CountdownModule } from 'ngx-countdown';
import { ExportAsModule } from 'ngx-export-as';
import { NgxImageCompressService } from 'ngx-image-compress';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OwlModule } from 'ngx-owl-carousel';
import { NgxSpinnerModule } from 'ngx-spinner';
import { environment } from 'src/environments/environment.prod';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddProfileAddressComponent } from './components/add-profile-address/add-profile-address.component';
import { AllDevicesListComponent } from './components/all-devices-list/all-devices-list.component';
import { BankDetailAddComponent } from './components/bank-detail-add/bank-detail-add.component';
import { CancelReturnComponent } from './components/cancel-return/cancel-return.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { CongratulationsComponent } from './components/congratulations/congratulations.component';
import { RenewModalParentComponent } from './components/dashboard/bids-and-items/bids-and-items.component';
import { ProfileModule } from './components/dashboard/profile/profile.module';
import { DeviceListingComponent } from './components/device-listing/device-listing.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { DraftProductReturnComponent } from './components/draft-product-return/draft-product-return.component';
import { FilterComponent } from './components/filter/filter.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { TestHyperPayComponent } from './components/hyper-pay/hyper-pay.component';
import { ListSummaryComponent } from './components/listing-summary/list-summary/list-summary.component';
import { CompletedSuccessfullyRegComponent } from './components/login/completed-successfully-reg/completed-successfully-reg.component';
import { FirstScreenLoginComponent } from './components/login/first-screen-login/first-screen-login.component';
import { LoginEnterMobileComponent } from './components/login/login-enter-mobile/login-enter-mobile.component';
import { LoginEnterPasswordComponent } from './components/login/login-enter-password/login-enter-password.component';
import { SecondScreenLoginComponent } from './components/login/second-screen-login/second-screen-login.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { OrderNowComponent } from './components/order-now/order-now.component';
import { PaymentOptionsComponent } from './components/payment-options/payment-options.component';
import { PaymentSuccessfulComponent } from './components/payment-successful/payment-successful.component';
import { PickUpAddressComponent } from './components/pick-up-address/pick-up-address.component';
import {
  ProductDetailsComponent,
  RenewModalComponent
} from './components/product-details/product-details.component';
import { ProductPhotosComponent } from './components/product-photos/product-photos.component';
import { ProductPriceComponent } from './components/product-price/product-price.component';
import { ProductComponent } from './components/product/product.component';
import { QuestionAnswerComponent } from './components/question-answer/question-answer.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SelectBrandComponent } from './components/select-brand/select-brand.component';
import { SelectDevicesComponent } from './components/select-devices/select-devices.component';
import { SelectModelComponent } from './components/select-model/select-model.component';
import { SelectVariantComponent } from './components/select-variant/select-variant.component';
import { SignupPasswordComponent } from './components/signup/signup-password/signup-password.component';
import { SignupComponent } from './components/signup/signup.component';
import { VerifyMobileComponent } from './components/signup/verify-mobile/verify-mobile.component';
import { SortByComponent } from './components/sort-by/sort-by.component';
import { TrackOrderComponent } from './components/track-order/track-order.component';
import { PipesModule } from './pipes/pipes.module';
import { AuthInterceptor } from './services/auth-interceptor/auth-interceptor.interceptor';
import { HttpInterceptorService } from './services/core/http-wrapper/http-interceptor/http-interceptor.service';
import { LoginModalComponent } from './shared-components/login-modal/login-modal.component';
import { SharedModule } from './shared-components/shared.module';
import { LastStepListingComponent } from './components/last-step-listing/last-step-listing.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DeviceSearchComponent } from './components/device-search/device-search.component';
import { PostListingWalkthroughComponent } from './components/post-listing-walkthrough/post-listing-walkthrough.component';
import { PreListingWalkthroughComponent } from './components/pre-listing-walkthrough/pre-listing-walkthrough.component';
import { DeviceStatusComponent } from './components/device-status/device-status.component';

firebase.initializeApp(environment.firebaseConfig);

export function HttpLoaderFactory(handler: HttpBackend) {
  const http = new HttpClient(handler);
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  exports: [MaterialModule],
  declarations: [
    AppComponent,
    DeviceListingComponent,
    BankDetailAddComponent,
    FilterComponent,
    SortByComponent,
    RenewModalComponent,
    RenewModalParentComponent,
    ProductDetailsComponent,
    ProductPhotosComponent,
    SelectDevicesComponent,
    SelectBrandComponent,
    SelectModelComponent,
    SelectVariantComponent,
    QuestionAnswerComponent,
    ProductPriceComponent,
    TrackOrderComponent,
    OrderDetailsComponent,
    OrderStatusComponent,
    LoginEnterMobileComponent,
    LoginEnterPasswordComponent,
    SignupComponent,
    VerifyMobileComponent,
    SignupPasswordComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    CancelReturnComponent,
    PickUpAddressComponent,
    TestHyperPayComponent,
    PaymentSuccessfulComponent,
    PaymentOptionsComponent,
    DisclaimerComponent,
    OrderNowComponent,
    FirstScreenLoginComponent,
    CompletedSuccessfullyRegComponent,
    SecondScreenLoginComponent,
    ListSummaryComponent,
    DraftProductReturnComponent,
    AllDevicesListComponent,
    ProductComponent,
    AddProfileAddressComponent,
    CongratulationsComponent,
    LastStepListingComponent,
    LoginModalComponent,
    DeviceSearchComponent,
    PostListingWalkthroughComponent,
    PreListingWalkthroughComponent,
    DeviceStatusComponent
  ],
  imports: [
    InfiniteScrollModule,
    ClipboardModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    ProfileModule,
    OwlModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    NoopAnimationsModule,
    NgOtpInputModule,
    NgxSliderModule,
    SharedModule,
    PipesModule,
    ExportAsModule,
    NgSelectModule,
    CountdownModule,
    PdfViewerModule,
    MaterialModule,
    MatFormFieldModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend]
      }
    })
  ],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false
      })
    },
    {
      provide: Sentry.TraceService,
      deps: [Router]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {
        console.log('');
      },
      deps: [Sentry.TraceService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    TitleCasePipe,
    DatePipe,
    NgxImageCompressService,
    CookieService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
