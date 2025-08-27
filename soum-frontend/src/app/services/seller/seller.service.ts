import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { CommonService } from '../common/common.service';
import { ApiEndpoints } from '../core/http-wrapper/api-endpoints.constant';

import { EMPTY } from 'rxjs'
import {
  HttpInputData,
  HttpWrapperService
} from '../core/http-wrapper/http-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  selectedDevice: any;
  selectedColor: any;
  selectedBrand: any;
  selectedModel: any;
  selectedVarient: any;
  sell_price: string;
  bid_price: string;
  expiryAfterInDays: number;
  isListedBefore: any;
  uploadProductData = new UploadProduct();
  answeredQuestion: Array<any> = [];
  mediaType: string;
  selectedProductTab: boolean;
  selectedProductId: string;
  savedResponseId: string;
  tempSelectedResList: any;
  saveAsDraftAction: boolean;

  constructor(
    private httpWrapper: HttpWrapperService,
    private commonService: CommonService,
    private router: Router
  ) {}
  questions = [];
  private quesSub = new BehaviorSubject<any>(this.questions);
  public observableLoading = this.quesSub.asObservable();
  sendques(ques) {
    this.quesSub.next(ques);
  }
  variants = [];
  private varSub = new BehaviorSubject<any>(this.variants);
  public observableVar = this.varSub.asObservable();
  sendVar(ques) {
    this.varSub.next(ques);
  }
  putAnswersToProduct(response_id, body) {
    return this.httpWrapper.putV2(
      ApiEndpoints.putAnswersToProduct(response_id),
      body
    );
  }
  postAnswersToProduct(body) {
    return this.httpWrapper.postV2(ApiEndpoints.postAnswersToProduct, body);
  }
  deleteAnswersToProduct(response_id) {
    return this.httpWrapper.deleteV2(
      ApiEndpoints.putAnswersToProduct(response_id)
    );
  }

  calculateScorePriceNudging(body) {
    return this.httpWrapper.postV2(ApiEndpoints.postAnswersToProduct, body);
  }

  getAnswersToProduct(product_id) {
    return this.httpWrapper.getV2(ApiEndpoints.getAnswersToProduct(product_id));
  }
  getQuestionnaires() {
    if (this.selectedDevice != undefined) {
      var body = { category_id: this.selectedDevice.category_id };
      return this.httpWrapper.postV2(ApiEndpoints.getQuestionnaires, body);
    } else {
      return EMPTY;
    

    }
  }

  getQuestionnairesForDetails(id) {
    var body = { category_id: id };
    return this.httpWrapper.postV2(ApiEndpoints.getQuestionnaires, body);
  }
  getUploadProductPayload() {
    let uploadProductPayload = new FormData();

    Object.keys(this.uploadProductData).forEach((key) => {
      if (
        key !== 'product_images' &&
        key !== 'defected_images' &&
        key !== 'product_images_url'
      ) {
        if (key == 'body_cracks') {
          uploadProductPayload.append(
            key,
            this.uploadProductData.defected_images.length ? 'yes' : 'no'
          );
        } else {
          uploadProductPayload.append(key, this.uploadProductData[key]);
        }
      } else if (key === 'product_images_url') {
        this.uploadProductData[key].forEach((data: any) => {
          if (data) {
            uploadProductPayload.append(`${key}`, data);
          }
        });
      } else {
        this.uploadProductData[key].forEach((data: any) => {
          if (data.file) {
            uploadProductPayload.append(`${key}`, data.file);
          }
        });
      }
    });
    return uploadProductPayload;
  }

  async uploadProduct() {
    this.uploadProductData.variant_attributes_selections = [];
    const httpInput = new HttpInputData();
    return this.httpWrapper
      .post(
        ApiEndpoints.uploadProduct,
        this.getUploadProductPayload(),
        httpInput
      )
      .pipe(
        map((res) => {
          if (res) {
            return res;
          }
        })
      )
      .toPromise()
      .catch((error) => {
        this.commonService.errorHandler(error);
      });
  }

  async saveAsDraftProduct() {
    const httpInput = new HttpInputData();
    return this.httpWrapper
      .postV2(
        ApiEndpoints.saveAsDraftProduct,
        this.getUploadProductPayload(),
        httpInput
      )
      .pipe(
        map((res) => {
          if (res) {
            return res;
          }
        })
      )
      .toPromise()
      .catch((error) => {
        this.commonService.errorHandler(error);
      });
  }

  getModelSummartByCategoryID(category_id) {
    return this.httpWrapper.getV2(ApiEndpoints.modelSummaryById(category_id));
  }

  // New Variants
  getBaseAttributesByModelID(modeID: string) {
    return this.httpWrapper.getV2(ApiEndpoints.getBaseAttributesByModelID(modeID));
  }

  getNextAttributeVariant(modelID: string, baseAttributeID: string, baseAttributeOptionID: string,attributeId: string,previousOptions: any[]) {
    return this.httpWrapper.getV2(ApiEndpoints.getNextAttributeVariant(modelID, baseAttributeID, baseAttributeOptionID,attributeId,previousOptions));
  }

  getVariantDetails(modelID: string, baseAttributeID: string, baseAttributeOptionID: string, selectedAttributesID: any[]) {
    return this.httpWrapper.getV2(ApiEndpoints.getVariantDetails(modelID, baseAttributeID, baseAttributeOptionID,selectedAttributesID));
  }

  nullifyVariables() {
    this.sell_price = null;
    this.selectedBrand = null;
    this.selectedColor = null;
    this.bid_price = null;
    this.selectedDevice = null;
    this.selectedModel = null;
    this.selectedVarient = null;
    this.expiryAfterInDays = null;
    this.isListedBefore = null;
    this.uploadProductData = new UploadProduct();
    this.answeredQuestion = [];
    this.selectedProductTab = false;
    this.selectedProductId = null;
    this.savedResponseId = null;
    this.tempSelectedResList = null;
    this.saveAsDraftAction = false;
  }

}
export class UploadProduct {
  category_id: string = '';
  brand_id: string = '';
  model_id: string = '';
  color: string = '';
  product_images: Array<any> = [];
  product_images_url: Array<any> = [];
  defected_images: Array<any> = [];
  varient: string = '';
  varient_id: any = '';
  variant_attributes_selections: any = '';
  body_cracks: string = '';
  sell_price: string = '';
  bid_price: string = '';
  description: string = '';
  answer_to_questions: string = '';
  pick_up_address: string = '';
  answer_to_questions_ar: string = '';
  score: number = -1;
  varient_ar: string = '';
  tempID: string = String(new Date().getTime());
  expiryAfterInDays: number = 0;
  isListedBefore: any = 0;
  sellerPromocodeId: string = '';
  sellerDiscount: number = 0;
  current_price: any = 0;
  save_as_draft_step: string = '';
}
