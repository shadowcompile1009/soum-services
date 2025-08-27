import { Request, Response, Router } from 'express';
import { body, check, query, validationResult } from 'express-validator';
import { Container } from 'typedi';
import { AuthGuard } from '../../middleware/authGuard';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { AddOnService } from '../../services/addOnService';
import IController from './IController';
import { ProductService } from '../../services/productService';
import { Cities } from '../../enums/Cities.Enum';

export class AddOnController implements IController {
  path = 'addon/';
  router: Router;
  addOnService: AddOnService;
  productService: ProductService;

  constructor(router: Router) {
    this.router = router;
    this.addOnService = Container.get(AddOnService);
    this.productService = Container.get(ProductService);
  }
  initializeRoutes() {
    // deprecated api - use api in addon microservice
    this.router.get('/', query('brandId'), query('productId'), this.getAddOns);
    // deprecated api - use api in addon microservice
    this.router.post(
      '/:productId/summary',
      AuthGuard,
      [
        check('productId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
        body('addOnIds')
          .isString()
          .withMessage(
            'addOnIds' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.addOnSummary
    );
  }
  getAddOns = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ADD_ONS,
            JSON.stringify(errors.array())
          )
        );
      }
      let brandId = req.query?.brandId?.toString() || null;
      const productId = req.query?.productId?.toString() || null;
      if (!brandId && !productId) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.BRAND_ID_AND_PRODUCT_ID_EMPTY,
            Constants.MESSAGE.BRAND_ID_AND_PRODUCT_ID_EMPTY
          )
        );
      }
      if (!brandId) {
        const product = await this.productService.getPreviewProductById(
          productId,
          null
        );
        if (
          product?.result?.seller_address?.city === Cities.RIYADH ||
          product?.result?.seller_address?.city === Cities.RIYADH_AR
        ) {
          brandId = product?.result?.brands?._id;
        }
      }
      if (!brandId) {
        return res.sendOk([], Constants.MESSAGE.GET_ADD_ONS_SUCCESSFUL);
      }
      const addOns = await this.addOnService.getAddOns(brandId);
      if (addOns.length === 0 || addOns === null) {
        return res.sendOk([], Constants.MESSAGE.GET_ADD_ONS_SUCCESSFUL);
      }
      return res.sendOk(addOns, Constants.MESSAGE.GET_ADD_ONS_SUCCESSFUL);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ADD_ONS,
            exception.message
          )
        );
      }
    }
  };
  addOnSummary = async (req: Request, res: Response) => {
    let addOnIds = req.body?.addOnIds || [];
    const productId = req.params.productId;
    if (typeof addOnIds === 'string') {
      addOnIds = addOnIds.split(',').map(id => id.trim());
    }

    try {
      const addOnsSummary = await this.addOnService.addOnSummary(
        productId,
        addOnIds
      );
      if (!addOnsSummary) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ADD_ONS,
            Constants.MESSAGE.FAILED_TO_GET_ADD_ON_SUMMARY
          )
        );
      }
      return res.sendOk(
        addOnsSummary,
        Constants.MESSAGE.GET_ADD_ONS_SUCCESSFUL
      );
    } catch (exception) {
      const errorMessage =
        exception instanceof ErrorResponseDto
          ? Constants.MESSAGE.FAILED_TO_GET_ADD_ON_SUMMARY
          : exception.message;

      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_ADD_ONS,
          errorMessage
        )
      );
    }
  };
}
