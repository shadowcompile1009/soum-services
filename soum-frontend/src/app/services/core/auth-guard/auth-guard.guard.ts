import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CommonService } from '../../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private commonService: CommonService, private router: Router) {}

  canActivate() {
    if (this.commonService.isLoggedIn) {
      this.router.navigate(['/profile']);
      return false;
    } else {
      return true;
    }
  }
}
