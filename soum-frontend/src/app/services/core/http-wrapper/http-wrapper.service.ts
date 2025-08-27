import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpWrapperService {
  constructor(private http: HttpClient) {}

  private getUrl(url: string) {
    url = environment.baseUrl + url;
    return url;
  }
  private getSecondUrl(url: string) {
    url = environment.secondbaseUrl + url;
    return url;
  }

  private getHttpHeaders(options: HttpInputData) {
    let headers = {};
    if (options) {
      headers = { headers: options.headers, params: options.params };
    }
    return headers;
  }
  public getImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  public getFullURL(url: string) {
    return this.getSecondUrl(url);
  }

  public getV2(endpoint: string, options?: HttpInputData): Observable<any> {
    return this.http.get(
      this.getSecondUrl(endpoint),
      this.getHttpHeaders(options)
    );
  }
  public postV2(
    endpoint: string,
    payload: any,
    options?: HttpInputData
  ): Observable<any> {
    return this.http.post(
      this.getSecondUrl(endpoint),
      payload,
      this.getHttpHeaders(options)
    );
  }
  public putV2(
    endpoint: string,
    payload: any,
    options?: HttpInputData
  ): Observable<any> {
    return this.http.put(
      this.getSecondUrl(endpoint),
      payload,
      this.getHttpHeaders(options)
    );
  }
  public deleteV2(endpoint: string, options?: HttpInputData): Observable<any> {
    return this.http.delete(
      this.getSecondUrl(endpoint),
      this.getHttpHeaders(options)
    );
  }
  public get(endpoint: string, options?: HttpInputData): Observable<any> {
    return this.http.get(this.getUrl(endpoint), this.getHttpHeaders(options));
  }
  public post(
    endpoint: string,
    payload: any,
    options?: HttpInputData
  ): Observable<any> {
    return this.http.post(
      this.getUrl(endpoint),
      payload,
      this.getHttpHeaders(options)
    );
  }
  public put(
    endpoint: string,
    payload: any,
    options?: HttpInputData
  ): Observable<any> {
    return this.http.put(
      this.getUrl(endpoint),
      payload,
      this.getHttpHeaders(options)
    );
  }
  public delete(endpoint: string, options?: HttpInputData): Observable<any> {
    return this.http.delete(
      this.getUrl(endpoint),
      this.getHttpHeaders(options)
    );
  }
}

export class HttpInputData {
  headers: HttpHeaders = null;
  params: HttpParams = null;
  authentication: boolean = null;
}
