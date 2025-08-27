import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';

import { CommonService } from 'src/app/services/common/common.service';
import { ConditionsService } from 'src/app/services/conditions/conditions.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';

declare var $: any;

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
})
export class ConditionComponent implements OnInit {
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  notMatchSearch;
  category_id: any;
  brand_id: any;
  entries;
  limit: any = 100;
  totalResult: any;
  currentPage: number = 1;
  model_id: any;
  varient_id: any;
  https = 'https://';
  selectedImage: File;
  conditionsList = [];
  addedImg: File;
  conditions: any;
  addConditionForm: FormGroup;
  editConditionForm: FormGroup;
  conditionToUpdate: any;
  conditionsToBeReordered: any[];
  condition_en: any = '';
  condition_ar: any = '';
  selectedCategory;
  catID;
  categoryList = [];
  colors: { labelColor: string; textColor: string }[];
  constructor(
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private activateRout: ActivatedRoute,
    private conditionService: ConditionsService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private _location: Location
  ) {
    this.activateRout.params.subscribe((res) => {
      this.category_id = res.category_id;
      this.brand_id = res.brand_id;
      this.model_id = res.model_id;
      this.varient_id = res.varient_id;
    });
    this.getCategory();

    this.colors = [
      { labelColor: '#E4ECF4', textColor: '#177AE2' },
      { labelColor: '#E5F1EC', textColor: '#24C081' },
      { labelColor: '#E6F2F2', textColor: '#31CDCD' },
      { labelColor: '#F6EFE4', textColor: '#F79E1B' },
      { labelColor: '#ECF0F1', textColor: '#313437' },
    ];
  }

  selectPage(event) {
    this.currentPage = event;
    this.getConditions();
    localStorage.setItem('condition_page_number', event);
  }
  getCategory() {
    this.commonService.presentSpinner();
    this.categoriesService.getCategory().subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.categoryList = res.body.responseData;
          this.changeCategory(this.categoryList[0]._id);
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }
  changeCategory(selectedCategory) {
    this.commonService.presentSpinner();

    this.selectedCategory = selectedCategory;
    this.catID = selectedCategory;
    localStorage.setItem('condition_page_number', '1');
    this.currentPage = 1;
    this.getConditions();
    this.commonService.dismissSpinner();
  }
  addCondition() {
    this.commonService.presentSpinner();

    const object = {
      status: 'Active',
      name: this.addConditionForm.value.condition,
      nameAr: this.addConditionForm.value.condition_ar,
      categoryId: this.selectedCategory,
      labelColor: this.addConditionForm.value.label,
      isPreset: this.addConditionForm.value.isPreset,
      textColor: this.getColorByLabel(this.addConditionForm.value.label)
        .textColor,
      scoreRange: {
        min: this.addConditionForm.value.Min,
        max: this.addConditionForm.value.Max,
      },
      banners: [
        {
          lang: 'AR',
          url: this.addConditionForm.value.addedImgBannerMPPAR,
          source: 'Listing',
        },
        {
          lang: 'EN',
          url: this.addConditionForm.value.addedImgBannerSPPEN,
          source: 'SPP',
        },
        {
          lang: 'AR',
          url: this.addConditionForm.value.addedImgBannerSPPAR,
          source: 'SPP',
        },
        {
          lang: 'EN',
          url: this.addConditionForm.value.addedImgBannerMPPEN,
          source: 'Listing',
        },
      ],
    };

    this.conditionService.postCondition(object).subscribe(() => {
      this.addConditionForm.reset({
        addedImgBannerSPPEN: '',
        addedImgBannerSPPAR: '',
        addedImgBannerMPPEN: '',
        addedImgBannerMPPAR: '',
        isPreset: false,
        Max: 0,
        Min: 0,
      });

      $('.custom_file_input').val('');

      this.getConditions();
      this.closeAddConditionModal();
      this.commonService.dismissSpinner();
    });
  }

