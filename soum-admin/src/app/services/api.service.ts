import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getRequestUrl(endpoint: string) {
    return environment.baseUrl + endpoint;
  }

  getRequestUrlWithSecondURL(endpoint: string) {
    return environment.secondbaseUrl + endpoint;
  }
  getRequestUrlWithThirdURL(endpoint: string) {
    return environment.thirdbaseUrl + endpoint;
  }

  getRequestUrlWithCommissionURL(endpoint: string) {
    return environment.baseCommissionURL + endpoint;
  }


  getHeader(isHeader: 1 | 2) {

    let httpOptions: any;
    switch (isHeader) {
      case 1:
        httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          }),
          observe: 'response'
        };
        break;

      case 2:
        let httpHeader = new HttpHeaders();
        httpHeader.append('content-type', 'multipart/form-data');
        httpOptions = {
          headers: httpHeader
        };
        break;
    }

    return httpOptions;
  }

  //  Post Api function **//
  postApi(endpoint: string, data: any, isHeader: 1 | 2): Observable<any> {
    return this.httpClient.post(this.getRequestUrl(endpoint), data, this.getHeader(isHeader));
  }

  //  Post Api function **//
  secondEnvpostApi(endpoint: string, data: any, isHeader: 1 | 2): Observable<any> {
    return this.httpClient.post(this.getRequestUrlWithSecondURL(endpoint), data, this.getHeader(isHeader));
  }
  commEnvpostApi(endpoint: string, data: any, isHeader: 1 | 2): Observable<any> {
    return this.httpClient.post(this.getRequestUrlWithCommissionURL(endpoint), data, this.getHeader(isHeader));
  }

  getURLFordownload(endpoint){
    return this.getRequestUrlWithSecondURL(endpoint);

  }

  //  Get Api function **//
  getApi(endpoint: string): Observable<any> {
    return this.httpClient.get(this.getRequestUrl(endpoint), this.getHeader(1));

  }

  secondEnvgetApi(endpoint: string): Observable<any> {
    return this.httpClient.get(this.getRequestUrlWithSecondURL(endpoint), this.getHeader(1));
  }

  commissionEnvget(endpoint: string): Observable<any> {
    return this.httpClient.get(this.getRequestUrlWithCommissionURL(endpoint), this.getHeader(1));
  }

  postCommissionApiWithTypeResponse<T>(endpoint: string, data: any, isHeader: 1 | 2, v2Api: boolean = true): Observable<HttpResponse<T>> {
    const apiURL = v2Api ? this.getRequestUrlWithCommissionURL(endpoint) : this.getRequestUrl(endpoint);
    return this.httpClient.post<T>(apiURL, data, this.getHeader(isHeader)) as Observable<HttpResponse<T>>;
  }

  microServiceGetApi(endpoint: string): Observable<any> {
    return this.httpClient.get(this.getRequestUrlWithThirdURL(endpoint), this.getHeader(1));
  }

  microServicePostApi(endpoint: string, data, isHeader): Observable<any> {
    return this.httpClient.post(this.getRequestUrlWithThirdURL(endpoint), data, this.getHeader(isHeader));
  }

  microServicePutApi(endpoint: string, obj: any, isHeader: 1 | 2): Observable<any> {
    return this.httpClient.put(this.getRequestUrlWithThirdURL(endpoint), obj, this.getHeader(isHeader));
  }

  microServicePatchApi(endpoint: string, obj: any, isHeader: 1 | 2): Observable<any> {
    return this.httpClient.patch(this.getRequestUrlWithThirdURL(endpoint), obj, this.getHeader(isHeader));
  }

  microServiceDeleteApi(endpoint: string): Observable<any> {
    return this.httpClient.delete(this.getRequestUrlWithThirdURL(endpoint), this.getHeader(1));
  }

  microServiceEnvgetApi(endpoint: string): Observable<any> {
    return this.httpClient.get(this.getRequestUrlWithThirdURL(endpoint), this.getHeader(1));
  }

  putSecondApiTypeResponseComm<T>(endpoint: string, obj: any, isHeader: 1 | 2, v2Api: boolean = true): Observable<HttpResponse<T>> {
    const apiURL = v2Api ? this.getRequestUrlWithCommissionURL(endpoint) : this.getRequestUrl(endpoint);
    return this.httpClient.patch<T>(apiURL, obj, this.getHeader(isHeader)) as Observable<HttpResponse<T>>;
  }


  deleteSecondApiTypeResponseComm<T>(endpoint: string, isHeader: 1 | 2, v2Api: boolean = true): Observable<HttpResponse<T>> {
    const apiURL = v2Api ? this.getRequestUrlWithCommissionURL(endpoint) : this.getRequestUrl(endpoint);
    return this.httpClient.delete<T>(apiURL, this.getHeader(isHeader)) as Observable<HttpResponse<T>>;
  }
  getApiWithTypeResponse<T>(endpoint: string, v2Api: boolean = true): Observable<HttpResponse<T>> {
    const apiURL = v2Api ? this.getRequestUrlWithSecondURL(endpoint) : this.getRequestUrl(endpoint);
    return this.httpClient.get<T>(apiURL, this.getHeader(1)) as Observable<HttpResponse<T>>;
  }

  postApiWithTypeResponse<T>(endpoint: string, data: any, isHeader: 1 | 2, v2Api: boolean = true): Observable<HttpResponse<T>> {
    const apiURL = v2Api ? this.getRequestUrlWithSecondURL(endpoint) : this.getRequestUrl(endpoint);
    return this.httpClient.post<T>(apiURL, data, this.getHeader(isHeader)) as Observable<HttpResponse<T>>;
  }

  putSecondApiTypeResponse<T>(endpoint: string, obj: any, isHeader: 1 | 2, v2Api: boolean = true): Observable<HttpResponse<T>> {
    const apiURL = v2Api ? this.getRequestUrlWithSecondURL(endpoint) : this.getRequestUrl(endpoint);
    return this.httpClient.put<T>(apiURL, obj, this.getHeader(isHeader)) as Observable<HttpResponse<T>>;
  }

  deleteSecondApiTypeResponse<T>(endpoint: string, isHeader: 1 | 2, v2Api: boolean = true): Observable<HttpResponse<T>> {
    const apiURL = v2Api ? this.getRequestUrlWithSecondURL(endpoint) : this.getRequestUrl(endpoint);
    return this.httpClient.delete<T>(apiURL, this.getHeader(isHeader)) as Observable<HttpResponse<T>>;
  }

  //  Put Api function **//
  putApi(endpoint: string, obj: any, isHeader: 1 | 2): Observable<any> {
    return this.httpClient.put(this.getRequestUrl(endpoint), obj, this.getHeader(isHeader));
  }
  putSecondApi(endpoint: string, obj: any, isHeader: 1 | 2): Observable<any> {
    return this.httpClient.put(this.getRequestUrlWithSecondURL(endpoint), obj, this.getHeader(isHeader));
  }

  putApicomm(endpoint: string,obj: any, isHeader: 1 | 2): Observable<any> {
    return this.httpClient.put(this.getRequestUrlWithCommissionURL(endpoint),obj, this.getHeader(isHeader));
  }
  microServiceSecondPutApi(endpoint: string, obj: any, isHeader: 1 | 2): Observable<any> {
    return this.httpClient.put(this.getRequestUrlWithThirdURL(endpoint), obj, this.getHeader(isHeader));
  }
  deleteApi(endpoint: string): Observable<any> {
    return this.httpClient.delete(this.getRequestUrl(endpoint), this.getHeader(1));
  }
  deleteApicomm(endpoint: string): Observable<any> {
    return this.httpClient.delete(this.getRequestUrlWithCommissionURL(endpoint), this.getHeader(1));
  }
  deleteSecondApi(endpoint: string): Observable<any> {
    return this.httpClient.delete(this.getRequestUrlWithSecondURL(endpoint), this.getHeader(1));
  }
}
