import { Injectable } from '@angular/core';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  constructor(private apiService: ApiService, private http: HttpClient) {}
  changeOrderForCollection(payload: any) {
    return this.apiService.secondEnvpostApi(
      endpoint.changeCollectionOrder,
      payload,
      1
    );
  }
  getCollectionList(category?: string) {
    return this.apiService.secondEnvgetApi(endpoint.getCollectionsList(category));
  }
  getCollectionsTypes() {
    return this.apiService.secondEnvgetApi(endpoint.getCollectionsTypes());
  }

  getCollectionsTypeList(feedType, category?: string) {
    return this.apiService.secondEnvgetApi(
      endpoint.getCollectionsTypeList(feedType, category)
    );
  }

  getCollectionById(id) {
    return this.apiService.secondEnvgetApi(endpoint.getCollectionById(id));
  }

  addCollection(payload) {
    return this.apiService.secondEnvpostApi(
      endpoint.getCollectionsList(''),
      payload,
      2
    );
  }

  editCollection(payload) {
    return this.apiService.putSecondApiTypeResponse(
      endpoint.editCollectionsList(),
      payload,
      2
    );
  }

  handleCollectionStatus(payload) {
    return this.apiService.putSecondApiTypeResponse(
      endpoint.changeCollectionStatus(),
      payload,
      2
    );
  }

  // tslint:disable-next-line:typedef
  validateProduct(payload) {
    return this.apiService.secondEnvpostApi(
      endpoint.productValidation(),
      payload,
      2
    );
  }

  requestUrlToUploadImage(
    count: number,
    extension: string,
    imageModule: string
  ) {
    return this.apiService.microServiceGetApi(
      endpoint.requestCategoryUrlToUploadImage(count, extension, imageModule)
    );
  }

  uploadImageToServer(url: any, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'content-type': 'multipart/form-data',
    });
    return this.http.put<any>(url, data, { headers });
  }
}

export class CollectionStatus {
  status: 'Active' | 'Inactive';

  constructor(status: 'Active' | 'Inactive') {
    this.status = status;
  }
}
