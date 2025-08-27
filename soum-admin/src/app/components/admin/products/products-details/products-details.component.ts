import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { MasterQuestionService } from 'src/app/services/master-question/master-question.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteListingCommentPopupComponent } from '../delete-listing-comment-popup/delete-listing-comment-popup.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pdfUrlValidator, urlValidator } from 'src/app/pipes/custom-urlValidators/urlValidators';
import { ImagesSectionComponent } from '../images-section/images-section.component';

declare var $: any;

@Component({
  selector: 'product-images.component',
  styleUrls: ['./products-details.component.scss'],
  templateUrl: './product-images-modal.html',
})
export class ProductImagesComponent {
  @Input() name;
  product: any;
  productId;
  customOptions = {
    responsiveClass: true,
    loop: false,
    autoplay: false,
    center: true,
    dots: true,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  };
  imgs;

  constructor(
    public activeModal: NgbActiveModal,
    private productService: ProductsService
  ) {
    this.getProductList();
  }
  getProductList() {
    this.productService.observableListing.subscribe((data) => {
      this.imgs = data;
    });
  }
}

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.scss'],
})
export class ProductsDetailsComponent implements OnInit {
  showEdit = false;
  allQuestionsIds;
  questionDetails;
  productId: any;
  product: any;
  currentPage: number = 1;
  limit: number = 4;
  productListQuestions = [];
  questionsList = [];
  answersList = [];
  questionsArray;
  public imgs;
  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };
  array = [];
  showListDetails = false;
  diffArray;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  linkRegaForProduct: string = '';
  selectedCategory;
  customOptions = {
    loop: false,
    autoplay: false,
    center: true,
    dots: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  };
  enableBtnEdit: boolean = false;
  showAlertMsgToRemoveBid: boolean = false;
  showInputsToUpdatePrice: boolean = false;

  showMsgExpiredProduct: boolean = false;
  showMsgAcceptedBid: boolean = false;
  showMsgActiveBid: boolean = false;
  currency;
  selectedImages: File[] = [];
  regaFormProduct: FormGroup;
  pdfFormProduct: FormGroup;
  modelTypeActionRealState: string = 'Pdf_link';
  regaLinkTypeAction: string = "Add";
  pdfLinkTypeAction: string = "Add";
  @ViewChild(ImagesSectionComponent) childComponent!: ImagesSectionComponent;

  constructor(
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private activatedRoute: ActivatedRoute,
    private mqService: MasterQuestionService,
    private _location: Location,
    private productService: ProductsService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private dialoge: MatDialog,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {
    this.getProductId();

  }

  ngOnInit(): void {
    this.currency = JSON.parse(localStorage.getItem('region')).currency;
    this.createRegaForm();
    this.createPdfForm();
  }

  createRegaForm() {
    this.regaFormProduct = this.fb.group({
      regaProductlink: ['', [Validators.required, urlValidator()]]
    })
  }

  createPdfForm() {
    this.pdfFormProduct = this.fb.group({
      guaranteesUrl: ['', [Validators.required, pdfUrlValidator()]]
    })
  }

  // Function to create a safe URL for displaying images
  getImageUrl(image: File): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(image))
  }

  onImageSelect(event) {
    const fileInput = event.target;
    this.selectedImages = Array.from(fileInput.files);
  }

  saveProductImages() {
    const formData = new FormData();
    for (const file of this.selectedImages) {
      formData.append('new_images', file);
    }

    for (const file of this.product?.product_images) {
      formData.append('listingImages', file);
    }

    this.commonService.presentSpinner();
    this.productService.updateProductImages(this.productId, formData).subscribe(res => {
      console.log('res from add new images ', res);
      this.commonService.dismissSpinner();
      this.selectedImages = [];
      this.getProductDetail();
    }, err => {
      console.log('err from  add new images ', err);
      this.selectedImages = [];
      this.commonService.dismissSpinner();
    });
  };

  getProductId() {
    this.activatedRoute.params.subscribe((params) => {
      if (params && params.id) {
        this.productId = params.id;
        this.getProductDetail();
      } else {
        this._location.back();
      }
    });
  }
  deleteBid(bidID, productID) {
    let options = {
      title: 'Are you Sure you want to delete this bid?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        //  console.log('Okay' , id);
        this.productService.deleteBid(bidID, productID).subscribe(
          (res) => {
            this.commonService.successToaster(res.body.message);
            this.getProductDetail();
          },
          (error) => {
            this.commonService.errorHandler(error);
          }
        );
      } else {
        //    console.log('Cancel');
      }
    });
  }
  action(id) {
    let options = {
      title: 'Are you Sure you want to delete this question?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        //  console.log('Okay' , id);

        this.deleteQ(id);
      } else {
        //    console.log('Cancel');
      }
    });
  }
  deleteQ(QID) {
    this.productService.deleteQ(QID._id).subscribe(
      (res) => {
        this.commonService.successToaster(res.body.message);
        this.getProductDetail();
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }
  getQuestionnaires() {
    this.mqService.getQuestionnaires(this.selectedCategory).subscribe((res) => {
      this.questionsArray = res.body.responseData[0].questions;
      this.questionsList = this.questionsArray;

      // print this.questionsList
      this.mapArrayQuestions();
    });
  }
  arr_diff(a1, a2) {
    var a = [],
      diff = [];

    for (var i = 0; i < a1.length; i++) {
      // console.log(a1[i]._id)
      a[a1[i]._id] = true;
    }

    for (var i = 0; i < a2.length; i++) {
      // console.log(a2[i].question_id)

      if (a[a2[i].question_id]) {
        // console.log(a2[i], 'bbbbb2')
        delete a[a2[i].question_id];
      } else {
        a[a2[i].question_id] = true;
      }
    }

    for (var k in a) {
      for (var l = 0; l < this.questionsArray.length; l++) {
        if (k === this.questionsArray[l]._id) {
          var obj = {
            answers: [],
            choices: [],
            order: this.questionsArray[l].order,
            question_ar: this.questionsArray[l].question_ar,
            question_en: this.questionsArray[l].question_en,
            question_id: this.questionsArray[l]._id,
            question_type: this.questionsArray[l].type,
            response_id: this.questionsArray[0].response_id,
          };
          this.productListQuestions.push(obj);
        }
      }
      diff.push(k);
    }

    return diff;
  }

  showFormQuestions(ques) {
    // console.log(ques , "questions")
    // ;
    this.productService
      .getQuestionDetails(ques.question_id)
      .subscribe((res) => {
        this.questionDetails = res.body.responseData;
      });
  }
  mapArrayQuestions() {
    this.arr_diff(this.questionsArray, this.productListQuestions);
    this.showList();
  }
  getProductQuestions() {
    this.productService.getProductQuestions(this.productId).subscribe((res) => {
      this.productListQuestions = res.body.responseData;
    });
  }

  getProductDetail() {
    this.getProductQuestions();
    this.productService.getProductDetails(this.productId).subscribe(
      (res) => {
        if (res) {
          this.product = res.body.productData;
          this.imgs = this.product?.product_images;
          this.regaFormProduct.patchValue({ regaProductlink: res?.body?.productData?.regaUrl || '' });
          this.pdfFormProduct.patchValue({guaranteesUrl: res?.body?.productData?.guaranteesUrl || '' });
          this.regaLinkTypeAction = res?.body?.productData?.regaUrl ? "Edit" : "Add";
          this.pdfLinkTypeAction = res?.body?.productData?.guaranteesUrl ? "Edit" : "Add";
          this.productService.sendListing(this.product?.product_images);
          localStorage.setItem('imgs', this.imgs);
          this.selectedCategory = this.product.categoryData._id;
          this.getQuestionnaires();
          if (this.product.answer_to_questions) {
            this.product.answer_to_questions = JSON.parse(
              this.product.answer_to_questions
            );
          }
          this.entries = this.commonService.calculateEntries(
            this.product.bidding,
            this.currentPage,
            this.limit,
            this.product.bidding.length
          );
          this.checkUpdatePriceAndBid();
          this.regaFormProduct.patchValue({regaProductlink: res?.body?.productData?.regaUrl || ''});
          this.regaLinkTypeAction = "Edit";
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  selectPage($event) {
    this.currentPage = $event;
    this.entries = this.commonService.calculateEntries(
      this.product.bidding,
      this.currentPage,
      this.limit,
      this.product.bidding.length
    );
  }

  // function to back the recent page
  // added by @naeeim 15/6/2021
  goBack() {
    this._location.back();
  }

  selectAnswerChoice(index, j, k) {
    if (
      this.questionsList[j].answers[index].sub_choices[k].selected == undefined
    ) {
      this.questionsList[j].answers[index].sub_choices[k].selected = true;
    } else if (
      this.questionsList[j].answers[index].sub_choices[k].selected != undefined
    ) {
      this.questionsList[j].answers[index].sub_choices[k].selected =
        !this.questionsList[j].answers[index].sub_choices[k].selected;
    }
    this.array = [];
    for (
      var o = 0;
      o < this.questionsList[j].answers[0].sub_choices.length;
      o++
    ) {
      if (this.questionsList[j].answers[index].sub_choices[o].selected) {
        this.array.push(
          this.questionsList[j].answers[index].sub_choices[o]._id
        );
      }
    }

    this.answersList = this.answersList.filter(
      (itemInArray) => itemInArray.question_id != this.questionsList[j]._id
    );

    var newobj = {
      question_id: this.questionsList[j]._id,
      answer_type: this.questionsList[j].answers[index].answer_ar,
      answer_ids: [
        {
          answer_id: this.questionsList[j].answers[index]._id,
          sub_choices: this.array,
        },
      ],
    };
    this.answersList.push(newobj);
  }
  selectAnswerCho(index: number, j, answer) {
    //first type yes-no-without-options
    this.questionsList[j].answers.forEach((answer: any, i: number) => {
      if (i !== index) {
        answer.selected = false;
      } else {
        answer.selected = true;
        var newobj = {
          question_id: this.questionsList[j]._id,
          answer_type: this.questionsList[j].answers[index].answer_ar,
          answer_ids: [
            {
              answer_id: this.questionsList[j].answers[index]._id,
            },
          ],
        };

        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id != this.questionsList[j]._id
        );

        this.answersList.push(newobj);
      }
    });
  }
  showList() {
    setTimeout(() => {
      this.showListDetails = true;
    }, 2000);
  }

  open() {
    const modalRef = this.modalService.open(ProductImagesComponent);
    modalRef.componentInstance.name = 'World';
  }
  selectAnswer(index: number, j, answer) {
    //first type yes-no-without-options

    this.questionsList[j].answers.forEach((answer: any, i: number) => {
      if (i !== index) {
        answer.selected = false;
      } else {
        answer.selected = true;
        var newobj = {
          question_id: this.questionsList[j]._id,
          answer_ids: [
            {
              answer_id: this.questionsList[j].answers[index]._id,
            },
          ],
        };

        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id != this.questionsList[j]._id
        );

        this.answersList.push(newobj);
      }
    });
  }
  selectAnswerA(index: number, j, answer) {
    //dropdown
    this.questionsList[j].choices.forEach((answer: any, i: number) => {
      if (i !== index) {
        answer.selected = false;
      } else {
        answer.selected = true;
        var newobj = {
          question_id: this.questionsList[j]._id,

          choices: [this.questionsList[j].choices[index]._id],
        };

        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id != this.questionsList[j]._id
        );

        this.answersList.push(newobj);
      }
    });
  }

  editQuestions() {
    this.getTheSelectedAnswers();
    this.showEdit = !this.showEdit;
  }

  addQuestiona() {
    var newList = {
      responses: this.answersList,
      product_id: this.productId,
    };
    this.productService.saveQuestionsAdding(newList).subscribe(
      (res) => {
        this.getQuestionnaires();
        this.getProductQuestions();
        this.commonService.successToaster("Questions saved Successfully!");
      },
      (err) => { }
    );
  }
  saveProduct() {

    this.showListDetails = false;

    this.arr_diff2(this.answersList, this.productListQuestions);

    if (this.answersList.length !== this.productListQuestions.length) {

      this.commonService.errorToast("Please answer all questions first!");
    }
    else {

      var newList = {
        responses: this.answersList,
        product_id: this.productId,
      };

      this.productService
        .saveQuestions(this.productListQuestions[0].response_id, newList)
        .subscribe(
          (res) => {
            this.getQuestionnaires();
            this.getProductQuestions();
            this.showList();
            this.commonService.successToaster("Questions saved Successfully!");
          },
          (err) => {
            this.addQuestiona();
            this.showList();
          }
        );
    }
  }

  openProductPage() {
    const domain = window.location.origin;
    let ProductURL = '';

    if (domain.includes('localhost')) {
      return;
    } else if (domain.includes('admin.soum.sa')) {
      ProductURL = `https://soum.sa/product-detail?redirect=false&product=${this.productId}`
    } else if (domain.includes('previews.soum.sa')) {
      const baseURL = domain.replace('admin', 'web');
      ProductURL = `${baseURL}/product-detail?redirect=false&product=${this.productId}`
    }
    window.open(ProductURL, '_blank');
  }

  getTheSelectedAnswers() {
    //this.questionsList  this for the whole list
    //productListQuestions for product
    //we need to compare this arrays to do the pre selection
    for (var i = 0; i < this.productListQuestions.length; i++) {
      for (var j = 0; j < this.questionsList.length; j++) {
        if (
          this.productListQuestions[i].question_id === this.questionsList[j]._id
        ) {
          if (this.productListQuestions[i].question_type == 'dropdown') {
            for (var z = 0; z < this.questionsList[j].choices.length; z++) {
              for (
                var t = 0;
                t < this.productListQuestions[i].choices.length;
                t++
              ) {
                if (
                  this.questionsList[j].choices[z]._id ==
                  this.productListQuestions[i].choices[t].choice_id
                ) {
                  this.questionsList[j].choices[z].selected = true;
                }
              }
            }
          }
          if (
            this.productListQuestions[i].question_type ==
            'yes-no-without-options'
          ) {
            for (var k = 0; k < this.questionsList[j].answers.length; k++) {
              for (
                var l = 0;
                l < this.productListQuestions[i].answers.length;
                l++
              ) {
                if (
                  this.questionsList[j].answers[k]._id ==
                  this.productListQuestions[i].answers[l].answer_id
                ) {
                  this.questionsList[j].answers[k].selected = true;
                }
              }
            }
          }
          if (
            this.productListQuestions[i].question_type == 'yes-no-with-options'
          ) {
            for (var d = 0; d < this.questionsList[j].answers.length; d++) {
              for (
                var f = 0;
                f < this.productListQuestions[i].answers.length;
                f++
              ) {
                if (
                  this.questionsList[j].answers[d]._id ==
                  this.productListQuestions[i].answers[f].answer_id
                ) {
                  this.questionsList[j].answers[d].selected = true;
                  if (this.questionsList[j].answers[d].answer_ar == 'نعم') {
                    for (
                      var k = 0;
                      k < this.questionsList[j].answers[d].sub_choices.length;
                      k++
                    ) {
                      for (
                        var u = 0;
                        u <
                        this.productListQuestions[i].answers[f].sub_choices
                          .length;
                        u++
                      ) {
                        if (
                          this.questionsList[j].answers[d].sub_choices[k]._id ==
                          this.productListQuestions[i].answers[f].sub_choices[u]
                            .choice_id
                        ) {
                          this.questionsList[j].answers[d].sub_choices[
                            k
                          ].selected = true;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  arr_diff2(a1, a2) {
    var obj;
    var a = [],
      diff = [];
    for (var i = 0; i < a1.length; i++) {
      a[a1[i].question_id] = true;
    }
    for (var i = 0; i < a2.length; i++) {
      if (a[a2[i].question_id]) {
        delete a[a2[i].question_id];
      } else {
        a[a2[i].question_id] = true;
      }
    }
    for (var k in a) {
      for (var l = 0; l < this.productListQuestions.length; l++) {
        if (k === this.productListQuestions[l].question_id) {
          if (this.productListQuestions[l].choices[0]) {
            obj = {
              choices: [this.productListQuestions[l].choices[0].choice_id],

              question_id: this.productListQuestions[l].question_id,
            };
          }
          if (this.productListQuestions[l].answers[0]) {
            if (this.productListQuestions[l].answers[0].sub_choices[0]) {
              obj = {
                answer_ids: this.productListQuestions[l].answers,

                question_id: this.productListQuestions[l].question_id,
              };
            } else {
              obj = {
                answer_ids: this.productListQuestions[l].answers,

                question_id: this.productListQuestions[l].question_id,
              };
            }
          }
        }
      }
      diff.push(k);

      if (obj != undefined) {
        this.answersList.push(obj);
      }
    }

    // for (var i = 0; i < diff.length; i++) {
    //   var objectobj = {
    //     answer_ids: [],
    //     choices: [],
    //     question_id: diff[i],
    //   };
    //   this.answersList.push(objectobj);
    // }
    return diff;
  }
  checkGrade(grade) {
    if (grade.includes('Like New')) {
      return 'excellent';
    }
    if (grade.includes('Lightly Used')) {
      return 'great';
    }
    if (grade.includes('Fair')) {
      return 'good';
    }
    if (grade.includes('Extensive Use')) {
      return 'extensive';
    }
  }


  // function t check edit price and bid values
  checkUpdatePriceAndBid() {
    const sell_status = this.product?.sell_status;
    if (sell_status == 'Sold') {
      this.enableBtnEdit = true;
      return;
    } else if (new Date(this.product?.expiryDate) < new Date()) {
      this.enableBtnEdit = false;
      this.showMsgExpiredProduct = true;
      return;
    }
    else if (sell_status == 'Expired') {
      this.enableBtnEdit = false;
      this.showMsgExpiredProduct = true;
      return;
    } else {
      const all_bids = this.product?.bidding;
      const all_statues = [];
      all_bids.forEach(bid => {
        all_statues.push(bid.bid_status);
      });
      if (all_statues.indexOf('accepted') >= 0) { this.enableBtnEdit = true; return; }
      if (all_statues.indexOf('open') >= 0 || all_statues.indexOf('active') >= 0) { this.enableBtnEdit = false; this.showMsgActiveBid = true; return }
    }
  }

  DeleteProductImage(index: number) {
    const formData = new FormData();
    this.product?.product_images?.splice(index, 1);

    for (const file of this.product?.product_images) {
      formData.append('listingImages', file);
    }

    this.productService.deleteProductImages(this.productId, formData).subscribe(res => {
      console.log('res from delete images ', res);
    }, err => {
      console.log('err from delete images ', err);
    });
  }

  scrollToChildDiv() {
    this.childComponent.scrollToDiv();
  }

  addImages() {
    if(this.childComponent.sectionsList.length) {
      this.scrollToChildDiv();
      return;
    }
    $('#add-image').modal('show');
  }

  openModalForAddEditRegaPdf(id: string) {
    $(id).modal('show');
  }

  closeModalForAddEditRegaPdf(id: string) {
    $(id).modal('hide');
  }


  updatePriceAndBid() {
    this.getProductDetail();
    if (this.showMsgActiveBid || this.showMsgExpiredProduct) {
      $('#change-price').modal('show');
    } else {
      this.showInputsToUpdatePrice = !this.showInputsToUpdatePrice;
      if (!this.showInputsToUpdatePrice) { this.updatePrductPrice() }
    }
  }


  updatePrductPrice() {
    this.commonService.presentSpinner()
    this.productService.updateProductPrice(this.productId,
      {
        "sell_price": Number(this.product.sell_price),
        "bid_price": Number(this.product.bid_price)
      })
      .subscribe((res) => {
        this.commonService.successToaster('Product price updated Successfully');
        this.getProductDetail();
        this.commonService.dismissSpinner();
      }, err => {
        console.log('error after update product price ', err);
        this.commonService.dismissSpinner();
      })
  }

  closeModal(id: string) {
    $(`#${id}`).modal('hide');
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  OpenDeleteListingModel() {
    let options = {
      title: 'Are you sure you want to delete this listing?',
      confirmLabel: 'Yes',
      declineLabel: 'No'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.openDeleteModelListing();
      } else {
        //  console.log('Cancel');
      }
    });
  }

  openDeleteModelListing() {
    this.dialoge.open(DeleteListingCommentPopupComponent, { data: { 'productID': this.productId, actionType: 'delete', "deleteFrom": "ProductDetails" } });
  }

  saveRegaLinkForProduct() {
    this.commonService.presentSpinner();
    if (this.regaFormProduct.valid) {
      const body = {
        productAction: 'adminRegaUrlUpdate',
        regaUrl: this.regaFormProduct.get('regaProductlink').value
      }
      this.productService.saveRegaQrRealStateProduct(this.productId, body).subscribe(res => {
        this.closeModalForAddEditRegaPdf('#add-rega-link');
        this.getProductDetail();
        this.commonService.dismissSpinner();
        this.commonService.successToaster('Rega Link Added Successfully!');
      }, err => {
        this.closeModalForAddEditRegaPdf('#add-rega-link');
        this.commonService.errorToast(err?.message);
        this.commonService.dismissSpinner();
      })
    } else {
      console.log('Form is invalid');
    }
  }

  savePdfLinkForProduct(guaranteesUrl?: string) {
    this.commonService.presentSpinner();
    if (this.pdfFormProduct.valid) {
      const body = {
        productAction: "adminGuaranteesUrlUpdate",
        guaranteesUrl: guaranteesUrl ? "" : this.pdfFormProduct.get('guaranteesUrl').value
      }
      this.productService.saveRegaQrRealStateProduct(this.productId, body).subscribe(res => {
        this.closeModalForAddEditRegaPdf('#pdf-rega-link');
        this.getProductDetail();
        this.commonService.dismissSpinner();
        this.commonService.successToaster(guaranteesUrl ? 'Guarantees PDF Link Deleted Successfully' : 'Pdf Link Added Successfully!');
      }, err => {
        this.closeModalForAddEditRegaPdf('#pdf-rega-link');
        this.commonService.errorToast(err?.message);
        this.commonService.dismissSpinner();
      })
    } else {
      console.log('Form is invalid');
    }
  }

  deletePdfLink() {
    let options = {
      title: 'Are you Sure you want to delete this Guarantees PDF Link?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.savePdfLinkForProduct("Delete");
      } else {
        //    console.log('Cancel');
      }
    });

  }
}
