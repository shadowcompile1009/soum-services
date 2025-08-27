import { Location } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase';
import { empty, Subscription } from 'rxjs';
import { BidsAndItemsService } from 'src/app/services/bids-and-items/bids-and-items.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AesEncryptDescryptService } from 'src/app/services/core/crypto-js/aes-encrypt-descrypt.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { HomeService } from 'src/app/services/home/home.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import {
  AddAddress,
  AddBank,
  ProfileService
} from 'src/app/services/profile/profile.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import cities from 'src/assets/SA-cities/new-cities.json';
import { MatDialog } from '@angular/material/dialog';
import { PopupNewAddressComponent } from "src/app/shared-components/popup-new-address/popup-new-address.component";
import {REGEX} from '../../constants/regex.constants';
@Component({
  selector: 'app-pick-up-address',
  templateUrl: './pick-up-address.component.html',
  styleUrls: ['./pick-up-address.component.scss']
})
export class PickUpAddressComponent implements OnInit {
  showErrorOfAccountID = false;
  addBankForm: FormGroup;
  bankList: Array<any>;
  product;
  updateBankDetail: boolean;
  bankDetail: any;
  previousBankDetail: any;
  showModal = false;
  questions = [];
  productId;
  formBankValid: boolean = true;
  address: any = null;
  showSaveAsDraftConfirm = false;
  userDetails: any;
  previousAddress: any;
  photos: any;
  showBattery = false;
  selectedBattery;
  selectedDevice: any;
  selectedBrand: any;
  currentQuestion: any;
  currentQuestionIndex: number;
  questionsList;
  array = [];
  showButton = true;
  questionAnswerList = [];
  answersList = [];
  subscriptions: Subscription[] = [];
  regx_accountID = /^SA[0-9a-zA-Z]{22}$/i;
  empty: boolean = false;
  addressForm: FormGroup;
  showCitiesModal: boolean = false;
  copy_cities: any[] = [];
  language: any;
  searchValue: any = '';
  originalAddress: any;
  ibanContainArabic: boolean = false;

  response = [];
  tempSelectedRes = [];
  cities: {
    name_ar: string;
    name_en: string;
  }[];

  commonService: CommonService;
  storage: StorageService;
  sellerService: SellerService;
  profileService: ProfileService;
  bidService: BidsAndItemsService;
  modalService: ModalService;
  encryptService: AesEncryptDescryptService;
  homeService: HomeService;

