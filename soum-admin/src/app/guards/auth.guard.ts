import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageKeys } from '../services/core/storage/storage-keys';
import { StorageService } from '../services/core/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private storage: StorageService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const savedData = this.storage.getSavedData();
    if (savedData) {
      if ((route.routeConfig.path.includes("login") || route.routeConfig.path.includes("forgot-password")) && !savedData[StorageKeys.loginDetails]) {
        return true;
      } else if (savedData[StorageKeys.loginDetails] && route.routeConfig.path.includes("admin")) {
        if(savedData?.loginDetails?.isBetaAdmin) {
         const flag = route.routeConfig.path.includes("flagged-listings") || route.routeConfig.path.includes("deleting-listings") || route.routeConfig.path.includes("products-details")
         if (flag) {
          return true;
         } else {
          this.router.navigate(['/admin/products/flagged-listings']);
         }
        }
        return true;
      } else if (savedData[StorageKeys.loginDetails] && (route.routeConfig.path.includes("login") || route.routeConfig.path.includes("forgot-password"))) {
        // this.router.navigate(['/admin/dashboard']);
        this.router.navigate(['/admin/system-settings']);
        return false;
      }
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

}
