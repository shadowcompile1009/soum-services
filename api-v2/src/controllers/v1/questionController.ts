import { Request, Response, Router } from 'express';
import _isEmpty from 'lodash/isEmpty';
import { Container } from 'typedi';
import { param, body, validationResult } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import {
  deleteCache,
  deleteWithPattern,
  getCache,
  setCache,
} from '../../libs/redis';
import { AuthGuard } from '../../middleware/authGuard';
import { AnswerInput } from '../../models/Answer';
import { ChoiceInput } from '../../models/Choice';
import { QuestionService } from '../../services/questionService';
import { isAdminAccess } from '../../util/authentication';
import IController from './IController';

export class QuestionController implements IController {
  path = 'question/';
  router: Router;
  questionService: QuestionService;

  constructor(router: Router) {
    this.router = router;
    this.questionService = Container.get(QuestionService);
  }
  initializeRoutes() {
    this.router.get(
      '/:questionId',
      [
        param('questionId')
          .trim()
          .notEmpty()
          .withMessage(
            'questionId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getQuestion
    );
    this.router.post(
      '/:questionId/answer',
      this.validateAddAnswerInput(),
      this.addAnswer
    );
    this.router.put(
      '/:questionId/answer/:answerId',
      this.validateUpdateAnswerInput(),
      this.updateAnswer
    );
    this.router.delete(
      '/:questionId/answer/:answerId',
      [
        AuthGuard,
        param('questionId')
          .trim()
          .notEmpty()
          .withMessage(
            'questionId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        param('answerId')
          .trim()
          .notEmpty()
          .withMessage(
            'answerId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.deleteAnswer
    );
    this.router.post(
      '/:questionId/choice',
      this.validateAddChoiceInput(),
      this.addChoice
    );
    this.router.put(
      '/:questionId/choice/:choiceId',
      this.validateUpdateChoiceInput(),
      this.updateChoice
    );
    this.router.delete(
      '/:questionId/choice/:choiceId',
      [
        AuthGuard,
        param('questionId')
          .trim()
          .notEmpty()
          .withMessage(
            'questionId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        param('choiceId')
          .trim()
          .notEmpty()
          .withMessage(
            'choiceId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.deleteChoice
    );
  }

  getQuestion = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_QUESTION,
            JSON.stringify(errors.array())
          )
        );
      }
      const questionId = req.params.questionId;
      const cacheQuestion = await getCache(`question_${questionId}`);
      if (_isEmpty(cacheQuestion)) {
        const [error, result] = await this.questionService.getQuestionDetail(
          questionId
        );
        if (error) {
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.NOT_FOUND,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_GET_QUESTION,
              result.result as string
            )
          );
        } else {
          await setCache(`question_${questionId}`, result);
          res.sendOk(result, Constants.MESSAGE.QUESTION_GET_SUCCESS);
        }
      } else {
        res.sendOk(cacheQuestion, Constants.MESSAGE.QUESTION_GET_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_QUESTION,
            exception.message
          )
        );
      }
    }
  };

