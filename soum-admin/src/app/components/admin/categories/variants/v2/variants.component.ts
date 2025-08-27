import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CommonService } from 'src/app/services/common/common.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { AttributesService } from 'src/app/services/attributes/attributes.service';
import { VarientV2Service } from 'src/app/services/varients/varients.service';
import { Entries } from 'src/app/models/interface';
declare var $: any;

interface IAttibuteOptions {
  id: string,
  nameAr: string,
  nameEn: string
}
interface IAttributeInfo  {
  attributeId: string,
  featureId: string,
  options: IAttibuteOptions[]
}
@Component({
  selector: 'app-variants',
  templateUrl: './variants.component.html',
  styleUrls: ['./variants.component.scss'],
})
export class VariantsV2Component implements OnInit {
  category_id: any;
  brand_id: any;
  model_id: any;
  varients: any[];
  addVarientForm: FormGroup;
  attributeForm: FormGroup;
  varientToUpdate: any;
  variantToBeReordered: any[];
  attributesList: any[];
  attributesListIds: string[];
  attributeOptionsList: any[];
  duplicatedAttributes: boolean = false;
  selectedVariantToUpdate: any;
  limit: any = 20;
  totalResult: any;
  currentPage = 1;
  offset: number = 0;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };
  currency;
  constructor(
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private activateRout: ActivatedRoute,
    private categoriesService: VarientV2Service, // CategoriesService,
    private CategoriesServiceV1: CategoriesService,
    private commonService: CommonService,
    private _location: Location,
    private fb: FormBuilder,
    private attributeService: AttributesService
  ) {
    this.activateRout.params.subscribe((res) => {
      this.category_id = res.category_id;
      this.brand_id = res.brand_id; // get id from brand
      this.model_id = res.model_id;
    });

    this.attributeForm = this.getAttributeForm();
    this.getAttributes();
    this.currency = JSON.parse(localStorage.getItem('region')).currency;

  }

  selectPage(event) {
    this.currentPage = event;
    this.offset = event - 1;
    localStorage.setItem('variants_page_number', event);
    this.getAttributes();
  }

  getAttributeForm() {
    return this.fb.group({
      'featureId': [null, Validators.required],
      'attributeId': [null, Validators.required],
      'options': [[]]
    })
  }

  addAttribute() {
   const attributeForm = this.getAttributeForm();
   this.attributes.push(attributeForm);
  }

  getAttributes() {
    this.commonService.presentSpinner();
    this.attributeService.getNewAttributeList(10000,1,true).subscribe(
      res => {
        this.commonService.dismissSpinner();
        this.attributesList = res?.body?.items;
        this.attributesListIds = (res?.body?.items || []).map(item => item.id)
        this.getVarients();
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      });
  }

  public getAttributeById(attribute, i) {
    const attributes = this.addVarientForm.controls.attributes;
    attributes['controls'][i].controls.options.patchValue(this.attributesList.filter(atr => atr.id == attribute)[0].options);
  }

  public attributeChange(attr, i) {
    const value = attr.target.value;
    const featureId = value.split(': ')[1];
    this.disableDuplicateAttributes();
    this.validateDuplicateAttribute();
    this.getAttributeById(featureId, i);
  }

  get attributes() : FormArray {
    return this.addVarientForm.get("attributes") as FormArray
  }

  public validateDuplicateAttribute() {
    this.duplicatedAttributes = false;
    const attributes: IAttributeInfo[] = (this.addVarientForm.get('attributes') as FormArray).value;
    attributes.reduce((acc, item) => {
        if (!acc[item.featureId])
          acc[item.featureId] = item.featureId;
        else {
          this.duplicatedAttributes = true;
        }
        return acc;
    }, {});
  }

  disableDuplicateAttributes() {
    const attributes: any = this.addVarientForm.get('attributes') as FormArray || [];
    const selectedFeaturesAttributes = attributes.value.map(item => item.featureId);
    (this.attributesList || []).forEach(att => att.disabled = false);

    (selectedFeaturesAttributes || []).forEach((item) => {
      const elementIndex = this.attributesListIds.indexOf(item);
      if(item) {
        this.attributesList[elementIndex].disabled = elementIndex >= 0 ? true : false
      }
    });
  }

  removeAttribute(index: number) {
    this.attributes.removeAt(index);
    this.disableDuplicateAttributes();
  }

  delete(id) {
    let options ={
      title: 'Are you Sure you want to delete this attribute?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res)  {

      };
    });
  }


  ngOnInit(): void {
    this.addVarientForm = this.fb.group({
      id: [null],
      varientEn: [''],
      currentPrice: ['', Validators.required],
      varientAr: [''],
      attributes: this.fb.array([])
    });
  }

  openModal() {
    this.addVarientForm.reset();
    const attributes = this.addVarientForm.controls.attributes;
    (this.attributesList || []).forEach(att => att.disabled = false);
    attributes.patchValue([]);
    this.addVarientForm.updateValueAndValidity();
    $('#add-varient').modal('show');
  }

  getVarients() {
    this.commonService.presentSpinner();
    this.CategoriesServiceV1.getPaginatedVariants(this.model_id, this.offset * this.limit, this.limit).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          res?.body?.responseData?.result?.forEach(varient => {
            varient.attributes = varient?.attributes?.map(attribute => {
              const features = this.attributesList.filter(atr => atr.id === attribute.featureId);
              if (features && features.length)  return {...attribute, options: features[0].options}
              return {...attribute, options: []}
            });
          });
          this.varients = res?.body?.responseData?.result;
          this.totalResult = res?.body?.responseData?.total || 0;
          this.entries = this.commonService.calculateEntries(
            this.varients,
            this.currentPage,
            this.limit,
            this.totalResult
          );
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.varients = [];
      }
    );
  }

  updateVarient(varient: any) {
    this.selectedVariantToUpdate = {
      position: varient?.position,
      status: varient?.status,
      createdAt: varient?.createdAt,
      deletedDate: varient?.deletedDate,
      currentPrice: varient?.currentPrice
    };

    $('#add-varient').modal('show');
    this.varientToUpdate = {...varient, attributes: []};
    this.addVarientForm.patchValue(this.varientToUpdate);
    this.addVarientForm.updateValueAndValidity();

    let control = <FormArray>this.addVarientForm.controls.attributes;
    control.clear();

    varient.attributes.forEach((x, i) => {
      const fg = this.getAttributeForm();
      const {featureId, attributeId, nameEn, nameAr, options: []} = x;
      fg.patchValue({ featureId, attributeId, nameEn, nameAr, options: []});
      fg.controls.options.patchValue(this.attributesList.filter(atr => atr.id == featureId)[0].options);
      control.push(fg);
    })

    this.addVarientForm.updateValueAndValidity();
    this.disableDuplicateAttributes();
  }

  closeModal(id: string) {
    $(`#${id}`).modal('hide');
    this.varientToUpdate = null;
    this.addVarientForm.reset();
    let attributesControls = <FormArray>this.addVarientForm.controls['attributes'];
    (this.attributesList || []).forEach(att => att.disabled = false);
    attributesControls.clear();
    this.addVarientForm.updateValueAndValidity();
  }

  action(id) {
    let options = {
      title: 'Are you Sure you want to delete this varient?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        //  console.log('Okay' , id);
        //  (click)="deleteProduct(product?._id)"
        this.deleteVarient(id);
      } else {
        //  console.log('Cancel');
      }
    });
  }
  addVarient(type: 'add' | 'edit') {
    this.commonService.presentSpinner();
    let payload = {
      ...this.selectedVariantToUpdate,
      ...this.addVarientForm.value,
      categoryId: this.category_id,
      brandId: this.brand_id,
      modelId: this.model_id
    };

    const varientEn = payload.attributes.map(attr => {
      const feature = this.attributesList.filter(ar => ar.id === attr.featureId)[0];
      const attribute = feature.options.filter(op => op.id === attr.attributeId)[0];
      return `${feature.nameEn} ${attribute.nameEn}`
    }).join(', ');


    const varientAr = payload.attributes.map(attr => {
      const feature = this.attributesList.filter(ar => ar.id === attr.featureId)[0];
      const attribute = feature.options.filter(op => op.id === attr.attributeId)[0];
      return `${feature.nameAr} ${attribute.nameAr}`
    }).join(', ');

    payload.attributes = (payload.attributes || []).map(({ options, ...rest }) => rest);

    payload = {...payload, varientEn, varientAr};

    const method = payload.id ? 'editVarient' : 'addVarient';
    this.categoriesService[method](payload)
      .subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          this.closeModal(type == 'add' ? 'add-varient' : 'edit-varient');
          this.getVarients();
        },
        (error) => {
          this.commonService.dismissSpinner();
          this.commonService.errorToast(error.error.message);
        }
      );
  }

  deleteVarient(varient_id: string) {
    this.commonService.presentSpinner();
    this.categoriesService.deleteVarient(varient_id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        this.getVarients();
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorToast(error.error.message);
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.variantToBeReordered,
      event.previousIndex,
      event.currentIndex
    );
  }

  getVariantToBeReordered() {
    this.variantToBeReordered = [];
    this.varients.forEach((variant) => {
      this.variantToBeReordered.push({ ...variant });
    });
  }

  changeOrderForVariant() {
    // TODO: need extra ticcket for that
  }

  // function to back the recent page
  // added by @naeeim 15/6/2021
  goBack() {
    this._location.back();
  }
}

export class AddVarient {
  category_id: string;
  brand_id: string;
  model_id: string;
  varient: string;
  varient_ar: string;
  attributes: [];
  current_price: Number;

  constructor(payload: {
    category_id: string;
    brand_id: string;
    model_id: string;
    varient: string;
    varient_ar: string;
    current_price: number;
    attributes: [];
  }) {
    this.category_id = payload.category_id;
    this.brand_id = payload.brand_id;
    this.model_id = payload.model_id;
    this.varient = payload.varient;
    this.varient_ar = payload.varient_ar;
    this.current_price = payload.current_price;
    this.attributes = payload.attributes || [];
  }
}
