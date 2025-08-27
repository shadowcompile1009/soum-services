import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { SharingDataService } from '../sharing-data/sharing-data.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private sharingServ: SharingDataService
  ) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let parseData: any = null;
    this.sharingServ.userData.subscribe((data) => {
      parseData = data ? data : null;
    });

    if (parseData) {
      const token = parseData?.token;
      const tokenDate: any = jwt_decode(token);

      const dateNow = new Date();
      const dateExpire = new Date(tokenDate?.exp * 1000);

      if (dateExpire <= dateNow) {
        localStorage.removeItem('token');
        localStorage.removeItem('userDetails');
        localStorage.removeItem('loginDetails');
        this.router.navigate(['/login/continue']);
      }
    }

    return next.handle(request);
  }
}
