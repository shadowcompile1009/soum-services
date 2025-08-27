import { Types } from 'mongoose';
import { QuestionnaireRepository } from '../repositories/questionnaireRepository';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { AnswerDocument, AnswerInput } from '../models/Answer';
import { ChoiceInput } from '../models/Choice';
import { QuestionDocument } from '../models/Question';
import { QuestionRepository } from '../repositories/questionRepository';
import { QuestionnaireDocument } from '../models/Questionnaire';

@Service()
export class QuestionService {
  constructor(
    public questionRepository: QuestionRepository,
    public questionnaireRepository: QuestionnaireRepository
  ) {}

  async getQuestionDetail(
    questionId: string
  ): Promise<
    [
      boolean,
      { code: number; result: string | QuestionDocument; message?: string }
    ]
  > {
    try {
      const [error, question] =
        await this.questionRepository.getQuestionDetailById(questionId);
      return [error, question];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_ANSWER,
          exception.message
        );
      }
    }
  }

  async addAnswer(obj: AnswerInput): Promise<
    [
      boolean,
      {
        code: number;
        result: string | AnswerDocument;
        questionnaire?: any;
        message?: string;
      }
    ]
  > {
    try {
      const [error, resQuestion] =
        await this.questionRepository.getQuestionById(obj.question_id);
      if (error) {
        return [
          error,
          { code: resQuestion.code, result: resQuestion.result as string },
        ];
      }
      const [, questionnaire] = await this.questionnaireRepository.getById(
        (resQuestion.result as QuestionDocument).questionnaire_id
      );
      const question = resQuestion.result as QuestionDocument;
      if (question?.type === 'dropdown' || question?.type === 'mcqs') {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.ANSWER_NOT_FOR_QUESTION_TYPE_DROPDOWN_MCQ,
          },
        ];
      }

      const [addErr, addResult] = await this.questionRepository.addAnswer(obj);
      return [
        addErr,
        {
          ...addResult,
          ...{ questionnaire: questionnaire as QuestionnaireDocument },
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_ANSWER,
          exception.message
        );
      }
    }
  }

  async updateAnswer(obj: AnswerInput): Promise<
    [
      boolean,
      {
        code: number;
        result: string | AnswerDocument;
        questionnaire?: any;
        message?: string;
      }
    ]
  > {
    try {
      const [error, resQuestion] =
        await this.questionRepository.getQuestionById(obj.question_id);
      if (error) {
        return [
          error,
          { code: resQuestion.code, result: resQuestion.result as string },
        ];
      }

      const [, questionnaire] = await this.questionnaireRepository.getById(
        (resQuestion.result as QuestionDocument).questionnaire_id
      );
      const question = resQuestion.result as QuestionDocument;
      if (question?.type === 'choice') {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: null,
            message:
              Constants.MESSAGE.ANSWER_NOT_FOR_QUESTION_TYPE_DROPDOWN_MCQ,
          },
        ];
      }
      const [updateErr, updateResult] =
        await this.questionRepository.updateAnswer(obj);

      return [
        updateErr,
        {
          ...updateResult,
          ...{ questionnaire: questionnaire as QuestionnaireDocument },
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_ANSWER,
          exception.message
        );
      }
    }
  }

  async removeAnswer(
    questionId: string,
    answerId: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: string | AnswerDocument;
        questionnaire?: any;
        message?: string;
      }
    ]
  > {
    try {
      const errors: string[] = [];
      if (!Types.ObjectId.isValid(questionId)) {
        errors.push('question id is not a valid object id');
      }
      if (!Types.ObjectId.isValid(answerId)) {
        errors.push('answer id is not a valid object id');
      }

      if (errors.length > 0) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: null,
            message: errors.join(','),
          },
        ];
      }

      const [error, resQuestion] =
        await this.questionRepository.getQuestionById(questionId);
      if (error) {
        return [
          error,
          { code: resQuestion.code, result: resQuestion.result as string },
        ];
      }

      const [, questionnaire] = await this.questionnaireRepository.getById(
        (resQuestion.result as QuestionDocument).questionnaire_id
      );
      const [delError, delResult] = await this.questionRepository.removeAnswer(
        questionId,
        answerId
      );

      return [
        delError,
        {
          ...delResult,
          ...{ questionnaire: questionnaire as QuestionnaireDocument },
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_ANSWER,
          exception.message
        );
      }
    }
  }

  async addChoice(obj: ChoiceInput): Promise<
    [
      boolean,
      {
        code: number;
        result: string | ChoiceInput;
        questionnaire?: any;
        message?: string;
      }
    ]
  > {
    try {
      const [error, resQuestion] =
        await this.questionRepository.getQuestionById(obj.question_id);
      if (error) {
        return [
          error,
          { code: resQuestion.code, result: resQuestion.result as string },
        ];
      }
      const [, questionnaire] = await this.questionnaireRepository.getById(
        (resQuestion.result as QuestionDocument).questionnaire_id
      );
      const question = resQuestion.result as QuestionDocument;
      if (question?.type === 'yes-no') {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: null,
            message: Constants.MESSAGE.CHOICE_NOT_FOR_QUESTION_TYPE_YES_NO,
          },
        ];
      }

      const [addErr, addResult] = await this.questionRepository.addChoiceAnswer(
        obj
      );

      return [
        addErr,
        {
          ...addResult,
          ...{ questionnaire: questionnaire as QuestionnaireDocument },
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_ANSWER,
          exception.message
        );
      }
    }
  }

  async updateChoice(obj: ChoiceInput): Promise<
    [
      boolean,
      {
        code: number;
        result: string | ChoiceInput;
        questionnaire?: any;
        message?: string;
      }
    ]
  > {
    try {
      const [error, resQuestion] =
        await this.questionRepository.getQuestionById(obj.question_id);
      if (error) {
        return [
          error,
          { code: resQuestion.code, result: resQuestion.result as string },
        ];
      }

      const [, questionnaire] = await this.questionnaireRepository.getById(
        (resQuestion.result as QuestionDocument).questionnaire_id
      );
      const question = resQuestion.result as QuestionDocument;
      if (question?.type === 'yes-no') {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: null,
            message: Constants.MESSAGE.CHOICE_NOT_FOR_QUESTION_TYPE_YES_NO,
          },
        ];
      }
      const [updateErr, updateResult] =
        await this.questionRepository.updateChoiceAnswer(obj);

      return [
        updateErr,
        {
          ...updateResult,
          ...{ questionnaire: questionnaire as QuestionnaireDocument },
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_ANSWER,
          exception.message
        );
      }
    }
  }

  async removeChoice(
    questionId: string,
    choiceId: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: string | ChoiceInput;
        questionnaire?: any;
        message?: string;
      }
    ]
  > {
    try {
      const errors: string[] = [];
      if (!Types.ObjectId.isValid(questionId)) {
        errors.push('question id is not a valid object id');
      }
      if (!Types.ObjectId.isValid(choiceId)) {
        errors.push('choice id is not a valid object id');
      }

      if (errors.length > 0) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: null,
            message: errors.join(','),
          },
        ];
      }

      const [error, resQuestion] =
        await this.questionRepository.getQuestionById(questionId);
      if (error) {
        return [
          error,
          { code: resQuestion.code, result: resQuestion.result as string },
        ];
      }

      const [, questionnaire] = await this.questionnaireRepository.getById(
        (resQuestion.result as QuestionDocument).questionnaire_id
      );
      const [delError, delResult] =
        await this.questionRepository.removeChoiceAnswer(questionId, choiceId);

      return [
        delError,
        {
          ...delResult,
          ...{ questionnaire: questionnaire as QuestionnaireDocument },
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REMOVE_CHOICE,
          exception.message
        );
      }
    }
  }
}
