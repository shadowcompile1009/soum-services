import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import { HomeService } from 'src/app/services/home/home.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-question-answer',
  templateUrl: './question-answer.component.html',
  styleUrls: ['./question-answer.component.scss']
})
export class QuestionAnswerComponent implements OnInit, OnDestroy {
  photos: any;
  showBattery = false;
  selectedBattery;
  selectedDevice: any;
  selectedBrand: any;
  questions: any;
  currentQuestion: any;
  currentQuestionIndex: number;
  questionsList = [];
  array = [];
  showButton = true;
  showSaveAsDraftConfirm = false;
  brandName: string;
  deviceName: string;
  modelName: string;
  capacityName: string;
  disableQuestions = false;
  showModal = false;
  questionAnswerList = [];
  answersList = [];
  productId: any;
  product: any;
  response = [];
  tempSelectedRes = [];
  subscription: Subscription[] = [];

  homeService: HomeService;
  sellerService: SellerService;
  translate: TranslateService;
  modalService: ModalService;
  commonService: CommonService;

  constructor(
    private router: Router,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private injector: Injector
  ) {
    this.homeService = this.injector.get<HomeService>(HomeService);
    this.sellerService = this.injector.get<SellerService>(SellerService);
    this.translate = this.injector.get<TranslateService>(TranslateService);
    this.modalService = this.injector.get<ModalService>(ModalService);
    this.commonService = this.injector.get<CommonService>(CommonService);

    this.openSuccesbidModal();
    this.showBatteryModal();
    //   this.checkDataBeforePageLoad();
    // Can we combine the if's together. I would suggest to write the conditions in a method and call it inside the if condition.
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.product) {
        this.productId = params.product;
      }
    });

    let deviceCatID = JSON.parse(localStorage.getItem('selectedDevice'));
    let brandID = JSON.parse(localStorage.getItem('selectedBrand'));
    let modelID = JSON.parse(localStorage.getItem('selectedModel'));
    let varientID = JSON.parse(localStorage.getItem('selectedVarient'));
    this.brandName = brandID?.brand_name;
    this.deviceName = deviceCatID?.category_name;
    this.modelName = modelID?.model_name;
    this.capacityName = varientID?.varient;
  }

  showSetBattery() {
    this.showBattery = true;

    this.showBatteryModal();
  }

  showBatteryModal() {
    this.modalService.openSetBattery({
      value: true
    });
  }
  ngOnInit(): void {
    // check the question when list product , get success, displayed success
    if (!this.productId) {
      this.subscription.push(
        this.sellerService?.getQuestionnaires()?.subscribe(
          (ques) => {
            this.questionsList = ques.responseData[0].questions;
            if (ques && ques.responseData[0].questions.length == 0) {
              this.disableQuestions = true;
            }
            if ((this.sellerService.tempSelectedResList || []).length > 0) {
              this.tempSelectedRes = this.sellerService.tempSelectedResList;
              this.mappingTempSelectedQuestion();
            }
          },
          (err) => {
            this.router.navigate(['/select-devices']);
          }
        )
      );
    } else {
      this.getProductDetail();
    }

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Question-answer'
    };
    window['dataLayer'].push(productGTM);
  }

  checkDataBeforePageLoad() {
    if (
      !this.sellerService.uploadProductData.product_images.length &&
      !this.sellerService.selectedDevice &&
      !this.sellerService.selectedModel &&
      !this.sellerService.selectedVarient &&
      !this.sellerService.selectedBrand &&
      this.questionsList
    ) {
      this.router.navigate(['/select-devices']);
    }
  }

  goBack() {
    if (!this.sellerService.saveAsDraftAction) {
      var addedQuestion = this.currentQuestionIndex + 1;
      var questionSkipped = 'skip_question_num' + addedQuestion;
      firebase.analytics().logEvent(questionSkipped);
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex -= 1;
        this.currentQuestion = this.questions[this.currentQuestionIndex];
      } else {
        this._location.back();
        this.sellerService.answeredQuestion = [];
        this.sellerService.uploadProductData.score = 0;
      }
    } else {
      this.router.navigate(['/selected-photos', 'product']);
    }
  }
  checkonlist() {
    for (var i = 0; i < this.answersList.length; i++) {
      if (
        this.answersList[i].answer_type != undefined &&
        this.answersList[i].answer_type == 'نعم'
      ) {
        if (this.answersList[i].answer_ids[0].sub_choices == undefined) {
          this.showButton = false;
          break;
        } else if (this.answersList[i].answer_ids[0].sub_choices.length != []) {
          this.showButton = true;
        }
      }
    }
  }
  setBattery(battery, j) {
    this.selectAnswerA(battery.i, j, battery.answer);
    this.selectedBattery = battery.answer;
  }

  // function to check product status before complete listing
  checkProductStatus() {
    this.commonService.presentSpinner();
    this.subscription.push(
      this.sellerService.observableLoading.subscribe((ques) => {
        var obj = {responses: ques};
        this.subscription.push(
          this.sellerService.calculateScorePriceNudging(obj).subscribe(data => {
            this.router.navigate(['/product-price']);
          }, err => {
            if(err.status == 400 && err.error.message === "Failed to list extensively used products") {
              this.router.navigate(['/deivce-status']);
            }
          })
        )
        this.commonService.dismissSpinner();
      })
    )
  }

  navigateToaddress() {
    if (this.productId) {
      this.sellerService.selectedProductId = this.product._id;
    }
    this.checkonlist();
    if (!this.disableQuestions) {
      if (
        this.answersList.length == this.questionsList?.length &&
        this.showButton
      ) {
        this.sellerService.tempSelectedResList = this.answersList;
        this.sellerService.sendques(this.answersList);
      }
    }
    // check Product statud before complete listing
    this.checkProductStatus();
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

          choices: [this.questionsList[j].choices[index]._id]
        };

        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id != this.questionsList[j]._id
        );

        this.answersList.push(newobj);
      }
    });
  }
  showmodal() {
    this.showModal = true;
    this.openSuccesbidModal();
  }
  openSuccesbidModal() {
    this.modalService.openCancelListing({
      value: true
    });
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
          sub_choices: this.array
        }
      ]
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
              answer_id: this.questionsList[j].answers[index]._id
            }
          ]
        };

        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id != this.questionsList[j]._id
        );

        this.answersList.push(newobj);
      }
    });
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
              answer_id: this.questionsList[j].answers[index]._id
            }
          ]
        };

        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id != this.questionsList[j]._id
        );

        this.answersList.push(newobj);
      }
    });
  }

  openSaveAsDraftModal() {
    this.sellerService.sendques(this.answersList);
    if (this.productId) {
      this.sellerService.selectedProductId = this.product._id;
    }
    this.modalService.openSaveAsDraftModal({
      value: true
    });
  }

  getPopupModal(modal) {
    switch (modal) {
      case 'saveAsDraft':
        this.showSaveAsDraftConfirm = true;
        this.openSaveAsDraftModal();
        break;
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

  getQuestion() {
    this.subscription.push(
      this.sellerService.getQuestionnaires().subscribe(
        (ques) => {
          this.questionsList = ques.responseData[0].questions || [];
        },
        (err) => {
          this.router.navigate(['/select-devices']);
        }
      )
    );
  }

  getResponse() {
    this.subscription.push(
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
  }

  getProductDetail() {
    this.commonService.presentSpinner();
    this.sellerService.uploadProductData.product_images = [];
    this.sellerService.saveAsDraftAction = true;
    this.sellerService.selectedProductId = this.productId;
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
        this.sellerService.uploadProductData.category_id =
          this.product.category._id;
        this.sellerService.selectedDevice = await this.getCategory(
          this.product.category._id
        );
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

        this.sellerService.uploadProductData.varient_id =this.product.varients._id;
        this.sellerService.uploadProductData.varient = this.product.varients.varient; // This varient.varient is NOT clear.
        this.sellerService.uploadProductData.varient_ar =this.product.varients.varient_ar; // This varient.varient is NOT clear.
        this.sellerService.selectedVarient = await this.getVariant(this.product.varients._id);
        this.sellerService.selectedVarient.attributes = JSON.parse(this.product.variant_attributes_selections);
        localStorage.setItem('selectedVarient', JSON.stringify(this.sellerService.selectedVarient))
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => {
      sub&&sub.unsubscribe();
    });
  }
}
