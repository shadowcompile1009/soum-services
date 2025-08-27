import { Injectable } from '@angular/core';
import { AssignQuestionToModel } from 'src/app/components/admin/categories/models/models.component';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class MasterQuestionService {

  constructor(
    private apiService: ApiService
  ) { }
  sendImg(file){
    return this.apiService.secondEnvpostApi(endpoint.uploadImg , file , 2);
 
  }
  addYesNoQuestionsDelete(questionnID , questID){
    return this.apiService.deleteSecondApi(endpoint.addYesNoQuestionsDelete(questionnID, questID));
  }
  addYesNoAnswersDelete(questionnID , questID){
    return this.apiService.deleteSecondApi(endpoint.addYesNoAnswersDelete(questionnID, questID));
  }
  addYesNoQuestions(id,data){

    return this.apiService.secondEnvpostApi(endpoint.addYesNoQuestions(id), data , 1);
  }
  getQuestionnairesList(data){
    return this.apiService.secondEnvgetApi(endpoint.getQuestionnairesList(data));
  }
  addQuestionnaire(data) {
    return this.apiService.secondEnvpostApi(endpoint.addQuestionnaire, data , 1);
  }
  getQuestionnaires(cat){
    var body = {category_id :  cat};
    return this.apiService.secondEnvpostApi(endpoint.getQuestionnaires , body , 1);
  }
  getProductQuestions(Prod){
    return this.apiService.secondEnvgetApi(endpoint.getQuestionsPerProduct(Prod));
  }
  getMasterQuestions(category_id: string) {
    return this.apiService.getApi(endpoint.masterQuestions(category_id));
  }

  linkQuestionToModel(model_id: string, payload: AssignQuestionToModel) {
    return this.apiService.putApi(endpoint.linkQuestionToModel(model_id), payload, 1);
  }

  updateQuestion(question_id: string, payload) {
    return this.apiService.putApi(endpoint.updateQuestion(question_id), payload, 1);
  }
  updateQuestionQ( questionnaire,question_id: string, payload) {
    return this.apiService.putSecondApi(endpoint.updateQuestionQ(questionnaire ,question_id), payload, 1);
  }
  getQuestionDetails(question_id: string, ) {
    return this.apiService.secondEnvgetApi(endpoint.getQuestionDetails(question_id));
  }
  updateAnswer(question_id: string, payload) {
    return this.apiService.putSecondApi(endpoint.updateAnswer(question_id , payload._id), payload, 1);
  }
  updateAnswerChoice(question_id: string, payload) {
    return this.apiService.putSecondApi(endpoint.updateAnswerChoice(question_id , payload._id), payload, 1);
  }
  addQuestion(payload: AddQuestion) {
    return this.apiService.postApi(endpoint.addQuestion, payload, 1);
  }

  deleteQuestion(question_id: string) {
    return this.apiService.deleteApi(endpoint.deleteQuestion(question_id));
  }

  deleteAnswer(question_id: string, answer_id: string) {
    return this.apiService.deleteApi(endpoint.deleteAnswer(question_id, answer_id));
  }

}

export class UpdateQuestion {
  category_id: string;
  question: string;
  question_ar: string;
  weightage: string;

  constructor(category_id: string, question: string, question_ar: string,
    weightage: string) {
    this.category_id = category_id;
    this.question = question;
    this.question_ar = question_ar;
    this.weightage = weightage;
  }
}
export class UpdateYesNoQuestion {
  category_id: string;
  question: string;
  question_ar: string;


  constructor(category_id: string, question: string, question_ar: string) {
    this.category_id = category_id;
    this.question = question;
    this.question_ar = question_ar;
  }
}

export class UpdateAnswer {
  category_id: string;
  answer: string;
  option_id: string;
  answer_ar: string;
  score: string;

  constructor(category_id: string, answer: string, option_id: string, answer_ar: string,
    score: string) {
    this.category_id = category_id;
    this.answer = answer;
    this.option_id = option_id;
    this.answer_ar = answer_ar;
    this.score = score;
  }
}
export class UpdateYesNoAnswer {
  category_id: string;
  option: string;
  option_id: string;
  option_ar: string;
  score: string;
  explanation: string;
  explanation_ar: string;
  fileInput;
  yesScore: string;
  noScore: string;

  constructor(category_id: string, option: string, option_id: string, option_ar: string, score: string, explanation: string, explanation_ar: string
    , fileInput, yesScore: string, noScore: string) {
    this.category_id = category_id;
    this.option = option;
    this.option_id = option_id;
    this.option_ar = option_ar;
    this.score = score;
    this.explanation = explanation;
    this.explanation_ar = explanation_ar;
    this.yesScore = yesScore;
    this.noScore = noScore;
    this.fileInput = fileInput;
  }
}
export class UpdateDropdownAnswer {
  category_id: string;
  answer: string;
  option_id: string;
  answer_ar: string;
  score: string;

  constructor(category_id: string, answer: string, option_id: string, answer_ar: string,
    score: string) {
    this.category_id = category_id;
    this.answer = answer;
    this.option_id = option_id;
    this.answer_ar = answer_ar;
    this.score = score;
  }
}

export class AddQuestion {
  category_id: string;
  question: string;
  question_ar: string;
  questionType: string;
  weightage: number;
  options: Array<Answer>

  constructor(payload: {
    category_id: string;
    question: string;
    questionType: string;
    question_ar: string;
    weightage: number;
    options: Array<Answer>
  }) {
    this.category_id = payload.category_id;
    this.question = payload.question;
    this.questionType = payload.questionType;
    this.question_ar = payload.question_ar;
    this.weightage = payload.weightage;
    this.options = payload.options;
  }
}

interface Answer {
  answer: string;
  answer_ar: string;
  score: number;
}
