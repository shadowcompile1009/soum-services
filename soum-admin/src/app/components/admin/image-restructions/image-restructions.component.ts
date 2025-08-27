import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ImageRestructionsService } from 'src/app/services/image-restructions/image-restructions.service';
import { compareValuesValidator } from './validateMinMaxNumbers';

declare var $: any;

@Component({
  selector: 'app-image-restructions',
  templateUrl: './image-restructions.component.html',
  styleUrls: ['./image-restructions.component.scss'],
  animations: [
    trigger('divState', [
      state('hidden', style({
        opacity: 0,
        display: 'none'
      })),
      state('visible', style({
        opacity: 1,
        display: 'block'
      })),
      transition('hidden => visible', [
        style({ display: 'block' }),
        animate('100ms ease-in')
      ]),
      transition('visible => hidden', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ImageRestructionsComponent implements OnInit {
  @ViewChild('uploadFile') uploadFileInput: ElementRef;
  selectedCategory: string = '';
  selectedCategoyId: string = '';
  selectedEditSectionId: string = '';
  actionType: string = "Add";
  isVisible: boolean = false;
  defaultLanguage: any = 'ar';
  categoryList: any = [];
  sectionsList: any = [];
  offset: number = 0;
  limit: number = 10;
  totalResult: any = [];
  currentPage: number = 1;
  selectedImage: any;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  disableChangeTab: boolean = false;
  tabSelected: string = 'Photos';
  tabSelectedModal: string = 'Photos';
  loading: boolean = false;
  formSection: FormGroup;
  entries: any;

  constructor(private catServ: CategoriesService,
    private translate: TranslateService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private imageService: ImageRestructionsService) {
    this.createSectionForm();
    this.formSection?.get('minImageCount').valueChanges?.subscribe((res) => {
      this.formSection.updateValueAndValidity();
    });
    this.formSection?.get('maxImageCount').valueChanges?.subscribe(() => {
      this.formSection.updateValueAndValidity();
    });

  }

  ngOnInit(): void {
    this.defaultLanguage = this.translate.getDefaultLang();
    this.getCategories();
  }

  createSectionForm() {
    this.formSection = this.fb.group({
      header: [null, [Validators.required]],
      headerAr: [null, [Validators.required]],
      description: [null, [Validators.required]],
      descriptionAr: [null, [Validators.required]],
      iconURL: [null],
      isActive: [null],
      iconURLName: [null, [Validators.required]],
      minImageCount: [null, [Validators.required, Validators.min(1), Validators.minLength(1)]],
      maxImageCount: [null, [Validators.required, Validators.min(1), Validators.minLength(1)]],
    }, { validators: compareValuesValidator('minImageCount', 'maxImageCount') })
  }

  getCategories() {
    this.commonService.presentSpinner();
    this.catServ.getCategory().subscribe((res: any) => {
      this.categoryList = res.body.responseData;
      this.selectedCategoyId = this.categoryList[0]?._id;
      this.defaultLanguage = this.translate.getDefaultLang();
      this.selectedCategory = this.defaultLanguage === 'ar' ? this.categoryList[0]?.category_name_ar : this.categoryList[0]?.category_name;
      this.commonService.dismissSpinner();
      this.commonService.successToaster('Categories Fetched Successfully!!');
      this.getImageGategorySections();
    }, (err: any) => {
      this.commonService.dismissSpinner();
      this.commonService.errorHandler(err);
    })
  }

  getImageGategorySections() {
    this.commonService.presentSpinner();
    this.loading = true;
    this.tabSelected = this.selectedCategory === 'Real Estate' ? this.tabSelectedModal : '';
    this.imageService.getImageGategorySections(this.selectedCategoyId, this.limit, this.offset * 10, this.tabSelected).subscribe((res: any) => {
      this.sectionsList = res?.body?.items;
      this.limit = res.body.limit;
      this.totalResult = res.body.total;
      this.entries = this.commonService.calculateEntries(
        this.sectionsList,
        this.currentPage,
        this.limit,
        this.totalResult
      );
      this.commonService.successToaster('Sections Fetched Successfully!');
      this.commonService.dismissSpinner();
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.commonService.errorHandler(err);
      this.commonService.dismissSpinner();
    })
  }

  handleShowHideCategoriesMenu() {
    this.isVisible = !this.isVisible;
  }

  setSelectedCategory(category: any) {
    this.tabSelected = "Photos";
    this.tabSelectedModal = "Photos";
    this.currentPage = 1;
    this.offset = 0;
    this.selectedCategory = this.defaultLanguage === 'ar' ? category.category_name_ar : category.category_name;
    this.selectedCategoyId = category?._id;
    this.getImageGategorySections();
    setTimeout(() => {
      this.isVisible = false;
    }, 250);
  }

  selectImage(images: any) {
    this.selectedImage = null;
    this.formSection.get('iconURL').setValue(null);
    this.formSection.get('iconURLName').setValue(null);
    this.selectedImage = images[0] || null;
    this.formSection.get('iconURLName').setValue(this.selectedImage?.name || null);
  }

  uploadImageToServer() {
    this.loading = true;
    this.commonService.presentSpinner();
    const fileExtensionArr = this.selectedImage ? this.selectedImage?.name?.split('.') : null;
    const fileExtension = fileExtensionArr[fileExtensionArr.length - 1];
    this.formSection.get('iconURLName').setValue(this.selectedImage.name);
    this.imageService.requestUrlToUploadImage(1, fileExtension, 'imageSecIcon').subscribe((res: any) => {
      if (res.status === 200) {
        const imagePath = res?.body[0]?.path;
        this.commonService.presentSpinner();
        this.imageService.uploadImageToServer(res?.body[0]?.url, this.selectedImage).subscribe((res) => {
          this.formSection.get('iconURL').setValue(imagePath);
          this.actionType === "Add" ? this.createNewSection() : this.updateSection();
          this.loading = false;
        }, (err: any) => {
          this.loading = false;
          this.commonService.dismissSpinner();
          this.commonService.errorHandler(err);
        })
      }
    }, (err: any) => {
      this.loading = false;
      this.commonService.dismissSpinner();
      this.commonService.errorHandler(err);
    })
  }


  openModalSection() {
    this.isVisible = false;
    this.actionType = "Add";
    this.selectedImage = null;
    $('#section-modal').modal('show');
    this.disableChangeTab = false;
  }

  closeModalSection() {
    $('#section-modal').modal('hide');
    this.selectedImage = null;
    this.resetForm();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  createNewSection() {
    const requestBody = {
      categoryId: this.selectedCategoyId,
      header: this.formSection.get('header').value,
      iconURL: this.formSection.get('iconURL').value || null,
      headerAr: this.formSection.get('headerAr').value,
      description: this.formSection.get('description').value,
      descriptionAr: this.formSection.get('descriptionAr').value,
      minImageCount: Number(this.formSection.get('minImageCount').value),
      maxImageCount: Number(this.formSection.get('maxImageCount').value),
      sectionType: this.tabSelectedModal,
      sectionTypeAr: this.tabSelectedModal === "Photos"? 'الصور' : 'مخطط',
      isActive: true,
    };
    if (this.formSection.valid) {
      this.commonService.presentSpinner();
      this.loading = true;
      this.imageService.saveSectionImage(requestBody).subscribe((res: any) => {
        this.closeModalSection();
        this.commonService.successToaster('Section Created Successfully!');
        this.getImageGategorySections();
      }, (err: any) => {
        this.loading = false;
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(err);
      })
    }
  }

  changeActiveSection(section: any) {
    this.loading = true;
    this.commonService.presentSpinner();
    this.imageService.updateSectionImage(section).subscribe((res) => {
      this.commonService.successToaster('Section Updated Successfully!');
      this.closeModalSection();
      this.getImageGategorySections();
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.commonService.dismissSpinner();
      this.commonService.errorHandler(err);
    })
  }

  editSectionAction(section: any) {
    this.tabSelectedModal = this.tabSelectedModal;
    this.disableChangeTab = true;
    this.actionType = "Edit";
    this.selectedEditSectionId = section.id;
    this.formSection.patchValue({
      header: section.header,
      iconURL: section.iconURL || null,
      headerAr: section.headerAr,
      iconURLName: section.iconURL ? section.iconURL.split('/')[1] : null,
      description: section.description,
      descriptionAr: section.descriptionAr,
      minImageCount: section.minImageCount,
      maxImageCount: section.maxImageCount,
      isActive: section.isActive
    })
    $('#section-modal').modal('show');
  };

  updateSection() {
    const requestBody = {
      id: this.selectedEditSectionId,
      categoryId: this.selectedCategoyId,
      header: this.formSection.value.header,
      headerAr: this.formSection.value.headerAr,
      isActive: this.formSection.value.isActive,
      description: this.formSection.value.description,
      iconURL: this.formSection.value.iconURL || null,
      descriptionAr: this.formSection.value.descriptionAr,
      minImageCount: Number(this.formSection.value.minImageCount),
      maxImageCount: Number(this.formSection.value.maxImageCount),
      sectionType: this.tabSelectedModal,
      sectionTypeAr: this.tabSelectedModal === "Photos"? 'الصور' : 'مخطط',
    };
    this.changeActiveSection(requestBody);
  }

  addEditCategorySection() {
    this.actionType === "Add" || (this.actionType === "Edit" && this.selectedImage) ? this.uploadImageToServer() : this.updateSection();
  }

  selectPage(event) {
    this.currentPage = event;
    this.offset = event - 1;
    this.getImageGategorySections();
  }


  resetForm() {
    this.formSection.reset();
    this.formSection.updateValueAndValidity();
    this.uploadFileInput.nativeElement.value = '';
  }

  getSectionByType(sectionType: string) {
    if(this.tabSelected === sectionType) {
      return;
    }
    this.tabSelected = sectionType;
    this.tabSelectedModal = sectionType;
    this.getImageGategorySections();
  }

  setActiveSectionTab(sectionType: string) {
    this.tabSelectedModal = sectionType;
  }
}
