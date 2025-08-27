import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from '../dashboard/products/products.component';
import { DashboardComponent } from './dashboard.component';
import { BidsAndItemsComponent } from './bids-and-items/bids-and-items.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from '../login/login.component';
import { TranslateModule } from '@ngx-translate/core';
import { OwlModule } from 'ngx-owl-carousel';
import { AuthGuard } from 'src/app/services/core/auth-guard/auth-guard.guard';
import { SharedModule } from 'src/app/shared-components/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NotificationComponent } from './notifications/notification/notification.component';
import { NotificationCellComponent } from './notifications/notification-cell/notification-cell.component';
import { PrivacyPolicyComponent } from './profile/privacy-policy/privacy-policy.component';
import { AboutSoumComponent } from './profile/about-soum/about-soum.component';
import { ReferAndEarnComponent } from 'src/app/components/dashboard/profile/refer-and-earn/refer-and-earn.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AllProductsPageComponent } from './all-products-page/all-products-page.component';
import { QuestionHeadersComponent } from './profile/question-headers/question-headers.component';
import { MaterialModule } from 'src/app/shared-components/material-components/material.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: '/products', pathMatch: 'full' },
      { path: 'products', component: ProductsComponent },
      { path: 'bids-and-items', component: BidsAndItemsComponent },
      // { path: 'sell', component: SellComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'about-soum', component: AboutSoumComponent },
      { path:'FAQ', component:QuestionHeadersComponent},
      { path: 'notifications', component: NotificationComponent },
      { path: 'refer-and-earn', component: ReferAndEarnComponent },
      {
        path: 'login-page',
        component: LoginComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    ProductsComponent,
    BidsAndItemsComponent,
    ProfileComponent,
    LoginComponent,
    NotificationComponent,
    NotificationCellComponent,
    PrivacyPolicyComponent,
    AllProductsPageComponent
  ],
  imports: [
    InfiniteScrollModule,
    MatButtonToggleModule,
    MatTabsModule,
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    OwlModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    MaterialModule
  ],
  exports: [RouterModule]
})
export class DashboardModule {}
