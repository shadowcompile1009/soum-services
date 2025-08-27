import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { ConditionsService } from 'src/app/services/conditions/conditions.service';
declare var $: any;

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
})
export class ConditionsComponent implements OnInit, OnDestroy {
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  category_id: any;
  brand_id: any;
  model_id: any;
  variant_id: any;
  entries;
  limit: any = 100;
  totalResult: any;
  currentPage: number = 1;
  conditions: any;
  updateConditionForm: FormGroup;
  conditionToUpdate: any;
  conditionsToBeReordered: any[];
  condition_en: any = '';
  condition_ar: any = '';
  currency;
  currentCondition: any;
  notMatchSearch;

  constructor(
    private activateRout: ActivatedRoute,
    private conditionServ: ConditionsService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private _location: Location
  ) {
    this.activateRout.params.subscribe((res) => {
      this.category_id = res.category_id;
      this.brand_id = res.brand_id;
      this.model_id = res.model_id;
      this.variant_id = res.variant_id;
    });
    this.getConditions();
  }

  ngOnDestroy(): void {
    localStorage.setItem('conditions_page_number', null);
  }

  ngOnInit(): void {
    this.currentPage =
      JSON.parse(localStorage.getItem('conditions_page_number')) || 1;

    this.updateConditionForm = this.fb.group({
      price_nudge_max: [0, Validators.required],
      price_nudge_min: [0, Validators.required],
      price_quality_list: this.fb.array([])
    });

    this.currency = JSON.parse(localStorage.getItem('region')).currency;
  }

  selectPage(event) {
    this.currentPage = event;
    this.getConditions();
    localStorage.setItem('conditions_page_number', event);
  }

  getPriceQualityList(){
    return this.updateConditionForm.get('price_quality_list') as FormArray;
  }

  getConditions() {
    this.commonService.presentSpinner();
    this.conditionServ.getConditionsByVariantId(this.variant_id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.conditions = res.body.items;
          this.notMatchSearch =
            this.conditions && this.conditions.length < 1 ? true : false;
          this.limit = res.body.limit;
          this.totalResult = res.body.total;

          this.entries = this.commonService.calculateEntries(
            this.conditions,
            this.currentPage,
            this.limit,
            res.body.total
          );
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.conditions = [];
      }
    );
  }

  addNewCondition() {
    this.commonService.presentSpinner();
    this.conditionServ.addNewCondition(this.variant_id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        this.getConditions();
      },
      (err) => {
        this.commonService.dismissSpinner();
        this.conditions = [];
      }
    );
  }

  getConditionObject(condition) {
    return this.conditions.find((cond) => cond.condition.id === condition.id);
  }
  updateCondition(condition: any) {
    $('#edit-condition').modal('show');
    
    const newPriceQualityList = this.fb.array([]);
    this.updateConditionForm.setControl('price_quality_list', newPriceQualityList);

    const condition_object = this.getConditionObject(condition);
    this.currentCondition = condition_object
    
    const price_quality_list = condition_object.priceQualityList.slice().sort((conditionA, conditionB) => {
      const positionA = conditionA.position;
      const positionB = conditionB.position;

      if (positionA < positionB) {
        return -1;
      } else if (positionA > positionB) {
        return 1;
      } else {
        return 0;
      }
    })

    for(let i = 0;  i < price_quality_list.length; i++) {
      const priceQuality = price_quality_list[i];

      const priceQualityItem = this.fb.group({
        name: [priceQuality.name,Validators.required],
        price: [priceQuality.price, Validators.required],
        TTS: [priceQuality.TTS,Validators.required],
        position: [priceQuality.position, Validators.required]
      });

      (this.updateConditionForm.get('price_quality_list') as FormArray).push(priceQualityItem);
    }

    this.updateConditionForm.patchValue({
      price_nudge_max: condition_object.priceNudge.max,
      price_nudge_min: condition_object.priceNudge.min,
    });
  }

  updateConditionValues() {

    const data = { 
      priceNudge: {
        max: this.updateConditionForm.value.price_nudge_max,
        min: this.updateConditionForm.value.price_nudge_min,
      },
      priceQualityList:this.updateConditionForm.value.price_quality_list
    };

    this.commonService.presentSpinner();
    this.conditionServ.updateConditionsByID(this.currentCondition.id, data).subscribe(
      (res) => {
        this.currentCondition = null
        const newPriceQualityList = this.fb.array([]);
        this.updateConditionForm.setControl('price_quality_list', newPriceQualityList);
        this.commonService.dismissSpinner();
        this.closeModal('edit-condition');
        this.getConditions();
      },
      (err) => {
        this.commonService.dismissSpinner();
      }
    );
  }

  closeModal(id: string) {
    $(`#${id}`).modal('hide');
  }

  goBack() {
    this._location.back();
  }
}

export class AddCondition {
  current_price: string;
  current_price_ar: string;

  constructor(payload: { current_price: string; current_price_ar: string }) {
    this.current_price = payload.current_price;
    this.current_price_ar = payload.current_price_ar;
  }
}
