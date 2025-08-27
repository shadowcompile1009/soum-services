import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CommonService } from 'src/app/services/common/common.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
declare var $: any;
@Component({
  selector: 'app-variants',
  templateUrl: './variants.component.html',
  styleUrls: ['./variants.component.scss'],
})
export class VariantsComponent implements OnInit {
  category_id: any;
  currency;
  brand_id: any;
  model_id: any;
  varients: any[];
  addVarientForm: FormGroup;
  varientToUpdate: any;
  variantToBeReordered: any[];
  actionVarient_type: string = '';

  constructor(
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private activateRout: ActivatedRoute,
    private categoriesService: CategoriesService,
    private commonService: CommonService,
    private _location: Location
  ) {
    this.activateRout.params.subscribe((res) => {
      this.category_id = res.category_id;
      this.brand_id = res.brand_id; // get id from brand
      this.model_id = res.model_id;
    });
    this.getVarients();
  }

  ngOnInit(): void {
    this.addVarientForm = new FormGroup({
      category_id: new FormControl(
        this.category_id,
        Validators.compose([Validators.required])
      ),
      brand_id: new FormControl(
        this.brand_id,
        Validators.compose([Validators.required])
      ),
      model_id: new FormControl(
        this.model_id,
        Validators.compose([Validators.required])
      ),
      varient: new FormControl('', Validators.compose([Validators.required])),
      current_price: new FormControl('', Validators.compose([Validators.required])),
      varient_ar: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });
    this.currency = JSON.parse(localStorage.getItem('region')).currency;
  }

  getVarients() {
    this.commonService.presentSpinner();
    this.categoriesService.getVarients(this.model_id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.varients = res.body.responseData;
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.varients = [];
      }
    );
  }

  updateVarient(varient: any) {
    this.actionVarient_type = 'edit-varient';
    $('#variantModal').modal('show');
    this.varientToUpdate = varient;
    this.addVarientForm.patchValue(varient);
  }

  openAddModalVarien() {
    this.actionVarient_type = 'add-varient';
    $('#variantModal').modal('show');
  }

  closeModal(id: string) {
    $('#variantModal').modal('hide');
    this.varientToUpdate = null;
    this.addVarientForm.controls['varient'].reset();
    this.addVarientForm.controls['varient_ar'].reset();
      this.addVarientForm.controls['current_price'].reset();
  }

  action(id) {
    let options = {
      title: 'Are you Sure you want to delete this varient?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.deleteVarient(id);
      } else {
        //  console.log('Cancel');
      }
    });
  }
  addVarient(type: 'add' | 'edit') {
    this.commonService.presentSpinner();
    this.categoriesService
      .addVarient(
        new AddVarient(this.addVarientForm.value),
        type == 'edit' ? this.varientToUpdate._id : ''
      )
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
    let payload = {
      category_id: this.category_id,
      brand_id: this.brand_id,
      model_id: this.model_id,
      varient_ids: [],
    };
    this.variantToBeReordered.forEach((variant) => {
      payload.varient_ids.push(variant._id);
    });
    if (!payload.varient_ids.length) {
      return;
    }
    this.variantToBeReordered = [];
    this.commonService.presentSpinner();
    this.categoriesService.changeOrderForVariant(payload).subscribe(
      (res) => {
        if (res) {
          this.variantToBeReordered = [];
          this.commonService.dismissSpinner();
          this.getVarients();
        }
      },
      (error) => {
        this.variantToBeReordered = [];
        this.commonService.errorHandler(error);
      }
    );
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
  current_price: Number;

  constructor(payload: {
    category_id: string;
    brand_id: string;
    model_id: string;
    varient: string;
    varient_ar: string;
    current_price: number;
  }) {
    console.log(payload)
    this.category_id = payload.category_id;
    this.brand_id = payload.brand_id;
    this.model_id = payload.model_id;
    this.varient = payload.varient;
    this.varient_ar = payload.varient_ar;
    this.current_price = payload.current_price;
  }
}
