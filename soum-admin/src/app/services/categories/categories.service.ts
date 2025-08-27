import { Injectable } from '@angular/core';
import { AddCondition } from 'src/app/components/admin/categories/conditions/conditions.component';
import { AddVarient } from 'src/app/components/admin/categories/variants/variants.component';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(
    private apiService: ApiService
  ) { }

  getCategory() {
    return this.apiService.secondEnvgetApi(endpoint.getCategoriesV2);
  }

  getCategoryBySuperCategoryId(super_category_id:string) {
    return this.apiService.secondEnvgetApi(endpoint.getCategoryBySuperCategoryId(super_category_id));
  }

  getSuperCategories() {
    return this.apiService.secondEnvgetApi(endpoint.getSuperCategoriesV2)
  }

  addCategory(payload: FormData) {
    return this.apiService.secondEnvpostApi(endpoint.addCategoryV2, payload, 2);
  }

  editCategory(category_id: string, payload: FormData) {
    return this.apiService.putSecondApi(endpoint.editCategoryV2(category_id), payload, 2);
  }

  deleteCategory(category_id: string) {
    return this.apiService.deleteSecondApi(endpoint.deleteCategory(category_id));
  }

  getBrands(category_id: string) {
    return this.apiService.getApi(endpoint.brand + `${category_id}`);
  }

  addBrand(payload: FormData) {
    return this.apiService.postApi(endpoint.addBrand, payload, 2);
  }

  editBrand(brand_id: string, payload: FormData) {
    return this.apiService.putApi(endpoint.editBrand(brand_id), payload, 2);
  }

  deleteBrand(brand_id: string) {
    return this.apiService.deleteApi(endpoint.deleteBrand(brand_id));
  }

  getModels(brand_id: string) {
    return this.apiService.getApi(endpoint.model + brand_id)
  }

  addModel(payload: FormData) {
    return this.apiService.postApi(endpoint.addModel, payload, 2)
  }

  editModel(model_id: string, payload: FormData) {
    return this.apiService.putApi(endpoint.editModel(model_id), payload, 2);
  }

  editModelCommission(model_id: string) {
    return this.apiService.secondEnvgetApi(endpoint.editModelCommission(model_id));
  }
  editModelV2(model_id: string, payload) {
    return this.apiService.putSecondApi(endpoint.editModelV2(model_id), payload, 2);
  }

  deleteModel(model_id: string) {
    return this.apiService.deleteApi(endpoint.deleteModel(model_id));
  }

  getVarients(model_id: string) {
    return this.apiService.secondEnvgetApi(endpoint.getVarients2(model_id))
  }

  getPaginatedVariants(model_id: string, offset: number, limit: number) {
    return this.apiService.secondEnvgetApi(endpoint.getPaginatedVariants(model_id, offset, limit))
  }

  addVarient(payload: AddVarient, varient_id?: string) {
    if (varient_id) {
      return this.apiService.putApi(endpoint.editVarient(varient_id), payload, 1);
    } else {
      return this.apiService.postApi(endpoint.addVarient, payload, 1);
    }
  }

  deleteVarient(varient_id: string) {
    return this.apiService.deleteApi(endpoint.deleteVarient(varient_id));
  }

  changeOrderForCategory(payload: any) {
    return this.apiService.postApi(endpoint.changeCategoryOrder, payload, 1);
  }
  changeOrderForBrand(payload: any) {
    return this.apiService.postApi(endpoint.changeBrandOrder, payload, 1);
  }

  changeOrderForModel(payload: any) {
    return this.apiService.postApi(endpoint.changeModelOrder, payload, 1);
  }

  uploadPricesFile(payload: any) {
    return this.apiService.secondEnvpostApi(endpoint.uploadPriceNudge, payload, 1);
  }

  changeOrderForVariant(payload: any) {
    return this.apiService.postApi(endpoint.changeVariantOrder, payload, 1);
  }

  getConditions(varientID: any) {
     // update endPoint to get conditions not varient
    return this.apiService.getApi(endpoint.getVarients(varientID))
  }

  addCondition(payload: AddCondition, condition_id?: string) {
    if (condition_id) {
       // update endPoint to update condition not varient
      return this.apiService.putApi(endpoint.editVarient(condition_id), payload, 1);
    } else {
      // update endPoint to add condition not varient
      return this.apiService.postApi(endpoint.addVarient, payload, 1);
    }
  }

  deleteCondition(condition_id: string) {
     // update endPoint to delete condition not varient
    return this.apiService.deleteApi(endpoint.deleteVarient(condition_id));
  }

  updateEnableBrandAccesories(brandID: string, payload) {
    return this.apiService.putSecondApi(endpoint.updateEnableBrandAccesories(brandID), payload, 1)
  }

  deleteBrandAccessories(accID: string) {
    return this.apiService.deleteSecondApi(endpoint.deleteBrandAccessories(accID))
  }

  addBrandAccessories(brandID: string, payload) {
    return this.apiService.secondEnvpostApi(endpoint.addBrandAccessories(brandID), payload, 2);
  }

  updateBrandAccessories(accID: string, payload) {
    return this.apiService.putSecondApi(endpoint.updateBrandAccessories(accID), payload, 2);
  }

}