  ngOnInit(): void {
    this.currentPage =
      JSON.parse(localStorage.getItem('condition_page_number')) || 1;

    this.addConditionForm = this.fb.group(
      {
        condition: ['', Validators.required],
        condition_ar: ['', Validators.required],
        label: ['', Validators.required],
        addedImgBannerSPPEN: ['', Validators.required],
        addedImgBannerSPPAR: ['', Validators.required],
        addedImgBannerMPPEN: ['', Validators.required],
        addedImgBannerMPPAR: ['', Validators.required],
        Min: [0, [Validators.required, Validators.min(0)]],
        Max: [0, [Validators.required, Validators.min(1)]],
        isPreset: [false],
      },
      { validator: rangeValidator }
    );

    this.editConditionForm = this.fb.group(
      {
        condition: ['', Validators.required],
        condition_ar: ['', Validators.required],
        label: ['', Validators.required],
        addedImgBannerSPPEN: ['', Validators.required],
        addedImgBannerSPPAR: ['', Validators.required],
        addedImgBannerMPPEN: ['', Validators.required],
        addedImgBannerMPPAR: ['', Validators.required],
        Min: [0, [Validators.required, Validators.min(0)]],
        Max: [0, [Validators.required, Validators.min(1)]],
        isPreset: [false],
      },
      { validator: rangeValidator }
    );
  }

  get isPresetEdit() {
    return this.editConditionForm.value.isPreset;
  }

  get isPresetAdd() {
    return this.addConditionForm.value.isPreset;
  }

