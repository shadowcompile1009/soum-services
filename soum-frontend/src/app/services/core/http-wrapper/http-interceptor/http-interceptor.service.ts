import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { storageKeys } from '../../storage/storage-keys';
import { StorageService } from '../../storage/storage.service';
import { ApiEndpoints } from '../api-endpoints.constant';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  empty: boolean = false;
  constructor(
    private storage: StorageService,
    private translate: TranslateService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const savedData = this.storage.getSavedData();
    let receivedHeaders = request.headers;
    let header = {};
    if (request.url.includes(environment.baseUrl)) {
      header['lang'] = this.translate.getDefaultLang();
    }
    if (savedData && savedData[storageKeys.userDetails]) {
      header['token'] = savedData[storageKeys.userDetails].token;
      header['client-id'] = 'soum-web';
    }
    if (
      request.url.includes(environment.baseUrl + ApiEndpoints.uploadProduct)
    ) {
      // header['content-type'] = 'multipart/form-data'
    }

    receivedHeaders.keys().forEach((key) => {
      header[key] = receivedHeaders.get(key);
    });

    const updatedRequest = request.clone({
      headers: new HttpHeaders(header)
    });
    return next.handle(updatedRequest).pipe(
      tap(
        (event: HttpEvent<any>) => {
          this.empty = true;
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            //write your code here
          }
        }
      )
    );
  }
}
