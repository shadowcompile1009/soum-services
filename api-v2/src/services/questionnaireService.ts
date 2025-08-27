import mongoose from 'mongoose';
import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import {
  QuestionDocument,
  QuestionInput,
  QuestionUpdateInput,
} from '../models/Question';
import {
  QuestionnaireDocument,
  QuestionnaireInput,
} from '../models/Questionnaire';
import { ProductRepository } from '../repositories/productRepository';
import { QuestionnaireRepository } from '../repositories/questionnaireRepository';
import { CategoryRepository } from '../repositories/categoryRepository';
import { CategoryDocument } from '../models/Category';

@Service()
export class QuestionnaireService {
  @Inject()
  error: ErrorResponseDto;
  @Inject()
  questionnaireRepository: QuestionnaireRepository;
  @Inject()
  productRepository: ProductRepository;
  @Inject()
  categoryRepository: CategoryRepository;

  customBatteryQuestions(questions: any) {
    const customQuestions = [];
    for (const question of questions) {
      if (
        String(question.question_en).toLowerCase().indexOf('battery health') !==
        -1
      ) {
        const newChoices = question.choices.map((choice: any) => {
          let from = '0';
          let to = '100';
          const choiceText = String(choice?.option_en).toLowerCase();
          if (choiceText.includes('less than')) {
            [, to] = choiceText.split('less than ');
            to = (Number(to) - 1).toString();
            from = '50';
          } else {
            const choiceContent = choiceText.replace(/[^\d\+\-]*/g, '');
            if (choiceContent.includes('+')) {
              [from, to] = choiceContent.split('+');
              to = '100';
            } else {
              [from, to] = choiceContent.split('-');
            }
          }
          const genChoices = [];
          for (let i = Number(from); i <= Number(to); i++) {
            genChoices.push({
              _id: choice._id,
              option_en: String(i),
              option_ar: String(i),
              score: choice.score,
              icon: choice.icon,
            });
          }

          return genChoices;
        });
        question.choices = newChoices;
      }
      customQuestions.push(question);
    }

    return customQuestions;
  }

  async getAllQuestionnaires() {
    try {
      return await this.questionnaireRepository.getAllQuestionnaires();
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_DETAIL_QUESTIONNAIRE
      );
    }
  }

  async getQuestionnaire(
    id: any
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const [error, questionnaire] =
        await this.questionnaireRepository.getDetailQuestionnaire(id);
      if (error) {
        return [
          error,
          {
            code: 400,
            result: questionnaire,
            message: Constants.MESSAGE.FAILED_TO_GET_DETAIL_QUESTIONNAIRE,
          },
        ];
      }

      questionnaire.questions = this.customBatteryQuestions(
        questionnaire.questions
      );

      return [
        false,
        {
          code: 200,
          result: questionnaire,
          message: Constants.MESSAGE.QUESTIONNAIRE_GET_SUCCESS,
        },
      ];
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_DETAIL_QUESTIONNAIRE
      );
    }
  }

  async filterQuestionnaire(
    filterParams: QuestionnaireInput,
    clientId?: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      let [error, questionnaire] =
        await this.questionnaireRepository.getDetailQuestionnaire(filterParams);

      if (error) {
        return [
          error,
          {
            code: 400,
            result: questionnaire,
            message: Constants.MESSAGE.FAILED_TO_GET_DETAIL_QUESTIONNAIRE,
          },
        ];
      }

      let recreateFlag = false;

      if (questionnaire?.length === 0) {
        const [, category] = await this.categoryRepository.getById(
          filterParams.category
        );
        await this.addQuestionnaire({
          category: filterParams.category,
          description_en: `${
            (category?.result as CategoryDocument)?.category_name
          } questionaire`,
          description_ar: `${
            (category?.result as CategoryDocument)?.category_name_ar
          } questionaire`,
          is_active: true,
        });
        recreateFlag = true;
      }

      if (recreateFlag) {
        [error, questionnaire] =
          await this.questionnaireRepository.getDetailQuestionnaire(
            filterParams
          );
      }

      if (clientId !== 'admin-web') {
        questionnaire[0].questions = this.customBatteryQuestions(
          questionnaire[0].questions
        );
      }

      return [
        false,
        {
          code: 200,
          result: questionnaire,
          message: Constants.MESSAGE.QUESTIONNAIRE_GET_SUCCESS,
        },
      ];
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_DETAIL_QUESTIONNAIRE,
        exception.message
      );
    }
  }

  async deleteQuestionnaire(id: any) {
    try {
      return await this.questionnaireRepository.deleteQuestionnaire(id);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_QUESTIONNAIRE,
          exception.message
        );
    }
  }

  async addQuestionnaire(
    obj: QuestionnaireInput
  ): Promise<[boolean, QuestionnaireDocument | string]> {
    try {
      if (!obj.category && !obj.brand && !obj.device_model) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS;
        throw this.error;
      }
      const [error, result] =
        await this.questionnaireRepository.addQuestionnaire(obj);
      return [error, result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_QUESTIONNAIRE,
          exception.message
        );
    }
  }

  async updateQuestionnaire(
    questionnaireId: string,
    obj: QuestionnaireInput
  ): Promise<[boolean, QuestionnaireDocument | string]> {
    try {
      const [error, result] =
        await this.questionnaireRepository.updateQuestionnaire(
          questionnaireId,
          obj
        );
      return [error, result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_ADD_QUESTIONNAIRE,
        exception.message
      );
    }
  }

  async addQuestion(
    obj: QuestionInput
  ): Promise<[boolean, QuestionDocument | string]> {
    try {
      const [error, result] =
        await this.questionnaireRepository.addQuestionOfQuestionnaire(obj);
      return [error, result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_QUESTIONNAIRE,
          exception.message
        );
    }
  }

  async updateQuestion(
    obj: QuestionUpdateInput,
    questionnaireId: string
  ): Promise<[boolean, QuestionDocument | string]> {
    try {
      const [error, result] =
        await this.questionnaireRepository.updateQuestionOfQuestionnaire(
          obj,
          questionnaireId
        );
      return [error, result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_QUESTIONNAIRE,
          exception.message
        );
      }
    }
  }

  async removeQuestion(questionId: string) {
    try {
      return await this.questionnaireRepository.removeQuestion(questionId);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REMOVE_QUESTION,
          exception.message
        );
    }
  }

  async removeAllQuestionnaire() {
    const session = await mongoose.startSession();
    try {
      // start transaction
      session.startTransaction();
      await this.productRepository.resetResponseProduct(session);
      await this.questionnaireRepository.removeAllQuestionnaire(session);

      await session.commitTransaction();
      session.endSession();
      return [false, 'Done reset'];
    } catch (exception) {
      await session.abortTransaction();
      session.endSession();
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REMOVE_QUESTION,
          exception.message
        );
    }
  }
}
