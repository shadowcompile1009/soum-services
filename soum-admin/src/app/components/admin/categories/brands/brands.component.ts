import { Location } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from 'src/app/services/api.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
declare var $: any;
@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  addBrandForm: FormGroup;
  addAccessories: FormArray;
  showAccessories: boolean = false;
  category_id: any;
  brandList: Array<any> = [];
  formData: FormData = new FormData();
  image: any;
  brandToUpdate: any;
  updatedBrandForm: FormGroup;
  addAccessoriesForm: FormGroup;
  brandsToBeReOrdered: any;
  activeTab: string = 'brands';

  constructor(
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private activateRout: ActivatedRoute,
    private categoriesService: CategoriesService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private _location: Location
  ) { }


  ngOnInit(): void {
    this.addBrandForm = this.fb.group({
      "image": ['', Validators.compose([Validators.required])],
      "name": ['', Validators.compose([Validators.required])],
      "name_ar": ['', Validators.compose([Validators.required])]
    })
    this.activateRout.params.subscribe(res => {
      this.category_id = res.id // get id from category
    })

    this.getBrand(); // call this function in ngOnInit for get brand

    this.updatedBrandForm = new FormGroup({
      brand_icon: new FormControl(''),
      category_id: new FormControl(this.category_id, Validators.compose([Validators.required])),
      brand_name: new FormControl('', Validators.compose([Validators.required])),
      brand_name_ar: new FormControl('', Validators.compose([Validators.required]))
    });

    this.addAccessoriesForm = new FormGroup({
      accessories: new FormArray([this.createAccessory()])
    })
  }

  createAccessory() {
    return new FormGroup({
      addOnName: new FormControl('' ,Validators.compose([Validators.required])),
      addOnNameAr: new FormControl('' ,Validators.compose([Validators.required])),
      addOnPrice: new FormControl('' ,Validators.compose([Validators.required])),
      addOnIcon: new FormControl('' ,Validators.compose([Validators.required])),
      id: new FormControl('')
    })
  };

  removeAccessoriesFields(index: number) {
    let accessories = this.addAccessoriesForm.controls['accessories'] as FormArray;
    accessories.removeAt(index);
  }

  numbersOnly(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      return false;
    }
  }

  toggleAccessories(event) {
    this.showAccessories = event.target.checked;
    this.updateEnableBrandAccesories();
  }

  action(id) {
    let options ={
      title: 'Sure you want to delete this brand?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
       // console.log('Okay');
        this.deleteBrand(id);
      } else {
      //  console.log('Cancel');
      }
    });
  }

  addNewAccessories() {
    let accessories = this.addAccessoriesForm.controls['accessories'] as FormArray;
    accessories.push(this.createAccessory());
  }

  getBrand() {
    this.commonService.presentSpinner();
    this.categoriesService.getBrands(this.category_id).subscribe(
      res => {
        this.commonService.dismissSpinner();
        if (res.body.code || res.responseCode == 200) {
          this.brandList = res.body.brandList
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.brandList = error.error.brandList;
      });
  }

  onSelectFile(event) {
    this.formData = new FormData();
    if (event.target.files && event.target.files[0]) {
      this.image = event.target.files[0];
    }
  }

  onSelectAccessoriesFile(event, index) {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      const imagesArray = this.addAccessoriesForm.get('accessories') as FormArray;
      imagesArray.value[index].addOnIcon = selectedFile;
    }
  }

  updateEnableBrandAccesories() {
    const brandID = this.brandToUpdate?.brand_id;
    this.categoriesService.updateEnableBrandAccesories(brandID, { isAddOnEnabled: this.showAccessories }).subscribe(res => {
      console.log('Delete Brand Accessories Done');
    }, error => {
      console.log('error : ', error)
    })
  };

  deleteBrandAccessories(index: number) {
    let accessories = this.addAccessoriesForm.controls['accessories'] as FormArray;
    const accID = accessories.value[index].id;
    if(!accID) {
      this.removeAccessoriesFields(index);
      return
    }

    this.categoriesService.deleteBrandAccessories(accID).subscribe(res => {
      this.removeAccessoriesFields(index);
    }, error => {
      console.log('error : ', error)
    })
  };

  saveUpdateAccessories(index: number) {
    let accessories = this.addAccessoriesForm.controls['accessories'] as FormArray;
    let payload = accessories.value[index];

    let payloadAsFormData = new FormData();
    Object.keys(payload).forEach(
      (key) => {
        if (key == 'addOnIcon') {
          if (payload.addOnIcon !== '') {
            payloadAsFormData.append(key, payload.addOnIcon)
          }
        } else {
          payloadAsFormData.append(key, payload[key])
        }
      }
    );
    payloadAsFormData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    if (payload.id) {
      if(payload.addOnName === '' || payload.addOnNameAr === '' || payload.addOnPrice === '') {
        return;
      }

      this.categoriesService.updateBrandAccessories(payload.id, payloadAsFormData).subscribe(res => {
        this.updateBrand(res.responseData);
      }, err => {
        console.log('Error from update Accessories brand : ', err)
      })
    } else {
      if(payload.addOnName === '' || payload.addOnNameAr === '' || payload.addOnPrice === '' || payload.addOnIcon === '') {
        return;
      }

      const brandID = this.brandToUpdate.brand_id || this.brandToUpdate._id;
      this.categoriesService.addBrandAccessories(brandID, payloadAsFormData).subscribe(res => {
        this.updateBrand(res.responseData);
      }, err => {
        console.log('Error from save Accessoriy brand : ', err)
      })
    }
  }

  saveBrand() {
    this.commonService.presentSpinner();
    this.formData.append('category_id', this.category_id);
    this.formData.append('brand_name', this.addBrandForm.value.name);
    this.formData.append('brand_name_ar', this.addBrandForm.value.name_ar);
    this.formData.append('brand_icon', this.image);
    this.image = null;

    this.categoriesService.addBrand(this.formData).subscribe(
      res => {
        if (res.code || res.responseCode == 200) {
          this.commonService.dismissSpinner();
          this.addBrandForm.reset();
          this.commonService.successToaster(res.message);
          this.getBrand();
        }
      }, (error) => {
        this.commonService.errorToast(error.error.message);
      });
  }

  checkErrorForm(i: number, filedName: string) {
    const haveError = this.addAccessoriesForm?.controls['accessories']['controls'][i].get(filedName);
    return haveError;
  };

  updateBrand(brand: any) {
    $('#edit-brand').modal('show');
    this.brandToUpdate = brand;
    this.showAccessories = brand?.is_add_on_enabled || false;
    this.updatedBrandForm.patchValue({
      brand_name: brand.brand_name,
      brand_name_ar: brand.brand_name_ar
    });

    let accessories = this.addAccessoriesForm.controls['accessories'] as FormArray;
    accessories.clear();
    (brand.add_ons || []).forEach(item => {
      accessories.push(this.fb.group({
        addOnName: [item.addOnName,Validators.compose([Validators.required])],
        addOnNameAr: [item.addOnNameAr,Validators.compose([Validators.required])],
        addOnPrice: [item.addOnPrice,Validators.compose([Validators.required])],
        addOnIcon: ['',Validators.compose([Validators.required])],
        id: [item.id || ''],
      }));
    });

  }

  closeModal(id: string) {
    $(`#${id}`).modal('hide');
    this.image = null;
    this.updatedBrandForm.controls['brand_name'].reset();
    this.updatedBrandForm.controls['brand_icon'].reset();
    this.addBrandForm.reset();
    this.brandToUpdate = null;
    this.getBrand();
  }

  editBrand() {
    this.commonService.presentSpinner();
    let payload = new EditBrand();
    let payloadAsFormData = new FormData();
    Object.keys(payload).forEach(
      (key) => {
        if (key == 'brand_icon') {
          if (this.image) {
            payloadAsFormData.append(key, this.image)
          }
        } else {
          payloadAsFormData.append(key, this.updatedBrandForm.value[key])
        }
      }
    );
    this.categoriesService.editBrand(this.brandToUpdate.brand_id, payloadAsFormData).subscribe(
      (res) => {
        if (res.code || res.responseCode == 200) {
          this.commonService.dismissSpinner();
          this.addBrandForm.reset();
          this.closeModal('edit-brand');
          this.commonService.successToaster(res.message);
          this.getBrand();
        }
      },
      (error) => {
        this.commonService.errorToast(error.error.message);
      }
    );
  }

  deleteBrand(brand_id: string) {
    this.commonService.presentSpinner();
    this.categoriesService.deleteBrand(brand_id).subscribe(
      (res) => {
        if (res.body.code || res.body.code == 200) {
          this.commonService.dismissSpinner();
          this.commonService.successToaster(res.body.message);
          this.getBrand();
        }
      },
      (error) => {
        this.commonService.errorToast(error.error.message);
      }
    )
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.brandsToBeReOrdered, event.previousIndex, event.currentIndex);
  }

  getBrandsToBeReordered() {
    this.brandsToBeReOrdered = []
    this.brandList.forEach(
      (brand) => {
        this.brandsToBeReOrdered.push({ ...brand })
      }
    )
  }

  changeOrderForBrand() {
    let payload = {
      "category_id": this.category_id,
      "brand_ids": []
    }
    this.brandsToBeReOrdered.forEach(
      (brand) => {
        payload.brand_ids.push(brand.brand_id);
      }
    );
    if (!payload.brand_ids.length) {
      return;
    }
    this.brandsToBeReOrdered = [];
    this.commonService.presentSpinner();
    this.categoriesService.changeOrderForBrand(payload).subscribe(
      (res) => {
        if (res) {
          this.brandsToBeReOrdered = [];
          this.commonService.dismissSpinner();
          this.getBrand();
        }
      },
      (error) => {
        this.brandsToBeReOrdered = [];
        this.commonService.errorHandler(error);
      }
    )
  }


  // function to back the recent page
  // added by @naeeim 15/6/2021
  goBack() {
    this._location.back();
  }

}

export class EditBrand {
  category_id: string = "";
  brand_name: string = "";
  brand_name_ar: string = "";
  brand_icon: string = "";
}
