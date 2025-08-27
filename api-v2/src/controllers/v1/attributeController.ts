import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { check, body, validationResult } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { AttributeService } from '../../services/attributeService';
import IController from './IController';
import { AuthGuardDM } from '../../middleware/authGuardDM';
import { CreateAttributeDto } from '../../dto/attribute/CreateAttributeDto';
import { UpdateAttributeDto } from '../../dto/attribute/UpdateAttributeDto';
import { CreateAttributeResponse } from '../../grpc/proto/category/CreateAttributeResponse';

export class AttributeController implements IController {
  path = 'attribute/';
  router: Router;
  attributeService: AttributeService;

  constructor(router: Router) {
    this.router = router;
    this.attributeService = Container.get(AttributeService);
  }

  initializeRoutes() {
    this.router.get('/', AuthGuardDM, this.getAllAttributes);
    this.router.post(
      '/',
      AuthGuardDM,
      [
        body('nameAr')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ATTRIBUTE_NAME),
        body('nameEn')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ATTRIBUTE_NAME),
        body('options')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ATTRIBUTE_NAME),
      ],
      this.createAttribute
    );
    this.router.get(
      '/:id',
      AuthGuardDM,
      check('id')
        .notEmpty()
        .withMessage(Constants.VALIDATE_REQUEST_MSG.ATTRIBUTE_ID),
      this.getAttribute
    );
    this.router.put(
      '/:id',
      AuthGuardDM,
      [
        check('id')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ATTRIBUTE_ID),
        body('nameAr')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ATTRIBUTE_NAME),
        body('nameEn')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ATTRIBUTE_NAME),
        body('options')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ATTRIBUTE_OPTIONS),
      ],
      this.updateAttribute
    );
    this.router.delete(
      '/:id',
      AuthGuardDM,
      [
        check('id')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ATTRIBUTE_ID),
      ],
      this.deleteAttribute
    );
  }

  getAllAttributes = async (req: Request, res: Response) => {
    try {
      const like: any = req.query.like || '';
      const page = Number(req.query.page) || 1;
      const size = Number(req.query.size) || 100;
      const optionsIncluded =
        req.query.optionsIncluded === 'true' ? true : false;
      const attributes = await this.attributeService.getAllAttributes(
        like,
        optionsIncluded,
        page,
        size
      );

      return res.sendOk(
        attributes,
        Constants.MESSAGE.GET_FILTERED_ATTRIBUTE_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ATTRIBUTE,
            exception.message
          )
        );
      }
    }
  };

  getAttribute = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ATTRIBUTE,
            JSON.stringify(errors.array())
          )
        );
      }
      const id = req.params.id || null;
      const result = await this.attributeService.getAttribute(id);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ATTRIBUTE,
            exception.message
          )
        );
      }
    }
  };

  createAttribute = async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_ATTRIBUTE,
            JSON.stringify(errors.array())
          )
        );
      }
      const objAttribute = req.body as CreateAttributeDto;
      const attribute: CreateAttributeResponse =
        await this.attributeService.createAttribute(objAttribute);

      return res.sendCreated(
        attribute,
        Constants.MESSAGE.ATTRIBUTE_CREATE_SUCCESS
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CREATE_ATTRIBUTE
          )
        );
      }
    }
  };

  updateAttribute = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATED_ATTRIBUTE,
            JSON.stringify(errors.array())
          )
        );
      }
      req.body.options.map((option: any) => {
        if (
          !option.nameAr ||
          option.nameAr.length <= 0 ||
          !option.nameEn ||
          option.nameEn.length <= 0
        ) {
          throw new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATED_ATTRIBUTE
          );
        }
      });
      const objAttribute = req.body as UpdateAttributeDto;
      objAttribute.id = req.params.id;
      const result = await this.attributeService.updateAttribute(objAttribute);
      res.sendOk(result, 'Attribute updated!');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATED_ATTRIBUTE,
            exception.message
          )
        );
      }
    }
  };

  deleteAttribute = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATED_ATTRIBUTE,
            JSON.stringify(errors.array())
          )
        );
      }
      const attributeId = req.params.id;
      const result = await this.attributeService.deleteAttribute(attributeId);
      res.sendOk(result, 'Attribute deleted');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATED_ATTRIBUTE,
            exception.message
          )
        );
      }
    }
  };
}