  validateAddAnswerInput() {
    return [
      AuthGuard,
      param('questionId')
        .trim()
        .notEmpty()
        .withMessage(
          'questionId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('answer_en')
        .trim()
        .isString()
        .withMessage(
          'answer_en' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('answer_ar')
        .trim()
        .isString()
        .withMessage(
          'answer_ar' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('icon')
        .trim()
        .isString()
        .withMessage(
          'icon' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('score')
        .isNumeric()
        .withMessage(
          'score' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
      body('sub_choices')
        .isArray()
        .optional()
        .withMessage(
          'sub_choices' + Constants.VALIDATE_REQUEST_MSG.INVALID_ARRAY_TYPE
        ),
    ];
  }

  addAnswer = async (req: Request, res: Response) => {
    try {
      if (!isAdminAccess(req)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            Constants.MESSAGE.ALLOW_ONLY_ADMIN_ACCESS
          )
        );
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_ANSWER,
            JSON.stringify(errors.array())
          )
        );
      }

      const answer: AnswerInput = {
        question_id: req.params.questionId,
        answer_en: req.body.answer_en,
        answer_ar: req.body.answer_ar,
        icon: req.body.icon,
        score: req.body.score,
        sub_choices: req.body.sub_choices,
      };
      const [error, result] = await this.questionService.addAnswer(answer);
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            result.code,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_ANSWER,
            result.result as string
          )
        );
      } else {
        deleteCache([`question_${answer.question_id}`]);
        deleteWithPattern(`filter_questionnaires_*`);
        res.sendCreated(result, Constants.MESSAGE.ANSWER_CREATED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_ANSWER,
            exception.message
          )
        );
      }
    }
  };

  validateUpdateAnswerInput() {
    return [
      AuthGuard,
      param('questionId')
        .trim()
        .notEmpty()
        .withMessage(
          'questionId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      param('answerId')
        .trim()
        .notEmpty()
        .withMessage(
          'answerId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('answer_en')
        .trim()
        .isString()
        .withMessage(
          'answer_en' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('answer_ar')
        .trim()
        .isString()
        .withMessage(
          'answer_ar' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('icon')
        .trim()
        .isString()
        .withMessage(
          'icon' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('score')
        .isNumeric()
        .withMessage(
          'score' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
      body('sub_choices')
        .isArray()
        .optional()
        .withMessage(
          'sub_choices' + Constants.VALIDATE_REQUEST_MSG.INVALID_ARRAY_TYPE
        ),
    ];
  }
  updateAnswer = async (req: Request, res: Response) => {
    try {
      if (!isAdminAccess(req)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            Constants.MESSAGE.ALLOW_ONLY_ADMIN_ACCESS
          )
        );
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_ANSWER,
            JSON.stringify(errors.array())
          )
        );
      }

      const answer: AnswerInput = {
        question_id: req.params.questionId,
        answer_id: req.params.answerId,
        answer_en: req.body.answer_en,
        answer_ar: req.body.answer_ar,
        icon: req.body.icon,
        score: req.body.score,
        sub_choices: req.body.sub_choices,
      };
      const [error, result] = await this.questionService.updateAnswer(answer);
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_ANSWER,
            result.message
          )
        );
      } else {
        deleteCache([`question_${answer.question_id}`]);
        deleteWithPattern(`filter_questionnaires_*`);
        res.sendOk(result, Constants.MESSAGE.ANSWER_UPDATED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_ANSWER,
            exception.message
          )
        );
      }
    }
  };

  deleteAnswer = async (req: Request, res: Response) => {
    try {
      if (!isAdminAccess(req)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            Constants.MESSAGE.ALLOW_ONLY_ADMIN_ACCESS
          )
        );
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_ANSWER,
            JSON.stringify(errors.array())
          )
        );
      }
      const questionId = req.params.questionId;
      const answerId = req.params.answerId;
      const [error, result] = await this.questionService.removeAnswer(
        questionId,
        answerId
      );
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_ANSWER,
            result.message
          )
        );
      } else {
        deleteCache([`question_${questionId}`]);
        deleteWithPattern(`filter_questionnaires_*`);
        res.sendOk(result, Constants.MESSAGE.ANSWER_REMOVED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_ANSWER,
            exception.message
          )
        );
      }
    }
  };
  validateAddChoiceInput() {
    return [
      AuthGuard,
      param('questionId')
        .trim()
        .notEmpty()
        .withMessage(
          'questionId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('option_en')
        .trim()
        .isString()
        .withMessage(
          'option_en' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('option_ar')
        .trim()
        .isString()
        .withMessage(
          'option_ar' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('icon')
        .trim()
        .isString()
        .withMessage(
          'icon' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('score')
        .isNumeric()
        .withMessage(
          'score' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
    ];
  }
  addChoice = async (req: Request, res: Response) => {
    try {
      if (!isAdminAccess(req)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            Constants.MESSAGE.ALLOW_ONLY_ADMIN_ACCESS
          )
        );
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_CHOICE,
            JSON.stringify(errors.array())
          )
        );
      }
      const choice: ChoiceInput = {
        question_id: req.params.questionId,
        option_ar: req.body.option_ar,
        option_en: req.body.option_en,
        icon: req.body.icon,
        score: req.body.score,
      };
      const [error, result] = await this.questionService.addChoice(choice);
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_CHOICE,
            result.message
          )
        );
      } else {
        deleteCache([`question_${choice.question_id}`]);
        deleteWithPattern(`filter_questionnaires_*`);
        res.sendCreated(result, Constants.MESSAGE.CHOICE_CREATED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_CHOICE,
            exception.message
          )
        );
      }
    }
  };

  validateUpdateChoiceInput() {
    return [
      AuthGuard,
      param('questionId')
        .trim()
        .notEmpty()
        .withMessage(
          'questionId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      param('choiceId')
        .trim()
        .notEmpty()
        .withMessage(
          'choiceId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('option_en')
        .trim()
        .isString()
        .withMessage(
          'option_en' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('option_ar')
        .trim()
        .isString()
        .withMessage(
          'option_ar' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('icon')
        .trim()
        .isString()
        .withMessage(
          'icon' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('score')
        .isNumeric()
        .withMessage(
          'score' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
    ];
  }
  updateChoice = async (req: Request, res: Response) => {
    try {
      if (!isAdminAccess(req)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            Constants.MESSAGE.ALLOW_ONLY_ADMIN_ACCESS
          )
        );
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_CHOICE,
            JSON.stringify(errors.array())
          )
        );
      }

      const choice: ChoiceInput = {
        question_id: req.params.questionId,
        choice_id: req.params.choiceId,
        option_en: req.body.option_en,
        option_ar: req.body.option_ar,
        icon: req.body.icon,
        score: req.body.score,
      };
      const [error, result] = await this.questionService.updateChoice(choice);
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_CHOICE,
            result.message
          )
        );
      } else {
        deleteCache([`question_${choice.question_id}`]);
        deleteWithPattern(`filter_questionnaires_*`);
        res.sendOk(result, Constants.MESSAGE.CHOICE_UPDATED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_CHOICE,
            exception.message
          )
        );
      }
    }
  };

  deleteChoice = async (req: Request, res: Response) => {
    try {
      if (!isAdminAccess(req)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            Constants.MESSAGE.ALLOW_ONLY_ADMIN_ACCESS
          )
        );
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_CHOICE,
            JSON.stringify(errors.array())
          )
        );
      }

      const questionId = req.params.questionId;
      const choiceId = req.params.choiceId;
      const [error, result] = await this.questionService.removeChoice(
        questionId,
        choiceId
      );
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_CHOICE,
            result.message
          )
        );
      } else {
        deleteCache([`question_${questionId}`]);
        deleteWithPattern(`filter_questionnaires_*`);
        res.sendOk(result, Constants.MESSAGE.CHOICE_REMOVED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_CHOICE,
            exception.message
          )
        );
      }
    }
  };
}
