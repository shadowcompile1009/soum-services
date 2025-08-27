import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from 'src/app/services/api.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CommonService } from 'src/app/services/common/common.service';
import { config } from './confi';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categoryForm: FormGroup
  categoryList: Array<any> = [];
  formData: FormData = new FormData();
  image: any;
  updateCategoryForm: FormGroup
  categoryToUpdate: any;
  options: config = { multi: false };
  categoriesToBeReOrdered: Array<any> = [];
  superCategoryId: string;

  selectedFile: File = null;

  constructor(
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private commonService: CommonService,
    private apiService: ApiService,
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private toastNotification: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private _location: Location,
  ) { }

  action(id) {
    let options = {
      title: 'Are you Sure you want to delete this category?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.deleteCategory(id);
      } else {
        //  console.log('Cancel');
      }
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.superCategoryId = params.get('superCategoryId');
    });

    this.categoryForm = this.fb.group({
      'category_icon': new FormControl(''),
      'category_name_en': new FormControl('', Validators.compose([Validators.required])),
      'category_name_ar': new FormControl('', Validators.compose([Validators.required])),
      'max_percentage': new FormControl('', Validators.compose([Validators.required]))
    })

    this.getCategory() // call this function in ngOnInit for get Category
    this.updateCategoryForm = this.fb.group({
      'category_icon': new FormControl(''),
      'category_name_en': new FormControl('', Validators.compose([Validators.required])),
      'category_name_ar': new FormControl('', Validators.compose([Validators.required])),
      'max_percentage': new FormControl('', Validators.compose([Validators.required]))
    })
  }

  //  this function in ngOnInit for get Category ** //
  getCategory() {
    this.commonService.presentSpinner();
    this.categoriesService.getCategoryBySuperCategoryId(this.superCategoryId).subscribe(
      res => {
        this.commonService.dismissSpinner();
        if (res) {
          this.categoryList = res.body.responseData
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      });
  }


  onSelectFile(event) {
    var self = this;
    this.formData = new FormData();
    if (event.target.files && event.target.files[0]) {
      // var type = event.target.files[0].type;
      // var size = event.target.files[0].size;
      this.image = event.target.files[0];

    }
  }

  resetFormData() {
    this.categoryForm.reset();
    this.formData.delete('parent_super_category_id');
    this.formData.delete('category_name_en');
    this.formData.delete('category_name_ar');
    this.formData.delete('max_percentage');
    this.formData.delete('category_icon');
  }

  saveCategory() {
    this.commonService.presentSpinner();
    if (!this.superCategoryId) return;
    this.formData.append('parent_super_category_id', this.superCategoryId);
    this.formData.append('category_name_en', this.categoryForm.value.category_name_en);
    this.formData.append('category_name_ar', this.categoryForm.value.category_name_ar);
    this.formData.append('max_percentage', this.categoryForm.value.max_percentage);
    this.formData.append('category_icon', this.image);
    this.image = null;

    this.categoriesService.addCategory(this.formData).subscribe(
      res => {
        if (res) {
          this.commonService.dismissSpinner();
          this.getCategory();
        }
        this.resetFormData();
      }, (error) => {
        this.resetFormData();
        this.commonService.errorHandler(error);
      });
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  updateCategory(category: any) {
    $('#edit-category').modal('show');
    this.categoryToUpdate = category;

    this.updateCategoryForm.patchValue({
      category_name_en: category.category_name,
      category_name_ar: category.category_name_ar,
      max_percentage: category.max_percentage || 0,
    });
  }

  closeModal(id: string) {
    $(`#${id}`).modal('hide');
    this.image = null;
    this.updateCategoryForm.reset();
    this.categoryForm.reset();
    this.categoryToUpdate = null;
  }


  editCategory() {
    this.commonService.presentSpinner();
    if(!this.superCategoryId) return;
    let payload = new editCategory();
    let payloadAsFormData = new FormData();
    Object.keys(payload).forEach(
      (key) => {
        if (key == 'category_icon') {
          if (this.image) {
            payloadAsFormData.append(key, this.image)
          }
        } else {
          payloadAsFormData.append(key, this.updateCategoryForm.value[key])
        }
      }
    );
    payloadAsFormData.append('parent_super_category_id', this.superCategoryId);
    this.categoriesService.editCategory(this.categoryToUpdate._id, payloadAsFormData).subscribe(
      (res) => {
        if (res) {
          this.commonService.dismissSpinner();
          this.categoryForm.reset();
          this.closeModal('edit-brand');
          this.getCategory();
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  deleteCategory(category_id: string) {
    this.commonService.presentSpinner();
    this.categoriesService.deleteCategory(category_id).subscribe(
      (res) => {
        if (res) {
          this.commonService.dismissSpinner();
          this.getCategory();
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    )
  }


  pre: any
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.categoriesToBeReOrdered, event.previousIndex, event.currentIndex);
    this.pre = JSON.stringify(this.categoriesToBeReOrdered, null, ' ');
  }

  getCategoriesToBeReordered() {
    this.categoriesToBeReOrdered = []
    this.categoryList.forEach(
      (category) => {
        this.categoriesToBeReOrdered.push({ ...category })
      }
    )
  }

  changeOrderForCategory() {
    let payload = {
      "category_ids": []
    }
    this.categoriesToBeReOrdered.forEach(
      (category) => {
        payload.category_ids.push(category._id);
      }
    );
    if (!payload.category_ids.length) {
      return;
    }
    this.categoriesToBeReOrdered = [];
    this.commonService.presentSpinner();
    this.categoriesService.changeOrderForCategory(payload).subscribe(
      (res) => {
        if (res) {
          this.categoriesToBeReOrdered = [];
          this.commonService.dismissSpinner();
          this.getCategory();
        }
      },
      (error) => {
        this.categoriesToBeReOrdered = [];
        this.commonService.errorHandler(error);
      }
    )
  }

  onFileSelected(event) {
    // Maximum allowed size in bytes
    const maxAllowedSize = 200 * 1024 * 1024;
    if (event.target.files[0].size > maxAllowedSize) {
      this.toastNotification.info('maximum size is 200MB', 'Size not allowed');

      return;
    }
    this.spinner.show();
    this.selectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name)
    this.categoriesService.uploadPricesFile(fd).subscribe((res) => {
      this.toastNotification.success(res.body.responseData, 'Success');
      this.spinner.hide();
      event.target.value = '';
    }, (error) => {
      this.spinner.hide();
      this.toastNotification.error(error.error.message, 'failed', {
        closeButton: true
      })

      event.target.value = '';
    })
  }


  goBack() {
    this._location.back();
  }
}

export class editCategory {
  // category_id: string = "";
  category_name_en: string = "";
  category_name_ar: string = "";
  category_icon: string = "";
  max_percentage: number = 0;
}
