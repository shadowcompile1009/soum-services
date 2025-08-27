import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgApexchartsModule} from 'ng-apexcharts';
import {FileSaverModule} from 'ngx-filesaver';
import {OwlModule} from 'ngx-owl-carousel';
import {NgxPaginationModule} from 'ngx-pagination';
import {AuthGuard} from 'src/app/guards/auth.guard';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {AdminComponent} from './admin.component';
import {AdministratorsComponent} from './administrators/administrators.component';
import {AttributesComponent} from './attributes/attributes.component';
import {BannersComponent} from './banners/banners.component';
import {BidLogsComponent} from './bid-logs/bid-logs.component';
import {LogDetailsComponent} from './bid-logs/log-details/log-details.component';
import {BidsSettingsComponent} from './bids-settings/bids-settings.component';
import {BidsComponent} from './bids/bids.component';
import {BrandsComponent} from './categories/brands/brands.component';
import {CategoriesComponent} from './categories/categories.component';
import {SuperCategoriesComponent} from './categories/super-categories/super-categories.component';
import {ConditionsComponent} from './categories/conditions/conditions.component';
import {ModelsComponent} from './categories/models/models.component';
import {VariantsV2Component} from './categories/variants/v2/variants.component';
import {VariantsComponent} from './categories/variants/variants.component';
import {AddCollectionComponent} from './collections/add-collection/add-collection.component';
import {CollectionsComponent} from './collections/collections.component';
import {CommissionsComponent} from './comissions/commissions.component';
import {CommentsComponent} from './comments/comments.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {MasterQuestionsComponent} from './master-questions/master-questions.component';
import {OrderDetailsComponent} from './orders/order-details/order-details.component';
import {OrdersComponent} from './orders/orders.component';
import {PayoutEditComponent} from './orders/payout-edit/payout-edit.component';
import {PayoutOrderComponent} from './orders/payout-order/payout-order.component';
import {PayoutRefundComponent} from './orders/payout-refund/payout-refund.component';
import {SuccessOrdersComponent} from './orders/success-orders/success-orders.component';
import {AdminLogsComponent} from './products/admin-logs/admin-logs.component';
import {
  DeleteListingCommentPopupComponent
} from './products/delete-listing-comment-popup/delete-listing-comment-popup.component';
import {DeletedListingComponent} from './products/deleted-listing/deleted-listing.component';
import {FlaggedListingComponent} from './products/flagged-listing/flagged-listing.component';
import {MismatchListingComponent} from './products/mismatch-listing/mismatch-listing.component';
import {OnholdListingComponent} from './products/onhold-listing/onhold-listing.component';
import {ProductsDetailsComponent} from './products/products-details/products-details.component';
import {ProductsComponent} from './products/products.component';
import {ReportedListingComponent} from './products/reported-listing/reported-listing.component';
import {PromoListComponent} from './promo-list/promo-list.component';
import {PromosReportComponent} from './promos-report/promos-report.component';
import {QuestionsComponent} from './questions/questions.component';
import {ReferralLogsComponent} from './referral-logs/referral-logs.component';
import {SellerFeesComponent} from './seller-fees/seller-fees.component';
import {SettingsComponent} from './settings/settings.component';
import {SystemSettingsComponent} from './system-settings/system-settings.component';
import {TradeInsComponent} from './trade-ins/trade-ins.component';
import {TradeinDetailsComponent} from './trade-ins/tradein-details/tradein-details.component';
import {BetaUsersComponent} from './users/beta-users/beta-users.component';
import {UserDetailsComponent} from './users/user-details/user-details.component';
import {UsersComponent} from './users/users.component';
import {ConditionComponent} from './conditions/conditions.component';
import {AttributeComponent} from './attribute/attribute.component';
import {ImageRestructionsComponent} from './image-restructions/image-restructions.component';
import {ImagesSectionComponent} from './products/images-section/images-section.component';
import {AddonsComponent} from './addons/addons.component';
import {
  DlDateTimeDateModule,
  DlDateTimePickerModule,
} from 'angular-bootstrap-datetimepicker';
import {CollectionsCarComponent} from "./collections-car/collections-car.component";
import {AddCollectionCarComponent} from "./collections-car/add-collection/add-car-collection.component";


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {path: '', redirectTo: '/admin/system-settings', pathMatch: 'full'},
      // { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      {
        path: 'admin/system-settings',
        component: SystemSettingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
      },

      // USERS ROUTING
      {
        path: 'admin/users',
        component: UsersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/trade-in',
        component: TradeInsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/trade-in/details/:id',
        component: TradeinDetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/banners',
        component: BannersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/bid-settings',
        component: BidsSettingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/bid-logs',
        component: BidLogsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/beta-users',
        component: BetaUsersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/seller-fees',
        component: SellerFeesComponent,
        canActivate: [AuthGuard],
      },
      // Collections ROUTING
      {
        path: 'admin/collections',
        component: CollectionsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/collections/:id',
        component: AddCollectionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/collections-car',
        component: CollectionsCarComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/collections-car/:id',
        component: AddCollectionCarComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/bids',
        component: BidsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/comments',
        component: CommentsComponent,
        canActivate: [AuthGuard],
      },
      // {
      //   path: 'admin/promos-report',
      //   component: PromosReportComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'admin/referral-log',
      //   component: ReferralLogsComponent,
      //   canActivate: [AuthGuard],
      // },
      {
        path: 'admin/users/user-details/:user_id',
        component: UserDetailsComponent,
        canActivate: [AuthGuard],
      },
      // USERS ROUTING END

      // CATEGORIES ROUTING
      {
        path: 'admin/categories',
        component: SuperCategoriesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/categories/:superCategoryId',
        component: CategoriesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/categories/brands/:id',
        component: BrandsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/categories/brands/models/:category_id/:brand_id',
        component: ModelsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/categories/brands/models/variants/:category_id/:brand_id/:model_id',
        component: VariantsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/categories/brands/models/adons/:category_id/:brand_id/:model_id',
        component: AddonsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/categories/brands/models/variant/:category_id/:brand_id/:model_id',
        component: VariantsV2Component,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/categories/brands/models/variants/conditions/:category_id/:brand_id/:model_id/:varient_id',
        component: ConditionsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/categories/brands/models/variant/conditions/:category_id/:brand_id/:model_id/:variant_id',
        component: ConditionsComponent,
        canActivate: [AuthGuard],
      },
      // CATEGORIES ROUTING END

      {
        path: 'admin/master-questions',
        component: MasterQuestionsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/questions',
        component: QuestionsComponent,
        canActivate: [AuthGuard],
      },

      // PRODUCTS ROUTING
      {
        path: 'admin/products',
        component: ProductsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/products/products-details/:id',
        component: ProductsDetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/products/admin-logs/:id',
        component: AdminLogsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/products/mismatched-listings',
        component: MismatchListingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/products/reported-listings',
        component: ReportedListingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/products/deleting-listings',
        component: DeletedListingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/products/onhold-listings',
        component: OnholdListingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/products/flagged-listings',
        component: FlaggedListingComponent,
        canActivate: [AuthGuard],
      },

      // ORDERS ROUTING
      {
        path: 'admin/orders',
        component: OrdersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/orders-success',
        component: SuccessOrdersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/orders/order-details/:order_id',
        component: OrderDetailsComponent,
        canActivate: [AuthGuard],
      },
      // ORDERS ROUTING END
      {
        path: 'admin/orders/order-payout/:order_id',
        component: PayoutOrderComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/administrators',
        component: AdministratorsComponent,
        canActivate: [AuthGuard],
      },

      // PROMO-LIST ROUTING
      // {
      //   path: 'admin/promo-list',
      //   component: PromoListComponent,
      //   canActivate: [AuthGuard],
      // },
      {
        path: 'admin/attributes',
        component: AttributesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/attribute/:id',
        component: AttributeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/commissions',
        component: CommissionsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/conditions',
        component: ConditionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin/image-restructions',
        component: ImageRestructionsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    CommissionsComponent,
    AdminComponent,
    DashboardComponent,
    SystemSettingsComponent,
    UsersComponent,
    TradeInsComponent,
    CategoriesComponent,
    SuperCategoriesComponent,
    MasterQuestionsComponent,
    ProductsComponent,
    OrdersComponent,
    UserDetailsComponent,
    BrandsComponent,
    ModelsComponent,
    VariantsComponent,
    VariantsV2Component,
    OrderDetailsComponent,
    AdministratorsComponent,
    ProductsDetailsComponent,
    AdminLogsComponent,
    PromoListComponent,
    PayoutOrderComponent,
    BidsComponent,
    CommentsComponent,
    QuestionsComponent,
    SettingsComponent,
    PromosReportComponent,
    ReferralLogsComponent,
    ConditionsComponent,
    CollectionsComponent,
    CollectionsCarComponent,
    AddCollectionComponent,
    AddCollectionCarComponent,
    SuccessOrdersComponent,
    PayoutEditComponent,
    AttributesComponent,
    PayoutRefundComponent,
    MismatchListingComponent,
    ReportedListingComponent,
    DeletedListingComponent,
    OnholdListingComponent,
    FlaggedListingComponent,
    DeleteListingCommentPopupComponent,
    BetaUsersComponent,
    SellerFeesComponent,
    BannersComponent,
    TradeinDetailsComponent,
    BidsSettingsComponent,
    BidLogsComponent,
    LogDetailsComponent,
    ConditionComponent,
    AttributeComponent,
    ImageRestructionsComponent,
    ImagesSectionComponent,
    AddonsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    // PdfViewerModule,
    // ExportAsModule
    FileSaverModule,
    DragDropModule,
    PipesModule,
    OwlModule,
    MatDialogModule,
    DlDateTimeDateModule,
    DlDateTimePickerModule,
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule {
}