  constructor(
    private router: Router,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private injector: Injector,
    private dialog: MatDialog
  ) {
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.storage = this.injector.get<StorageService>(StorageService);
    this.sellerService = this.injector.get<SellerService>(SellerService);
    this.profileService = this.injector.get<ProfileService>(ProfileService);
    this.bidService =
      this.injector.get<BidsAndItemsService>(BidsAndItemsService);
    this.modalService = this.injector.get<ModalService>(ModalService);
    this.encryptService = this.injector.get<AesEncryptDescryptService>(
      AesEncryptDescryptService
    );
    this.homeService = this.injector.get<HomeService>(HomeService);
    this.language = JSON.parse(JSON.parse(localStorage.getItem('defaultLang')));
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.product) {
        this.productId = params.product;
        localStorage.setItem('productIDForDraft', this.productId);
      }
    });
    this.addressForm = new FormGroup({
      street: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      district: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      city: new FormControl('', [Validators.required]),
      postal_code: new FormControl('', [
        Validators.required,
        Validators.maxLength(5),
        Validators.minLength(5)
      ]),
      address_type: new FormControl('', []),
      latitude: new FormControl('', []),
      longitude: new FormControl('', []),
      is_verified: new FormControl(true, [])
    });
    //  / this.checkDataOnPageEnter();
    this.getUserDetails();
    this.getAddressList();
    this.openSuccesbidModal();
    if (this.sellerService.uploadProductData.pick_up_address) {
      //write your code here
    }
    this.cities = cities;
    this.cities.sort((a, b) => {
      return a.name_en.localeCompare(b.name_en);
    });
    this.copy_cities = this.cities;

    this.addBankForm = new FormGroup({
      accountHolderName: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ]),
      accountId: new FormControl('', [Validators.required]),
      bankBIC: new FormControl(null, [Validators.required])
    });

    this.formBankValid = false;
    this.bidService.sendRouter(false);
    this.bankDetail =
      this.profileService.profileData &&
      this.profileService.profileData.bankDetail
        ? this.profileService.profileData.bankDetail
        : null;

    let state = this.router.getCurrentNavigation().extras.state;
    if (state && state.bankList) {
      this.bankList = state.bankList;
    } else {
      this.profileService.getProfileData().then(() => {
        this.getBanks();
      });
    }
    this.getAddressDetails();
    this.getbankDetails();
  }

  getAddressDetails() {
    if (this.address == null) {
      return;
    }
    this.addressForm.patchValue(this.address);
  }
  get accountId() {
    return this.addBankForm.get('accountId');
  }
  getBanks() {
    this.profileService.getBanks().subscribe(
      (res) => {
        if (res) {
          this.bankList = res.bankList;
        } else {
          this.bankList = [];
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
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
    this.commonService.presentSpinner();
    this.sellerService.saveAsDraftAction = true;
    this.homeService.getSpecificProduct(this.productId).then(async (res) => {
      if (res && res.responseData) {
        this.commonService.dismissSpinner();
        this.product = res.responseData.result;

        if (this.product.product_images.length > 0) {
          this.sellerService.uploadProductData.product_images =
            this.product.product_images;
          this.sellerService.uploadProductData.product_images_url =
            this.product.product_images;
        }
        this.sellerService.selectedProductId = this.product._id;
        this.sellerService.uploadProductData.category_id =this.product.category._id;
        this.sellerService.selectedDevice = await this.getCategory(this.product.category._id);
        this.sellerService.selectedDevice.category_id = this.product.category._id;
        localStorage.setItem('selectedDevice', JSON.stringify(this.sellerService.selectedDevice));
        await this.getQuestion();
        await this.getResponse();

        this.sellerService.uploadProductData.brand_id = this.product.brands._id;
        this.sellerService.selectedBrand = await this.getBrand(this.product.brands._id);
        this.sellerService.selectedBrand.brand_id = this.product.brands._id;
        localStorage.setItem('selectedBrand', JSON.stringify(this.sellerService.selectedBrand));

        this.sellerService.uploadProductData.model_id = this.product.models._id;
        this.sellerService.selectedModel = await this.getModel(this.product.models._id);

        this.sellerService.uploadProductData.varient_id = this.product.varients._id;
        this.sellerService.uploadProductData.varient = this.product.varients.varient; // This varient.varient is NOT clear.
        this.sellerService.uploadProductData.varient_ar = this.product.varients.varient_ar; // This varient.varient is NOT clear.
        this.sellerService.selectedVarient = await this.getVariant(this.product.varients._id);
        this.sellerService.selectedVarient.attributes = JSON.parse(this.product.variant_attributes_selections);
        localStorage.setItem('selectedVarient', JSON.stringify(this.sellerService.selectedVarient))
      }
    });
  }
getbankDetails(){
  if(this.bankDetail == null){
    return;
  }

  let bank = {
    accountHolderName: this.bankDetail.accountHolderName,
    accountId: this.bankDetail.accountId,
    bankBIC: this.bankDetail.bankBIC
  };

  this.addBankForm.patchValue(bank);
}
  update() {
    let bank = {
      accountHolderName: this.bankDetail.accountHolderName,
      accountId:  this.bankDetail.accountId.toUpperCase(),
      bankBIC:  this.bankDetail.bankBIC,
    };

    this.addBankForm.patchValue(bank);
    this.checkPattern();
    this.updateBankDetail = true;
    this.previousBankDetail = { ...this.bankDetail };
    this.formBankValid = false;
    this.bankDetail = null;
  }
  getQuestion() { 
    this.subscriptions.push(
      this.sellerService.getQuestionnaires().subscribe(
        (ques) => {
          if(ques){
          this.questionsList = ques.responseData[0].questions || [];
          }
        },
        (err) => {
          this.router.navigate(['/select-devices']);
        }
      )
    );
  }

  getResponse() {
    this.subscriptions.push(
      this.sellerService.getAnswersToProduct(this.productId).subscribe(
        (data) => {
          this.response = data.responseData || [];
          if (this.response.length > 0) {
            this.sellerService.savedResponseId = this.response[0].response_id;
            this.mappingSelectedQuestion();
          }
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }

  mappingTempSelectedQuestion() {
    for (let i = 0; i < this.questionsList?.length; i++) {
      const quesType = this.questionsList[i].type;
      const questionId = this.questionsList[i]._id;
      if (quesType === 'yes-no-without-options') {
        const selectedQues = this.tempSelectedRes.find(
          (q) => q.question_id === questionId
        );
        if (!selectedQues) {
          continue;
        }
        const answerId = selectedQues.answer_ids[0]?.answer_id;
        if (!answerId) {
          continue;
        }
        this.questionsList[i].answers.map((a) => {
          if (a._id === answerId) {
            a.selected = true;
          }
          return a;
        });
        const newobj = {
          question_id: questionId,
          answer_ids: [
            {
              answer_id: answerId
            }
          ]
        };

        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id !== questionId
        );
        this.answersList.push(newobj);
      }
      if (quesType === 'yes-no-with-options') {
        const selectedQues = this.tempSelectedRes.find(
          (q) => q.question_id === questionId
        );
        if (!selectedQues) {
          continue;
        }
        const answerId = selectedQues.answer_ids[0]?.answer_id;
        if (!answerId) {
          continue;
        }
        let indexAnswer = 0;
        this.questionsList[i].answers.map((a, index) => {
          if (a._id === answerId) {
            a.selected = true;
            indexAnswer = index;
          }
          return a;
        });
        const updateSubChoices = [];
        const subChoices = selectedQues.answer_ids[0].sub_choices || [];
        for (const subChoiceId of subChoices) {
          if (subChoiceId) {
            this.questionsList[i].answers[indexAnswer].sub_choices.map((c) => {
              if (c._id === subChoiceId) {
                c.selected = true;
              }
              return c;
            });
            updateSubChoices.push(subChoiceId);
          }
        }
        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id !== questionId
        );
        const newobj = {
          question_id: questionId,
          answer_ids: [
            {
              answer_id: answerId,
              sub_choices: updateSubChoices
            }
          ]
        };
        this.answersList.push(newobj);
      }
      if (quesType === 'dropdown') {
        const selectedQues = this.tempSelectedRes.find(
          (q) => q.question_id === questionId
        );
        if (!selectedQues) {
          continue;
        }
        const choiceId = selectedQues.choices[0];
        if (!choiceId) {
          continue;
        }
        this.questionsList[i].choices.map((c) => {
          if (c._id === choiceId) {
            c.selected = true;
            this.selectedBattery = c;
          }
          return c;
        });
        const newobj = {
          question_id: questionId,
          choices: [choiceId]
        };
        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id !== questionId
        );
        this.answersList.push(newobj);
      }
    }
  }

  mappingSelectedQuestion() {
    for (let i = 0; i < this.questionsList?.length; i++) {
      const quesType = this.questionsList[i].type;
      const questionId = this.questionsList[i]._id;
      if (quesType === 'yes-no-without-options') {
        const selectedQues = this.response.find(
          (q) => q.question_id === questionId
        );
        if (!selectedQues) {
          continue;
        }
        const answerId = selectedQues.answers[0]?.answer_id;
        if (!answerId) {
          continue;
        }
        this.questionsList[i].answers.map((a) => {
          if (a._id === answerId) {
            a.selected = true;
          }
          return a;
        });
        const newobj = {
          question_id: questionId,
          answer_ids: [
            {
              answer_id: answerId
            }
          ]
        };

        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id !== questionId
        );
        this.answersList.push(newobj);
      }
      if (quesType === 'yes-no-with-options') {
        const selectedQues = this.response.find(
          (q) => q.question_id === questionId
        );
        if (!selectedQues) {
          continue;
        }
        const answerId = selectedQues.answers[0]?.answer_id;
        if (!answerId) {
          continue;
        }
        let indexAnswer = 0;
        this.questionsList[i].answers.map((a, index) => {
          if (a._id === answerId) {
            a.selected = true;
            indexAnswer = index;
          }
          return a;
        });
        const updateSubChoices = [];
        const subChoices = selectedQues.answers[0].sub_choices || [];
        for (const choice of subChoices) {
          const subChoiceId = choice?.choice_id;
          if (subChoiceId) {
            this.questionsList[i].answers[indexAnswer].sub_choices.map((c) => {
              if (c._id === subChoiceId) {
                c.selected = true;
              }
              return c;
            });
            updateSubChoices.push(subChoiceId);
          }
        }
        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id !== questionId
        );
        const newobj = {
          question_id: questionId,
          answer_ids: [
            {
              answer_id: answerId,
              sub_choices: updateSubChoices
            }
          ]
        };
        this.answersList.push(newobj);
      }
      if (quesType === 'dropdown') {
        const selectedQues = this.response.find(
          (q) => q.question_id === questionId
        );
        if (!selectedQues) {
          continue;
        }
        const choiceId = selectedQues.choices[0]?.choice_id;
        if (!choiceId) {
          continue;
        }
        this.questionsList[i].choices.map((c) => {
          if (c._id === choiceId) {
            c.selected = true;
            this.selectedBattery = c;
          }
          return c;
        });
        const newobj = {
          question_id: questionId,
          choices: [choiceId]
        };
        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id !== questionId
        );
        this.answersList.push(newobj);
      }
    }
    this.sellerService.tempSelectedResList = this.answersList;
  }
  storeImage(file: File, dataURI: any) {
    this.commonService.presentSpinner();
    const selectedFile = new SelectedFiles(file, dataURI);
    if (this.sellerService.uploadProductData.product_images.length) {
      if (!(this.sellerService.uploadProductData.product_images.length >= 9)) {
        this.sellerService.uploadProductData.product_images.push(selectedFile);
      }
    } else {
      this.sellerService.uploadProductData.product_images = [];
      if (!(this.sellerService.uploadProductData.product_images.length >= 9)) {
        this.sellerService.uploadProductData.product_images.push(selectedFile);
      }
    }
  }

  addBank() {
    let selectedBank;
    this.bankList = null;
    if(this.bankList){
    selectedBank = this.bankList.find((bank) => {
      return bank.bankCode == this.addBankForm.value.bankBIC;
    });
  }

    let payload = new AddBank({
      accountHolderName: this.addBankForm.value.accountHolderName,
      accountId:  this.addBankForm.value.accountId.toUpperCase(),
      bankBIC:  this.addBankForm.value.bankBIC,
      bankName: selectedBank ? selectedBank.bankName : "",
    });

    if (
      payload.accountHolderName == '' ||
      payload.accountId == '' ||
      payload.bankBIC == ''
    ) {
      return;
    } else {
      this.profileService.addBankAccount(payload).subscribe(
        (res) => {
          if (res) {
            firebase.analytics().logEvent('user_adds_bank');
            this.profileService.getProfileData().then((profileData) => {
              if (profileData) {
                this.updateBankDetail = false;
              }
            });
          }
        },
        (error) => {
          this.commonService.errorHandler(error);
        }
      );
    }
  }
  checkDataOnPageEnter() {
    if (
      !this.sellerService.uploadProductData.product_images.length &&
      !this.sellerService.selectedDevice &&
      !this.sellerService.selectedBrand &&
      !this.sellerService.selectedModel &&
      !this.sellerService.uploadProductData.sell_price &&
      !this.sellerService.uploadProductData.bid_price &&
      !this.sellerService.uploadProductData.description
    ) {
      this.router.navigate(['/select-devices']);
    }
  }

  ngOnInit(): void {
    this.checkUserAddressStatus();
    this.subscriptions.push(
      this.sellerService.observableLoading.subscribe((ques) => {
        this.questions = ques;
      })
    );
    if (!this.productId) {
      let checked = false;
        this.sellerService.getQuestionnaires().subscribe({
        
          next: (ques) => {
          if(ques){
            checked = true;
            this.questionsList = ques.responseData[0].questions;
            if ((this.sellerService.tempSelectedResList || []).length > 0) {
              this.tempSelectedRes = this.sellerService.tempSelectedResList;
              this.mappingTempSelectedQuestion();
            }
          }
        },
          complete: () =>{ 
          if(!checked)
          {
          this.router.navigate(['/select-devices'])}
          }
        })
     
       
      
    } else {
      this.getProductDetail();
    }
    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Pick-up-address'
    };
    window['dataLayer'].push(productGTM);
  }

  goBack() {
    this._location.back();
  }

  getUserDetails() {
    const savedData = this.storage.getSavedData();
    if (savedData && savedData[storageKeys.userDetails]) {
      this.userDetails = savedData[storageKeys.userDetails];
    }
  }
  openSuccesbidModal() {
    this.modalService.openCancelListing({
      value: true
    });
  }
  showmodal() {
    this.showModal = true;
    this.openSuccesbidModal();
  }

  checkUserAddressStatus() {
    const userHaveNewAddress = this.commonService.checkExistAddress() || false;
    if (!userHaveNewAddress) {
      setTimeout(() => {
        this.dialog.open(PopupNewAddressComponent, {
          data: { closeInSamePage: true }
        });
      }, 1000);
    }
  }

  getAddressList() {
    const userAddress = localStorage.getItem('userAddress');
    const checkNewAddress = this.commonService.checkExistAddress();

    if (!checkNewAddress) {
      this.address = null;
    } else {
      this.address = userAddress ? JSON.parse(userAddress) : null;
    }
  }

  addAddress() {
    this.router.navigate(['/profile/add-address']);
  }
  checkDisable() {
    this.checkPattern();
    if (
      this.addressForm.valid &&
      this.addBankForm.valid &&
      this.showErrorOfAccountID
    ) {
      return false;
    } else {
      return true;
    }
  }

  checkForAddress() {
    if (!this.checkDisable()) {
      if (this.addressForm.valid) {
        this.commonService.presentSpinner();
        if (this.previousAddress) {
          const userAddressv2 = JSON.parse(localStorage.getItem('userAddress'));
          this.profileService
            .updateAddressV2(
              this.userDetails.userId,
              userAddressv2._id,
              new AddAddress(this.addressForm.value)
            )
            .subscribe(
              (res) => {
                if (res) {
                  this.getAddressAfterAddOrUpdate();
                  this.commonService.dismissSpinner();
                }
              },
              (error) => {
                this.commonService.errorHandler(error);
                this.commonService.dismissSpinner();
              }
            );
        } else {
          this.profileService
            .addNewAddressV2(
              this.userDetails.userId,
              new AddAddress(this.addressForm.value)
            )
            .subscribe(
              (res) => {
                firebase.analytics().logEvent('user_adds_address');
                if (res) {
                  this.getAddressAfterAddOrUpdate();
                  this.commonService.dismissSpinner();
                }
              },
              (error) => {
                this.commonService.errorHandler(error);
                this.commonService.dismissSpinner();
              }
            );
        }
      } else {
        if (this.address) {
          this.addProduct(this.address);
        }
      }
      this.checkForBank();
    }
  }
  getAddressAfterAddOrUpdate() {
    this.commonService.presentSpinner();
    this.profileService.getNewUserAddressFormat().subscribe(address => {
      this.address = address.responseData.length>0 ? address.responseData[address.responseData.length - 1]: '';
      if(this.address) {localStorage.setItem('userAddress', JSON.stringify(this.address));}
      this.commonService.dismissSpinner();
      this.addProduct(this.address)
    }, err => {
      this.commonService.dismissSpinner();
      this.commonService.errorHandler(err);
    })
  }

  async addProduct(address?: any) {
    if (address._id == null) {
      this.commonService.presentAlert({
        header: await this.commonService.getTranslatedString(
          'alertPopUpTexts.noAddressSelected'
        ),
        message: await this.commonService.getTranslatedString(
          'alertPopUpTexts.selectAddress'
        ),
        button1: {
          text: await this.commonService.getTranslatedString(
            'alertPopUpTexts.ok'
          ),
          handler: () => {
            this.empty = true;
          }
        }
      });
      return;
    }
    this.sellerService.uploadProductData.pick_up_address = address._id;
  }

  //  add my code
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  checkPattern() {
    this.showErrorOfAccountID =  this.regx_accountID.test(
      this.addBankForm.get("accountId").value.toUpperCase()
    );

    this.ibanContainArabic = REGEX.ibanNotConatinArabicCharacters.test(this.addBankForm.value.accountId);
  }
  updateAddress() {
    const existAddress = this.commonService.checkExistAddress();
    if (!existAddress) {
      this.address = null;
      this.addressForm.reset();
      return;
    }
    this.addressForm.patchValue(this.address);
    this.previousAddress = { ...this.address };
    this.address = null;
  }

  cancel() {
    this.address = this.previousAddress;
    this.previousAddress = null;
    this.addressForm.reset();
    this.updateBankDetail = false;
    this.bankDetail = { ...this.previousBankDetail };
    this.addBankForm.reset();
    this.previousBankDetail = null;
  }
  checkForBank() {
    if (
      this.addBankForm.valid ||
      this.previousBankDetail ||
      this.bankDetail == null
    ) {
      this.addBank();
      this.addProductAfterBank();
    } else {
      this.addProductAfterBank();
    }
  }
  @ViewChild('AddProductButton', { static: true }) addProductButton: any;
  enableDisableAddProductButton(value: boolean) {
    this.addProductButton.nativeElement.disabled = value;
  }

  removeOldProduct() {
    const productId = this.sellerService.selectedProductId;
    if (productId) {
      this.homeService.deleteProduct(productId).subscribe(
        (res) => {
          this.empty = true;
        },
        (error) => {
          this.commonService.errorHandler(error, true);
        }
      );
    }
  }

  async addProductAfterBank() {
    if (this.bankDetail || this.addBankForm.valid) {
      if (
        (this.addBankForm.get('accountHolderName').value &&
          this.addBankForm.get('accountId').value &&
          this.addBankForm.get('bankBIC').value) ||
        this.bankDetail
      ) {
        this.commonService.presentSpinner();

        this.removeOldProduct();
        this.sellerService.uploadProduct().then(async (data) => {
          this.bidService.sendRouter(false);
          this.commonService.dismissSpinner();

          if (data) {
            var obj = {
              product_id: data.product_id,
              responses: this.questions
            };
            this.subscriptions.push(
              this.sellerService.postAnswersToProduct(obj).subscribe((res) => {
                localStorage.setItem('productIDCon', obj.product_id);
                    this.profileService.updateUserPrefernences({skip_pre_listing: true}).subscribe((data:any) => {
                      this.profileService.checkUserPrefernences();
                    })               
                this.router.navigateByUrl('/listing-confirmation');
              })
            );
            if (this.sellerService.savedResponseId) {
              this.subscriptions.push(
                this.sellerService
                  .deleteAnswersToProduct(this.sellerService.savedResponseId)
                  .subscribe((result) => {
                    this.empty = true;
                  })
              );
            }
            firebase.analytics().logEvent('user_sells_item');

            localStorage.removeItem('selectedBrand');
            localStorage.removeItem('selectedDevice');
            localStorage.removeItem('selectedVarient');
            localStorage.removeItem('selectedModel');
            localStorage.removeItem('productIDForDraft');

            this.sellerService.nullifyVariables();
          } else {
            //write your code here
          }
        });
      }
    } else {
      return;
    }
  }
  getPopupModal(modal) {
    switch (modal) {
      case 'saveAsDraft':
        this.showSaveAsDraftConfirm = true;
        this.openSaveAsDraftModal();
        break;
    }
  }
  openSaveAsDraftModal() {
    if (this.productId) {
      this.sellerService.sendques(this.answersList);
      this.sellerService.selectedProductId = this.product._id;
    } else {
      this.sellerService.sendques(this.sellerService.tempSelectedResList);
    }
    this.modalService.openSaveAsDraftModal({
      value: true
    });
  }

  // ----------------------------------- handling new address ----------------------------------
  removeStreetName() {
    this.addressForm.get('street').setValue('');
  }

  openCitiesModal() {
    this.showCitiesModal = true;
  }

  closeCitiesModal() {
    this.showCitiesModal = false;
  }

  selectCity(cityName) {
    this.searchValue = cityName;
    this.addressForm.get('city').setValue(cityName);
    this.showCitiesModal = false;
  }

  clearSearchFilter() {
    this.searchValue = '';
    this.addressForm.get('city').setValue(null);
    this.copy_cities = this.cities;
  }

  filterByCityName() {
    if (this.searchValue == '') {
      this.copy_cities = [];
      this.copy_cities = this.cities;
    } else {
      this.copy_cities = [];
      this.copy_cities = this.cities.filter((city) =>
        city[this.language == 'en' ? 'name_en' : 'name_ar']
          .trim()
          .toLowerCase()
          .includes(this.searchValue.trim().toLowerCase())
      );
    }
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
