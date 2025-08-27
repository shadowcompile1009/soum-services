import { instanceToPlain } from 'class-transformer';
import isEmpty from 'lodash.isempty';

import { apiClientV2, apiGatewayClient } from '@/api/client';

export const ProductQuestionEndpoints = {
  getQuestionsByCategoryId: `rest/api/v1/questionnaire/filter`,
  getResponsesByListingId(listingId: string) {
    return `rest/api/v1/response/filter/${listingId}`;
  },
  getReviewQuestionsByListingId(listingId: string) {
    return `review/response/filter/${listingId}`;
  },
};

type QuestionType =
  | 'yes-no-without-options'
  | 'dropdown'
  | 'yes-no-with-options';

interface IAnswerResponse {
  answer_id: string;
  answer_en: string;
  answer_ar: string;
  icon: string;
  score: number;
  sub_choices: IChoicesResponse[];
}

interface IReviewAnswerResponse {
  optionEn: string;
  optionAr: string;
  score: number;
  attachment: string;
  text: string;
}

interface IChoicesResponse {
  choice_id: string;
  option_ar: string;
  option_en: string;
  icon: string;
  score: number;
}
interface IQuestionResponse {
  response_id: string;
  question_id: string;
  question_type: QuestionType;
  order: number;
  question_en: string;
  question_ar: string;
  answers: IAnswerResponse[];
  choices: IChoicesResponse[];
}

interface IReviewQuestionResponse {
  questionId: string;
  questionAr: string;
  questionEn: string;
  answers: IReviewAnswerResponse[];
}

export interface IAnswer {
  answerId: string;
  answer: string;
}

export interface IQuestion {
  questionId: string;
  question: string;
  order: number;
  type: QuestionType;
  answers: IAnswer[];
}

export class ProductQuestion {
  static async getResponsesByListingId(listingId: string) {
    const endpoint =
      ProductQuestionEndpoints.getResponsesByListingId(listingId);
    const result = await apiClientV2.client.get(endpoint);

    return instanceToPlain(
      ProductQuestion.mapProductQuestions(result.data.responseData)
    ) as ProductQuestion[];
  }

  static async getReviewResponsesByListingId(listingId: string) {
    const endpoint =
      ProductQuestionEndpoints.getReviewQuestionsByListingId(listingId);
    const result = await apiGatewayClient.client.get(endpoint);

    return instanceToPlain(
      ProductQuestion.mapReviewProductQuestions(result.data?.[0]?.responses)
    ) as ProductQuestion[];
  }

  static mapProductAnswers(question: IQuestionResponse) {
    let answers: IAnswer[] = [];

    if (!isEmpty(question.answers)) {
      let mappedAnswers = question.answers.map((answer) => ({
        answerId: answer.answer_id,
        answer: answer.answer_en,
        answerAr: answer.answer_ar,
      }));

      answers.push(...mappedAnswers);

      let mappedSubChoices = question.answers.reduce(
        (result, currentAnswer) => {
          if (!isEmpty(currentAnswer.sub_choices)) {
            const subChoices = currentAnswer.sub_choices.map((subChoice) => ({
              answerId: subChoice.choice_id,
              answer: subChoice.option_en,
            }));
            result.push(...subChoices);
          }
          return result;
        },
        [] as IAnswer[]
      );

      answers.push(...mappedSubChoices);
    }

    if (!isEmpty(question.choices)) {
      let mappedChoice = question.choices.map((choice) => ({
        answerId: choice.choice_id,
        answer: choice.option_en,
        answerAr: choice.option_ar,
      }));

      answers.push(...mappedChoice);
    }

    return answers;
  }

  static mapReviewProductAnswers(question: IReviewQuestionResponse) {
    let answers: IAnswer[] = [];

    if (!isEmpty(question.answers)) {
      let mappedAnswers = question.answers.map((answer, index) => ({
        answerId: index.toString(),
        answer: answer.optionEn || answer.text,
        answerAr: answer.optionAr,
      }));
      answers.push(...mappedAnswers);
    }

    return answers;
  }

  static async mapProductQuestions(questions: IQuestionResponse[]) {
    return questions.map(
      (question) =>
        new ProductQuestion({
          questionId: question.question_id,
          order: question.order,
          type: question.question_type,
          question: question.question_en,
          answers: ProductQuestion.mapProductAnswers(question),
        })
    );
  }

  static async mapReviewProductQuestions(questions: IReviewQuestionResponse[]) {
    return questions.map(
      (question, index) =>
        new ProductQuestion({
          questionId: question.questionId,
          order: index,
          type: 'yes-no-with-options',
          question: question.questionEn,
          answers: ProductQuestion.mapReviewProductAnswers(question),
        })
    );
  }

  public answers: IAnswer[];
  public questionId: string;
  public order: number;
  public question: string;
  public type: QuestionType;

  constructor({ answers, questionId, order, question, type }: IQuestion) {
    this.answers = answers;
    this.questionId = questionId;
    this.order = order;
    this.question = question;
    this.type = type;
  }
}
