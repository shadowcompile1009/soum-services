import { Request, Response, Router } from 'express';
import { body, header, param } from 'express-validator';
import { Container } from 'typedi';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { ProductFilterDto } from '../../dto/product/ProductFilterDto';
import { ReportingService } from '../../services/reportingService';
import { SearchService } from '../../services/searchService';
import { SettingService } from '../../services/settingService';
import IController from './IController';

export class SearchController implements IController {
  path = 'search/';
  router: Router;
  searchService: SearchService;
  settingService: SettingService;
  reportingService: ReportingService;

  constructor(router: Router) {
    this.router = router;
    this.searchService = Container.get(SearchService);
    this.settingService = Container.get(SettingService);
    this.reportingService = Container.get(ReportingService);
  }

  initializeRoutes() {
    this.router.get('/sync', this.syncAllProducts);
    this.router.post(
      '/sync/product',
      [
        body('productIds')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.EMPTY_PRODUCTS),
        body('productIds')
          .isString()
          .withMessage(
            'productIds' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        header('client-id').notEmpty().equals('api-v1'),
      ],
      this.addProduct
    );
    this.router.delete(
      '/sync/product/:productId',
      [
        param('productId')
          .isString()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        header('client-id').notEmpty().equals('api-v1'),
      ],
      this.deleteProduct
    );
    this.router.delete('/sync/cron/product', this.deleteProduct);
  }

  addProduct = async (req: Request, res: Response) => {
    const { productIds } = req.body || {};
    try {
      const response = await this.searchService.addProducts(productIds);
      if (productIds) {
        return res.sendOk(
          response,
          Constants.MESSAGE.SUCCESSFULLY_ADDED_NEW_PRODUCTS_TO_TYPESENSE
        );
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_NEW_PRODUCTS_TO_TYPESENSE,
            Constants.MESSAGE.FAILED_TO_ADD_NEW_PRODUCTS_TO_TYPESENSE
          )
        );
      }
    } catch (exception) {
      const errorMessage =
        exception instanceof ErrorResponseDto
          ? Constants.MESSAGE.FAILED_TO_ADD_NEW_PRODUCTS_TO_TYPESENSE
          : exception.message;

      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_NEW_PRODUCTS_TO_TYPESENSE,
          errorMessage
        )
      );
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;

    const productIds = productId ? [productId] : [];

    try {
      const response = await this.searchService.deleteOneOrManyProducts(
        productIds
      );

      if (productIds.length === 0) {
        const date = new Date();
        const currentMinute = date.getMinutes();
        if (
          currentMinute === 15 ||
          currentMinute === 30 ||
          currentMinute === 45 ||
          currentMinute === 0
        ) {
          this.searchService.cleanUp();
        }
      }

      return res.sendOk(
        response,
        Constants.MESSAGE.SUCCESSFULLY_DELETED_PRODUCTS_TO_TYPESENSE
      );
    } catch (exception) {
      const errorMessage =
        exception instanceof ErrorResponseDto
          ? Constants.MESSAGE.FAILED_TO_DELETE_PRODUCTS_TO_TYPESENSE
          : exception.message;

      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_DELETE_PRODUCTS_FROM_TYPESENSE,
          errorMessage
        )
      );
    }
  };
  syncAllProducts = async (req: Request, res: Response) => {
    try {
      const filter = {
        size: Math.min(+req.query.size || 100),
      } as ProductFilterDto;
      const data = await this.searchService.getSyncData(filter);
      return res.sendOk(
        data,
        Constants.MESSAGE.SUCCESSFULLY_SYNCED_PRODUCTS_TO_TYPESENSE
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SYNC_PRODUCTS_TO_TYPESENSE,
            Constants.MESSAGE.FAILED_TO_SYNC_PRODUCTS_TO_TYPESENSE
          )
        );
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SYNC_PRODUCTS_TO_TYPESENSE,
            exception.message
          )
        );
      }
    }
  };
  mappingToUpdateProductPriceRequest(req: Request) {
    try {
      const filePath = (req.file as any)?.key || '';
      const csvFile =
        filePath !== ''
          ? process.env.IMAGES_AWS_S3_ENDPOINT_CDN +
            '/' +
            filePath.bucket.split('/')[1] +
            '/' +
            filePath.key
          : filePath;
      return csvFile;
    } catch (exception) {
      throw exception;
    }
  }
}
