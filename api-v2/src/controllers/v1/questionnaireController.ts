import { Request, Response, Router } from 'express';
import _isEmpty from 'lodash/isEmpty';
import multer from 'multer';
import { Container } from 'typedi';
import { param, body, validationResult } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { upload } from '../../libs/multer';
import {
  deleteCache,
  deleteWithPattern,
  getCache,
  setCache,
} from '../../libs/redis';
import { AuthGuard } from '../../middleware/authGuard';
import { QuestionInput, QuestionUpdateInput } from '../../models/Question';
import {
  QuestionnaireDocument,
  QuestionnaireInput,
} from '../../models/Questionnaire';
import { QuestionnaireService } from '../../services/questionnaireService';
import { isAdminAccess } from '../../util/authentication';
import IController from './IController';
import { _get } from '../../util/common';

const ModelUpload = upload('/models').single('model_icon');

export class QuestionnaireController implements IController {
  path = 'questionnaire/';
  router: Router;
  questionnaireService: QuestionnaireService;
  constructor(router: Router) {
    this.router = router;
    this.questionnaireService = Container.get(QuestionnaireService);
  }

  initializeRoutes() {
    this.router.get('/', this.getAllQuestionnaires);
    // this.router.get('/import-existing-questions', AuthGuard, this.importQuestion);
    this.router.get(
      '/:questionnaireId',
      [
        param('questionnaireId')
          .trim()
          .notEmpty()
          .withMessage(
            'questionnaireId' +
              Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getQuestionnaire
    );
    this.router.post(
      '/filter',
      [
        body('brand_id')
          .trim()
          .isString()
          .optional()
          .withMessage(
            'brand_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('category_id')
          .trim()
          .isString()
          .optional()
          .withMessage(
            'category_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('model_id')
          .trim()
          .isString()
          .optional()
          .withMessage(
            'model_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.filterQuestionnaire
    );
    this.router.post(
      '/',
      this.validateAddQuestionnaireInput(),
      this.addQuestionnaire
    );
    this.router.put(
      '/:questionnaireId',
      this.validateUpdateQuestionnaireInput(),
      this.updateQuestionnaire
    );
    this.router.delete(
      '/:questionnaireId',
      [
        AuthGuard,
        param('questionnaireId')
          .trim()
          .notEmpty()
          .withMessage(
            'questionnaireId' +
              Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.deleteQuestionnaire
    );
    this.router.post(
      '/:questionnaireId/questions',
      this.validateAddQuestionInput(),
      this.addQuestion
    );
    this.router.put(
      '/:questionnaireId/question/:questionId',
      this.validateUpdateQuestionInput(),
      this.updateQuestion
    );
    this.router.delete(
      '/:questionnaireId/question/:questionId',
      [
        AuthGuard,
        param('questionnaireId')
          .trim()
          .notEmpty()
          .withMessage(
            'questionnaireId' +
              Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        param('questionId')
          .trim()
          .notEmpty()
          .withMessage(
            'questionId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.deleteQuestion
    );
    this.router.post('/single/upload', AuthGuard, this.uploadIllustration);
  }

  getAllQuestionnaires = async (req: Request, res: Response) => {
    try {
      const cacheQuestionnaires: QuestionnaireDocument[] | string =
        await getCache<QuestionnaireDocument[]>('all_questionnaires');
      if (_isEmpty(cacheQuestionnaires)) {
        const [err, result] =
          await this.questionnaireService.getAllQuestionnaires();
        if (err) {
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
              result.toString()
            )
          );
        } else {
          await setCache('all_questionnaires', result);
          res.sendOk(result, Constants.MESSAGE.QUESTIONNAIRE_GET_SUCCESS);
        }
      } else {
        res.sendOk(
          cacheQuestionnaires,
          Constants.MESSAGE.QUESTIONNAIRE_GET_SUCCESS
        );
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            exception.message
          )
        );
      }
    }
  };

  getQuestionnaire = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_QUESTIONNAIRE,
            JSON.stringify(errors.array())
          )
        );
      }
      const questionnaireId = req.params.questionnaireId;
      const cacheQuestionnaire = await getCache<QuestionnaireDocument>(
        `questionnaire_${questionnaireId}`
      );
      if (_isEmpty(cacheQuestionnaire)) {
        const [err, questionnaireResult] =
          await this.questionnaireService.getQuestionnaire(questionnaireId);
        if (err) {
          res.sendError(
            new ErrorResponseDto(
              questionnaireResult.code,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_GET_QUESTIONNAIRE,
              questionnaireResult.message
            )
          );
        } else {
          await setCache(
            `questionnaire_${questionnaireId}`,
            questionnaireResult
          );
          res.sendOk(
            questionnaireResult.result,
            Constants.MESSAGE.QUESTIONNAIRE_GET_SUCCESS
          );
        }
      } else {
        res.sendOk(
          cacheQuestionnaire,
          Constants.MESSAGE.QUESTIONNAIRE_GET_SUCCESS
        );
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_QUESTIONNAIRE,
            exception.message
          )
        );
      }
    }
  };