  action(id) {
    let options = {
      title: 'Are you sure you want to delete this condition?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.deleteConditionById(id);
      } else {
        //  console.log('Cancel');
      }
    });
  }

  deleteConditionById(conditionId: string) {
    this.commonService.presentSpinner();
    this.conditionService.deleteConditionById(conditionId).subscribe(
      (res) => {
        this.getConditions();
        this.commonService.dismissSpinner();
      },
      (_) => {
        this.commonService.dismissSpinner();
      }
    );
  }

  getConditions() {
    this.commonService.presentSpinner();
    const newPageNumber = (this.currentPage - 1) * 100;
    this.conditionService
      .getAllConditions(this.catID, newPageNumber, this.limit)
      .subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          if (res) {
            this.conditionsList = res.body.items;
            this.notMatchSearch =
              this.conditionsList && this.conditionsList.length < 1
                ? true
                : false;
            this.limit = res.body.limit;
            this.totalResult = res.body.total;

            this.entries = this.commonService.calculateEntries(
              this.conditionsList,
              this.currentPage,
              this.limit,
              res.body.total
            );
          }
        },
        (error) => {
          this.commonService.dismissSpinner();
          this.conditionsList = [];
        }
      );
  }

  addConditionModal() {
    $('#add-condition').modal('show');
  }

  closeAddConditionModal() {
    this.closeModal('add-condition');
  }

  selectImage(files: FileList, item) {
    this.commonService.presentSpinner();

    if (files.length) {
      this.selectedImage = files.item(0);
      this.uploadImageToServer(item);
    }
  }

  selectEditImage(files: FileList, item) {
    this.commonService.presentSpinner();

    if (files.length) {
      this.selectedImage = files.item(0);
      this.uploadEditImage(item);
    }
  }

  getBanner(banners: any[], source: 'Listing' | 'SPP', lang: 'AR' | 'EN') {
    return banners.find(
      (banner) => banner.source === source && banner.lang === lang
    );
  }

  getColorByLabel(labelColor: string) {
    return this.colors.find((color) => color.labelColor === labelColor);
  }

  updateCondition(condition: any) {
    $('#edit-condition').modal('show');
    this.conditionToUpdate = condition;

    const banners = condition.banners;
    const addedImgBannerSPPEN = this.getBanner(banners, 'SPP', 'EN');
    const addedImgBannerSPPAR = this.getBanner(banners, 'SPP', 'AR');
    const addedImgBannerMPPEN = this.getBanner(banners, 'Listing', 'EN');
    const addedImgBannerMPPAR = this.getBanner(banners, 'Listing', 'AR');

    this.editConditionForm.patchValue({
      condition: condition.name,
      condition_ar: condition.nameAr,
      label: condition.labelColor,
      addedImgBannerSPPEN: addedImgBannerSPPEN.url,
      addedImgBannerSPPAR: addedImgBannerSPPAR.url,
      addedImgBannerMPPEN: addedImgBannerMPPEN.url,
      addedImgBannerMPPAR: addedImgBannerMPPAR.url,
      Min: condition.scoreRange.min,
      Max: condition.scoreRange.max,
      isPreset: condition.isPreset,
    });
  }

  saveUpdateCondition() {
    this.commonService.presentSpinner();

    const object = {
      status: 'Active',
      name: this.editConditionForm.value.condition,
      nameAr: this.editConditionForm.value.condition_ar,
      categoryId: this.selectedCategory,
      labelColor: this.editConditionForm.value.label,
      textColor: this.getColorByLabel(this.editConditionForm.value.label)
        .textColor,
      isPreset: this.editConditionForm.value.isPreset,
      scoreRange: {
        min: this.editConditionForm.value.Min,
        max: this.editConditionForm.value.Max,
      },
      banners: [
        {
          lang: 'AR',
          url: this.editConditionForm.value.addedImgBannerMPPAR,
          source: 'Listing',
        },
        {
          lang: 'EN',
          url: this.editConditionForm.value.addedImgBannerSPPEN,
          source: 'SPP',
        },
        {
          lang: 'AR',
          url: this.editConditionForm.value.addedImgBannerSPPAR,
          source: 'SPP',
        },
        {
          lang: 'EN',
          url: this.editConditionForm.value.addedImgBannerMPPEN,
          source: 'Listing',
        },
      ],
    };

    this.conditionService
      .updateConditionById(this.conditionToUpdate.id, object)
      .subscribe(() => {
        this.editConditionForm.reset({
          addedImgBannerSPPEN: '',
          addedImgBannerSPPAR: '',
          addedImgBannerMPPEN: '',
          addedImgBannerMPPAR: '',
          isPreset: false,
          Max: 0,
          Min: 0,
        });

        $('.custom_file_input').val('');
        this.conditionToUpdate = null;
        this.getConditions();
        $('#edit-condition').modal('hide');
        this.commonService.dismissSpinner();
      });
  }

  closeModal(id: string) {
    $(`#${id}`).modal('hide');
  }

  goBack() {
    this._location.back();
  }

  uploadImageToServer(item) {
    const fileExtensionArr = this.selectedImage
      ? this.selectedImage?.name?.split('.')
      : null;
    const fileExtension = fileExtensionArr[fileExtensionArr.length - 1];
    this.conditionService
      .requestUrlToUploadImage(1, fileExtension, 'conditionIcon')
      .subscribe(
        (res) => {
          if (res.status === 200) {
            const presignURL = res?.body[0];
            const imageUrl =
              presignURL?.cdn && presignURL?.path
                ? `${presignURL.cdn}/${presignURL.path}`
                : undefined;
            this.commonService.presentSpinner();
            this.conditionService
              .uploadImageToServer(presignURL.url, this.selectedImage)
              .subscribe(
                (res) => {
                  this.addConditionForm.get(item).setValue(imageUrl);
                },
                (err: any) => {
                  this.commonService.dismissSpinner();
                  this.commonService.errorHandler(err);
                }
              );
          }
        },
        (e) => {
          this.commonService.errorToast('Unable to upload banner ' + e.message);
          this.commonService.dismissSpinner();
        }
      );
  }

  uploadEditImage(item) {
    const fileExtensionArr = this.selectedImage
      ? this.selectedImage?.name?.split('.')
      : null;
    const fileExtension = fileExtensionArr[fileExtensionArr.length - 1];
    this.conditionService
      .requestUrlToUploadImage(1, fileExtension, 'conditionIcon')
      .subscribe(
        (res) => {
          if (res.status === 200) {
            const presignURL = res?.body[0];
            const imageUrl =
              presignURL?.cdn && presignURL?.path
                ? `${presignURL.cdn}/${presignURL.path}`
                : undefined;
            this.commonService.presentSpinner();
            this.conditionService
              .uploadImageToServer(presignURL.url, this.selectedImage)
              .subscribe(
                (res) => {
                  this.editConditionForm.get(item).setValue(imageUrl);
                },
                (err: any) => {
                  this.commonService.dismissSpinner();
                  this.commonService.errorHandler(err);
                }
              );
          }
        },
        (e) => {
          this.commonService.errorToast('Unable to upload banner ' + e.message);
          this.commonService.dismissSpinner();
        }
      );
  }
}

const rangeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const min = control.get('Min')?.value;
  const max = control.get('Max')?.value;

  if (min !== null && max !== null && min >= max) {
    return { rangeError: 'Min should not be greater than Max' };
  }

  return null;
};
