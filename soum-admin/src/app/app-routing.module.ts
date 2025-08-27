import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { StorageKeys } from './services/core/storage/storage-keys';

class RedirectUrl {
  static getRedirectUrl() {
    const savedData = JSON.parse(JSON.parse(localStorage.getItem(StorageKeys.loginDetails)));
    if(savedData) {
      const defaultRoute = savedData?.isBetaAdmin ? '/admin/products/flagged-listings' : "/admin/system-settings"
      return defaultRoute;
    } else {
      return "/login";
    }
  }
}

let routes: Routes = [
  { path: '', redirectTo: RedirectUrl.getRedirectUrl(), pathMatch: 'full' },
  { path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
