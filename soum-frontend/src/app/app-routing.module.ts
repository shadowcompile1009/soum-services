import { HotDealsComponent } from './components/hot-deals/hot-deals.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancelReturnComponent } from './components/cancel-return/cancel-return.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DeviceListingComponent } from './components/device-listing/device-listing.component';
import { DeviceSearchComponent } from './components/device-search/device-search.component';
import { FilterComponent } from './components/filter/filter.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginEnterMobileComponent } from './components/login/login-enter-mobile/login-enter-mobile.component';
import { LoginEnterPasswordComponent } from './components/login/login-enter-password/login-enter-password.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { PickUpAddressComponent } from './components/pick-up-address/pick-up-address.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductPhotosComponent } from './components/product-photos/product-photos.component';
import { ProductPriceComponent } from './components/product-price/product-price.component';
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
import { TestHyperPayComponent } from './components/hyper-pay/hyper-pay.component';
import { TrackOrderComponent } from './components/track-order/track-order.component';
import { AuthGuard } from './services/core/auth-guard/auth-guard.guard';
import { PaymentSuccessfulComponent } from './components/payment-successful/payment-successful.component';
import { PaymentOptionsComponent } from './components/payment-options/payment-options.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { DraftProductReturnComponent } from './components/draft-product-return/draft-product-return.component';
import { OrderNowComponent } from './components/order-now/order-now.component';
import { FirstScreenLoginComponent } from './components/login/first-screen-login/first-screen-login.component';
import { CompletedSuccessfullyRegComponent } from './components/login/completed-successfully-reg/completed-successfully-reg.component';
import { SecondScreenLoginComponent } from './components/login/second-screen-login/second-screen-login.component';
import { ListSummaryComponent } from './components/listing-summary/list-summary/list-summary.component';
import { AllDevicesListComponent } from './components/all-devices-list/all-devices-list.component';
import { AddProfileAddressComponent } from './components/add-profile-address/add-profile-address.component';
import { CongratulationsComponent } from './components/congratulations/congratulations.component';
import { BankDetailAddComponent } from './components/bank-detail-add/bank-detail-add.component';
import { LastStepListingComponent } from './components/last-step-listing/last-step-listing.component';
import { RedirectPageComponent } from './shared-components/redirect-page/redirect-page.component';
import { PostListingWalkthroughComponent } from './components/post-listing-walkthrough/post-listing-walkthrough.component';
import { PreListingWalkthroughComponent } from './components/pre-listing-walkthrough/pre-listing-walkthrough.component';
import { DeviceStatusComponent } from './components/device-status/device-status.component';

const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  {
    path: '',
    loadChildren: () =>
      import('./components/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      )
  },
  { path: 'devices', component: DeviceListingComponent },
  { path: 'devices-search', component: DeviceSearchComponent },
  { path: 'allproducts', component: AllDevicesListComponent },
  { path: 'filter', component: FilterComponent },
  { path: 'sort-by', component: SortByComponent },
  { path: 'product-detail', component: ProductDetailsComponent },
  { path: 'list-detail', component: ListSummaryComponent },

  // SELLER FLOW
  { path: 'disclaimer', component: PreListingWalkthroughComponent },
  { path: 'save-draft', component: DraftProductReturnComponent },
  { path: 'selected-photos/:type', component: ProductPhotosComponent },
  { path: 'select-devices', component: SelectDevicesComponent },
  { path: 'select-brand', component: SelectBrandComponent },
  { path: 'select-model', component: SelectModelComponent },
  { path: 'select-variant', component: SelectVariantComponent },
  { path: 'product-price', component: ProductPriceComponent },
  { path: 'question-answer', component: QuestionAnswerComponent },
  { path: 'cancel-return/:order_id', component: CancelReturnComponent },
  { path: 'pick-up-address', component: PickUpAddressComponent },
  { path: 'add-address', component: AddProfileAddressComponent },
  // SELLLER FLOW ENDS HERE
  { path: 'add-bank', component: BankDetailAddComponent },
  { path: 'track-order', component: TrackOrderComponent },
  { path: 'order-details', component: OrderDetailsComponent },
  { path: 'order-status', component: OrderStatusComponent },
  { path: 'order', component: OrderNowComponent },
  // LOGIN SIGNUP RELATED FLOWS
  { path: 'login', component: FirstScreenLoginComponent },
  {
    path: 'login/enter-mobile',
    component: LoginEnterMobileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login/verify-user',
    component: LoginEnterPasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'successfully/registered',
    component: CompletedSuccessfullyRegComponent
  },
  {
    path: 'signup/enter-mobile',
    component: SignupComponent,
    canActivate: [AuthGuard]
  },
  { path: 'signup/password', component: SignupPasswordComponent },
  {
    path: 'verify-mobile',
    component: VerifyMobileComponent
    // canActivate: [AuthGuard],
  },
  { path: 'login/continue', component: SecondScreenLoginComponent },
  // LOGIN SIGNUP RELATED FLOWS ENDS HERE
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // hyper pay
  {
    path: 'pay/:order_id/:product_id/:checkout_id/:payment_mode/:type',
    component: TestHyperPayComponent
  },
  {
    path: 'payment-successful/:order_id/:product_id/:type',
    component: PaymentSuccessfulComponent
  },

  {
    path: 'payment-options/:product_id/:type',
    component: PaymentOptionsComponent
  },
  // { path: "bank-detail", component: BankDetailComponent },
  { path: 'listing-confirmation', component: PostListingWalkthroughComponent },
  { path: 'congratulation', component: CongratulationsComponent },
  // { path: 'pre-listing', component: PreListingWalkthroughComponent },
  { path: 'redirect', component: RedirectPageComponent },
  { path: 'lastStep', component: LastStepListingComponent },
  { path: 'hot-deals', component: HotDealsComponent },
  { path: 'deivce-status', component: DeviceStatusComponent },
  { path: '**', redirectTo: 'products', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
