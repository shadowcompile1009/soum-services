import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CommonService } from 'src/app/services/common/common.service';
import {
  AddQuestion,
  MasterQuestionService,
  UpdateAnswer,
  UpdateDropdownAnswer,
  UpdateQuestion,
  UpdateYesNoAnswer,
  UpdateYesNoQuestion,
} from 'src/app/services/master-question/master-question.service';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  selectedImage = [];
  categoryList: any;
  selectedCategory: any;
  masterQuestions: any;
  questionToUpdate: any;
  optionToUpdate: any;
  addQuestionForm: FormGroup;
  yesNoQuestionForm: FormGroup;
  yesNoOptionsForm: FormGroup;
  inputForm : FormGroup;
  DropdownQuestionForm: FormGroup;

  categoryDropdownValue: string = 'yes-no-without-options';
  catIdsQ = [];
  catIds = [];
  questionsArray;
  selectedQuestionnaire;
  constructor(
    private mqService: MasterQuestionService,
    private commonService: CommonService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private categoriesService: CategoriesService,
    private fb: FormBuilder
  ) {
    this.getCategory();
    this.selectedImage =[];
    this.generateAddQuestionForm();
    this.initYesNoQuestionForm();
    this.initYesNoOptionsForm();
    this.initInputForm();
    this.initDropdownQuestionForm();
  }

  ngOnInit(): void {}

  addQuestionnaire() {
    var obj = {
      category_id: this.selectedCategory,
      description_en: 'Questionnaire',
      description_ar: 'استبيان',
      is_active: true,
    };
    this.mqService.addQuestionnaire(obj).subscribe((res) => {
 this.getQuestionnaires();

    });
  }
  getQuestionnaires() {
    this.mqService.getQuestionnaires(this.selectedCategory).subscribe((res) => {

      if (res.body.responseData.length) {

        this.questionsArray = res.body.responseData[0].questions;
        this.selectedQuestionnaire = res.body.responseData[0]._id;
      } else {

        this.addQuestionnaire();
        this.questionsArray = [];
      }
    });
  }
  deleteAnsweraction( quest , id) {
    let options = {
      title: 'Are you Sure you want to delete this answer?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        //   console.log('Okay' , id);
        //  (click)="deleteProduct(product?._id)"
        this.addYesNoAnswersDelete( quest,id);
      } else {
        //   console.log('Cancel');
      }
    });
  }
  deleteQuestionaction(question , id) {
    let options = {
      title: 'Are you Sure you want to delete this question?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        console.log('Okay', id);
        //  (click)="deleteProduct(product?._id)"
        this.addYesNoQuestionsDeleteFun(question, id);
      } else {
        console.log('Cancel');
      }
    });
  }
  getCategory() {
    this.commonService.presentSpinner();
    this.categoriesService.getCategory().subscribe(
      (res) => {
        if (res) {
          this.commonService.dismissSpinner();
          this.categoryList = res.body.responseData;
          for (var i = 0; i < this.categoryList.length; i++) {
            this.catIds.push(this.categoryList[i]._id);
          }
          this.selectedCategory = this.categoryList[0]._id;
          this.getQuestionnaires();
          var there = this.catIdsQ.findIndex(
            (x) => x === this.selectedCategory
          );
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  getMasterQuestions() {
    this.mqService.getMasterQuestions(this.selectedCategory).subscribe(
      (res) => {
        if (res) {
          this.masterQuestions = res.body.questionList;
          this.masterQuestions.forEach((question) => {
            question.edit = false;
            question.options.forEach((option) => {
              option.edit = false;
            });
          });
        } else {
          this.masterQuestions = [];
        }
      },
      (error) => {
        this.masterQuestions = [];
        this.commonService.errorHandler(error);
      }
    );
  }

  getQuestionNumber(index: number): Object {
    return { number: index + 1 };
  }

  editQuestion(question) {
    question.edit = !question.edit;
    if (question.edit) {
      this.questionToUpdate = { ...question };
    } else {
      this.questionToUpdate = null;
    }
  }

  editOption(option) {
    option.edit = !option.edit;
    if (option.edit) {
      this.optionToUpdate = { ...option };
    } else {
      this.optionToUpdate = null;
    }
  }

  updateQuestion(questionnaire, question: any) {
    this.commonService.presentSpinner();

    this.mqService
      .updateQuestionQ(questionnaire, question._id, question)
      .subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          if (res) {
            this.getQuestionnaires();
            question.edit = !question.edit;
            this.questionToUpdate = null;
          }
        },
        (error) => {
          this.commonService.dismissSpinner();
          question.edit = !question.edit;
          this.questionToUpdate = null;
          this.commonService.errorHandler(error);
        }
      );
  }

  updateYesNoQuestion(question: any) {
    this.commonService.presentSpinner();
    let payload = new UpdateYesNoQuestion(
      this.questionToUpdate._id,
      this.questionToUpdate.question_en,
      this.questionToUpdate.question_ar
    );
    this.mqService.updateQuestion(question._id, payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.getQuestionnaires();
          question.edit = !question.edit;
          this.questionToUpdate = null;
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        question.edit = !question.edit;
        this.questionToUpdate = null;
        this.commonService.errorHandler(error);
      }
    );
  }

  updateAnswerChoice(option: any ,question_id: string) {
    this.commonService.presentSpinner();

    this.mqService.updateAnswerChoice(question_id, option).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.getQuestionnaires();
          option.edit = !option.edit;
          this.optionToUpdate = null;
          this.commonService.successToaster(res.body.message);
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        option.edit = !option.edit;
        this.optionToUpdate = null;
        this.commonService.errorHandler(error);
      }
    );
  }
  updateAnswer(option: any ,question_id: string) {
    this.commonService.presentSpinner();

    this.mqService.updateAnswer(question_id, option).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.getQuestionnaires();
          option.edit = !option.edit;
          this.optionToUpdate = null;
          this.commonService.successToaster(res.body.message);
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        option.edit = !option.edit;
        this.optionToUpdate = null;
        this.commonService.errorHandler(error);
      }
    );
  }
  updateYesNoAnswer(option: any, question_id: string) {
    this.commonService.presentSpinner();
    let payload = new UpdateYesNoAnswer(
      this.selectedCategory,
      this.optionToUpdate.option,
      this.optionToUpdate.option_id,
      this.optionToUpdate.option_ar,
      this.optionToUpdate.score,
      this.optionToUpdate.explanation,
      this.optionToUpdate.explanation_ar,
      this.optionToUpdate.fileInput,
      this.optionToUpdate.yesScore,
      this.optionToUpdate.noScore
    );
    this.mqService.updateAnswer(question_id, payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.getQuestionnaires();
          option.edit = !option.edit;
          this.optionToUpdate = null;
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        option.edit = !option.edit;
        this.optionToUpdate = null;
        this.commonService.errorHandler(error);
      }
    );
  }

  updateDropdownAnswer(option: any, question_id: string) {
    this.commonService.presentSpinner();
    let payload = new UpdateDropdownAnswer(
      this.selectedCategory,
      this.optionToUpdate.answer,
      this.optionToUpdate.option_id,
      this.optionToUpdate.answer_ar,
      this.optionToUpdate.score
    );
    this.mqService.updateAnswer(question_id, payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.getQuestionnaires();
          option.edit = !option.edit;
          this.optionToUpdate = null;
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        option.edit = !option.edit;
        this.optionToUpdate = null;
        this.commonService.errorHandler(error);
      }
    );
  }

  addMoreAnswerFields() {

    if (this.categoryDropdownValue === 'mcqs') {
      let options = this.addQuestionForm.controls['options'] as FormArray;
      options.push(this.createAnswerForm());
    } else if (this.categoryDropdownValue === 'yes-no-without-options') {
      let options = this.yesNoOptionsForm.controls['options'] as FormArray;
      options.push(this.createYesNoForm());
    } else if (this.categoryDropdownValue === 'yes-no-with-options') {
      let options = this.yesNoOptionsForm.controls['options'] as FormArray;
      options.push(this.createYesNoForm());
    }
    else if (this.categoryDropdownValue === 'input_text') {
      let options = this.yesNoOptionsForm.controls['options'] as FormArray;
      options.push(this.createYesNoForm());
    }
     else {
      let options = this.DropdownQuestionForm.controls['options'] as FormArray;
      options.push(this.createDropdownForm());
    }
  }

  createAnswerForm() {
    return new FormGroup({
      answer: new FormControl('', Validators.compose([Validators.required])),
      answer_ar: new FormControl('', Validators.compose([Validators.required])),
      score: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  createYesNoForm() {
    return new FormGroup({
      option_en: new FormControl('', Validators.compose([Validators.required])),
      option_ar: new FormControl('', Validators.compose([Validators.required])),
      score: new FormControl('', Validators.compose([Validators.required])),
       icon: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  createDropdownForm() {
    return new FormGroup({
      option_en: new FormControl(''),
      option_ar: new FormControl(''),
      score: new FormControl(''),
      icon: new FormControl(''),
    });
  }

  removeAnswerFields(index: number) {
    let options;
    if (this.categoryDropdownValue === 'mcqs') {
      options = this.addQuestionForm.controls['options'] as FormArray;
    } else if (this.categoryDropdownValue === 'yes-no-with-options') {
      options = this.yesNoOptionsForm.controls['options'] as FormArray;
    } else {
      options = this.DropdownQuestionForm.controls['options'] as FormArray;
    }
    options.removeAt(index);
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  addQuestion() {
    let values = { ...this.addQuestionForm.value };
    values.questionType = 'mcq';
    values.category_id = this.selectedCategory;

    // this.mqService.addQuestion(new AddQuestion(values)).subscribe(
    //   (res) => {
    //     if (res) {
    //       this.getMasterQuestions();
    //     }
    //   }
    // )
    // this.resetForm();
  }

  addYesNoOptions() {
    let values = { ...this.yesNoOptionsForm.value };
    values.questionType = 'yes-no-with-options';
    values.category_id = this.selectedCategory;
    var yesNoObj = {
      order: 1,
      question_en: values.question_en,
      question_ar: values.question_ar,
      type: 'yes-no-with-options',
      answers: [
        {
          answer_en: 'Yes',
          answer_ar: 'نعم',
          score: values.yesScore,

          sub_choices: values.options,
        },
        {
          answer_en: 'No',
          answer_ar: 'لا',
          score: values.noScore,
        },
      ],
    };
    for( var i = 0 ; i < values.options.length ; i++){
      yesNoObj.answers[0].sub_choices[i].icon = this.selectedImage[i];
    }

    this.mqService
      .addYesNoQuestions(this.selectedQuestionnaire, yesNoObj)
      .subscribe((res) => {
        if (res) {
          this.getQuestionnaires();
        }
      });
    this.resetForm();
    // this.mqService.addQuestion(new AddQuestion(values))
    // .subscribe(
    //   (res) => {
    //     if (res) {
    //       this.getMasterQuestions();
    //     }
    //   }
    // )
    // this.resetForm();
  }

  addYesNoQuestion() {
    let values = { ...this.yesNoQuestionForm.value };
    values.questionType = 'yes-no-without-options';
    values.category_id = this.selectedCategory;

    var yesNoObj = {
      order: 1,
      question_en: values.question_en,
      question_ar: values.question_ar,
      type: 'yes-no-without-options',
      answers: [
        {
          answer_en: 'Yes',
          answer_ar: 'نعم',
          score: values.yesScore,
        },
        {
          answer_en: 'No',
          answer_ar: 'لا',
          score: values.noScore,
        },
      ],
    };

    this.mqService
      .addYesNoQuestions(this.selectedQuestionnaire, yesNoObj)
      .subscribe((res) => {
        if (res) {
          this.getQuestionnaires();
        }
      });
    this.resetForm();
  }

  addinputForm() {
    let values = { ...this.inputForm.value };
    values.questionType = 'input_text';
    values.category_id = this.selectedCategory;
    var yesNoObj = {
      order: 1,
      question_en: values.question_en,
      question_ar: values.question_ar,
      text_placeholder_en: values.text_placeholder_en,
      text_placeholder_ar: values.text_placeholder_ar,
      subtext_en: values.subtext_en,
      subtext_ar: values.subtext_ar,
      is_mandatory: values.is_mandatory,
      question_key:values.question_key,
      type: 'text-box',


    };
    this.mqService
      .addYesNoQuestions(this.selectedQuestionnaire, yesNoObj)
      .subscribe((res) => {
        if (res) {
          this.getQuestionnaires();
        }
      });
    this.resetForm();
  }
  addDropdownQuestion() {
    let values = { ...this.DropdownQuestionForm.value };
    values.questionType = 'dropdown';
    values.category_id = this.selectedCategory;

    var yesNoObj = {
      order: 1,
      question_en: values.question_en,
      question_ar: values.question_ar,
      type: 'dropdown',
      choices: values.options,
    };
    for( var i = 0 ; i < values.options.length ; i++){
      yesNoObj.choices[i].icon = this.selectedImage[i];
    }

    this.mqService
      .addYesNoQuestions(this.selectedQuestionnaire, yesNoObj)
      .subscribe((res) => {
        if (res) {
          this.getQuestionnaires();
        }
      });
    this.resetForm();
    // this.mqService.addQuestion(new AddQuestion(values))
    // .subscribe(
    //   (res) => {
    //     if (res) {
    //       this.getMasterQuestions();
    //     }
    //   }
    // )
    // this.resetForm();
  }

  generateAddQuestionForm() {
    this.addQuestionForm = new FormGroup({
      question: new FormControl('', Validators.compose([Validators.required])),
      question_ar: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      weightage: new FormControl('', Validators.compose([Validators.required])),
      options: new FormArray([
        this.createAnswerForm(),
        this.createAnswerForm(),
      ]),
    });
  }

  initYesNoQuestionForm() {
    this.yesNoQuestionForm = new FormGroup({
      question_en: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      question_ar: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      yesScore: new FormControl('', Validators.compose([Validators.required])),
      noScore: new FormControl('', Validators.compose([Validators.required])),
    });
  }
  initYesNoOptionsForm() {
    this.yesNoOptionsForm = new FormGroup({
      question: new FormControl('', Validators.compose([Validators.required])),
      question_ar: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      // explanation: new FormControl(
      //   '',
      //   Validators.compose([Validators.required])
      // ),
      // explanation_ar: new FormControl(
      //   '',
      //   Validators.compose([Validators.required])
      // ),
      yesScore: new FormControl('', Validators.compose([Validators.required])),
      noScore: new FormControl('', Validators.compose([Validators.required])),
      options: new FormArray([this.createYesNoForm(), this.createYesNoForm()]),
    });
  }
  initInputForm() {

    this.inputForm = new FormGroup({
      order: new FormControl(1),
      type: new FormControl("text-box"),

      question_en: new FormControl('', Validators.compose([Validators.required])), //Input Field Title EN
      question_ar: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      question_key:new FormControl('', Validators.compose([Validators.required])),
      text_placeholder_en: new FormControl('', Validators.compose([Validators.required])),
      text_placeholder_ar: new FormControl('', Validators.compose([Validators.required])),
      subtext_en: new FormControl(''),
      subtext_ar: new FormControl(''),
      is_mandatory : new FormControl(false, ),
    });
  }
  initDropdownQuestionForm() {
    this.DropdownQuestionForm = new FormGroup({
      question_en: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      question_ar: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      options: new FormArray([
        this.createDropdownForm(),
        this.createDropdownForm(),
      ]),
    });
  }

  addYesNoQuestionsDelete(question, id) {
    this.deleteQuestionaction(question, id);
  }
  addYesNoQuestionsDeleteFun(question, id) {
    this.commonService.presentSpinner();
    this.mqService.addYesNoQuestionsDelete(question, id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();

          this.getQuestionnaires();

      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }
  addYesNoAnswersDelete(question, id) {
    this.commonService.presentSpinner();
    this.mqService.addYesNoAnswersDelete(question, id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();

          this.getQuestionnaires();

      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }
  deleteQuestion(question_id: string) {
    this.commonService.presentSpinner();
    this.mqService.deleteQuestion(question_id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.getQuestionnaires();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  deleteAnswer(question_id: string, answer_id: string) {
    this.commonService.presentSpinner();
    this.mqService.deleteAnswer(question_id, answer_id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.getQuestionnaires();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  resetForm() {
    this.selectedImage = [];
    this.addQuestionForm.reset();
    this.yesNoQuestionForm.reset();
    this.yesNoOptionsForm.reset();
    this.inputForm.reset();
    this.DropdownQuestionForm.reset();
    this.categoryDropdownValue = 'yes-no-without-options';
  }

  onFileSelected(files , i ) {

    if (files.length) {
      //files.item(0);
      this.commonService.presentSpinner();
      var obj = {model_icon: files.item(0)}
      let formData = new FormData();
formData.append("model_icon", files.item(0));
      this.mqService.sendImg(formData).subscribe(
        (res) => {
          this.commonService.dismissSpinner();
            this.selectedImage[i] = res.responseData;
        },
        (error) => {
          this.commonService.dismissSpinner();
          this.commonService.errorHandler(error);
        }
      );
    }
  }

  getName(fileInput) {
    let nameArray = [];
    if (fileInput.value) {
      nameArray = fileInput.value.split(/[\\]/);
    }
    return nameArray[nameArray.length - 1];
  }

  getQuestionnairesList() {
    // this.mqService.getQuestionnairesList().subscribe((res) => {
    //   console.log(res.body, 'Ressssssss12' );
    //   // console.log(res, 'Ressssssss' , this.catIdsQ);
    // });
  }
  changeCategoty(selectedCategory) {

    this.selectedCategory = selectedCategory;
    this.getQuestionnaires();
  }
}
