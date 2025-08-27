import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from 'src/app/services/api.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CommonService } from 'src/app/services/common/common.service';
import { MasterQuestionService } from 'src/app/services/master-question/master-question.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
})
export class ModelsComponent implements OnInit {
  modelForm: FormGroup;
  modelList: any;
  lastIndex: any;
  lastindexQuesion: any;
  addQuestion_data: any;
  id: any;
  formData: FormData;
  image: any;
  brand_id: any;
  editModelForm: FormGroup;
  modelToUpdate: any;
  category_id: any;
  modelQuestion: any = [];
  match_id: any;
  questions: any = {
    mcq: [],
    sellerInput: [],
  };
  modelValue: any = [];
  question_id: any;
  modelIndex: number;
  questionIndex: number;
  masterQuestions: any = [];
  model_id: string;
  modelToBeReordered: any[];
  activeTab: string = 'Edit Model';

  showCommissionArea: boolean;
  showSellerCommissionArea: boolean;

  constructor(
    private activateRout: ActivatedRoute,

    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private categoriesService: CategoriesService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private mqService: MasterQuestionService,
    private _location: Location,
    private toastNotification: ToastrService,
    private spinner: NgxSpinnerService,
  ) {
    this.activateRout.params.subscribe((res) => {
      this.model_id = res.model_id;
      this.category_id = res.category_id;
      this.brand_id = res.brand_id; // get id from brand
    });
  }

  ngOnInit(): void {
    this.modelForm = this.fb.group({
      image: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      name_ar: ['', Validators.compose([Validators.required])],
      // price: ['', Validators.compose([Validators.required])],
    });

    this.editModelForm = new FormGroup({
      model_icon: new FormControl(''),
      category_id: new FormControl('', Validators.compose([Validators.required])),
      brand_id: new FormControl('', Validators.compose([Validators.required])),
      model_name: new FormControl('', Validators.compose([Validators.required])),
      model_name_ar: new FormControl('', Validators.compose([Validators.required])),
      // current_price: new FormControl('', Validators.compose([Validators.required])),
      tradeInSettings: new FormControl(false),
      priceNudgingSettings: new FormControl(false),
      commissionToggle: new FormControl(false),
      excellentCommission: new FormControl(0),
      fairCommission: new FormControl(0),
      expensiveLBCommission: new FormControl(0),
      expensiveUBCommission: new FormControl(0),
      // seller commission variable
      sellerCommissionToggle: new FormControl(false),
      excellentSellerCommission: new FormControl(0),
      fairSellerCommission: new FormControl(0),
      expensiveLBSellerCommission: new FormControl(0),
      expensiveUBSellerCommission: new FormControl(0),
    });
    this.getModels(); // call this function in ngOnInit for get models
    this.handleCommissionSection();
  }

  handleCommissionSection() {
    this.editModelForm.get('commissionToggle').valueChanges.subscribe(val => {
      this.showCommissionArea = val;
      if(!val) {
        this.editModelForm.patchValue({
          sellerCommissionToggle: false,
        });
      }
    });
    this.editModelForm.get('sellerCommissionToggle').valueChanges.subscribe(val => {
      this.showSellerCommissionArea = val;
    });
  }

  getCommissionValues(model_id) {
    return this.categoriesService.editModelCommission(model_id);
  }