  filterQuestionnaire = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_QUESTIONNAIRE,
            JSON.stringify(errors.array())
          )
        );
      }
      const questionnaireParams: QuestionnaireInput = {
        brand: req.body.brand_id,
        category: req.body.category_id,
        device_model: req.body.model_id,
      };
      const clientId: string = _get(req.headers, 'client-id', '');

      const cacheKey = `filter_questionnaires_${Object.values({
        ...questionnaireParams,
        ...{ clientId },
      })
        .filter(Boolean)
        .join('_')}`;
      const cacheQuestionnaires: QuestionnaireDocument[] | string =
        await getCache(cacheKey);
      if (_isEmpty(cacheQuestionnaires)) {
        const [err, filterResult] =
          await this.questionnaireService.filterQuestionnaire(
            questionnaireParams,
            clientId
          );
        if (err) {
          res.sendError(
            new ErrorResponseDto(
              filterResult.code,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_GET_QUESTIONNAIRE,
              filterResult.message
            )
          );
        } else {
          await setCache(cacheKey, filterResult.result);
          res.sendOk(filterResult.result, filterResult.message);
        }
      } else {
        res.sendOk(
          cacheQuestionnaires,
          Constants.MESSAGE.QUESTIONNAIRE_GET_SUCCESS
        );
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_QUESTIONNAIRE,
            exception.message
          )
        );
      }
    }
  };

  validateAddQuestionnaireInput() {
    return [
      AuthGuard,
      body('brand_id')
        .trim()
        .isString()
        .withMessage(
          'brand_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('category_id')
        .trim()
        .isString()
        .withMessage(
          'category_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('model_id')
        .trim()
        .isString()
        .withMessage(
          'model_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('description_ar')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'description_ar' +
            Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('description_ar').default(''),
      body('description_en')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'description_en' +
            Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('description_en').default(''),
      body('is_active').toBoolean().optional(),
      body('is_active').default(true),
    ];
  }
  addQuestionnaire = async (req: Request, res: Response) => {
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
            Constants.ERROR_MAP.FAILED_TO_ADD_QUESTIONNAIRE,
            JSON.stringify(errors.array())
          )
        );
      }

      const reqData: QuestionnaireInput = {
        description_ar: req.body.description_ar || '',
        description_en: req.body.description_en || '',
        is_active: req.body.is_active || true,
        brand: req.body.brand_id || undefined,
        category: req.body.category_id || undefined,
        device_model: req.body.model_id || undefined,
      };
      const [error, result] = await this.questionnaireService.addQuestionnaire(
        reqData
      );
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_ERROR,
            result.toString()
          )
        );
      } else {
        deleteCache(['all_questionnaires']);
        deleteWithPattern('filter_questionnaires_*');
        res.sendCreated(
          result,
          Constants.MESSAGE.QUESTIONNAIRE_CREATED_SUCCESS
        );
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_QUESTIONNAIRE,
            exception.message
          )
        );
      }
    }
  };

  validateUpdateQuestionnaireInput() {
    return [
      AuthGuard,
      param('questionnaireId')
        .trim()
        .notEmpty()
        .withMessage(
          'questionnaireId' +
            Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('brand_id')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'brand_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('category_id')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'category_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('model_id')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'model_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('description_ar')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'description_ar' +
            Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('description_ar').default(''),
      body('description_en')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'description_en' +
            Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('description_en').default(''),
      body('is_active').toBoolean().optional(),
      body('is_active').default(true),
    ];
  }
  updateQuestionnaire = async (req: Request, res: Response) => {
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_QUESTION,
            JSON.stringify(errors.array())
          )
        );
      }

      const questionnaireId = req.params.questionnaireId;
      const reqData: QuestionnaireInput = {
        description_en: req.body.description_en || '',
        description_ar: req.body.description_ar || '',
        is_active: req.body.is_active || true,
        brand: req.body.brand_id || undefined,
        category: req.body.category_id || undefined,
        device_model: req.body.model_id || undefined,
      };
      const [error, result] =
        await this.questionnaireService.updateQuestionnaire(
          questionnaireId,
          reqData
        );
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTIONNAIRE_NOT_FOUND,
            result.toString()
          )
        );
      } else {
        deleteCache(['all_questionnaires']);
        deleteWithPattern('filter_questionnaires_*');
        res.sendOk(result, Constants.MESSAGE.QUESTIONNAIRE_UPDATED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_QUESTIONNAIRE,
            exception.message
          )
        );
      }
    }
  };

  deleteQuestionnaire = async (req: Request, res: Response) => {
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
            Constants.ERROR_MAP.FAILED_TO_REMOVE_QUESTIONNAIRE,
            JSON.stringify(errors.array())
          )
        );
      }

      const questionnaire_id = req.params.questionnaireId;
      const [error, result] =
        await this.questionnaireService.deleteQuestionnaire(questionnaire_id);
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            result.toString()
          )
        );
      } else {
        deleteCache(['all_questionnaires']);
        deleteWithPattern('filter_questionnaires_*');
        res.sendOk(result, Constants.MESSAGE.QUESTIONNAIRE_DELETED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_QUESTIONNAIRE,
            exception.message
          )
        );
      }
    }
  };

  validateAddQuestionInput() {
    return [
      AuthGuard,
      param('questionnaireId')
        .trim()
        .notEmpty()
        .withMessage(
          'questionnaireId' +
            Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('question_ar')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'question_ar' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('question_ar').default(''),
      body('question_en')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'question_en' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('question_en').default(''),
      body('type')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'type' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('type').default('yes-no'),
      body('order')
        .trim()
        .isNumeric()
        .optional()
        .withMessage(
          'order' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
      body('order').default(0),
      body('answers')
        .isArray()
        .optional()
        .withMessage(
          'answers' + Constants.VALIDATE_REQUEST_MSG.INVALID_ARRAY_TYPE
        ),
      body('answers').default([]),
      body('choices')
        .isArray()
        .optional()
        .withMessage(
          'choices' + Constants.VALIDATE_REQUEST_MSG.INVALID_ARRAY_TYPE
        ),
      body('choices').default([]),
    ];
  }
  addQuestion = async (req: Request, res: Response) => {
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
            Constants.ERROR_MAP.FAILED_TO_CREATE_QUESTION,
            JSON.stringify(errors.array())
          )
        );
      }

      const reqData: QuestionInput = {
        questionnaire_id: req.params.questionnaireId,
        question_ar: req.body.question_ar || '',
        question_en: req.body.question_en || '',
        type: req.body.type || 'yes-no',
        order: req.body.order || 0,
        answers: req.body.answers || [],
        choices: req.body.choices || [],
        is_mandatory: req.body?.is_mandatory || false,
        text_placeholder_ar: req.body?.text_placeholder_ar || '',
        text_placeholder_en: req.body?.text_placeholder_en || '',
        subtext_ar: req.body?.subtext_ar || '',
        subtext_en: req.body?.subtext_en || '',
        question_key: req.body?.question_key || '',
      };
      const [error, result] = await this.questionnaireService.addQuestion(
        reqData
      );
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_QUESTION,
            result.toString()
          )
        );
      } else {
        deleteCache([
          'all_questionnaires',
          `questionnaire_${reqData.questionnaire_id}`,
        ]);
        deleteWithPattern('filter_questionnaires_*');
        res.sendCreated(result, Constants.MESSAGE.QUESTION_CREATED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_QUESTION,
            exception.message
          )
        );
      }
    }
  };

  validateUpdateQuestionInput() {
    return [
      AuthGuard,
      param('questionId')
        .trim()
        .notEmpty()
        .withMessage(
          'questionId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('question_ar')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'question_ar' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('question_ar').default(''),
      body('question_en')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'question_en' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('question_en').default(''),
      body('type')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'type' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      body('type').default('yes-no'),
      body('order')
        .trim()
        .isNumeric()
        .optional()
        .withMessage(
          'order' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
      body('order').default(0),
      body('answers')
        .isArray()
        .optional()
        .withMessage(
          'answers' + Constants.VALIDATE_REQUEST_MSG.INVALID_ARRAY_TYPE
        ),
      body('answers').default([]),
      body('choices')
        .isArray()
        .optional()
        .withMessage(
          'choices' + Constants.VALIDATE_REQUEST_MSG.INVALID_ARRAY_TYPE
        ),
      body('choices').default([]),
    ];
  }
  updateQuestion = async (req: Request, res: Response) => {
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
            Constants.ERROR_MAP.FAILED_TO_UPDATE_QUESTION,
            JSON.stringify(errors.array())
          )
        );
      }

      const reqData: QuestionUpdateInput = {
        question_id: req.params.questionId,
        question_ar: req.body.question_ar,
        question_en: req.body.question_en,
        type: req.body.type,
        order: req.body.order,
        answers: req.body.answers,
        choices: req.body.choices,
        is_mandatory: req.body?.is_mandatory || false,
        text_placeholder_ar: req.body?.text_placeholder_ar || '',
        text_placeholder_en: req.body?.text_placeholder_en || '',
        subtext_ar: req.body?.subtext_ar || '',
        subtext_en: req.body?.subtext_en || '',
        question_key: req.body?.question_key || '',
      };
      const questionnaire_id = req.params.questionnaireId;
      const [error, result] = await this.questionnaireService.updateQuestion(
        reqData,
        questionnaire_id
      );
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            result.toString()
          )
        );
      } else {
        deleteCache([
          'all_questionnaires',
          `questionnaire_${questionnaire_id}`,
        ]);
        deleteWithPattern('filter_questionnaires_*');
        res.sendOk(result, Constants.MESSAGE.QUESTION_UPDATED_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_QUESTION,
            exception.message
          )
        );
      }
    }
  };

  deleteQuestion = async (req: Request, res: Response) => {
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
            Constants.ERROR_MAP.FAILED_TO_REMOVE_QUESTION,
            JSON.stringify(errors.array())
          )
        );
      }

      const questionId = req.params.questionId;
      const [error, result] = await this.questionnaireService.removeQuestion(
        questionId
      );
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.QUESTION_NOT_FOUND,
            result.toString()
          )
        );
      } else {
        // TODO: This one missing a case to remove questionnaire of this question
        deleteCache(['all_questionnaires']);
        deleteWithPattern('filter_questionnaires_*');
        res.sendOk(error, result.toString());
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_QUESTION,
            exception.message
          )
        );
      }
    }
  };

  uploadIllustration = async (req: Request, res: Response) => {
    try {
      ModelUpload(req, res, async (error: any) => {
        if (error instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.sendError(error);
        } else if (error) {
          // An unknown error occurred when uploading.
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPLOAD,
              error.message
            )
          );
        }
        let fileUrl = (req?.file as any)?.key;
        fileUrl =
          process.env.IMAGES_AWS_S3_ENDPOINT_CDN +
          '/' +
          (req?.file as any)?.bucket.split('/')[1] +
          '/' +
          fileUrl;

        res.sendOk(fileUrl, 'Done to upload image');
      });
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPLOAD,
          exception.message
        )
      );
    }
  };
}
