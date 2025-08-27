import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AddQuestion, MasterQuestionService, UpdateAnswer, UpdateQuestion } from 'src/app/services/master-question/master-question.service';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';  

@Component({
  selector: 'app-master-questions',
  templateUrl: './master-questions.component.html',
  styleUrls: ['./master-questions.component.scss']
})
export class MasterQuestionsComponent implements OnInit {
  categoryList: any;
  selectedCategory: any;
  masterQuestions: any;
  questionToUpdate: any;
  optionToUpdate: any;
  addQuestionForm: FormGroup;

  constructor(
    private mqService: MasterQuestionService,
    private commonService: CommonService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private categoriesService: CategoriesService
  ) {
    this.getCategory();
    this.generateAddQuestionForm();
  }

  ngOnInit(): void {
  }

  deleteAnsweraction(id , quest) {
    let options ={
      title: 'Are you Sure you want to delete this answer?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
    //   console.log('Okay' , id);
     //  (click)="deleteProduct(product?._id)"
       this.deleteAnswer(id , quest);
      } else {
   //   console.log('Cancel');
      }
    });
  }
  deleteQuestionaction(id) {
    let options ={
      title: 'Are you Sure you want to delete this question?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
       console.log('Okay' , id);
     //  (click)="deleteProduct(product?._id)"
       this.deleteQuestion(id);
      } else {
      console.log('Cancel');
      }
    });
  }
  getCategory() {
    this.commonService.presentSpinner();
    this.categoriesService.getCategory().subscribe(
      res => {
        if (res) {
          this.commonService.dismissSpinner();
          this.categoryList = res.body.responseData;
          this.selectedCategory = this.categoryList[0]._id;
          this.getMasterQuestions();
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      });
  }

  getMasterQuestions() {
    this.mqService.getMasterQuestions(this.selectedCategory).subscribe(
      (res) => {
        if (res) {
          this.masterQuestions = res.body.questionList;
          this.masterQuestions.forEach(
            (question) => {
              question.edit = false;
              question.options.forEach(
                (option) => {
                  option.edit = false;
                }
              );
            }
          )
        } else {
          this.masterQuestions = [];
        }
      },
      (error) => {
        this.masterQuestions = []
        this.commonService.errorHandler(error);
      }
    );
  }

  getQuestionNumber(index: number): Object {
    return { 'number': index + 1 }
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

  updateQuestion(question: any) {
    this.commonService.presentSpinner();
    let payload = new UpdateQuestion(this.questionToUpdate._id, this.questionToUpdate.question, this.questionToUpdate.question_ar, this.questionToUpdate.weightage);
    this.mqService.updateQuestion(question._id, payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.getMasterQuestions();
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

  updateAnswer(option: any, question_id: string) {
    this.commonService.presentSpinner();
    let payload = new UpdateAnswer(this.selectedCategory, this.optionToUpdate.answer, this.optionToUpdate.option_id, this.optionToUpdate.answer_ar, this.optionToUpdate.score);
    this.mqService.updateAnswer(question_id, payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.getMasterQuestions();
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
    let options = this.addQuestionForm.controls['options'] as FormArray;
    options.push(this.createAnswerForm());
  }

  createAnswerForm() {
    return new FormGroup({
      answer: new FormControl('', Validators.compose([Validators.required])),
      answer_ar: new FormControl('', Validators.compose([Validators.required])),
      score: new FormControl('', Validators.compose([Validators.required]))
    })
  }

  removeAnswerFields(index: number) {
    let options = this.addQuestionForm.controls['options'] as FormArray;
    options.removeAt(index);
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  addQuestion() {
    let values = { ...this.addQuestionForm.value };
    values.category_id = this.selectedCategory;
    this.mqService.addQuestion(new AddQuestion(values)).subscribe(
      (res) => {
        if (res) {
          this.getMasterQuestions();
        }
      }
    )
  }

  generateAddQuestionForm() {
    this.addQuestionForm = new FormGroup({
      question: new FormControl('', Validators.compose([Validators.required])),
      question_ar: new FormControl('', Validators.compose([Validators.required])),
      weightage: new FormControl('', Validators.compose([Validators.required])),
      options: new FormArray([
        this.createAnswerForm(),
        this.createAnswerForm()
      ])
    });
  }

  deleteQuestion(question_id: string) {
    this.commonService.presentSpinner();
    this.mqService.deleteQuestion(question_id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.getMasterQuestions();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    )
  }

  deleteAnswer(question_id: string, answer_id: string) {
    this.commonService.presentSpinner();
    this.mqService.deleteAnswer(question_id, answer_id).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.getMasterQuestions();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    )
  }

}
