import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { MasterQuestionService } from 'src/app/services/master-question/master-question.service';
import { ProductsService } from 'src/app/services/products/products.service';
declare var $: any;

@Component({
  selector: 'product-images.component',
  styleUrls: ['./tradein-details.component.scss'],
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
  selector: 'app-tradein-details',
  templateUrl: './tradein-details.component.html',
  styleUrls: ['./tradein-details.component.scss']
})
export class TradeinDetailsComponent implements OnInit {

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

  constructor(
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private activatedRoute: ActivatedRoute,
    private mqService: MasterQuestionService,
    private _location: Location,
    private productService: ProductsService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private dialoge: MatDialog
  ) {
    this.getProductId();

  }

  ngOnInit(): void { }

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
    // this.arr_diff(this.questionsArray, this.productListQuestions);
    this.showList();
  }
  getProductQuestions() {
    this.productService.getTradeinProductDetails(this.productId).subscribe((res) => {
      const data = res.body.responseData.answer_to_questions_migration;
      this.productListQuestions = JSON.parse(data);
    });
  }
  getProductDetail() {
    this.getProductQuestions();
    this.commonService.presentSpinner();
    this.productService.getProductDetails(this.productId).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.product = res.body.productData;
          this.imgs = this.product?.product_images;
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

  handleTradeinStatusSubmit(status: string) {
    this.commonService.presentSpinner();
    this.productService.putTradeinProductStatus(this.productId, { status }).subscribe((res) => {
      this.commonService.dismissSpinner();
      this.getProductDetail();
    }, () => {
      this.commonService.dismissSpinner();
    });
  }

}
