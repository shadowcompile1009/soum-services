/* eslint-disable max-len */
import { Request, Response, Router } from 'express';
import {
  body,
  check,
  header,
  param,
  query,
  validationResult,
} from 'express-validator';
import _isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose';
import multer from 'multer';
import { Container } from 'typedi';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { PaginationDto } from '../../dto/paginationDto';
import { ProductFilterDto } from '../../dto/product/ProductFilterDto';
import { GetProductSummaryInputDto } from '../../dto/product/ProductSummaryInputDto';
import { ProductUpdateDto } from '../../dto/product/ProductUpdateDto';
import { ListingSource } from '../../enums/ListingSource';
import { ProductSortBy } from '../../enums/SortBy';
import { upload } from '../../libs/multer';
import { createKey, deleteCache, getCache, setCache } from '../../libs/redis';
import { AuthGuard, CheckTokenIfFound } from '../../middleware/authGuard';
import { AuthGuardDM } from '../../middleware/authGuardDM';
import { redisCache } from '../../middleware/redisCache';
import { EditPriceProductInput } from '../../models/AdminChangePriceHistory';
import {
  ILegacyProductModel,
  LegacyProductInput,
} from '../../models/LegacyProducts';
import { DMSecurityFeeService } from '../../services/dmSecurityFeeService';
import { ProductService } from '../../services/productService';
import { ReportingService } from '../../services/reportingService';
import { SearchService } from '../../services/searchService';
import { UserService } from '../../services/userService';
import {
  _get,
  formatPriceInDecimalPoints,
  settingScoreCondition,
  validateImagesQualityScore,
  validateQuestionAndAnswer,
} from '../../util/common';
import logger from '../../util/logger';
import { sendEventData } from '../../util/webEngageEvents';
import IController from './IController';

const UploadMultiple = upload('/image-collection/uploads').fields([
  { name: 'product_images', maxCount: 10 },
]);

const UpdateUploadMultiple = upload('/images').fields([
  { name: 'new_images', maxCount: 10 },
]);

export class ProductController implements IController {
  path = 'product/';
  router: Router;
  productService: ProductService;
  reportingService: ReportingService;
  searchService: SearchService;
  userService: UserService;
  dmSecurityFeeService: DMSecurityFeeService;

  constructor(router: Router) {
    this.router = router;
    this.productService = Container.get(ProductService);
    this.reportingService = Container.get(ReportingService);
    this.searchService = Container.get(SearchService);
    this.userService = Container.get(UserService);
    this.dmSecurityFeeService = Container.get(DMSecurityFeeService);
  }

