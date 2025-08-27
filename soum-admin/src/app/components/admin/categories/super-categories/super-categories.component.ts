import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';

import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CommonService } from 'src/app/services/common/common.service';

declare var $: any;

@Component({
  selector: 'app-super-categories',
  templateUrl: './super-categories.component.html',
  styleUrls: ['./super-categories.component.scss'],
})
export class SuperCategoriesComponent implements OnInit {
  categoryForm: FormGroup;
  formData: FormData = new FormData();
  image: any;
  categoryList: Array<any> = [];
  updateCategoryForm: FormGroup
  categoryToUpdate: any;
  categoriesToBeReOrdered: Array<any> = [];

  constructor(
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private categoriesService: CategoriesService,
  ) { }
  
  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      category_icon: new FormControl(''),
      category_name_en: new FormControl('',Validators.compose([Validators.required])),
      category_name_ar: new FormControl('',Validators.compose([Validators.required])),
      max_percentage: new FormControl('',Validators.compose([Validators.required])),
    });
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
    this.categoriesService.getSuperCategories().subscribe(
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
      this.image = event.target.files[0];
    }
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

  closeModal(id: string) {
    $(`#${id}`).modal('hide');
    this.image = null;
    this.updateCategoryForm.reset();
    this.categoryForm.reset();
    this.categoryToUpdate = null;
  }

  editCategory() {
    this.commonService.presentSpinner();
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

  saveCategory() {
    this.commonService.presentSpinner();
    this.formData.append('category_name_en', this.categoryForm.value.category_name_en);
    this.formData.append('category_name_ar', this.categoryForm.value.category_name_ar);
    this.formData.append('max_percentage', this.categoryForm.value.max_percentage);
    this.formData.append('category_icon', this.image);
    this.image = null;

    this.categoriesService.addCategory(this.formData).subscribe(
      res => {
        if (res) {
          this.commonService.dismissSpinner();
          this.categoryForm.reset();
          this.getCategory();
        }
      }, (error) => {
        this.commonService.errorHandler(error);
      });
  }
}

class editCategory {
  // category_id: string = "";
  category_name_en: string = "";
  category_name_ar: string = "";
  category_icon: string = "";
  max_percentage: number = 0;
}