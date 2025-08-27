import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { endpoint } from 'src/app/constants/endpoint';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageRestructionsService {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getImageGategorySections(catId: string, limit: number, page: number, sectionType: string) {
    return this.apiService.microServiceGetApi(endpoint.getImageGategorySections(catId, limit, page, sectionType));
  }

  requestUrlToUploadImage(count: number, extension: string, imageModule: string) {
    return this.apiService.microServiceGetApi(endpoint.requestUrlToUploadImage(count, extension, imageModule));
  }

  uploadImageToServer(url: any, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'content-type': 'multipart/form-data'
    });
    return this.http.put<any>(url, data, { headers });
  }

  sendMultiplePutRequests(urls: any[], bodies: any[]) {
    const headers = new HttpHeaders({
      'content-type': 'multipart/form-data'
    });
    const requests = urls.map((url, index) =>
      this.http.put<any>(url.url, bodies[index], { headers })
    );
    return forkJoin(requests);
  }

  saveSectionImage(data: any) {
    return this.apiService.microServicePostApi(endpoint.saveImageSection, data, 1);
  }

  updateSectionImage(section: any) {
    return this.apiService.microServicePutApi(endpoint.updateImageSectionActive(section?.id), section, 1);
  }

  getDummySectionsImages(productId: string) {
    return this.apiService.microServiceGetApi(endpoint.getDummySectionsImages(productId));
  }

  updateImageSection(productId: string, body: any) {
    return this.apiService.microServicePatchApi(endpoint.updateImageSection(productId), body, 1);
  }
}
