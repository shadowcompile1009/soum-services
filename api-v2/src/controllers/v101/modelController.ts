import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { query, param, validationResult } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { ModelService } from '../../services/modelService';
import IController from './IController';

export class ModelController implements IController {
  path = 'model/';
  router: Router;
  modelService: ModelService;

  constructor(router: Router) {
    this.router = router;
    this.modelService = Container.get(ModelService);
  }
  initializeRoutes() {
    this.router.get(
      '/summary/:categoryId',
      this.validateModelSummaryInput(),
      this.getModelsSummary
    );
  }

  getModelsSummary = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
            JSON.stringify(errors.array())
          )
        );
      }
      const categoryId = req.params.categoryId;
      const brands = req.query.brands as string;
      const models = req.query.models as string;
      const priceMax = +req.query.priceMax;
      const priceMin = +req.query.priceMin;
      const page = +req.params.page || 1;
      const size = +req.query.size || 4;
      const result = await this.modelService.getModelsSummary(
        categoryId,
        brands?.split(','),
        models?.split(','),
        priceMin,
        priceMax,
        page,
        size
      );
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MODEL,
            exception.message
          )
        );
      }
    }
  };

  validateModelSummaryInput() {
    return [
      param('categoryId')
        .trim()
        .notEmpty()
        .withMessage(
          'categoryId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
        ),
      query('brands')
        .isString()
        .optional()
        .withMessage(
          'brands' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      query('models')
        .isString()
        .optional()
        .withMessage(
          'models' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      query('priceMax')
        .isNumeric()
        .optional()
        .withMessage(
          'priceMax' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
      query('priceMin')
        .isNumeric()
        .optional()
        .withMessage(
          'priceMin' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
    ];
  }
}
