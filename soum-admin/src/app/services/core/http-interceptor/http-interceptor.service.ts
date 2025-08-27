import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageKeys } from '../storage/storage-keys';
import { StorageService } from '../storage/storage.service';
import { tap } from 'rxjs/operators';
import { CommonService } from '../../common/common.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private storage: StorageService,
    private commonService: CommonService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const savedData = this.storage.getSavedData();
    if (savedData && savedData[StorageKeys.token]) {
      const header = {
        token: savedData[StorageKeys.token],
        'client-id':"admin-web"

      };

      const updatedRequest = request.clone({
        headers: new HttpHeaders(header),
      });
      return next.handle(updatedRequest).pipe(
        tap(
          (event: HttpEvent<any>) => {},
          (error) => {
            if (error instanceof HttpErrorResponse) {
              console.log('http error ====>>', error);
              if (error.status == 401) {
                this.commonService.logout();
              }
            }
          }
        )
      );
    } else {
      return next.handle(request);
    }
  }
}