  mappingImagesRequest(req: any) {
    try {
      let fileNameArr: string[] = [];
      if (
        (req.files &&
          req.files.product_images &&
          req.files.product_images?.length > 0) ||
        (req.files?.new_images && req.files.new_images?.length > 0)
      ) {
        const files = req.files.product_images || req?.files?.new_images;

        if (files.length > 0) {
          for (const file of files) {
            let fileUrl = file?.key;

            if (fileUrl) {
              fileUrl =
                process.env.IMAGES_AWS_S3_ENDPOINT_CDN +
                '/' +
                file.bucket.split('/')[1] +
                '/' +
                fileUrl;
              fileNameArr.push(fileUrl);
            }
          }
        }
      }
      const product_images_url: string[] = req.body?.product_images_url || [];
      if (product_images_url.length > 0) {
        fileNameArr = fileNameArr.concat(product_images_url);
      }
      return fileNameArr;
    } catch (exception) {
      logger.error(exception);
    }
  }
  mappingToCreateDraftProductRequest(req: Request) {
    try {
      const product_image_arr = this.mappingImagesRequest(req);
      // const stateProduct = settingScoreCondition(req.body.score);
      const draftProduct: LegacyProductInput = {
        category_id: req.body?.category_id || null,
        brand_id: req.body?.brand_id || null,
        model_id: req.body?.model_id || null,
        varient_id: req.body?.varient_id || null,
        varient: req.body?.varient || '',
        varient_ar: req.body?.varient_ar || '',
        product_images: product_image_arr || [],
        save_as_draft_step: req.body?.save_as_draft_step || '',
        sell_price: req.body?.sell_price || 0,
        bid_price: req.body?.bid_price || 0,
        description: req.body?.description || '',
        expiryAfterInDays:
          req.body?.expiryAfterInDays ||
          Constants.product.DEFAULT_EXPIRY_LISTING_DAYS,
        isListedBefore: req.body?.isListedBefore || 'no',
        promocode: req.body?.sellerPromocodeId || '',
        body_cracks: req.body?.body_cracks || '',
        attributes: req.body?.attributes || [],
        variant_attributes_selections:
          req.body?.variant_attributes_selections || [],
      };
      return draftProduct;
    } catch (exception) {
      logger.error(exception);
    }
  }
  initializeRoutes() {
    this.router.put(
      '/remove-billing-settings',
      header('caller').notEmpty().equals('system'),
      this.removeBillingSettings
    );
    this.router.get(
      '/explore',
      [
        query('size')
          .isNumeric()
          .optional()
          .withMessage(
            'size' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('size').default(10),
        query('page')
          .isNumeric()
          .optional()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('page').default(1),
      ],
      this.getExploreProducts
    );
    this.router.get(
      '/',
      [
        query('size')
          .isNumeric()
          .optional()
          .withMessage(
            'size' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('size').default(5),
        query('page')
          .isNumeric()
          .optional()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('page').default(1),
      ],
      this.getProductsWithPagination
    );
    this.router.post('/', AuthGuard, this.createDraftProduct);
    this.router.post('/listing', AuthGuard, this.createProduct);
    this.router.post('/ims-listing', this.createImsProduct);
    this.router.put('/ims-listing', this.updateImsProduct);
    this.router.post('/price-nudging-history', this.createLogForPriceNudge);
    this.router.put(
      '/:id/',
      [
        AuthGuard,
        param('id')
          .trim()
          .notEmpty()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.updateProduct
    );
    this.router.get('/list', CheckTokenIfFound, this.listProducts);
    this.router.post(
      '/:id/test-change-state',
      [
        param('id')
          .trim()
          .notEmpty()
          .withMessage(
            'id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.testStateChange
    );
    this.router.get('/color', this.getColors);
    this.router.get(
      '/prerequisite',
      [
        query('userId')
          .trim()
          .notEmpty()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.checkPriorListingCondition
    );
    this.router.get('/get-variant', this.getVariants);
    this.router.get('/image-scan', this.identifyProductImages);
    this.router.get(
      '/detail/:productId',
      [
        AuthGuard,
        param('productId')
          .trim()
          .notEmpty()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getDetailProduct
    );
    this.router.get(
      '/price-nudge-history/:productId',
      [
        param('productId')
          .trim()
          .notEmpty()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getPriceNudgingHistory
    );
    this.router.post(
      '/filter',
      this.validateGetProductByFilteringInput(),
      this.getProductByFiltering
    );
    this.router.get('/my/wishlist', AuthGuard, this.getWishList);
    this.router.get(
      '/get-mpp-products/:modelId',
      redisCache,
      [
        CheckTokenIfFound,
        param('modelId')
          .trim()
          .notEmpty()
          .withMessage('modelId' + Constants.ERROR_MAP.MODEL_ID_NOT_FOUND),
        query('size')
          .isNumeric()
          .optional()
          .withMessage(
            'size' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('size'),
        query('page')
          .isNumeric()
          .optional()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
      ],
      this.listProducts
    );
    this.router.post(
      '/:productId/ask-seller',
      [
        AuthGuard,
        param('productId')
          .trim()
          .notEmpty()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('question')
          .trim()
          .notEmpty()
          .withMessage(
            'question' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.askSeller
    );
    this.router.get(
      '/:productId/ask-seller',
      [
        param('productId')
          .trim()
          .notEmpty()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        query('isSeller')
          .optional()
          .isBoolean()
          .withMessage(
            'isSeller' + Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE
          ),
      ],
      this.getAskSeller
    );
    this.router.put(
      '/:productId/ask-seller/:questionId/answer',
      [
        AuthGuard,
        param('productId')
          .trim()
          .notEmpty()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        param('questionId')
          .trim()
          .notEmpty()
          .withMessage(
            'askSellerId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('answer')
          .trim()
          .notEmpty()
          .withMessage(
            'answer' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.answerAskSeller
    );
    this.router.get(
      '/:productId/question/answer',
      [
        param('productId')
          .trim()
          .notEmpty()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getQuestionAnswer
    );
    this.router.put(
      '/:productId/price',
      [
        AuthGuardDM,
        check('productId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
        body('sell_price')
          .isDecimal()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.SELL_PRICE),
        body('bid_price')
          .isDecimal()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.BID_PRICE),
      ],
      this.updatePriceProduct
    );
    this.router.get(
      '/:productId/log',
      [
        AuthGuardDM,
        check('productId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
      ],
      this.getAdminLog
    );

    this.router.get(
      '/mismatched-listings',
      [AuthGuardDM],
      this.getMismatchedListings
    );

    this.router.get(
      '/mismatched-listings/report',
      this.getMismatchedListingsReport
    );

    this.router.put(
      '/delete/:productId',
      [
        AuthGuard,
        check('productId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
      ],
      this.deleteProduct
    );
    this.router.get(
      '/deleted-listings',
      [
        AuthGuard,
        query('size')
          .isInt({ min: 1, max: 30 })
          .optional()
          .withMessage('size' + Constants.MESSAGE.INVALID_SIZE),
      ],
      this.getDeletedListings
    );
    this.router.get(
      '/pending-listings',
      [
        AuthGuard,
        query('size')
          .isInt({ min: 1, max: 50 })
          .optional()
          .withMessage('size' + Constants.MESSAGE.INVALID_SIZE),
      ],
      this.getPendingListings
    );
    this.router.put(
      '/report/:productId',
      [
        check('productId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
      ],
      this.reportProduct
    );
    this.router.get(
      '/reported-listings',
      [AuthGuardDM],
      this.getReportedListings
    );
    this.router.get(
      '/filter/products',
      // redisCache,
      [
        CheckTokenIfFound,
        query('size')
          .isNumeric()
          .optional()
          .withMessage(
            'size' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('size').default(5),
        query('page')
          .isNumeric()
          .optional()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
      ],
      this.getProductsFilter
    );
    this.router.get('/auto-approve', this.autoApproveProduct);
    this.router.get('/update-trending-key', this.updateTrendingTag);
    this.router.get('/on-hold', [AuthGuardDM], this.getOnHoldListing);
    this.router.get('/fraud-listings', [AuthGuardDM], this.getFraudListings);
    this.router.put(
      '/update-fraud-status/:productId',
      [
        AuthGuard,
        check('productId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
      ],
      this.updateFraudStatus
    );
    this.router.get(
      '/listings-transactions',
      [
        AuthGuardDM,
        query('isGetSuccess')
          .optional()
          .isBoolean()
          .withMessage(
            'isGetSuccess' + Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE
          ),
      ],
      this.getListingsTransaction
    );
    this.router.get(
      '/flagged-listings',
      [AuthGuardDM],
      this.getFlaggedListings
    );
    this.router.put(
      '/verify-product/:productId',
      [
        AuthGuardDM,
        check('productId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
      ],
      this.verifyProduct
    );
    this.router.get(
      '/:productId/preview',
      [
        CheckTokenIfFound,
        param('productId')
          .trim()
          .notEmpty()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.getPreviewProductById
    );
    this.router.put(
      '/update-price/:productId',
      [
        AuthGuard,
        param('productId')
          .trim()
          .notEmpty()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('sell_price')
          .notEmpty()
          .isFloat({ min: 1 })
          .withMessage(Constants.VALIDATE_REQUEST_MSG.SELL_PRICE),
        body('variant_id')
          .trim()
          .notEmpty()
          .withMessage(
            'variant_id' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('isNullRange'),
      ],
      this.updatePrice
    );
    this.router.put(
      '/update-edit-price-status/:productId',
      [
        AuthGuard,
        param('productId')
          .trim()
          .notEmpty()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('isEditing')
          .notEmpty()
          .isBoolean()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE),
      ],
      this.updateEditPriceStatus
    );
    this.router.post(
      '/validate-sell-data/:productId',
      [
        param('productId')
          .trim()
          .notEmpty()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('sell_price')
          .notEmpty()
          .isDecimal()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.SELL_PRICE),
        body('status')
          .trim()
          .notEmpty()
          .withMessage(
            'status' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('sell_status')
          .trim()
          .notEmpty()
          .withMessage(
            'sell_status' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.validateSellData
    );
    this.router.post(
      '/update-variant-of-product/',
      [
        AuthGuard,
        check('productId')
          .trim()
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
        check('newVariantId')
          .trim()
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.VARIANT_ID),
        check('isForceUpdate')
          .optional()
          .isBoolean()
          .withMessage(
            'isForceUpdate' +
              Constants.VALIDATE_REQUEST_MSG.INVALID_BOOLEAN_TYPE
          ),
      ],
      this.updateProductVariant
    );
    this.router.get('/my-sales', [AuthGuard], this.getMySales);
    //  @depricated
    this.router.put(
      '/:productId/approve',
      [
        param('productId')
          .trim()
          .notEmpty()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        check('isApproved', 'Please select status').not().isEmpty(),
      ],
      this.approveProduct
    );
    this.router.get(
      '/my-sales-detail/:orderId',
      [
        AuthGuard,
        param('orderId')
          .trim()
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ORDER_ID),
      ],
      this.getMySalesDetail
    );
    this.router.put(
      '/:productId/reject',
      [
        AuthGuardDM,
        param('productId')
          .trim()
          .notEmpty()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('rejected_reasons')
          .trim()
          .notEmpty()
          .withMessage(
            'rejected_reasons' +
              Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.rejectProductById
    );
    this.router.get(
      '/calculate',
      [
        query('productId')
          .trim()
          .notEmpty()
          .custom(value => {
            return mongoose.isValidObjectId(value);
          })
          .withMessage('productId' + Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
      ],
      this.calculateProductSummary
    );

    this.router.get(
      '/commissions',
      [
        query('productId')
          .trim()
          .notEmpty()
          .custom(value => {
            return mongoose.isValidObjectId(value);
          })
          .withMessage('productId' + Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
      ],
      this.calculateProductCommissions
    );

    this.router.get(
      '/countBetterPriceListings',
      [
        AuthGuard,
        query('variantId')
          .trim()
          .notEmpty()
          .withMessage(
            'variantId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        query('score')
          .notEmpty()
          .isInt({ min: 0, max: 100 })
          .withMessage('score must be a number from 0 to 100'),
        query('listingPrice')
          .notEmpty()
          .isInt({ min: 1 })
          .withMessage('listingPrice must be a number and over than 0'),
      ],
      this.countBetterPriceListings
    );
    this.router.get(
      '/update-model-mismatch',
      [
        AuthGuard,
        query('numberOfRecord')
          .isNumeric()
          .notEmpty()
          .withMessage(
            'numberOfRecord' +
              Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
      ],
      this.updateModelMismatch
    );
    this.router.post(
      '/commission',
      [
        header('client-id').notEmpty().equals('api-v1'),
        body('product')
          .notEmpty()
          .isObject()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.EMPTY_PRODUCTS),
      ],
      this.getProductCommission
    );
    this.router.get(
      '/calculate/:modelId/:variantId/:sellPrice',
      [
        AuthGuard,
        param('modelId')
          .trim()
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.MODEL_ID),
        param('variantId')
          .trim()
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.VARIANT_ID),
        param('sellPrice')
          .trim()
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.SELL_PRICE),
      ],
      this.calculateSellerCutPrice
    );
    this.router.get(
      '/user/:userId',
      [
        param('userId')
          .trim()
          .isString()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        query('size')
          .isNumeric()
          .optional()
          .withMessage(
            'size' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
        query('size').default(5),
        query('page')
          .isNumeric()
          .optional()
          .withMessage(
            'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
          ),
      ],
      this.getActiveListingByUserID
    );
    this.router.put(
      '/images/:productId',
      [
        AuthGuard,
        check('productId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
      ],
      this.updateProductImages
    );
    this.router.put(
      '/:productId/details',
      [
        AuthGuard,
        param('productId')
          .trim()
          .notEmpty()
          .withMessage(
            'productId' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('isUpranked')
          .trim()
          .optional()
          .isBoolean()
          .withMessage(
            'isUpranked' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('imagesQualityScore')
          .trim()
          .optional()
          .isNumeric()
          .custom(validateImagesQualityScore)
          .withMessage(
            'imagesQualityScore' +
              Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.updateProductDetails
    );
    this.router.get(
      '/status/:productId',
      [
        AuthGuardDM,
        param('productId')
          .trim()
          .isString()
          .withMessage('productId' + Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
      ],
      this.getProductActivationStatus
    );
    this.router.put(
      '/status/:productId',
      [
        AuthGuardDM,
        param('productId')
          .trim()
          .isString()
          .withMessage('productId' + Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
      ],
      this.updateProductActivationStatus
    );
    this.router.put(
      '/activate/:productId',
      [
        AuthGuard,
        param('productId')
          .trim()
          .isString()
          .withMessage('productId' + Constants.VALIDATE_REQUEST_MSG.PRODUCT_ID),
      ],
      this.activateProduct
    );
  }

  getProductsWithPagination = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
            JSON.stringify(errors.array())
          )
        );
      }
      const [err, result] = await this.productService.getProductWithPagination(
        req
      );
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            result.toString()
          )
        );
      } else {
        const returnMessage = result
          ? Constants.MESSAGE.PRODUCT_GET_SUCCESS
          : Constants.MESSAGE.PRODUCT_GET_NOT_FOUND;

        res.sendOk(result, returnMessage);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
            exception.message
          )
        );
      }
    }
  };

  // this handler is deprecated,
  // use advanced products filtering instead
  listProducts = async (req: Request, res: Response) => {
    try {
      const result: any = await this.getProductsFilter(req, res);

      return res.sendOk(result?.responseData, result?.message);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MPP_PRODUCTS,
            'failed to get mpp products'
          )
        );
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MPP_PRODUCTS,
            exception.message
          )
        );
      }
    }
  };

  createDraftProduct = async (req: Request, res: Response) => {
    try {
      UploadMultiple(req, res, async (error: any) => {
        if (error instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.sendError(error);
        } else if (error) {
          // An unknown error occurred when uploading.
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPLOAD
            )
          );
        }
        try {
          const objDraftProduct = this.mappingToCreateDraftProductRequest(req);
          const userId = (req.user as any).id || null;
          const [err, result] = await this.productService.createDraftProduct(
            objDraftProduct,
            userId
          );
          if (err) {
            res.sendError(
              new ErrorResponseDto(
                Constants.ERROR_CODE.BAD_REQUEST,
                Constants.ERROR_TYPE.API,
                result.toString()
              )
            );
          } else {
            res.sendCreated(
              result,
              Constants.MESSAGE.DRAFT_PRODUCT_CREATED_SUCCESS
            );
          }
        } catch (exception) {
          if (exception instanceof ErrorResponseDto) {
            return res.sendError(exception);
          }
          throw exception;
        }
      });
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_CREATE_DRAFT_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  mappingToCreateProductRequest(req: Request) {
    try {
      const product_image_arr = this.mappingImagesRequest(req);
      const updatedStateProduct = settingScoreCondition(req.body?.score || 0);
      const listingProduct: LegacyProductInput = {
        category_id: req.body?.category_id || null,
        brand_id: req.body?.brand_id || null,
        model_id: req.body?.model_id || null,
        varient_id: req.body?.varient_id || null,
        varient: req.body?.varient || '',
        varient_ar: req.body?.varient_ar || '',
        product_images: product_image_arr || [],
        answer_to_questions: req.body?.answer_to_questions || '',
        answer_to_questions_ar: req.body?.answer_to_questions_ar || '',
        pick_up_address: req.body?.pick_up_address || {},
        sell_price: formatPriceInDecimalPoints(req.body?.sell_price) || 0,
        bid_price: formatPriceInDecimalPoints(req.body?.bid_price) || 0,
        description: req.body?.description || '',
        expiryAfterInDays:
          req.body?.expiryAfterInDays ||
          Constants.product.DEFAULT_EXPIRY_LISTING_DAYS,
        isListedBefore: req.body?.isListedBefore || 'no',
        promocode: req.body?.sellerPromocodeId || '',
        body_cracks: req.body?.body_cracks || 'no',
        score: Number(parseFloat(updatedStateProduct.score).toFixed(2)),
        grade: updatedStateProduct.grade,
        grade_ar: updatedStateProduct.grade_ar,
        attributes: req.body?.attributes?.split(',') || [],
        start_bid: req.body?.start_bid || 0,
        listingSource: req?.body?.listingSource || ListingSource.CONSUMER,
        recommended_price: req?.body?.recommended_price || null,
      };
      return listingProduct;
    } catch (exception) {
      logger.error(exception);
    }
  }
  createProduct = async (req: Request, res: Response) => {
    try {
      UploadMultiple(req, res, async (error: any) => {
        if (error instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.sendError(error);
        } else if (error) {
          // An unknown error occurred when uploading.
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPLOAD
            )
          );
        }
        try {
          const objProduct = this.mappingToCreateProductRequest(req);
          const userId = (req.user as any).id || null;
          const [err, result] = await this.productService.createProduct(
            objProduct,
            userId
          );
          if (err) {
            res.sendError(
              new ErrorResponseDto(
                Constants.ERROR_CODE.BAD_REQUEST,
                Constants.ERROR_TYPE.API,
                result.toString()
              )
            );
          } else {
            res.sendCreated(result, Constants.MESSAGE.PRODUCT_CREATED_SUCCESS);
          }
        } catch (exception) {
          if (exception instanceof ErrorResponseDto) {
            return res.sendError(exception);
          }
          throw exception;
        }
      });
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_CREATE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  createImsProduct = async (req: Request, res: Response) => {
    try {
      req.body.listingSource = ListingSource.IMS;
      const objProduct = this.mappingToCreateProductRequest(req);
      const userId = req.body?.userId;
      const [err, result] = await this.productService.createProduct(
        objProduct,
        userId
      );
      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_CREATE_PRODUCT,
            JSON.stringify(result)
          )
        );
      }

      return res.sendCreated(result, Constants.MESSAGE.PRODUCT_CREATED_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_CREATE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  updateImsProduct = async (req: Request, res: Response) => {
    try {
      req.body.listingSource = ListingSource.IMS;
      const updatedStateProduct = settingScoreCondition(req.body?.score || 0);
      const objProduct = {
        id: req.body?.id,
        category_id: req.body?.category_id || null,
        brand_id: req.body?.brand_id || null,
        model_id: req.body?.model_id || null,
        varient_id: req.body?.varient_id || null,
        varient: req.body?.varient || '',
        varient_ar: req.body?.varient_ar || '',
        product_images: req.body?.product_image_arr || [],
        sell_price: formatPriceInDecimalPoints(req.body?.sell_price) || 0,
        description: req.body?.description || '',
        expiryAfterInDays: req.body?.expiryAfterInDays,
        score: Number(parseFloat(updatedStateProduct.score).toFixed(2)),
        grade: updatedStateProduct.grade,
        grade_ar: updatedStateProduct.grade_ar,
        attributes: req.body?.attributes?.split(',') || [],
        start_bid: formatPriceInDecimalPoints(req.body?.start_bid) || 0,
        listingSource: req?.body?.listingSource || ListingSource.CONSUMER,
        promo_code: '',
        sellerId: req.body?.userId,
      };
      const prodId = req.body?.id;
      const [err, result] = await this.productService.updateProduct(
        prodId,
        objProduct
      );
      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            result.message
          )
        );
      }

      return res.sendOk(
        result.result,
        Constants.MESSAGE.PRODUCT_UPDATED_SUCCESS
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      UploadMultiple(req, res, async (error: any) => {
        if (error instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.sendError(error);
        } else if (error) {
          // An unknown error occurred when uploading.
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPLOAD
            )
          );
        }
        try {
          // get list of updated images
          const product_image_arr = this.mappingImagesRequest(req);
          req.body.product_image_arr = product_image_arr;

          const updatedStateProduct = settingScoreCondition(req.body.score);
          req.body.score = updatedStateProduct.score;
          req.body.grade = updatedStateProduct.grade;
          req.body.grade_ar = updatedStateProduct.grade_ar;

          const id_product = req.params.id;

          if (!mongoose.isValidObjectId(id_product)) {
            return res.sendError(
              new ErrorResponseDto(
                Constants.ERROR_CODE.BAD_REQUEST,
                Constants.ERROR_TYPE.API,
                Constants.ERROR_MAP.INVALID_ID_FORMAT,
                Constants.MESSAGE.INVALID_ID_FORMAT
              )
            );
          }
          const [err, result] = await this.productService.updateProduct(
            id_product,
            req
          );
          if (err) {
            res.sendError(
              new ErrorResponseDto(
                Constants.ERROR_CODE.BAD_REQUEST,
                Constants.ERROR_TYPE.API,
                result.toString()
              )
            );
          } else {
            res.sendOk(result);
          }
        } catch (exception) {
          if (exception instanceof ErrorResponseDto) {
            return res.sendError(exception);
          }
          throw exception;
        }
      });
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  createLogForPriceNudge = async (req: Request, res: Response) => {
    try {
      await this.productService.addPriceNudgingHistory(
        req.body.productId,
        req.body.sellPrice
      );
      return res.sendOk(null);
    } catch (exception) {
      logger.error(exception);
    }
  };
  testStateChange = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const id_product = req.params.id;
      const req_body = {
        current_state: req.body.current,
        next_state: req.body.next,
        calling_action: req.body.action,
      };
      // eslint-disable-next-line max-len
      const result = await this.productService.testProductState(
        id_product,
        req_body.current_state,
        req_body.next_state,
        req_body.calling_action
      );
      res.sendOk(result ? 'Valid action' : 'Invalid action');
    } catch (exception) {
      res.sendError(exception);
    }
  };

  getDetailProduct = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DETAIL_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = !req.params.productId ? null : req.params.productId;
      const [err, productRes] = await this.productService.getDetailProduct(
        productId
      );
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            productRes.result.toString()
          )
        );
      } else {
        res.sendOk(productRes.result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DETAIL_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  getPriceNudgingHistory = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PRICE_NUDGING_HISTORY,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = !req.params.productId ? null : req.params.productId;
      const [err, productRes] =
        await this.productService.getPriceNudgingHistoryByProductId(productId);
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            productRes.result.toString()
          )
        );
      } else {
        res.sendOk(productRes.result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PRICE_NUDGING_HISTORY,
            exception.message
          )
        );
      }
    }
  };
  identifyProductImages = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DETAIL_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }

      const [scanError, result] = await this.productService.scanProductImages();
      if (scanError) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_DETECT_IMAGES,
            result.message
          )
        );
      }

      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_DETECT_IMAGES,
            exception.message
          )
        );
      }
    }
  };

  validateGetProductByFilteringInput() {
    return [
      body('categories')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'categories' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('categories').default(''),
      body('models')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'models' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('models').default(''),
      body('brands')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'brands' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('brands').default(''),
      body('colors')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'colors' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('colors').default(''),
      body('variants')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'variants' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('variants').default(''),
      body('size')
        .isNumeric()
        .optional()
        .withMessage(
          'size' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
      body('size').default(5),
      body('page')
        .isNumeric()
        .optional()
        .withMessage(
          'page' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
      body('page').default(1),
      body('search')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'search' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('search').default(''),
      body('price.from')
        .isNumeric()
        .optional()
        .withMessage(
          'price.from' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
      body('price.from').default(0),
      body('price.to')
        .isNumeric()
        .optional()
        .withMessage(
          'price.to' + Constants.VALIDATE_REQUEST_MSG.INVALID_NUMBER_TYPE
        ),
      body('price.to').default(0),
      body('sorting')
        .trim()
        .isString()
        .optional()
        .withMessage(
          'sorting' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
        ),
      body('sorting').default('ASC'),
    ];
  }
  getProductByFiltering = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_FILTERING_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const filter = {
        categories: _get(req.body, 'categories', '').split(','),
        models: _get(req.body, 'models', '').split(','),
        brands: _get(req.body, 'brands', '').split(','),
        colors: _get(req.body, 'colors', '').split(','),
        variants: _get(req.body, 'variants', '').split(','),
        size: parseInt(_get(req.body, 'size', 5), 10),
        page: parseInt(_get(req.body, 'page', 1), 10),
        search: _get(req.body, 'search', ''),
        range_price_from: !req.body?.price?.from ? 0 : req.body.price.from,
        range_price_to: !req.body?.price?.to ? 0 : req.body.price.to,
        sorting: !req.body.sorting ? 'ASC' : req.body.sorting,
      };
      const [err, result] = await this.productService.getProductWithFiltering(
        filter
      );
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            result.toString()
          )
        );
      } else {
        res.sendOk(result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_FILTERING_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_DELETE_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = req.params.productId;
      const reason = !req.body.reason ? '' : req.body.reason;
      const result = await this.productService.deleteProduct(productId, reason);

      await this.searchService.deleteOneOrManyProducts([productId]);

      res.sendOk(result, Constants.MESSAGE.DELETE_PRODUCT_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_DELETE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  getDeletedListings = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DELETED_LISTINGS,
            JSON.stringify(errors.array())
          )
        );
      }
      const page = parseInt(req?.query?.page?.toString()) || 1;
      const size = parseInt(req?.query?.size?.toString()) || 20;
      const result = await this.productService.getDeletedListings(page, size);
      res.sendOk(result, Constants.MESSAGE.GET_DELETED_LISTINGS_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DELETED_LISTINGS,
            exception.message
          )
        );
      }
    }
  };

  getPendingListings = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DELETED_LISTINGS,
            JSON.stringify(errors.array())
          )
        );
      }
      const page = parseInt(req?.query?.page?.toString()) || 1;
      const size = parseInt(req?.query?.size?.toString()) || 20;
      const sortBy = req.query?.sortBy?.toString() || 'most_recent';

      const result = await this.productService.getPendingListings(
        page,
        size,
        sortBy
      );
      res.sendOk(result, Constants.MESSAGE.GET_DELETED_LISTINGS_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DELETED_LISTINGS,
            exception.message
          )
        );
      }
    }
  };

  reportProduct = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REPORT_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = req.params.productId;
      const reason = _get(req.body, 'reason', '');
      const userId = _get(req.body, 'userId', '');
      const result = await this.productService.reportProduct(
        productId,
        reason,
        userId
      );
      res.sendOk(result, Constants.MESSAGE.REPORT_PRODUCT_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REPORT_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  getReportedListings = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page.toString()) || 1;
      const size = parseInt(req.query.size.toString()) || 20;
      const result = await this.productService.getReportedListings(page, size);
      res.sendOk(result, Constants.MESSAGE.GET_REPORTED_LISTINGS_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_REPORTED_LISTINGS,
            exception.message
          )
        );
      }
    }
  };

  getWishList = async (req: Request, res: Response) => {
    try {
      const user_id = (req.user as any).id || null;
      const [err, result] = await this.productService.getWishList(user_id);
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            result.toString()
          )
        );
      } else {
        res.sendOk(result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_WISH_LIST,
            exception.message
          )
        );
      }
    }
  };

  getAskSeller = async (req: Request, res: Response) => {
    try {
      const productId = !req.params.productId ? null : req.params.productId;

      if (!mongoose.isValidObjectId(productId)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.INVALID_ID_FORMAT,
            Constants.MESSAGE.INVALID_ID_FORMAT
          )
        );
      }

      const isSeller: boolean = req?.query?.isSeller?.toString() === 'true';
      const [error, result] = await this.productService.getAskSeller(
        productId,
        isSeller
      );

      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ASK_SELLER,
            result as string
          )
        );
      } else {
        res.sendOk(result, Constants.MESSAGE.GET_Q_AND_A_SUCCESSFULLY);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_WISH_LIST,
            exception.message
          )
        );
      }
    }
  };

  askSeller = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_ASK_SELLER,
            JSON.stringify(errors.array())
          )
        );
      }

      const questionerId = (req.user as any)?.id || '';
      if (!questionerId) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.USER_NOT_FOUND,
            Constants.MESSAGE.USER_IS_NOT_FOUND
          )
        );
      }
      const [countError, questionsAskedByQuestioner] =
        await this.productService.countTodayAskQuestionsOfUser(questionerId);
      if (countError || questionsAskedByQuestioner?.result >= 15) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_ASK_SELLER,
            Constants.MESSAGE.FAILED_TO_ADD_ASK_SELLER_EXCEEDS
          )
        );
      }

      const [countMonthError, questionsAskedByQuestionerMonth] =
        await this.productService.countThisMonthAskQuestionsOfUser(
          questionerId
        );
      if (countMonthError || questionsAskedByQuestionerMonth?.result >= 50) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_ASK_SELLER,
            Constants.MESSAGE.FAILED_TO_ADD_ASK_SELLER_EXCEEDS_MONTH
          )
        );
      }

      const question = req.body.question || '';
      validateQuestionAndAnswer(question);
      const productId = !req.params.productId ? null : req.params.productId;
      const productData = await this.productService.getPreviewProductById(
        productId,
        questionerId
      );
      const [error, result] = await this.productService.addAskSeller(
        questionerId,
        productId,
        question,
        productData?.result?.seller_id || ''
      );

      const cacheKey = createKey(Constants.CACHE_KEYS.USER_PRE, [
        productData?.result?.seller_id || '',
      ]);
      deleteCache([cacheKey]);

      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_ASK_SELLER,
            result as string
          )
        );
      } else {
        const [, buyerData] = await this.userService.getUserInfo(
          questionerId,
          'name'
        );
        const webEngageData = {
          'Buyer Name': buyerData?.name || '',
          'Buyer user id': (result as any)?.questioner_id || '',
          'Seller ID': productData.result?.seller_id,
          'Seller Name': productData.result?.seller_name || '',
          'Model Name': productData.result?.models?.model_name || '',
          'Product ID': productData.result?._id || '',
          'Timestamp of the questions asked':
            (result as any)?.created_date || '',
          'Question content': (result as any)?.question || '',
          'Question id': (result as any)?._id || '',
        };
        const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
        await sendEventData(
          productData.result?.seller_id || 'Dave ID',
          'Seller receives question',
          dateFormat,
          webEngageData
        );
        res.sendOk(result, Constants.MESSAGE.ASK_SELLER_SUCCESSFULLY);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_ASK_SELLER,
            exception.message
          )
        );
      }
    }
  };

  getMismatchedListings = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query?.page?.toString()) || 1;
      const size = parseInt(req.query?.size?.toString()) || 20;
      const id = req.query?.id?.toString() || '';
      const sortByMostRecent =
        req.query?.sortByMostRecent?.toString() === 'true';
      const result = await this.productService.getMismatchedListings(
        page,
        size,
        id,
        sortByMostRecent
      );
      res.sendOk(result, 'Get Mismatched Listings successfully');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_DELETED_LISTINGS,
            exception.message
          )
        );
      }
    }
  };

  getMismatchedListingsReport = async (req: Request, res: Response) => {
    try {
      const [err, sendResult] =
        await this.productService.getMismatchedListingsReport();
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SEND_MISMATCH_REPORT_EMAIL,
            sendResult.message
          )
        );
      } else {
        res.sendOk(sendResult.result, sendResult.message);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_SEND_MISMATCH_REPORT_EMAIL,
            exception.message
          )
        );
      }
    }
  };

  answerAskSeller = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_ASK_SELLER,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = !req.params.productId ? null : req.params.productId;
      const questionId = !req.params.questionId ? null : req.params.questionId;

      if (
        !mongoose.isValidObjectId(productId) ||
        !mongoose.isValidObjectId(questionId)
      ) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.INVALID_ID_FORMAT,
            // eslint-disable-next-line max-len
            `${!mongoose.isValidObjectId(productId) ? 'Product ID - ' : ''}${
              !mongoose.isValidObjectId(questionId) ? 'Question ID - ' : ''
            }${Constants.MESSAGE.INVALID_ID_FORMAT}`
          )
        );
      }
      const userId = (req.user as any)?.id || null;
      const data = { answer: req.body.answer || '' };
      validateQuestionAndAnswer(data?.answer?.toString());
      const productData = await this.productService.getPreviewProductById(
        productId,
        userId
      );
      const [error, result] = await this.productService.updateAskSeller(
        questionId,
        productId,
        data
      );

      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_ASK_SELLER,
            result as string
          )
        );
      } else {
        const [, buyerData] = await this.userService.getUserInfo(
          userId,
          'name'
        );
        const webEngageData = {
          'Buyer Name': buyerData?.name || '',
          'Buyer user id': (result as any)?.questioner_id || '',
          'Seller ID': productData.result?.seller_id,
          'Seller Name': productData.result?.seller_name || '',
          'Model Name': productData.result?.models?.model_name || '',
          'Product ID': productData.result?._id || '',
          'Timestamp of the questions asked':
            (result as any)?.created_date || '',
          'Question content': (result as any)?.question || '',
          'Question id': (result as any)?._id || '',
          'Answer content': (result as any)?.answer || '',
          'Answer id': (result as any)?._id || '',
        };
        const dateFormat = `${new Date().toISOString().split('.')[0]}+0000`;
        await sendEventData(
          (result as any)?.questioner_id || 'Dave ID',
          'Buyer receives answer',
          dateFormat,
          webEngageData
        );
        const cacheKey = createKey(Constants.CACHE_KEYS.USER_PRE, [
          productData?.result?.seller_id || '',
        ]);
        deleteCache([cacheKey]);

        res.sendOk(result, Constants.MESSAGE.ANSWER_BUYER_SUCCESSFULLY);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_ASK_SELLER,
            exception.message
          )
        );
      }
    }
  };

  getColors = async (req: Request, res: Response) => {
    try {
      const [error, result] = await this.productService.getColors();
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_COLOR,
            result as string
          )
        );
      } else {
        res.sendOk(result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_COLOR,
            exception.message
          )
        );
      }
    }
  };

  getQuestionAnswer = async (req: Request, res: Response) => {
    try {
      const productId = req.params.productId || null;
      const [error, data] = await this.productService.getQuestionAnswer(
        productId
      );
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_QUESTION
          )
        );
      } else {
        res.sendOk(data);
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

  checkPriorListingCondition = async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId.toString();
      if (_isEmpty(userId)) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CHECK_PREREQUISITE,
            Constants.MESSAGE.USER_IS_NOT_FOUND
          )
        );
      }

      const [error, result] =
        await this.productService.validateListingPreCondition(userId);
      if (error) {
        res.sendError(
          new ErrorResponseDto(
            result.code,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CHECK_PREREQUISITE,
            result.message,
            result.result
          )
        );
      } else {
        res.sendOk(result.result, result.message);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CHECK_PREREQUISITE,
            exception.message
          )
        );
      }
    }
  };

  updatePriceProduct = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_VALIDATE_REQUEST_EDIT_PRICE_ADMIN,
            JSON.stringify(errors.array())
          )
        );
      }
      const mappingInput = this.mappingEditPriceProductInput(req);
      await this.searchService.addProducts([mappingInput.product_id]);
      const [err, result] = await this.productService.updatePriceProduct(
        mappingInput
      );
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRICE_PRODUCT,
            result.toString()
          )
        );
      } else {
        // Push product to typesense
        await this.searchService.addProducts([mappingInput.product_id]);
        res.sendOk(result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRICE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  mappingEditPriceProductInput(req: any) {
    const obj: EditPriceProductInput = {
      product_id: req.params.productId,
      sell_price: req.body.sell_price,
      bid_price: req.body.bid_price,
      user_id: (req.userInfo as any)._id,
    };
    return obj;
  }

  getAdminLog = async (req: Request, res: Response) => {
    try {
      const productId = !req.params.productId ? null : req.params.productId;
      const [err, result] = await this.productService.getAdminLog(productId);
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ADMIN_LOG,
            result.toString()
          )
        );
      } else {
        res.sendOk(result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ADMIN_LOG,
            exception.message
          )
        );
      }
    }
  };

  getVariants = async (req: Request, res: Response) => {
    res.sendOk(
      [
        {
          variant_id: '6074877e1dda2e8416145bd4',
          varian_name: '9th gen 2021',
          variant_ar: '9th arabic 2021',
          position: '',
          category_id: '',
          brand_id: '60640602929f92968a347b12',
          model_id: '6074877e1dda2e8416145bd4',
          features: [
            {
              _id: '6074877e1dda2e8416145bd4',
              name: 'Screen Size',
              name_ar: 'Screen Size in arabic',
              options: {
                en: ['9.7 inch', '10 inch'],
                ar: ['9.7 arabic', '10 inch'],
              },
            },
            {
              _id: '6074877e1dda2e8123455bd4',
              name: 'Storage',
              name_ar: 'Storage in arabic',
              options: {
                en: ['64GB', '256GB'],
                ar: ['64GB', '256GB'],
              },
            },
            {
              _id: '6074877e1dda2e8124325bd4',
              name: 'Connectivity',
              name_ar: 'Connectivity in arabic',
              options: {
                en: ['Wi-Fi + Cellular', 'Wi-Fi Only'],
                ar: ['Wi-Fi + Cellular', 'Wi-Fi Only'],
              },
            },
          ],
        },
        {
          variant_id: '6074877e1dda2e5415145bd4',
          varian_name: '8th gen 2020',
          variant_ar: '8th arabic 2020',
          position: '',
          category_id: '',
          brand_id: '60640602929f92968a347b12',
          model_id: '6074877e1dda2e8416145bd4',
          features: [
            {
              _id: '6074877e1dda2e8416145bd4',
              name: 'Screen Size',
              name_ar: 'Screen Size in arabic',
              options: {
                en: ['9.7 inch', '10 inch'],
                ar: ['9.7 arabic', '10 inch'],
              },
            },
            {
              _id: '6074877e1dda2e8123455bd4',
              name: 'Storage',
              name_ar: 'Storage in arabic',
              options: {
                en: ['32GB', '128GB'],
                ar: ['32GB', '128GB'],
              },
            },
            {
              _id: '6074877e1dda2e8124325bd4',
              name: 'Connectivity',
              name_ar: 'Connectivity in arabic',
              options: {
                en: ['Wi-Fi + Cellular', 'Wi-Fi Only'],
                ar: ['Wi-Fi + Cellular', 'Wi-Fi Only'],
              },
            },
          ],
        },
        {
          variant_id: '6074877e1dda2e2019145bd4',
          varian_name: '7th gen 2019',
          variant_ar: '7th arabic 2019',
          position: '',
          category_id: '',
          brand_id: '60640602929f92968a347b12',
          model_id: '6074877e1dda2e8416145bd4',
          features: [
            {
              _id: '6074877e1dda2e8416145bd4',
              name: 'Screen Size',
              name_ar: 'Screen Size in arabic',
              options: {
                en: ['9.7 inch', '10 inch'],
                ar: ['9.7 arabic', '10 inch'],
              },
            },
            {
              _id: '6074877e1dda2e8123455bd4',
              name: 'Storage',
              name_ar: 'Storage in arabic',
              options: {
                en: ['32GB', '128GB'],
                ar: ['32GB', '128GB'],
              },
            },
            {
              _id: '6074877e1dda2e8124325bd4',
              name: 'Connectivity',
              name_ar: 'Connectivity in arabic',
              options: {
                en: ['Wi-Fi + Cellular', 'Wi-Fi Only'],
                ar: ['Wi-Fi + Cellular', 'Wi-Fi Only'],
              },
            },
          ],
        },
        {
          variant_id: '6074877e1dda2e5420185bd4',
          varian_name: '6th gen 2018',
          variant_ar: '6th arabic 2018',
          position: '',
          category_id: '',
          brand_id: '60640602929f92968a347b12',
          model_id: '6074877e1dda2e8416145bd4',
          features: [
            {
              _id: '6074877e1dda2e8416145bd4',
              name: 'Screen Size',
              name_ar: 'Screen Size in arabic',
              options: {
                en: ['9.7 inch', '10 inch'],
                ar: ['9.7 arabic', '10 inch'],
              },
            },
            {
              _id: '6074877e1dda2e8123455bd4',
              name: 'Storage',
              name_ar: 'Storage in arabic',
              options: {
                en: ['32GB', '128GB'],
                ar: ['32GB', '128GB'],
              },
            },
            {
              _id: '6074877e1dda2e8124325bd4',
              name: 'Connectivity',
              name_ar: 'Connectivity in arabic',
              options: {
                en: ['Wi-Fi + Cellular', 'Wi-Fi Only'],
                ar: ['Wi-Fi + Cellular', 'Wi-Fi Only'],
              },
            },
          ],
        },
      ],
      'Get Variants successfully'
    );
  };

  getExploreProducts = async (req: Request, res: Response) => {
    try {
      // const page = +req.query?.page || 1;
      // const size = Math.min(+req.query.size || 30, 30);

      // const result = await this.productService.getExploreProducts(page, size);
      const result = {
        docs: [],
        hasNextPage: false,
        totalDocs: 0,
      } as PaginationDto<ILegacyProductModel>;
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_EXPLORE_PRODUCTS,
            exception.message
          )
        );
      }
    }
  };

  prepareFilterData = async (req: Request) => {
    const userId = (req.user as any)?.id || null;
    let price = (req.query.price as string) || '';
    const page = +req.query.page || 1;

    const modelIdParam = (req.params as any)?.modelId || null;
    let grades = (req.query.grades as string)?.split(',').sort() || [];
    let models = (req.query.modelId as string)?.split(',').sort() || [];

    const varients = (req.query.varients as string)?.split('|') || [];
    let deviceTypes = (req.query.deviceType as string)?.split(',').sort() || [];
    const capacities =
      (req.query.capacities as string)?.split(',').sort() || [];
    const tags = (req.query.tags as string)?.split(',').sort() || [];

    // handles logic from deprecated mpp apis
    if (modelIdParam) {
      const minPrice = +req.query.minPrice || 0;
      const maxPrice = +req.query.maxPrice || null;

      if (maxPrice) {
        price = minPrice + '-' + maxPrice;
      }

      deviceTypes = (req.query.categoryId as string)?.split(',').sort() || [];
      models = [modelIdParam];
      grades =
        (req.query.grades as string)
          ?.replace('excellent', 'Like New')
          .replace('great', 'Lightly Used')
          .replace('good', 'Fair')
          .replace('extensive,', 'Extensive Use')
          .split(',') || [];
    }

    const size = Math.min(+req.query.size || 20, 20);
    const brands = (req.query.brand as string)?.split(',').sort() || [];
    const userCity = req.query.userCity || '';
    const sortBy = req.query.sortDirection as ProductSortBy;

    return {
      models: models,
      brands: brands,
      deviceTypes: deviceTypes,
      grades: grades,
      userCity: userCity,
      size: size,
      page: page,
      price: price,
      sortBy: sortBy,
      userId: userId,
      capacities: capacities,
      varients: varients,
      tags: tags,
    } as ProductFilterDto;
  };

  getProductsFilter = async (req: Request, res: Response) => {
    try {
      const filter = await this.prepareFilterData(req);

      const {
        models,
        brands,
        deviceTypes,
        grades,
        size,
        page,
        price,
        userCity,
        sortBy,
        userId,
        varients,
      } = filter;

      const apiType = (req.params as any)?.modelId
        ? 'mpp'
        : 'advanced_filtering';

      const key = createKey(apiType, [
        models?.join('_'),
        brands?.join('_'),
        deviceTypes?.join('_'),
        grades?.join('_'),
        varients?.join('_'),
        size?.toString(),
        page?.toString(),
        price,
        userCity,
        sortBy,
        userId,
        req.query.withPageInfo?.toString(),
      ]);

      const filteredDataCache = await getCache<ILegacyProductModel[]>(key);
      if (!_isEmpty(filteredDataCache)) {
        return res.sendOk(
          filteredDataCache,
          Constants.MESSAGE.FETCH_MODELS_SUCCESS
        );
      }
      if (filter.price) {
        const price_ranges_reg = RegExp('^\\d+-\\d+(,\\d+-\\d+)*$');
        const isValid = price_ranges_reg.test(req.query.price as string);
        if (!isValid) {
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_WRONG_PRICE_FORMAT,
              Constants.MESSAGE.FAILED_WRONG_PRICE_FORMAT
            )
          );
        }
      }

      const result = await this.productService.getProductsFilter(filter);

      if (apiType === 'mpp') {
        setCache(key, result?.docs, 120);
        return {
          message: Constants.MESSAGE.FETCH_MODELS_SUCCESS,
          responseData: result?.docs ? result.docs : [],
        };
      } else if (req.query?.withPageInfo) {
        setCache(key, result, 120);
        return res.sendOk(result, Constants.MESSAGE.FETCH_MODELS_SUCCESS);
      } else {
        setCache(key, result?.docs, 120);
        return res.sendOk(result?.docs, Constants.MESSAGE.FETCH_MODELS_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MPP_PRODUCTS,
            exception.message
          )
        );
      }
    }
  };

  autoApproveProduct = async (req: Request, res: Response) => {
    try {
      const result = await this.productService.autoApproveProduct();
      if (typeof result == 'object' && result.result.length > 0) {
        const filter = {
          productIds: result.result,
          size: result.result.length,
        } as ProductFilterDto;
        await this.searchService.getSyncData(filter);
      }

      res.sendOk(result, Constants.MESSAGE.AUTO_APPROVE_PRODUCT_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_AUTO_APPROVE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };
  updateTrendingTag = async (req: Request, res: Response) => {
    try {
      await this.productService.checkIfgroupListingIsPopular(null, true);
      res.sendOk({});
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_AUTO_APPROVE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };
  // @depricated
  approveProduct = async (req: Request, res: Response) => {
    try {
      const productId = req.params.productId;
      const isApproved = req.body.isApproved;
      if (typeof isApproved !== 'boolean') {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.VALUE_NOT_BOOLEAN,
            Constants.MESSAGE.VALUE_NOT_BOOLEAN
          )
        );
      }
      const result = await this.productService.approveProduct(
        productId,
        isApproved
      );

      if (result) {
        const filter = {
          productIds: [productId],
          size: 1,
        } as ProductFilterDto;
        isApproved
          ? await this.searchService.getSyncData(filter)
          : await this.searchService.deleteOneOrManyProducts([productId]);
      }
      deleteCache(['cars-category-count-app', 'cars-category-count-web']);
      res.sendOk(result, Constants.MESSAGE.APPROVE_PRODUCT_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_APPROVE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };
  getOnHoldListing = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query?.page?.toString()) || 1;
      const size = parseInt(req.query?.size?.toString()) || 20;
      const result = await this.productService.getOnHoldListings(page, size);
      res.sendOk(result, 'Get On Hold Listings successfully');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ON_HOLD_LISTINGS,
            exception.message
          )
        );
      }
    }
  };

  getFraudListings = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query?.page?.toString()) || 1;
      const size = parseInt(req.query?.size?.toString()) || 20;
      const result = await this.productService.getFraudListings(page, size);
      res.sendOk(result, 'Get Fraud Listings successfully');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_FRAUD_LISTINGS,
            exception.message
          )
        );
      }
    }
  };

  getListingsTransaction = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_LISTINGS_TRANSACTION_LISTINGS,
            JSON.stringify(errors.array())
          )
        );
      }

      const page = parseInt(req.query?.page?.toString()) || 1;
      const size = parseInt(req.query?.size?.toString()) || 20;
      const isGetSuccess: boolean =
        req.query?.isGetSuccess?.toString() === 'true';
      const result = await this.productService.getListingsTransaction(
        page,
        size,
        isGetSuccess
      );
      res.sendOk(result, 'Get Listings Transaction successfully');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_LISTINGS_TRANSACTION_LISTINGS,
            exception.message
          )
        );
      }
    }
  };

  updateFraudStatus = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_FRAUD_STATUS_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = req.params.productId;
      const fraudStatus: boolean =
        req.body?.fraudStatus?.toString() === 'true' ? true : false;
      const result = await this.productService.updateFraudStatus(
        productId,
        fraudStatus
      );
      res.sendOk(result, 'Update Fraud Status successfully');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_FRAUD_STATUS_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  getFlaggedListings = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query?.page?.toString()) || 1;
      const size = parseInt(req.query?.size?.toString()) || 20;
      const sortBy = req.query?.sortBy?.toString() || 'most_recent';
      const isOnHold = req.query?.isOnHold?.toString() === 'true' || false;
      const isConsignment =
        req.query?.isConsignment?.toString() === 'true' || false;
      const result = await this.productService.getFlaggedListings(
        page,
        size,
        sortBy,
        isOnHold,
        isConsignment
      );
      res.sendOk(result, 'Get Flagged Listings successfully');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAIL_TO_GET_FLAGGED_LISTING,
            exception.message
          )
        );
      }
    }
  };

  verifyProduct = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_VERIFY_STATUS,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = req.params.productId;
      const userId = (req.user as any)?.id || null;
      const verifyStatus: boolean =
        _get(req.body, 'verifyStatus', '').toString() === 'true' ? true : false;
      const result = await this.productService.verifyProduct(
        productId,
        userId,
        verifyStatus
      );
      res.sendOk(result, Constants.MESSAGE.UPDATE_VERIFY_STATUS_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_VERIFY_STATUS,
            exception.message
          )
        );
      }
    }
  };

  getPreviewProductById = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = req.params.productId;
      const userId = (req.user as any)?.id || null;
      const productDetails = await this.productService.getPreviewProductById(
        productId,
        userId
      );
      productDetails.result.showSecurityBadge = false;
      try {
        const user = await this.userService.getUser(
          productDetails?.result?.seller_id
        );
        productDetails.result.showSecurityBadge = user?.hasOptedForSF || false;
      } catch (err) {}
      res.sendOk(
        productDetails,
        Constants.MESSAGE.GET_PREVIEW_PRODUCT_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  updateProductVariant = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_VARIANT,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId: string = req?.body?.productId;
      const newVariantId: string = req?.body?.newVariantId;
      const isForceUpdate: boolean = req.body?.isForceUpdate || false;

      if (
        !mongoose.isValidObjectId(productId) ||
        !mongoose.isValidObjectId(newVariantId)
      ) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.INVALID_ID_FORMAT,
            // eslint-disable-next-line max-len
            `${!mongoose.isValidObjectId(productId) ? 'Product ID ' : ''}${
              !mongoose.isValidObjectId(newVariantId) ? 'New Variant ID ' : ''
            }${Constants.MESSAGE.INVALID_ID_FORMAT}`
          )
        );
      }
      const result = await this.productService.updateProductVariant(
        productId,
        newVariantId,
        isForceUpdate
      );
      res.sendOk(result, Constants.MESSAGE.UPDATE_VARIANT_PRODUCT_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  updatePrice = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = req.params.productId;
      const userId = (req.user as any)?.id || null;
      const sellPrice = req?.body?.sell_price;
      const variant_id = req?.body?.variant_id;
      const isNullRange: boolean =
        req?.body?.isNullRange?.toString()?.toLowerCase() === 'true';

      if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !mongoose.Types.ObjectId.isValid(userId) ||
        (variant_id && !mongoose.Types.ObjectId.isValid(variant_id))
      ) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.WRONG_ID_FORMAT,
            'Wrong ID format for productId/userId. Please retry!'
          )
        );
        return;
      }

      const checkPrice = await this.productService.checkSellPriceForUpdate(
        variant_id,
        sellPrice
      );

      if (checkPrice && !isNullRange) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.INVALID_SELL_PRICE,
            Constants.MESSAGE.INVALID_SELL_PRICE
          )
        );
      }

      const [err, result] = await this.productService.updatePrice(
        productId,
        userId,
        sellPrice
      );

      if (err) {
        res.sendError(
          new ErrorResponseDto(
            result.code,
            Constants.ERROR_TYPE.API,
            result.result,
            result.result
          )
        );
        return;
      }
      await this.productService.addPriceNudgingHistory(productId, sellPrice);

      // Push product to typesense
      await this.searchService.addProducts([productId]);

      res.sendOk(result, Constants.MESSAGE.UPDATE_PRICE_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  updateEditPriceStatus = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = req?.params?.productId;
      const userId = (req.user as any)?.id || null;
      const isEditing = req?.body?.isEditing || false;

      if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.WRONG_ID_FORMAT,
            'Wrong ID format for productId/userId. Please retry!'
          )
        );
        return;
      }

      const [err, result] = await this.productService.updateEditPriceStatus(
        productId,
        userId,
        isEditing
      );

      if (err) {
        res.sendError(
          new ErrorResponseDto(
            result.code,
            Constants.ERROR_TYPE.API,
            result.result,
            result.result
          )
        );
        return;
      }
      res.sendOk(result, Constants.MESSAGE.UPDATE_PRICE_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  validateSellData = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const productId = req?.params?.productId;
      const sellPrice = req?.body?.sell_price;
      const status = req?.body?.status;
      const sellStatus = req?.body?.sell_status;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.WRONG_ID_FORMAT,
            'Wrong ID format for productId. Please retry!'
          )
        );

        return;
      }
      const [err, result] = await this.productService.validateSellData(
        productId,
        sellPrice,
        status,
        sellStatus
      );

      if (err) {
        res.sendError(
          new ErrorResponseDto(
            result.code,
            Constants.ERROR_TYPE.API,
            result.result,
            result.message
          )
        );
        return;
      }
      res.sendOk(result, Constants.MESSAGE.VALIDATE_PRODUCT_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  rejectProductById = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REJECT_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }

      const productId: string = req?.params?.productId;
      const rejected_reasons: string = req?.body?.rejected_reasons;

      if (!mongoose.isValidObjectId(productId)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.INVALID_ID_FORMAT,
            Constants.MESSAGE.INVALID_ID_FORMAT
          )
        );
      }

      const result = await this.productService.rejectProduct(
        productId,
        rejected_reasons
      );

      await this.searchService.deleteOneOrManyProducts([productId]);

      res.sendOk(result, Constants.MESSAGE.REJECT_PRODUCT_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REJECT_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  calculateProductSummary = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REJECT_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const getProductSummaryDto = {
        productId: req?.query?.productId,
        actionType: 'buy',
        applyDefaultPromo:
          req?.query?.applyDefaultPromo?.toString().toLocaleLowerCase() ===
          'true',
        promoCode: req?.query?.promoCode,
        allPayments: false,
      } as GetProductSummaryInputDto;
      const result = await this.productService.getProductCalculationSummary(
        getProductSummaryDto
      );
      res.sendOk(result, Constants.MESSAGE.PRODUCT_CALCULATION_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REJECT_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  calculateProductCommissions = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REJECT_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }
      const getProductSummaryDto = {
        productId: req?.query?.productId,
        actionType: 'buy',
        applyDefaultPromo:
          req?.query?.applyDefaultPromo?.toString().toLocaleLowerCase() ===
          'true',
        promoCode: req?.query?.promoCode,
        allPayments: true,
        paymentModule: req?.query?.paymentModule,
      } as GetProductSummaryInputDto;
      const result = await this.productService.getProductCalculationSummary(
        getProductSummaryDto
      );
      res.sendOk(result, Constants.MESSAGE.PRODUCT_CALCULATION_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REJECT_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  calculateSellerCutPrice = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CALCULATE_PRODUCT_PRICE,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = (req.user as any).id;
      let grade = req.query?.grade?.toString();
      if (grade === 'excellent') {
        grade = 'like_new';
      } else if (grade === 'goodCondition') {
        grade = 'lightly_used';
      } else {
        grade = 'good_condition';
      }
      const result = await this.productService.calculateSellerCutPrice(
        userId,
        req.params.modelId,
        req.params.variantId,
        parseInt(req.params.sellPrice),
        grade
      );
      res.sendOk(result, Constants.MESSAGE.PRODUCT_CALCULATION_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CALCULATE_PRODUCT_PRICE,
            exception.message
          )
        );
      }
    }
  };

  countBetterPriceListings = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_COUNT_BETTER_PRICE_LISTINGS,
            JSON.stringify(errors.array())
          )
        );
      }

      const variantId: string = req?.query?.variantId?.toString();
      const score: number = parseInt(req?.query?.score?.toString());
      const listingPrice: number = parseInt(
        req?.query?.listingPrice?.toString()
      );

      if (!mongoose.isValidObjectId(variantId)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.INVALID_ID_FORMAT,
            Constants.MESSAGE.INVALID_ID_FORMAT
          )
        );
      }

      const [err, result] = await this.productService.countBetterPriceListings(
        variantId,
        score,
        listingPrice
      );

      if (err) {
        res.sendError(
          new ErrorResponseDto(
            result.code,
            Constants.ERROR_TYPE.API,
            result.result,
            result.message
          )
        );
        return;
      }
      res.sendOk(
        result.result,
        Constants.MESSAGE.COUNT_BETTER_PRICE_LISTINGS_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_COUNT_BETTER_PRICE_LISTINGS,
            exception.message
          )
        );
      }
    }
  };

  updateModelMismatch = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_MISMATCHED_MODEL,
            JSON.stringify(errors.array())
          )
        );
      }
      const numberOfRecord: number =
        parseInt(req?.query?.numberOfRecord?.toString()) || 10000;
      const [err, result] = await this.productService.updateModelMismatch(
        numberOfRecord
      );

      if (err) {
        res.sendError(
          new ErrorResponseDto(
            result.code,
            Constants.ERROR_TYPE.API,
            result.result,
            result.message
          )
        );
        return;
      }
      res.sendOk(
        result?.result,
        Constants.MESSAGE.UPDATE_MISMATCHED_MODEL_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_MISMATCHED_MODEL,
            exception.message
          )
        );
      }
    }
  };

  getMySales = async (req: Request, res: Response) => {
    try {
      const user_id = (req.user as any).id || null;

      if (!mongoose.isValidObjectId(user_id)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.INVALID_ID_FORMAT,
            Constants.MESSAGE.INVALID_ID_FORMAT
          )
        );
      }
      const [err, result] = await this.productService.getMySales(user_id);

      if (err) {
        res.sendError(
          new ErrorResponseDto(
            result.code,
            Constants.ERROR_TYPE.API,
            result.result,
            result.message
          )
        );
        return;
      }
      res.sendOk(result.result, Constants.MESSAGE.GET_MY_SALES_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MY_SALES,
            exception.message
          )
        );
      }
    }
  };

  getMySalesDetail = async (req: Request, res: Response) => {
    try {
      const user_id = (req.user as any).id || null;
      const orderId = req?.params?.orderId?.toString() || '';
      const token = req?.headers['token'].toString() || '';

      if (
        !mongoose.isValidObjectId(user_id) ||
        !mongoose.isValidObjectId(orderId)
      ) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.INVALID_ID_FORMAT,
            Constants.MESSAGE.INVALID_ID_FORMAT
          )
        );
      }
      const [err, result] = await this.productService.getMySalesDetail(
        user_id,
        orderId,
        token
      );

      if (err) {
        res.sendError(
          new ErrorResponseDto(
            result.code,
            Constants.ERROR_TYPE.API,
            result.result,
            result.message
          )
        );
        return;
      }
      res.sendOk(result.result, Constants.MESSAGE.GET_MY_SALES_SUCCESSFULLY);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_MY_SALES,
            exception.message
          )
        );
      }
    }
  };

  getProductCommission = async (req: Request, res: Response) => {
    try {
      res.sendError('Not supported any more');
    } catch (exception) {
      res.sendError(exception);
    }
  };
  removeBillingSettings = async (_: Request, res: Response) => {
    try {
      const result =
        await this.productService.removeBillingSettingsForOldProducts();
      return res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  getActiveListingByUserID = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ACTIVE_LISTINGS_BY_ID,
            JSON.stringify(errors.array())
          )
        );
      }
      const page = parseInt(req?.query?.page?.toString()) || 1;
      const size = parseInt(req?.query?.size?.toString()) || 20;
      const userId = req?.params?.userId?.toString() || '';

      const [err, data] = await this.productService.getActiveListingByUserID(
        userId,
        page,
        size
      );

      if (err) {
        res.sendError(
          new ErrorResponseDto(
            data.code,
            Constants.ERROR_TYPE.API,
            data.result,
            data.message
          )
        );
      }

      return res.sendOk(
        data.result,
        Constants.MESSAGE.GET_LISTINGS_BY_USER_ID_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ACTIVE_LISTINGS_BY_ID,
            exception.message
          )
        );
      }
    }
  };

  updateProductImages = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_LISTING_IMAGES,
            JSON.stringify(errors.array())
          )
        );
      }
      UpdateUploadMultiple(req, res, async (error: any) => {
        if (error instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.sendError(error);
        } else if (error) {
          // An unknown error occurred when uploading.
          return res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_UPLOAD
            )
          );
        }
        try {
          const listingImages = req?.body?.listingImages;
          const productId = req.params.productId;
          const product_image_arr = this.mappingImagesRequest(req);

          if (!listingImages || listingImages?.length <= 0) {
            return res.sendError(
              new ErrorResponseDto(
                Constants.ERROR_CODE.BAD_REQUEST,
                Constants.ERROR_TYPE.API,
                Constants.ERROR_MAP.FAILED_TO_UPDATE_LISTING_IMAGES,
                Constants.MESSAGE.EMPTY_LISTING_IMAGES
              )
            );
          }

          const [err, data] = await this.productService.updateProductImages(
            productId,
            (typeof listingImages === 'string'
              ? [listingImages]
              : listingImages
            ).concat(product_image_arr)
          );

          if (err) {
            res.sendError(
              new ErrorResponseDto(
                data.code,
                Constants.ERROR_TYPE.API,
                data.result,
                data.message
              )
            );
          }

          await this.searchService.addProducts([productId]);

          return res.sendOk(
            data.result,
            Constants.MESSAGE.UPDATE_LISTING_IMAGES
          );
        } catch (exception) {
          if (exception instanceof ErrorResponseDto) {
            return res.sendError(exception);
          }
          throw exception;
        }
      });
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_LISTING_IMAGES,
            exception.message
          )
        );
      }
    }
  };
  updateProductDetails = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            JSON.stringify(errors.array())
          )
        );
      }

      const productId: string = req?.params?.productId;
      if (!mongoose.isValidObjectId(productId)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.INVALID_ID_FORMAT,
            Constants.MESSAGE.INVALID_ID_FORMAT
          )
        );
      }

      const productUpdate: ProductUpdateDto = this.mapRequestToProductUpdateDto(
        req.body
      );

      const result = await this.productService.updateProductDetails(
        productId,
        productUpdate
      );

      await this.searchService.addProducts([productId]);

      res.sendOk(result, Constants.MESSAGE.PRODUCT_UPDATED_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  getProductActivationStatus = async (req: Request, res: Response) => {
    try {
      const result = await this.productService.getProductActivationStatus(
        req.params.productId
      );
      return res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT,
            exception.message
          )
        );
      }
    }
  };

  updateProductActivationStatus = async (req: Request, res: Response) => {
    try {
      const result = await this.productService.updateProductActivationStatus(
        req.params.productId,
        req.body.isActivated
      );
      return res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };
  activateProduct = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id || null;
      const [err, result] = await this.productService.activateProduct(
        userId,
        req.params.productId
      );
      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            Constants.MESSAGE.FAILED_TO_UPDATE_PRODUCT
          )
        );
      }
      return res.sendOk(result, Constants.MESSAGE.PRODUCT_UPDATED_SUCCESS);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
            exception.message
          )
        );
      }
    }
  };
  mapRequestToProductUpdateDto = (reqBody: any) => {
    const productUpdate: ProductUpdateDto = {};

    const { isUpranked, imagesQualityScore } = reqBody;

    if (isUpranked !== undefined) {
      productUpdate.isUpranked = isUpranked;
    }

    if (imagesQualityScore !== undefined) {
      productUpdate.imagesQualityScore = parseInt(imagesQualityScore, 10);
    }

    return productUpdate;
  };
}
