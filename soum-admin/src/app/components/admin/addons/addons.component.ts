import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { AddonsService } from 'src/app/services/addons/addons.service';
import { CommonService } from 'src/app/services/common/common.service';
declare var $: any;

@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.scss']
})
export class AddonsComponent implements OnInit {

  category_id: string;
  model_id: string;
  brand_id: string;
  addonsList: any[] = [];
  editAddAdonsForm: FormGroup;
  actionsType: string = "Add";
  activeAddon: string;
  image: any;
  imageName: string = '';

  constructor(
    private activateRout: ActivatedRoute,
    private addonsServ: AddonsService,
    private commonService: CommonService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private _location: Location,
    private fb: FormBuilder) {
    this.activateRout.params.subscribe((res) => {
      this.category_id = res.category_id;
      this.model_id = res.model_id;
      this.brand_id = res.brand_id;
    });
  }

  ngOnInit(): void {
    this.getAddonsByModelID();
    this.createAddEditAdonsModel();
  }

  createAddEditAdonsModel() {
    this.editAddAdonsForm = this.fb.group({
      type: ['warranty'],
      image: [null, Validators.required],
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      priceType: ['percentage'],
      taglineEn: [''],
      taglineAr: [''],
      validity: ['', [Validators.min(1)]],
      validityType: ['month'],
      descriptionEn: [''],
      descriptionAr: [''],
      modelIds: [''],
    });
  }

  getAddonsByModelID() {
    this.commonService.presentSpinner();
    this.addonsServ.getAddonsList(this.model_id).subscribe((addons) => {
      this.addonsList = addons?.body?.items || [];
      this.commonService.dismissSpinner();
    }, err => {
      this.commonService.dismissSpinner();
    })
  }


  action(addon_id: string) {
    let options = {
      title: 'Are you Sure you want to delete this Addons?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.deleteAddonById(addon_id);
      } else {
        this.commonService.errorHandler('Error in deleting Addons!')
      }
    });
  }

  deleteAddonById(addon_id: string) {
    this.commonService.presentSpinner();
    this.addonsServ.deleteAddonById(addon_id).subscribe((res) => {
      this.commonService.successToaster('Addons Deleted Successfully!')
      this.getAddonsByModelID();
    }, err => {
      this.commonService.dismissSpinner();
    })
  }

  openAddAddons() {
    this.actionsType = "Add";
    this.openModel()
  };

  openModel() {
    $('#edit-model').modal('show');
  };

  closeModal() {
    $('#edit-model').modal('hide');
    this.editAddAdonsForm.reset();
    this.createAddEditAdonsModel();
    this.imageName = '';
    this.image = '';
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.image = event.target.files[0];
      this.imageName = event.target.files[0]?.name || '';
    }
  }

  updateModel(addon: any) {
    this.actionsType = "Edit";
    this.activeAddon = addon.id;
    this.image = addon.image;
    const imageURL = addon.image?.split('/');
    this.imageName = imageURL[imageURL.length - 1];

    imageURL ? this.editAddAdonsForm.get('image')?.setValidators(null) : this.editAddAdonsForm.get('image')?.setValidators(Validators.required);
    this.editAddAdonsForm.get('image')?.updateValueAndValidity();

    this.editAddAdonsForm.patchValue({
      type: addon.type,
      price: addon.price,
      nameEn: addon.nameEn,
      nameAr: addon.nameAr,
      validity: addon.validity,
      taglineAr: addon.taglineAr,
      priceType: addon.priceType,
      taglineEn: addon.taglineEn,
      validityType: addon.validityType,
      descriptionEn: addon.descriptionEn,
      descriptionAr: addon.descriptionAr
    });

    this.openModel();
  }


  addAdons() {
    this.commonService.presentSpinner();
    const addonFormDataInfo = this.prepareAddonsFormData();
    this.addonsServ.addNewAddons(addonFormDataInfo).subscribe((res: any) => {
      this.commonService.successToaster('Addons Added Successfully!');
      this.closeModal();
      this.getAddonsByModelID();
    }, (err: any) => {
      this.commonService.dismissSpinner();
    })
  }

  editAddon() {
    const addonFormDataInfo = this.prepareAddonsFormData();
    this.commonService.presentSpinner();
    this.addonsServ.updateAddons(addonFormDataInfo, this.activeAddon).subscribe((res: any) => {
      this.commonService.successToaster('Addons Updated Successfully!');
      this.closeModal();
      this.getAddonsByModelID();
    }, (err: any) => {
      this.commonService.dismissSpinner();
    })
  }

  addEditAddon() {
    this.actionsType === "Add" ? this.addAdons() : this.editAddon();
  }

  prepareAddonsFormData() {
    const addonFormData = new FormData();
    addonFormData.append('image', this.image);
    addonFormData.append('modelIds', this.model_id);
    addonFormData.append('type', this.editAddAdonsForm.value.type);
    addonFormData.append('price', this.editAddAdonsForm.value.price);
    addonFormData.append('nameEn', this.editAddAdonsForm.value.nameEn);
    addonFormData.append('nameAr', this.editAddAdonsForm.value.nameAr);
    addonFormData.append('validity', this.editAddAdonsForm.value.validity);
    addonFormData.append('taglineAr', this.editAddAdonsForm.value.taglineAr);
    addonFormData.append('priceType', this.editAddAdonsForm.value.priceType);
    addonFormData.append('taglineEn', this.editAddAdonsForm.value.taglineEn);
    addonFormData.append('validityType', this.editAddAdonsForm.value.validityType);
    addonFormData.append('descriptionEn', this.editAddAdonsForm.value.descriptionEn);
    addonFormData.append('descriptionAr', this.editAddAdonsForm.value.descriptionAr);
    return addonFormData;
  }

  numbersOnly(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      return false;
    }
  }

  goBack() {
    this._location.back()
  }

}