  getModels() {
    this.commonService.presentSpinner();
    this.categoriesService.getModels(this.brand_id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res.body.code || res.responseCode == 200) {
          this.modelList = res.body.modelList;
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
        this.modelList = [];
      }
    );
  }

  //    Add Question ** //
  addQuestion(data: any) {
    console.log('addQuestion_data', data.questions);
    this.addQuestion_data = data.questions;
  }

  selectData(val: any) {
    this.id = val._id;
    console.log('Val_id', this.id);
  }

  // Upload Icon **//
  onSelectFile(event: any) {
    this.formData = new FormData();
    if (event.target.files && event.target.files[0]) {
      this.image = event.target.files[0];
    }
  }

  saveModel() {
    this.commonService.presentSpinner();
    this.formData.append('model_icon', this.image);
    this.formData.append('brand_id', this.brand_id);
    this.formData.append('category_id', this.category_id);
    this.formData.append('model_name', this.modelForm.value.name);
    this.formData.append('model_name_ar', this.modelForm.value.name_ar);
    // this.formData.append('current_price', this.modelForm.value.price);

    this.categoriesService.addModel(this.formData).subscribe(
      (res) => {
        if (res.code || res.responseCode == 200) {
          console.log('res', res);
          this.commonService.dismissSpinner();
          this.modelForm.reset();
          this.commonService.successToaster(res.message);
          this.getModels();
        }
      },
      (error) => {
        this.commonService.errorToast(error.error.message);
      }
    );
  }

  deleteModel(model_id: string) {
    this.commonService.presentSpinner();
    this.categoriesService.deleteModel(model_id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res.body.code || res.body.code == 200) {
          console.log('res', res);
          this.modelForm.reset();
          // this.commonService.successToaster(res.body.message);
          this.getModels();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorToast(error.error.message);
      }
    );
  }

  updateModel(model: any) {
    this.getCommissionValues(model.model_id).subscribe(response => {
      $('#edit-model').modal('show');
      this.modelToUpdate = model;
      const commissions = response.body.responseData;

      this.editModelForm.patchValue({
        category_id: model.category_id,
        brand_id: model.brand_id,
        model_name: model.model_name,
        model_name_ar: model.model_name_ar,
        tradeInSettings: commissions?.tradeInSettings,
        priceNudgingSettings: commissions?.priceNudgingSettings,
        commissionToggle: commissions?.commissionSettings?.toggleStatus,
        excellentCommission: commissions?.commissionSettings?.excellentCommission,
        fairCommission: commissions?.commissionSettings?.fairCommission,
        expensiveLBCommission: commissions?.commissionSettings?.expensiveLBCommission,
        expensiveUBCommission: commissions?.commissionSettings?.expensiveUBCommission,
        sellerCommissionToggle: commissions?.keySellerCommissionSettings?.toggleStatus,
        excellentSellerCommission: commissions?.keySellerCommissionSettings?.excellentCommission,
        fairSellerCommission: commissions?.keySellerCommissionSettings?.fairCommission,
        expensiveLBSellerCommission: commissions?.keySellerCommissionSettings?.expensiveLBCommission,
        expensiveUBSellerCommission: commissions?.keySellerCommissionSettings?.expensiveUBCommission,
      });
    }, error => {
      $('#edit-model').modal('show');
      this.modelToUpdate = model;
      this.editModelForm.patchValue({
        category_id: model.category_id,
        brand_id: model.brand_id,
        model_name: model.model_name,
        model_name_ar: model.model_name_ar,
        tradeInSettings: false,
        priceNudgingSettings: false,
        commissionToggle: false,
        excellentCommission: 0,
        fairCommission: 0,
        expensiveLBCommission: 0,
        expensiveUBCommission: 0,
        sellerCommissionToggle: false,
        excellentSellerCommission: 0,
        fairSellerCommission: 0,
        expensiveLBSellerCommission: 0,
        expensiveUBSellerCommission: 0,
      });
    });
  }

  updateModel2(model: any) {
    $('#edit-model').modal('show');
    this.modelToUpdate = model;

    this.editModelForm.patchValue({
      model_name: model.model_name,
      model_name_ar: model.model_name_ar,
      excellentCommission: model.model_name_ar,
      fairCommission: model.model_name_ar,
      expensiveLBCommission: model.model_name_ar,
      expensiveUBCommission: model.model_name_ar,
      excellentSellerCommission: model.model_name_ar,
      fairSellerCommission: model.model_name_ar,
      expensiveLBSellerCommission: model.model_name_ar,
      expensiveUBSellerCommission: model.model_name_ar,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  }


  action(id) {
    let options = {
      title: 'Are you Sure you want to delete this model?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        //    console.log('Okay' , id);

        this.deleteModel(id);
      } else {
        // console.log('Cancel');
      }
    });
  }
  editModel() {
    let payload = new EditModel();
    let payloadAsFormData = new FormData();
    Object.keys(payload).forEach((key) => {
      if (key === 'model_icon') {
        if (this.image) {
          payloadAsFormData.append(key, this.image);
        }
      } else {
        payloadAsFormData.append(key, this.editModelForm.value[key]);
      }
    });

    this.categoriesService.editModel(this.modelToUpdate._id, payloadAsFormData).subscribe(
      (res) => {
        if (res.code || res.responseCode == 200) {
          this.commonService.dismissSpinner();
          this.closeModal('edit-model');
          this.commonService.successToaster(res.message);
          this.getModels();
        }
      },
      (error) => {
        this.commonService.errorToast(error.error.message);
      }
    );

    let payloadV2 = {
      tradeInSettings: this.editModelForm.value.tradeInSettings,
      priceNudgingSettings: this.editModelForm.value.priceNudgingSettings,
      status: this.editModelForm.value.commissionToggle,
      commissionSettings: {
        toggleStatus: this.editModelForm.value.commissionToggle,
        excellentCommission: this.editModelForm.value.excellentCommission,
        fairCommission: this.editModelForm.value.fairCommission,
        expensiveLBCommission: this.editModelForm.value.expensiveLBCommission,
        expensiveUBCommission: this.editModelForm.value.expensiveUBCommission,
      },
      keySellerCommissionSettings: {
        toggleStatus: this.editModelForm.value.sellerCommissionToggle,
        excellentCommission: this.editModelForm.value.excellentSellerCommission,
        fairCommission: this.editModelForm.value.fairSellerCommission,
        expensiveLBCommission: this.editModelForm.value.expensiveLBSellerCommission,
        expensiveUBCommission: this.editModelForm.value.expensiveUBSellerCommission,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.categoriesService.editModelV2(this.modelToUpdate._id, payloadV2).subscribe(
      (res) => {
        if (res) {
          this.commonService.dismissSpinner();
          this.closeModal('edit-model');
          this.commonService.successToaster('Data Updated Successfully');
          this.getModels();
        }
      },
      (error) => {
        this.commonService.errorToast(error.error.message);
      }
    );
  }

  closeModal(id: string) {
    $(`#${id}`).modal('hide');
    this.image = null;
    this.modelForm.reset();
    this.editModelForm.reset();
    this.modelToUpdate = null;
    this.model_id = '';
  }

  getMasterQuestions() {
    this.masterQuestions = [];
    this.mqService.getMasterQuestions(this.category_id).subscribe(
      (res) => {
        let masterQuestions = res.body.questionList;
        masterQuestions.forEach((question) => {
          question.selected = false;
          // question.weightage = "";
          question.options.forEach((option) => {
            if (option) {
              option.selected = false;
            }
          });
          this.masterQuestions.push({ ...question });
        });
        // console.log('master questions ====>>>', this.masterQuestions);
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  openLinkQuestionModal(model: any) {
    if (!this.masterQuestions.length) {
      alert('No master question for the selected model!');
      return;
    }
    this.model_id = model._id;
    this.questions = {
      mcq: [],
      sellerInput: [],
    };
    this.masterQuestions.forEach((question) => {
      let selectedQuestion = model.questions.find((modelQuestion) => {
        return modelQuestion.question_id == question._id;
      });
      question.selected = selectedQuestion ? true : false;
      if (selectedQuestion) {
        question.selected = true;
        // question.weightage = selectedQuestion.weightage;
      } else {
        question.selected = false;
        // question.weightage = "";
      }
      switch (question.questionType) {
        case 'mcq':
          if (question.selected && question.options.length) {
            for (let i = 0; i < selectedQuestion.options.length; i++) {
              for (let j = 0; j < question.options.length; j++) {
                if (
                  selectedQuestion.options[i] == question.options[j].option_id
                ) {
                  question.options[j].selected = true;
                }
              }
            }
          }
          this.questions.mcq.push({ ...question });
          break;

        case 'sellerInput':
          this.questions.sellerInput.push(question);
          break;
      }
    });
    $(`#link-question`).modal('show');
    console.log('question ===>>>', this.questions);
  }

  selectQuestion(question: any) {
    question.options.forEach((option) => {
      option.selected = question.selected;
    });
  }

  linkQuestion() {
    let selectedQuestions: AssignQuestionToModel = new AssignQuestionToModel();
    let noMcqOptionSelected = false;
    this.questions.mcq.forEach((question) => {
      if (question.selected) {
        let options = question.options.filter((option) => {
          return option.selected;
        });
        let optionIds = [];
        if (options.length) {
          options.forEach((option) => {
            optionIds.push(option.option_id);
          });
        } else {
          noMcqOptionSelected = true;
        }
        selectedQuestions.questions.push({
          question_id: question._id,
          // weightage: question.weightage,
          options: optionIds,
        });
      }
    });
    this.questions.sellerInput.forEach((question) => {
      if (question.selected) {
        selectedQuestions.questions.push({
          question_id: question._id,
          // weightage: question.weightage,
          options: [],
        });
      }
    });
    console.log(selectedQuestions);
    // if (noMcqOptionSelected) {
    //   alert('No options selected in some of the selected MCQ type questions.');
    //   return;
    // }
    // let checkWeightage = selectedQuestions.questions.filter((question) => { return !question.weightage });
    // if (checkWeightage.length) {
    //   alert("Please make sure that you've put weightage in the questions you've selected.");
    //   return;
    // }
    this.mqService
      .linkQuestionToModel(this.model_id, selectedQuestions)
      .subscribe(
        (res) => {
          if (res) {
            this.questions = {
              mcq: [],
              sellerInput: [],
            };
            this.getModels();
            this.model_id = '';
            $('#link-question').modal('hide');
          }
        },
        (error) => {
          this.commonService.errorHandler(error);
        }
      );
  }

  getQuestionNumber(index: number): Object {
    return { number: index + 1 };
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.modelToBeReordered,
      event.previousIndex,
      event.currentIndex
    );
  }

  getmodelToBeReordered() {
    this.modelToBeReordered = [];
    this.modelList.forEach((model) => {
      this.modelToBeReordered.push({ ...model });
    });
  }

  changeOrderForModel() {
    let payload = {
      category_id: this.category_id,
      brand_id: this.brand_id,
      model_ids: [],
    };
    this.modelToBeReordered.forEach((model) => {
      payload.model_ids.push(model._id);
    });
    if (!payload.model_ids.length) {
      return;
    }
    this.modelToBeReordered = [];
    this.commonService.presentSpinner();
    this.categoriesService.changeOrderForModel(payload).subscribe(
      (res) => {
        if (res) {
          this.modelToBeReordered = [];
          this.commonService.dismissSpinner();
          this.getModels();
        }
      },
      (error) => {
        this.modelToBeReordered = [];
        this.commonService.errorHandler(error);
      }
    );
  }

  handlePriceNudgingSettingsAppearance() {

    console.log('priceNudgingSettings', this.editModelForm.value.priceNudgingSettings);

  }
  handleCommissionAppearance() {

    console.log('this.commissionToggle', this.editModelForm.value);

  }
  handleSellerCommissionAppearance() {

    console.log('this.SellerCommissionToggle', this.editModelForm.value);

  }

  // function to back the recent page
  // added by @naeeim 15/6/2021
  goBack() {
    this._location.back();
  }
}

export class EditModel {
  category_id: string = '';
  brand_id: string = '';
  model_name: string = '';
  model_name_ar: string = '';
  model_icon: string = '';
  excellentCommission: number = 0;
  fairCommission: number = 0;
  expensiveLBCommission: number = 0;
  expensiveUBCommission: number = 0;
  excellentSellerCommission: number = 0;
  fairSellerCommission: number = 0;
  expensiveLBSellerCommission: number = 0;
  expensiveUBSellerCommission: number = 0;
  status: boolean = true;

  // current_price: string = '';
}

export class AssignQuestionToModel {
  questions: Array<AssigneeQuestion> = [];
}

export interface AssigneeQuestion {
  question_id: string;
  options: Array<string>;
  // weightage: string;
}
