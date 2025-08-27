import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DlDateTimePickerChange} from 'angular-bootstrap-datetimepicker';
import {NgxBootstrapConfirmService} from 'ngx-bootstrap-confirm';
import {CollectionsService} from 'src/app/services/collections/collections.service';
import {CommonService} from 'src/app/services/common/common.service';
import * as moment from 'moment-timezone';
import {CategoriesService} from '../../../../services/categories/categories.service';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-car-collection.component.html',
  styleUrls: ['./add-car-collection.component.scss'],
})
export class AddCollectionCarComponent implements OnInit {
  CollectionId;
  CollectionType;
  isOffer;
  isBudget;
  showCalendar = false;
  selectedDate: Date;
  today: Date = new Date();
  productList = [];
  selectedImage: File;
  editMode: boolean;
  editCollectionData;
  uploadedImageUrl: string | null = null;
  addProductForm: FormGroup;
  addCollectionForm: FormGroup;
  superCategoryId: '';
  categoryId: '';
  currency;

  constructor(
    private commonService: CommonService,
    private collectionsService: CollectionsService,
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.today.setHours(0, 0, 0, 0);
    this.CollectionId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getSuperCategory();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.CollectionType = params.type;
      this.isOffer = this.CollectionType === 'offers';
      this.isBudget = this.CollectionType === 'budget';
    });
    this.initializeForms();
    if (this.CollectionId !== 'add') {
      this.editMode = true;
      this.collectionsService
        .getCollectionById(this.CollectionId)
        .subscribe((res) => {
          this.editCollectionData = res.body.responseData;
          this.productList = [...this.editCollectionData.items];
          this.productList.forEach((element) => {
            const datePart = element.expiryDate.split('T')[0];
            element.expiryDate = new Date(datePart);
            element.active = element.status === 0 ? true : false;
          });
          if (this.isOffer) {
            this.addCollectionForm.setValue({
              name_en: this.editCollectionData.enName,
              name_ar: this.editCollectionData.arName,
              title_en: this.editCollectionData.enTitle,
              title_ar: this.editCollectionData.arTitle,
              expiry_date: new Date(this.editCollectionData.expiryDate),
              img_url: '',
              max_budget: '',
            });
          } else if (this.isBudget) {
            this.addCollectionForm.setValue({
              name_en: this.editCollectionData.enName,
              name_ar: this.editCollectionData.arName,
              title_en: '',
              title_ar: '',
              expiry_date: new Date(),
              img_url: this.editCollectionData.imgURL,
              max_budget: this.editCollectionData.maxBudget,
            });
            this.uploadedImageUrl = this.editCollectionData.imgURL;
          } else {
            this.addCollectionForm.setValue({
              name_en: this.editCollectionData.enName,
              name_ar: this.editCollectionData.arName,
              title_en: '',
              title_ar: '',
              expiry_date: new Date(),
              img_url: '',
              max_budget: '',
            });
          }
        });
    }
    this.currency = JSON.parse(localStorage.getItem('region')).currency;
  }

  initializeForms() {
    this.addCollectionForm = this.fb.group({
      name_en: [
        '',
        this.isBudget
          ? Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(25),
            Validators.pattern(/^[a-zA-Z0-9\s]+$/),
          ])
          : Validators.compose([Validators.required]),
      ],
      name_ar: [
        '',
        this.isBudget
          ? Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(25),
            Validators.pattern(/^[\u0621-\u064A0-9\s]+$/),
          ])
          : Validators.compose([Validators.required]),
      ],
      title_en: [''],
      title_ar: [''],
      expiry_date: [this.selectedDate],
      img_url: [
        '',
        this.CollectionType === 'budget'
          ? Validators.compose([Validators.required])
          : '',
      ],
      max_budget: [
        '',
        this.CollectionType === 'budget'
          ? Validators.compose([
            Validators.required,
            Validators.min(1),
            Validators.max(9999),
          ])
          : '',
      ],
    });
    this.addProductForm = this.fb.group({
      product_name: ['', Validators.compose([Validators.required])],
    });
  }

  saveCollection() {
    const items = [];
    for (const [i, iterator] of this.productList.entries()) {
      items.push({
        productId: iterator.productId,
        feedId: this.CollectionId,
        categoryId: iterator.categoryId,
        brandId: iterator.brandId,
        modelId: iterator.modelId,
        position: i,
        status: iterator.active == true ? 0 : 1,
      });
    }
    let collectionObj: any = {
      arName: this.addCollectionForm.value.name_ar,
      enName: this.addCollectionForm.value.name_en,
      items,
      feedType: this.CollectionType,
      feedCategory: 'cars',
    };
    if (this.CollectionType === 'offers') {
      collectionObj = {
        arName: this.addCollectionForm.value.name_ar,
        enName: this.addCollectionForm.value.name_en,
        enTitle: this.addCollectionForm.value.title_en,
        arTitle: this.addCollectionForm.value.title_ar,
        expiryDate: moment
          .tz(this.addCollectionForm.value.expiry_date, 'Asia/Riyadh')
          .toDate(),
        items,
        feedType: this.CollectionType,
      };
    }

    if (this.CollectionType === 'budget') {
      collectionObj = {
        arName: this.addCollectionForm.value.name_ar,
        enName: this.addCollectionForm.value.name_en,
        maxBudget: this.addCollectionForm.value.max_budget,
        imgURL: this.addCollectionForm.value.img_url,
        items,
        feedType: this.CollectionType,
        enTitle: '',
        arTitle: '',
        expiryDate: this.addCollectionForm.value.expiry_date,
      };
    }
    this.commonService.presentSpinner();
    if (this.editMode) {
      collectionObj.feedId = this.CollectionId;
      this.collectionsService.editCollection(collectionObj).subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          this.router.navigate(['/admin/collections-car'], {
            queryParams: {type: this.CollectionType},
          });
        },
        (error) => {
          this.commonService.dismissSpinner();
          this.commonService.errorToast(error.error.message);
          this.commonService.errorHandler(error);
        }
      );
    } else {
      this.collectionsService.addCollection(collectionObj).subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          this.router.navigate(['/admin/collections-car'], {
            queryParams: {type: this.CollectionType},
          });
        },
        (error) => {
          this.commonService.dismissSpinner();
          this.commonService.errorToast(error.error.message);
          this.commonService.errorHandler(error);
        }
      );
    }
  }

  // tslint:disable-next-line:typedef
  getSuperCategory() {
    this.commonService.presentSpinner();
    this.categoriesService.getSuperCategories().subscribe(
      res => {
        this.commonService.dismissSpinner();
        if (res) {
          const category = res.body.responseData.find((v) => v.category_name === 'Cars');
          if (category) {
            this.superCategoryId = category._id;
            this.getCategory();
          }

        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      });
  }

  //  this function in ngOnInit for get Category ** //
  // tslint:disable-next-line:typedef
  getCategory() {
    this.commonService.presentSpinner();
    this.categoriesService.getCategoryBySuperCategoryId(this.superCategoryId).subscribe(
      res => {
        this.commonService.dismissSpinner();
        if (res) {
          const category = res.body.responseData.find((v) => v.category_name === 'Cars');
          if (category) {
            this.categoryId  = category._id;
          }
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      });
  }


  cancelCollection() {
    this.router.navigate(['/admin/collections-car'], {
      queryParams: {type: this.CollectionType},
    });
  }

  saveProduct() {
    this.commonService.presentSpinner();
    const id = this.addProductForm.get('product_name').value;
    const listIds = id.toString().split(',');
    for (let i = 0; i < listIds.length; i++) {
      listIds[i] = listIds[i].trim();
      if (this.idExists(parseInt(listIds[i]))) {
        this.commonService.errorToast(
          'The product you’re trying to add is added before in this collection list'
        );
        this.addProductForm.reset();
        this.commonService.dismissSpinner();
        return;
      }
    }
    this.collectionsService.validateProduct({
      productIds: listIds,
      categoryId: this.categoryId,
      isCategorySpecific: true,
    }).subscribe(
      (res: any) => {
        this.addProductForm.reset();
        const validProduct = res.responseData;
        for (let i = 0; i < validProduct.length; i++) {
          validProduct[i].active = true;
          this.productList.push(validProduct[i]);
        }
        this.commonService.dismissSpinner();
        this.commonService.successToaster('Product added successfully!');
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
        this.commonService.errorToast(error.error.message);
        this.addProductForm.reset();
      }
    );
  }

  idExists(id) {
    return this.productList.some((el) => el.productId === id);
  }

  action(id) {
    const options = {
      title: 'Are you Sure you want to delete this product?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.productList = this.filterArray(this.productList, id);
      }
    });
  }

  activate(product) {
    product.active = !product.active;
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.productList, event.previousIndex, event.currentIndex);
  }

  filterArray(arr, value) {
    return arr.filter((item) => item.productId != value);
  }

  onCustomDateChange(event: DlDateTimePickerChange<Date>) {
    if (this.selectedDate != event.value) {
      // if (event.value < this.today) {
      //   // Reset to today if a past date is selected
      //   this.addCollectionForm.get('expiry_date').setValue(this.today);
      //   alert('You cannot select a past date.'); // Optional alert
      // }
      this.selectedDate = event.value;
      this.addCollectionForm.get('expiry_date').setValue(event.value);
      this.showCalendar = !this.showCalendar;
      this.cdr.detectChanges();
    }
  }

  dateFilter = (event): boolean => {
    return event.value >= this.today;
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    this.cdr.detectChanges();
  }

  selectImage(files: FileList, item) {
    this.commonService.presentSpinner();

    if (files.length) {
      this.selectedImage = files.item(0);
      this.uploadImageToServer(item);
    }
  }

  uploadImageToServer(item) {
    const fileExtensionArr = this.selectedImage
      ? this.selectedImage?.name?.split('.')
      : null;
    const fileExtension = fileExtensionArr[fileExtensionArr.length - 1];
    this.collectionsService
      .requestUrlToUploadImage(1, fileExtension, 'budgetCategory')
      .subscribe(
        (res) => {
          if (res.status === 200) {
            const presignedURL = res?.body[0];
            const imageUrl =
              presignedURL?.cdn && presignedURL?.path
                ? `${presignedURL.cdn}/${presignedURL.path}`
                : undefined;
            this.commonService.presentSpinner();
            this.collectionsService
              .uploadImageToServer(presignedURL.url, this.selectedImage)
              .subscribe(
                (res) => {
                  this.addCollectionForm.get(item).setValue(imageUrl);
                  this.uploadedImageUrl =
                    this.addCollectionForm.get(item).value;
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

  removeUploadedImage(): void {
    this.uploadedImageUrl = null;
    this.addCollectionForm.get('img_url')?.reset();
  }
}
