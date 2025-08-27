import { Location } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import firebase from 'firebase';
import { CommonService } from 'src/app/services/common/common.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import { HomeService } from 'src/app/services/home/home.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-product-photos',
  templateUrl: './product-photos.component.html',
  styleUrls: ['./product-photos.component.scss']
})
export class ProductPhotosComponent implements OnInit {
  photosToUpload: any[] = [];
  uriParam: any;
  numberOfPhotos: number = 0;
  mediaType: string;
  questions: any;
  showModal = false;
  takePhotoModal = false;
  showOptions = false;
  proceedDisabled = true;
  showSaveAsDraftConfirm = false;
  productId: any;
  product: any;
  showDraftImg = false;
  subscriptions: Subscription[] = [];
  brandName: string;
  deviceName: string;
  modelName: string;
  capacityName: string;

  modalService: ModalService;
  sellerService: SellerService;
  commonService: CommonService;
  homeService: HomeService;

  constructor(
    private router: Router,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private imageCompress: NgxImageCompressService,
    private injector: Injector
  ) {
    this.modalService = this.injector.get<ModalService>(ModalService);
    this.sellerService = this.injector.get<SellerService>(SellerService);
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.homeService = this.injector.get<HomeService>(HomeService);

    this.activatedRoute.params.subscribe((params) => {
      this.uriParam = params;
    });
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe((params) => {
        if (params && params.product) {
          localStorage.setItem('productIDForDraft', params.product);
          this.productId = params.product;
          this.getProductDetail();
        }
      })
    );
    this.mediaType = this.sellerService.mediaType;
    if (
      this.sellerService.saveAsDraftAction &&
      this.sellerService.uploadProductData.product_images.length > 0
    ) {
      this.showDraftImg = true;
    }
    let deviceCatID = JSON.parse(localStorage.getItem('selectedDevice'));
    let brandID = JSON.parse(localStorage.getItem('selectedBrand'));
    let modelID = JSON.parse(localStorage.getItem('selectedModel'));
    let varientID = JSON.parse(localStorage.getItem('selectedVarient'));
    this.brandName = brandID?.brand_name;
    this.deviceName = deviceCatID?.category_name;
    this.modelName = modelID?.model_name;
    this.capacityName = varientID?.varient;
  }

  checkDataBeforePageLoad() {
    if (!this.sellerService.uploadProductData.product_images.length) {
      this.goBack();
    }
  }

  ngOnInit(): void {
    this.loadSavedImage();
    this.subscriptions.push(
      this.sellerService.observableLoading.subscribe((ques) => {
        this.questions = ques;
      })
    );
  }

  goBack() {
    this.showDraftImg = false;
    const navigationExtras: NavigationExtras = {
      state: {
        backFromPhoto: true
      }
    };
    this.router.navigate(['/select-variant'], navigationExtras);

    // if (!this.sellerService.saveAsDraftAction) {
    //   console.log('back to select variant page 111111!!!!!!!!!!!!!!!!!!!!!!!!');
    //   // this._location.back();
    //   const navigationExtras: NavigationExtras = {
    //     state: {
    //       backFromPhoto: true
    //     }
    //   };
    //   this.router.navigate(['/select-variant'], navigationExtras);
    // } else {
    //   console.log('back to select variant page 222222!!!!!!!!!!!!!!!!!!!!!!!!!');
    //   this.sellerService.uploadProductData.product_images = [];
    //   this.sellerService.uploadProductData.product_images_url = [];
    //   this.sellerService.uploadProductData.varient_id = '';
    //   this.sellerService.uploadProductData.varient = '';
    //   this.sellerService.uploadProductData.varient_ar = '';
    //   this.commonService
    //     .getModels(
    //       this.sellerService.selectedDevice.category_id,
    //       this.sellerService.selectedBrand.brand_id
    //     )
    //     .subscribe(
    //       (res) => {
    //         if (res) {
    //           const variantAr = res.modelList.find(
    //             (item) =>
    //               (item.model_id || item._id) ===
    //               this.sellerService.selectedModel._id
    //           );
    //           const navigationExtras: NavigationExtras = {
    //             state: {
    //               varients: variantAr.varients,
    //               backFromPhoto: true
    //             }
    //           };
    //           this.router.navigate(['/select-variant'], navigationExtras);
    //         }
    //       },
    //       (error) => this.commonService.errorHandler(error)
    //     );
    // }
  }

  addPhoto(media: any) {
    media.click();
  }

  deletePhoto(index: number) {
    if (this.sellerService.uploadProductData.product_images) {
      switch (this.uriParam.type) {
        case 'defects':
          this.sellerService.uploadProductData.defected_images.splice(index, 1);
          break;

        case 'product':
          this.sellerService.uploadProductData.product_images.splice(index, 1);
          break;
      }
    }
    this.photosToUpload = [];
    this.loadSavedImage();
  }

  loadSavedImage() {
    this.photosToUpload = [];
    this.numberOfPhotos = 0;

    switch (this.uriParam.type) {
      case 'defects':
        for (let i = 0; i < 9; i++) {
          if (this.sellerService.uploadProductData.defected_images[i]) {
            this.photosToUpload.push(
              this.sellerService.uploadProductData.defected_images[i]
            );
            this.numberOfPhotos += 1;
          } else {
            this.photosToUpload.push('');
          }
        }
        break;

      case 'product':
        for (let i = 0; i < 9; i++) {
          if (this.sellerService.uploadProductData.product_images[i]) {
            this.photosToUpload.push(
              this.sellerService.uploadProductData.product_images[i]
            );
            this.numberOfPhotos += 1;
          } else {
            this.photosToUpload.push('');
          }
        }
        break;
    }
    this.checkImagesNumber();
  }

  proceedToSelectDevice() {
    if (!this.proceedDisabled) {
      if (this.product?.sell_status === 'Draft') {
        this.homeService.deleteProduct(this.product._id).subscribe(
          (res) => {
            this.commonService.dismissSpinner();
          },
          (error) => {
            this.commonService.errorHandler(error, true);
          }
        );
      }

      firebase.analytics().logEvent('user_uploads_item_defects_images');
      this.router.navigate(['/question-answer'], {
        state: { questions: this.questions }
      });
    }
  }

  selectImage(event) {
    let files = event.target.files;
    if (files.length) {
      this.getImage(files);
    }
  }

  getImage(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      var reader = new FileReader();
      reader.onload = (event) => {
        this.compressFile(event.target.result, files.item(i));
      };
      reader.readAsDataURL(files.item(i));
    }
  }

  async compressFile(image: any, file: File) {
    let result = await this.imageCompress.compressFile(image, -1, 50, 50);
    const imageBlob = this.dataURItoBlob(result.split(',')[1], file);
    const imageFile = new File([imageBlob], file.name, { type: file.type });
    this.storeImage(imageFile, result);
  }

  dataURItoBlob(dataURI, file: File) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: file.type });
    return blob;
  }

  storeImage(file: File, dataURI: any) {
    this.commonService.presentSpinner();
    let selectedFile = new SelectedFiles(file, dataURI);
    switch (this.uriParam.type) {
      case 'defects':
        if (this.sellerService.uploadProductData.defected_images.length) {
          if (
            !(this.sellerService.uploadProductData.defected_images.length >= 9)
          ) {
            this.sellerService.uploadProductData.defected_images.push(
              selectedFile
            );
          }
        } else {
          this.sellerService.uploadProductData.defected_images = [];
          if (
            !(this.sellerService.uploadProductData.defected_images.length >= 9)
          ) {
            this.sellerService.uploadProductData.defected_images.push(
              selectedFile
            );
          }
        }
        break;

      case 'product':
        if (this.sellerService.uploadProductData.product_images.length) {
          if (
            !(this.sellerService.uploadProductData.product_images.length >= 9)
          ) {
            this.sellerService.uploadProductData.product_images.push(
              selectedFile
            );
          }
        } else {
          this.sellerService.uploadProductData.product_images = [];
          if (
            !(this.sellerService.uploadProductData.product_images.length >= 9)
          ) {
            this.sellerService.uploadProductData.product_images.push(
              selectedFile
            );
          }
        }
        this.checkImagesNumber();
        break;
    }
    setTimeout(() => {
      if (
        (this.uriParam.type == 'defects' &&
          this.sellerService.uploadProductData.defected_images.length) ||
        (this.uriParam.type == 'product' &&
          this.sellerService.uploadProductData.product_images.length)
      ) {
        this.commonService.dismissSpinner();
        this.loadSavedImage();
      }
    }, 1000);
  }

  getPopupModal(modal) {
    switch (modal) {
      case 'cancel':
        this.showModal = true;
        this.openCancelModal();
        break;
      case 'showOptions':
        this.showOptions = true;
        this.openOptionsModal();
        break;
      case 'photoHint':
        this.takePhotoModal = true;
        this.openPhotoModal();
        break;
      case 'saveAsDraft':
        this.showSaveAsDraftConfirm = true;
        this.openSaveAsDraftModal();
        break;
    }
  }

  openCancelModal() {
    this.modalService.openCancelListing({
      value: true
    });
  }

  openOptionsModal() {
    this.modalService.openOptionModal({
      value: true
    });
  }

  openPhotoModal() {
    this.modalService.openPhotoModal({
      value: true
    });
  }

  openSaveAsDraftModal() {
    if (this.productId) {
      this.sellerService.selectedProductId = this.product._id;
    }
    this.modalService.openSaveAsDraftModal({
      value: true
    });
  }

  checkImagesNumber() {
    if (this.sellerService.uploadProductData.product_images.length >= 3) {
      this.proceedDisabled = false;
    } else {
      this.proceedDisabled = true;
    }
  }

  getCategory(categoryId: string) {
    return this.homeService.getCategory(categoryId).then(async (data) => {
      if (data) {
        data.responseData.category_id = data.responseData._id;
        return data.responseData;
      }
    });
  }

  getBrand(brandId: string) {
    return this.homeService.getBrand(brandId).then(async (data) => {
      if (data) {
        return data.responseData;
      }
    });
  }

  getModel(modelId: string) {
    return this.homeService.getModel(modelId).then(async (data) => {
      if (data) {
        return data.responseData;
      }
    });
  }

  getVariant(variantId: string) {
    return this.homeService.getVariant(variantId).then(async (data) => {
      if (data) {
        return data.responseData;
      }
    });
  }

  getProductDetail() {
    this.sellerService.uploadProductData.product_images = [];
    this.sellerService.saveAsDraftAction = true;
    this.sellerService.selectedProductId = this.productId;
    this.commonService.presentSpinner();
    this.homeService.getSpecificProduct(this.productId).then(async (res) => {
      if (res && res.responseData) {
        this.commonService.dismissSpinner();
        this.product = res.responseData.result;
        if (this.product.product_images.length > 0) {
          this.showDraftImg = true;
          this.sellerService.uploadProductData.product_images =
            this.product.product_images;
          this.sellerService.uploadProductData.product_images_url =
            this.product.product_images;
          this.loadSavedImage();
        }

        this.sellerService.uploadProductData.category_id =
          this.product.category._id;
        this.sellerService.selectedDevice = await this.getCategory(
          this.product.category._id
        );
        this.sellerService.selectedDevice.category_id =
          this.product.category._id;
        localStorage.setItem(
          'selectedDevice',
          JSON.stringify(this.sellerService.selectedDevice)
        );

        this.sellerService.uploadProductData.brand_id =
          this.product.brands._id;
        this.sellerService.selectedBrand = await this.getBrand(
          this.product.brands._id
        );
        this.sellerService.selectedBrand.brand_id = this.product.brands._id;
        localStorage.setItem(
          'selectedBrand',
          JSON.stringify(this.sellerService.selectedBrand)
        );

        this.sellerService.uploadProductData.model_id =
          this.product.models._id;
        this.sellerService.selectedModel = await this.getModel(
          this.product.models._id
        );

        this.sellerService.uploadProductData.varient_id =
        this.product.varients._id;
        this.sellerService.uploadProductData.varient = this.product.varients.variant; // This varient.varient is NOT clear.
        this.sellerService.uploadProductData.varient_ar =
          this.product.varients.varient_ar; // This varient.varient is NOT clear.
        this.sellerService.selectedVarient = await this.getVariant(
          this.product.varients._id
        );
        this.sellerService.selectedVarient.attributes = JSON.parse(this.product.variant_attributes_selections);
        localStorage.setItem('selectedVarient', JSON.stringify(this.sellerService.selectedVarient));}
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}

class SelectedFiles {
  file: any;
  base64: string;

  constructor(file: any, base64: any) {
    this.file = file;
    this.base64 = base64;
  }
}
