import _differenceWith from 'lodash/differenceWith';
import _isEqual from 'lodash/isEqual';
import moment, { Moment } from 'moment';
import mongoose, { ClientSession, LeanDocument } from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { CreateProductFraudDto } from '../dto/product/CreateProductFraudDto';
import { ProductFilterDto } from '../dto/product/ProductFilterDto';
import { ProductUpdateDto } from '../dto/product/ProductUpdateDto';
import { ProductGrade } from '../enums/ProductGrade';
import { ProductHighlights } from '../enums/ProductHighlights';
import { ProductOrderStatus, ProductStatus } from '../enums/ProductStatus.Enum';
import { ProductSyncStatus } from '../enums/search/searchEnums';
import { ProductSortBy } from '../enums/SortBy';
import { TransactionOrderStatus } from '../enums/TransactionStatus';
import { mappingMongoError } from '../libs/mongoError';
import { AskSeller, AskSellerType } from '../models/AskSeller';
import { Brand } from '../models/Brand';
import { Category } from '../models/Category';
import { DeltaMachineOrder } from '../models/DeltaMachineOrder';
import { FraudProduct } from '../models/FraudProduct';
import {
  AnswerToQuestion,
  ILegacyProductModel,
  LegacyProductInput,
  ProductModel,
  ProductModelPaginated,
} from '../models/LegacyProducts';
import { LegacyUser } from '../models/LegacyUser';
import { DeviceModel } from '../models/Model';
import { BillingSettings, Product, ProductDocument } from '../models/Product';
import { Variant, VariantDocument } from '../models/Variant';
import { generateCode, settingScoreCondition } from '../util/common';
import {
  calculateMismatchedDiscount,
  errorTemplate,
  lookup,
  returnedDataTemplate,
  unwind,
} from '../util/queryHelper';
import { PaginationDto } from './../dto/paginationDto';
import { syncProduct } from './../grpc/productMicroService';
import { ProductActions } from './../enums/productActions.enum';

const getNewConditionName = (product: any) => {
  const old_condition_en = ['like new', 'lightly used', 'fair'];
  const new_condition_en = [
    ProductGrade.EXCELLENT,
    ProductGrade.GOOD,
    ProductGrade.NOTICEABLY_USED,
  ];
  const new_condition_ar = ['حالة ممتازة', 'حالة جيدة', 'إستخدام ملحوظ'];
  const condition_index_en = old_condition_en.indexOf(
    product.grade?.toLowerCase()
  );

  if (condition_index_en > -1) {
    product.grade = new_condition_en[condition_index_en];
    product.grade_ar = new_condition_ar[condition_index_en];
    if (product.arGrade) {
      product.arGrade = product.grade_ar;
    }
  }

  return product;
};

export interface ProductRepoFilters {
  modelId?: string;
  modelIds?: string[];
  categoryId?: string;
  categoryIds?: string[];
  brandIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  capacities?: string[];
  grades?: string[];
  page?: number;
  size?: number;
  sortBy?: ProductSortBy;
  userId?: string;
  userCity?: any;
}

@Service()
export class ProductRepository {
  sortNum: Record<string, any> = {
    $switch: {
      branches: [
        {
          case: {
            $eq: ['$grade', Constants.product.GRADE.LIKE_NEW.EN],
          },
          then: 1,
        },
        {
          case: {
            $eq: ['$grade', Constants.product.GRADE.LIGHTLY_USED.EN],
          },
          then: 2,
        },
        {
          case: {
            $eq: ['$grade', Constants.product.GRADE.FAIR.EN],
          },
          then: 3,
        },
        {
          case: {
            $eq: ['$grade', Constants.product.GRADE.EXTENSIVE_USE.EN],
          },
          then: 4,
        },
      ],
      default: 5,
    },
  };
  async getProductsForExplore(
    page: number,
    size: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: PaginationDto<ILegacyProductModel> | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await ProductModelPaginated.paginate(
        {
          sell_status: 'Available',
          status: 'Active',
          isApproved: true,
          expiryDate: { $gte: moment().toDate() },
          trade_in: { $ne: true },
        },
        {
          page: page,
          limit: size,
          sort: { createdDate: -1 },
          populate: ['model_id'],
          projection: {
            'model_id.model_name': 1,
            'model_id.model_name_ar': 1,
            sell_price: 1,
            product_images: 1,
          },
        }
      );
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: {
              docs: [],
              totalDocs: 0,
              hasNextPage: false,
            },
            message: Constants.ERROR_MAP.FAILED_TO_GET_EXPLORE_PRODUCTS,
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: {
            docs: data.docs,
            totalDocs: data.totalDocs,
            hasNextPage: data.hasNextPage,
          },
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_EXPLORE_PRODUCTS,
          message: exception.message,
        },
      ];
    }
  }
  async getAllProduct() {
    return await ProductModel.find({ trade_in: { $ne: true } })
      .populate('brand')
      .populate('category')
      .populate('model')
      .populate('color')
      .populate('variant')
      .exec();
  }
  async getUnverifiedProducts(
    numOfItems: number = 10
  ): Promise<
    [
      boolean,
      { code: number; result: string | ILegacyProductModel[]; message: string }
    ]
  > {
    try {
      const data = await ProductModel.find(
        {
          verified_date: null,
          trade_in: { $ne: true },
          $or: [{ status: 'Active' }, { status: 'On hold' }],
        },
        null,
        { sort: { createdDate: -1 }, limit: numOfItems }
      ).exec();
      if (!data || data.length === 0) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCTS,
            message: Constants.MESSAGE.FAILED_TO_GET_PRODUCTS,
          },
        ];
      }

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
          message: 'Get unverified products successful',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCTS,
          message: exception.message,
        },
      ];
    }
  }

  async createProductFraud(
    obj: CreateProductFraudDto
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const productFraud = new FraudProduct({
        productId: new mongoose.Types.ObjectId(obj.productId),
        productImage: obj.productImage || '',
        visionResponse: obj.visionResponse || '',
        detectText: obj.detectText || '',
        createdDate: moment().toDate(),
        updatedDate: moment().toDate(),
      });

      const resultData = await productFraud.save();

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: resultData },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAIL_TO_CREATE_PRODUCT,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getDetailProduct(
    productId: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const options = [
        {
          $match: {
            _id: mongoose.Types.ObjectId(productId),
            status: 'Active',
            isApproved: true,
            sell_price: { $gt: 0 },
            $and: [
              {
                $or: [{ sell_status: 'Available' }, { sell_status: 'Locked' }],
              },
              { $or: [{ isPriceUpdating: false }, { isPriceUpdating: null }] },
            ],
          },
        },
        lookup('categories', 'category_id', '_id', 'category'),
        unwind('$category'),
        lookup('brands', 'brand_id', '_id', 'brands'),
        unwind('$brands'),
        lookup('device_models', 'model_id', '_id', 'models'),
        unwind('$models'),
        lookup('varients', 'varient_id', '_id', 'varients'),
        unwind('$varients'),
        lookup('users', 'user_id', '_id', 'seller'),
        unwind('$seller'),
        {
          $project: {
            product_id: '$_id',
            user_id: 1,
            category_id: 1,
            brand_id: 1,
            model_id: 1,
            varient_id: 1,
            condition_id: 1,
            varient: 1,
            sell_price: 1,
            bid_price: 1,
            product_images: 1,
            defected_images: 1,
            body_cracks: 1,
            description: 1,
            answer_to_questions: 1,
            answer_to_questions_ar: 1,
            score: 1,
            grade: 1,
            grade_ar: 1,
            current_bid_price: 1,
            favourited_by: 1,
            code: 1,
            sell_status: 1,
            status: 1,
            expiryDate: 1,
            isListedBefore: 1,
            createdDate: 1,
            'category.category_name': 1,
            'category.category_name_ar': 1,
            'brands.brand_name': 1,
            'brands.brand_name_ar': 1,
            'brands.brand_icon': 1,
            'models.model_name': 1,
            'models.model_name_ar': 1,
            'models.model_icon': 1,
            'models.current_price': 1,
            seller_id: '$seller._id',
            seller_name: '$seller.name',
            seller_phone: '$seller.mobileNumber',
            seller_country_code: '$seller.countryCode',
            'varients.varient': 1,
            'varients.current_price': 1,
            answer_to_questions_migration: 1,
            answer_to_questions_ar_migration: 1,
            attributes: 1,
            conditions: 1,
            isBiddingProduct: 1,
            billingSettings: 1,
            isUpranked: 1,
            imagesQualityScore: 1,
          },
        },
      ];
      const products = await ProductModel.aggregate(options).exec();
      if (!products || products?.length == 0)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: null,
          },
        ];

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: products[0],
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DETAIL_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  /*All the aggregation was not needed from function 'getDetailProduct'
    so added this new function to optimize api processing time */
  async getProductDetail(
    productId: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const options = [
        {
          $match: {
            _id: mongoose.Types.ObjectId(productId),
            isApproved: true,
            sell_price: { $gt: 0 },
          },
        },
        lookup('categories', 'category_id', '_id', 'category'),
        unwind('$category'),
        lookup('device_models', 'model_id', '_id', 'models'),
        unwind('$models'),
        lookup('varients', 'varient_id', '_id', 'variant'),
        unwind('$variant'),
        lookup('brands', 'brand_id', '_id', 'brands'),
        unwind('$brands', false),
        {
          $project: {
            product_id: '$_id',
            category_id: 1,
            condition_id: 1,
            model_id: 1,
            user_id: 1,
            varient_id: 1,
            sell_price: 1,
            recommended_price: 1,
            status: 1,
            sell_status: 1,
            product_images: 1,
            description: 1,
            grade: 1,
            billingSettings: 1,
            promocode: 1,
            isConsignment: 1,
            'category.category_name': 1,
            'models.model_name': 1,
            'variant.varient': 1,
            'brands.brand_name': 1,
            consignment: 1,
          },
        },
      ];
      const products = await ProductModel.aggregate(options).exec();
      if (!products || products?.length == 0)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: null,
          },
        ];

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: products[0],
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DETAIL_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async createDraftProduct(
    obj: LegacyProductInput,
    user_id: string
  ): Promise<
    [
      boolean,
      { code: number; result: ILegacyProductModel | string; message?: string }
    ]
  > {
    try {
      const product = new ProductModel({
        brand_id: new mongoose.Types.ObjectId(obj.brand_id),
        category_id: new mongoose.Types.ObjectId(obj.category_id),
        model_id: new mongoose.Types.ObjectId(obj.model_id),
        varient_id: new mongoose.Types.ObjectId(obj.varient_id),
        varient: obj.varient,
        varient_ar: obj.varient_ar,
        user_id: new mongoose.Types.ObjectId(user_id),
        promocode: !obj.promocode
          ? null
          : new mongoose.Types.ObjectId(obj.promocode),
        product_images: obj.product_images || [],
        sell_status: 'Draft',
        save_as_draft_step: obj.save_as_draft_step,
        code: generateCode(7),
        isApproved: true,
        sell_price: obj.sell_price || 0,
        bid_price: obj.bid_price || 0,
        body_cracks: obj.body_cracks,
        description: obj.description || '',
        isListedBefore: obj.isListedBefore === 'yes' ? true : false,
        attributes:
          obj.attributes?.map((item: string) => {
            return new mongoose.Types.ObjectId(item);
          }) || [],
        expiryDate: moment().add('days', obj.expiryAfterInDays).toDate(),
        createdDate: moment().toDate(),
        variant_attributes_selections: obj.variant_attributes_selections || [],
        billingSettings: obj.billingSettings || {},
      });

      const draftProduct = await product.save();

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: draftProduct },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAIL_TO_CREATE_DRAFT_PRODUCT,
            message: exception.message,
          },
        ];
      }
    }
  }
  async getLatestProduct(
    user_id: string
  ): Promise<
    [
      boolean,
      { code: number; result: ILegacyProductModel | string; message?: string }
    ]
  > {
    try {
      const latestProduct = await ProductModel.findOne({
        user_id: new mongoose.Types.ObjectId(user_id),
        status: 'Active',
        sell_status: { $ne: 'Sold' },
        trade_in: { $ne: true },
      })
        .sort({ createdDate: -1 })
        .exec();
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: latestProduct },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAIL_TO_GET_LATEST_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }
  async createProduct(
    obj: LegacyProductInput,
    user_id: string
  ): Promise<
    [
      boolean,
      { code: number; result: ILegacyProductModel | string; message?: string }
    ]
  > {
    try {
      const product = new ProductModel({
        _id:
          obj?._id?.toString() !== ''
            ? new mongoose.Types.ObjectId(obj._id)
            : new mongoose.Types.ObjectId(),
        brand_id: new mongoose.Types.ObjectId(obj.brand_id),
        category_id: new mongoose.Types.ObjectId(obj.category_id),
        model_id: new mongoose.Types.ObjectId(obj.model_id),
        varient_id: new mongoose.Types.ObjectId(obj.varient_id),
        varient: obj.varient,
        varient_ar: obj.varient_ar,
        user_id: new mongoose.Types.ObjectId(user_id),
        promocode: !obj.promocode
          ? null
          : new mongoose.Types.ObjectId(obj.promocode),
        product_images: obj.product_images || [],
        code: generateCode(7),
        isApproved: obj.isApproved || false,
        sell_price: obj.sell_price || 0,
        bid_price: obj.bid_price || 0,
        body_cracks: obj.body_cracks === 'yes' ? 'yes' : 'no',
        description: obj.description || '',
        isListedBefore: obj.isListedBefore === 'yes' ? true : false,
        attributes:
          obj.attributes?.map((item: string) => {
            return new mongoose.Types.ObjectId(item);
          }) || [],
        score: obj.score,
        grade: obj.grade,
        grade_ar: obj.grade_ar,
        expiryDate: moment().add(obj.expiryAfterInDays, 'days').toDate(),
        createdDate: moment().toDate(),
        recommended_price: obj.recommended_price || null,
        defected_images: obj.defected_images || [],
        answer_to_questions: '',
        answer_to_questions_ar: '',
        previous_grade: '',
        previous_score: null,
        pick_up_address: '',
        bidding: [],
        save_as_draft_step: '',
        current_bid_price: 0,
        favourited_by: [],
        reportedBy: [],
        status: obj.status,
        sell_status: obj.sell_status,
        response: obj.response
          ? new mongoose.Types.ObjectId(obj.response)
          : null,
        questionnaire_migration_status:
          obj.questionnaire_migration_status || '',
        isExpired: obj.isExpired,
        isFraudDetected: obj.isFraudDetected,
        verified_date: obj.verified_date,
        expiryAfterInDays: obj.expiryAfterInDays,
        variant_attributes_selections: [],
        mismatch_model_migration: '',
        listingQuantity: obj.listingQuantity,
        billingSettings: obj.billingSettings,
        listingGroupId: obj.listingGroupId,
        isModelImage: obj.isModelImage,
        condition_id: obj?.condition_id || '',
        listingSource: obj.listingSource,
        isBiddingProduct: obj.isBiddingProduct,
        trade_in: obj.trade_in,
        auto_approve_at: obj.auto_approve_at,
        listingAddress: obj.listingAddress,
        inventoryId: obj?.inventoryId,
        isConsignment: obj?.isConsignment,
      });

      const draftProduct = await product.save();

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: draftProduct },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAIL_TO_CREATE_PRODUCT,
            message: exception.message,
          },
        ];
      }
    }
  }

  async findAndUpdateAnswerToQuestionProduct(
    productId: string,
    answer_to_questions_en: AnswerToQuestion[],
    answer_to_questions_ar: AnswerToQuestion[]
  ): Promise<[boolean, { code: number; result: string; message?: string }]> {
    try {
      const product = await ProductModel.findById(productId).exec();
      if (!product) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND,
          },
        ];
      }

      product.answer_to_questions_migration = JSON.stringify(
        answer_to_questions_en
      );
      product.answer_to_questions_ar_migration = JSON.stringify(
        answer_to_questions_ar
      );
      product.updatedDate = moment().toDate();
      await product.save();

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: "Product's update answer_to_question success",
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async getQuestionAnswerProduct(
    productId: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      // @ts-ignore
      const product = await ProductModel.findById(productId)
        .select(
          'answer_to_questions_migration answer_to_questions_ar_migration'
        )
        .lean()
        .exec();
      if (!product) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: product }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_QUESTION,
          message: exception.message,
        },
      ];
    }
  }

  async findAndUpdateScoreProduct(
    productId: string,
    score: number
  ): Promise<[boolean, { code: number; result: string; message?: string }]> {
    try {
      const setting = settingScoreCondition(score.toString());

      const product = await ProductModel.findById(productId).exec();
      if (!product) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND,
          },
        ];
      }
      product.previous_grade = product.grade;
      product.previous_score = product.score;

      product.grade = setting.grade;
      product.grade_ar = setting.grade_ar;
      product.score = parseFloat(score.toFixed(2));
      await product.save();

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: "Product's update score success",
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async findAndLinkResponseToProduct(
    productId: string,
    responseId: string
  ): Promise<[boolean, { code: number; result: string; message?: string }]> {
    try {
      const product = (await ProductModel.findById(productId).exec()) as any;
      if (!product) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND,
          },
        ];
      }
      product.response = new mongoose.Types.ObjectId(responseId);
      await product.save();

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: "Product's update success",
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async updateProduct(
    id_product: any,
    updatedProduct: any
  ): Promise<[boolean, { result: ILegacyProductModel; message?: string }]> {
    try {
      const product: ILegacyProductModel = await ProductModel.findById(
        id_product
      ).exec();
      if (!product) {
        return [
          true,
          { result: null, message: Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND },
        ];
      }

      if (product.user_id != updatedProduct.sellerId) {
        return [
          true,
          { result: null, message: Constants.ERROR_MAP.UNAUTHORIZED_USER },
        ];
      }

      // set product properties
      product.brand_id = updatedProduct.brand_id || product.brand_id;
      product.category_id = updatedProduct.category_id || product.category_id;
      product.model_id = updatedProduct.model_id || product.model_id;
      product.status = updatedProduct.status || product.status;
      product.product_images =
        updatedProduct.product_image_arr?.length > 0
          ? updatedProduct.product_image_arr
          : product.product_images;
      product.promocode =
        updatedProduct.promo_code || product.promocode || null;
      product.score = updatedProduct.score || product.score;
      product.grade = updatedProduct.grade || product.grade;
      product.grade_ar = updatedProduct.grade_ar || product.grade_ar;
      product.updatedDate = moment().toDate();

      const saved = await product.save();
      return [false, { result: saved, message: 'Update product successfully' }];
    } catch (exception) {
      return [true, { result: exception, message: exception.message }];
    }
  }

  async updateLegacyProduct(
    product: ILegacyProductModel,
    updatingData: LegacyProductInput,
    validateModifiedOnly: boolean = true
  ) {
    Object.keys(updatingData).forEach(key => {
      product.set(key, (updatingData as any)[key]);
    });

    return product.save({ validateModifiedOnly });
  }

  async getNumberOfPages(size: number) {
    if (isNaN(size) || size <= 0) return { total: 0, pages: 0 };
    const count = await ProductModel.estimatedDocumentCount().exec();
    return { total: count, pages: Math.ceil(count / size) };
  }

  async getProductWithPagination(size: number, page: number) {
    try {
      const data = await ProductModel.find({})
        .populate({
          path: 'brand',
          select: { _id: 1, brand_name_en: 1, brand_name_ar: 1, active: 1 },
        })
        .populate({
          path: 'category',
          select: {
            _id: 1,
            category_name_ar: 1,
            category_name_en: 1,
            active: 1,
          },
        })
        .populate({
          path: 'model',
          select: { _id: 1, model_name_ar: 1, model_name_en: 1, active: 1 },
        })
        .populate({
          path: 'questionnaire',
          select: { _id: 1, created_date: 1, updated_date: 1 },
        })
        .populate({
          path: 'color',
          select: {
            _id: 1,
            color_name_ar: 1,
            color_name_en: 1,
            created_date: 1,
            updated_date: 1,
          },
        })
        .populate({
          path: 'variant',
          select: {
            _id: 1,
            variant_name_ar: 1,
            variant_name_en: 1,
            created_date: 1,
            updated_date: 1,
          },
        })
        .skip((page - 1) * size)
        .limit(size)
        .exec();
      data.map((product: any) => {
        return getNewConditionName(product);
      });
      return [false, data];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION];
    }
  }

  async getProductWithFiltering(filters: any) {
    try {
      // set up new array for ids
      filters.category_ids = [];
      filters.model_ids = [];
      filters.brand_ids = [];
      filters.color_ids = [];
      filters.variant_ids = [];
      // loop categories
      for (const category of filters.categories) {
        // push new ids
        filters.category_ids.push(new mongoose.Types.ObjectId(category));
      }

      // loop brands
      for (const brand of filters.brands) {
        // push new ids
        filters.brand_ids.push(new mongoose.Types.ObjectId(brand));
      }

      // loop model
      for (const model of filters.models) {
        // push new ids
        filters.model_ids.push(new mongoose.Types.ObjectId(model));
      }

      // loop color
      for (const color of filters.colors) {
        // push new ids
        filters.color_ids.push(new mongoose.Types.ObjectId(color));
      }

      // loop variant
      for (const variant of filters.variants) {
        // push new ids
        filters.variant_ids.push(new mongoose.Types.ObjectId(variant));
      }

      // build match criteria
      const match_criteria: any = {
        deleted_date: null,
        active: true,
        trade_in: { $ne: true },
      };

      // check for categories
      if (filters.categories.length > 0) {
        match_criteria['category'] = {
          $in: filters.category_ids,
        };
      }
      // check for models
      if (filters.models.length > 0) {
        match_criteria['model'] = {
          $in: filters.model_ids,
        };
      }
      // check for brand
      if (filters.brands.length > 0) {
        match_criteria['brand'] = {
          $in: filters.brand_ids,
        };
      }

      // check for color
      if (filters.colors.length > 0) {
        match_criteria['color'] = {
          $in: filters.color_ids,
        };
      }

      // check for variant
      if (filters.variants.length > 0) {
        match_criteria['variant'] = {
          $in: filters.variant_ids,
        };
      }

      // check for search
      if (filters.search != '') {
        match_criteria.$or = [
          {
            product_name: {
              $regex: '.*' + filters.search + '.*',
              $options: 'i',
            },
          },
          { status: { $regex: '.*' + filters.search + '.*', $options: 'i' } },
          { score: { $regex: '.*' + filters.search + '.*', $options: 'i' } },
        ];
      }

      if (filters.range_price_to > 0) {
        match_criteria['current_price'] = {
          $lte: parseFloat(filters.range_price_to),
          $gte: parseFloat(filters.range_price_from),
        };
      }

      const data = await ProductModel.aggregate([
        {
          $project: {
            product_name: 1,
            product_name_ar: 1,
            status: 1,
            active: 1,
            current_price: 1,
            discount: 1,
            sell_price: 1,
            bid_price: 1,
            current_bid_price: 1,
            product_image: 1,
            score: 1,
            brand: 1,
            category: 1,
            model: 1,
            color: 1,
            variant: 1,
            seller: 1,
            questionnaire: 1,
            specification: 1,
            created_date: 1,
            updated_date: 1,
            deleted_date: 1,
          },
        },
        {
          $match: match_criteria,
        },
      ])
        .sort({
          current_price: filters.sorting === 'ASC' ? 1 : -1,
          created_date: 1,
        })
        .skip((filters.page - 1) * filters.size)
        .limit(filters.size)
        .exec();
      return [false, data];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAIL_TO_FILTERING_PRODUCT];
    }
  }

  async findProductById(id: string) {
    return await ProductModel.findById(id).exec();
  }

  async addFollowingUser(
    product_id: string,
    user_id: string,
    user_name: string,
    role: string,
    session: ClientSession
  ) {
    try {
      const product: ProductDocument = await Product.findById(product_id)
        .session(session)
        .exec();
      if (!product) return [true, Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND];
      if (!product.followed_users) product.followed_users = [];
      const matchedInFollowerId = product.followed_users.findIndex(
        (item: any) => item.follower_id === user_id
      );
      if (matchedInFollowerId < 0) {
        product.followed_users.push({
          follower_id: user_id,
          username: user_name,
          role: role,
        });
      }
      await product.save({ session: session });
      return [false, 'Added follower'];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_ADD_PRODUCT_TO_WISHLIST];
    }
  }

  async getWishList(user_id: string) {
    try {
      const products = await Product.find({
        deleted_date: null,
        followed_users: {
          $elemMatch: {
            follower_id: user_id,
          },
        },
      })
        .select(
          '_id status product_name product_name_ar active current_price discount sell_price' +
            ' bid_price current_bid_price product_image brand category model created_date'
        )
        .exec();
      return [false, products];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_GET_WISH_LIST];
    }
  }

  async addAskSeller(
    questionerId: string,
    product_id: string,
    question: string,
    sellerID?: string
  ): Promise<[boolean, mongoose.Document<typeof AskSeller> | string]> {
    try {
      const askSeller = new AskSeller({
        product_id: new mongoose.Types.ObjectId(product_id),
        question: question,
        questioner_id: new mongoose.Types.ObjectId(questionerId),
        seller_id: new mongoose.Types.ObjectId(sellerID),
      });
      const result = await askSeller.save();

      return [false, result];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        return [true, Constants.ERROR_MAP.DUPLICATE_REQUEST];
      }

      return [true, exception.message];
    }
  }

  async updateAskSeller(
    questionId: string,
    productId: string,
    updatedData: any
  ) {
    try {
      const askSeller = (await AskSeller.findOne({
        _id: questionId,
        product_id: productId,
      }).exec()) as AskSellerType;
      if (!askSeller) {
        return [true, 'Ask Seller not found'];
      }
      askSeller.question = updatedData.question || askSeller.question;
      askSeller.answer = updatedData.answer || askSeller.answer;
      askSeller.updated_date = moment().toDate();
      await askSeller.save();

      return [false, askSeller];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, exception.message];
      }
    }
  }

  async getAskSeller(
    productId: string,
    isSeller: boolean
  ): Promise<[boolean, AskSellerType[] | string]> {
    try {
      const matchConditions: any = {
        product_id: new mongoose.Types.ObjectId(productId),
        status: 'Active',
      };

      if (!isSeller) {
        matchConditions.answer = { $ne: null };
      }

      const pipeline = [
        {
          $match: matchConditions,
        },
        lookup('users', 'questioner_id', '_id', 'buyer'),
        unwind('$buyer', false),
        {
          $sort: { answer: 1, updated_date: -1 },
        },
        {
          $project: {
            product_id: 1,
            questioner_id: 1,
            seller_id: 1,
            question: 1,
            answer: 1,
            created_date: 1,
            updated_date: 1,
            deleted_date: 1,
            deleted_by: 1,
            deleted_reason: 1,
            status: 1,
            buyer_name: '$buyer.name',
          },
        },
      ];

      const products = (await AskSeller.aggregate(
        pipeline
      ).exec()) as AskSellerType[];

      return [false, products];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, exception.message];
      }
    }
  }

  async applyPromoCode(
    productId: string,
    promoCodeId: string,
    session: ClientSession
  ) {
    try {
      const product: ProductDocument = await Product.findById(productId)
        .session(session)
        .exec();
      if (product.promo_code.toString() === promoCodeId.toString()) {
        // same promo mode
        return [false, Constants.ERROR_MAP.ALREADY_APPLY_CURRENT_PROMO_CODE];
      }
      product.promo_code = promoCodeId;
      await product.save({ session: session });
      return [false, 'Updated'];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT];
    }
  }

  async applyPromoCodeViaUserId(
    userId: string,
    promoCodeId: string,
    session: ClientSession
  ) {
    try {
      await Product.findOneAndUpdate(
        { seller: userId },
        { promo_code: promoCodeId }
      )
        .session(session)
        .exec();
      return [false, 'Updated'];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT];
    }
  }

  async addGenerativeQASeller(
    productId: string,
    question: string
  ): Promise<void> {
    try {
      const generativeQA = (await AskSeller.findOne({
        product_id: productId,
        status: 'Active',
        question,
      }).exec()) as AskSellerType;

      if (!generativeQA) {
        const askSeller = new AskSeller({
          product_id: new mongoose.Types.ObjectId(productId),
          question: question,
        });
        await askSeller.save();
      }
      return;
    } catch (exception) {}
  }

  async getProductIds(
    productIds: string[]
  ): Promise<[boolean, ProductDocument[] | string]> {
    try {
      // set up new array for ids
      const product_ids = [];
      // loop categories
      for (const prodId of productIds) {
        // push new ids
        product_ids.push(new mongoose.Types.ObjectId(prodId));
      }

      const products = await Product.find({
        _id: {
          $in: product_ids,
        },
      })
        .select('_id')
        .exec();

      if (!products) {
        return [true, Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND];
      }

      return [false, products];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAIL_TO_FILTERING_PRODUCT];
    }
  }

  async resetResponseProduct(session: ClientSession) {
    try {
      await Product.updateMany(
        {},
        { $set: { response: null } },
        { session: session }
      ).exec();
      return [false, 'Done to reset response of product'];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT];
    }
  }

  async getFirstProductNotMigrated() {
    try {
      const product = await ProductModel.findOne({
        questionnaire_migration_status: null,
        trade_in: { $ne: true },
      })
        .lean()
        .exec();
      if (!product) {
        // when all products are migrated
        //that means 0 products are returned with for question_migrated_status is undefined
        return [false, null];
      }
      return [false, product];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAIL_TO_FILTERING_PRODUCT];
    }
  }

  async updateAnswerQuestionInProductModel(
    id_product: any,
    oldQuestionArray: any,
    responseId: string
  ) {
    try {
      const product = (await ProductModel.findById(id_product).exec()) as any;
      if (!product) {
        return [true, Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND];
      }

      product.response = new mongoose.Types.ObjectId(responseId);
      product.updatedDate = moment().toDate();

      await product.save();
      return [false, 'Update product successfully'];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT];
    }
  }

  async updateUnAnswerQuestionInProductModel(
    id_product: any,
    unAnswerQuestionArray: any
  ) {
    try {
      const product = (await ProductModel.findById(id_product).exec()) as any;
      if (!product) {
        return [true, Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND];
      }
      if (
        product.unansweredQuestions &&
        product.unansweredQuestions.length > 0
      ) {
        const existUnansweredQuestions = JSON.parse(
          product.unansweredQuestions
        );
        const diff = _differenceWith(
          unAnswerQuestionArray,
          existUnansweredQuestions,
          _isEqual
        );
        product.unansweredQuestions =
          diff.length > 0
            ? JSON.stringify(existUnansweredQuestions.concat(diff))
            : JSON.stringify(unAnswerQuestionArray);
      } else {
        product.unansweredQuestions = JSON.stringify(unAnswerQuestionArray);
      }
      product.updatedDate = moment().toDate();
      await product.save();
      return [false, 'Update product successfully'];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT];
    }
  }

  async updateUnMatchingAnswerQuestionInProductModel(
    id_product: any,
    unMatchingAnswerQuestionArray: any
  ) {
    try {
      const product = (await ProductModel.findById(id_product).exec()) as any;
      if (!product) {
        return [true, Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND];
      }
      if (product.unmatchedQuestions && product.unmatchedQuestions.length > 0) {
        const existUnmatchedAnswerQuestions = JSON.parse(
          product.unmatchedQuestions
        );
        const diff = _differenceWith(
          unMatchingAnswerQuestionArray,
          existUnmatchedAnswerQuestions,
          _isEqual
        );
        product.unmatchedQuestions =
          diff.length > 0
            ? JSON.stringify(existUnmatchedAnswerQuestions.concat(diff))
            : JSON.stringify(unMatchingAnswerQuestionArray);
      } else {
        product.unmatchedQuestions = JSON.stringify(
          unMatchingAnswerQuestionArray
        );
      }
      product.updatedDate = moment().toDate();
      await product.save();
      return [false, 'Update product successfully'];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT];
    }
  }

  async updateMigrationFlagInProductModel(id_product: any, state: string) {
    try {
      const product: ILegacyProductModel = await ProductModel.findById(
        id_product
      ).exec();
      if (!product) {
        return [true, Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND];
      }
      product.questionnaire_migration_status = state;
      product.updatedDate = moment().toDate();
      const updatedProduct = await product.save();
      return [false, updatedProduct];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT];
    }
  }

  async getMySellProducts(
    userId: string,
    size: number,
    page: number,
    isExpired?: boolean,
    sort?: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      let expiredCondition;

      if (isExpired) {
        expiredCondition = {
          $or: [
            { isExpired: true },
            { status: ProductStatus.Idle },
            { expiryDate: { $lte: moment().toDate() } },
          ],
        };
      } else {
        expiredCondition = {
          $and: [
            { isExpired: false },
            { expiryDate: { $gt: moment().toDate() } },
          ],
        };
      }
      const matchCondition = {
        $match: {
          $and: [
            { user_id: new mongoose.Types.ObjectId(userId) },
            {
              $or: [
                {
                  $and: [
                    {
                      status: 'Active',
                    },
                    {
                      isApproved: { $eq: true },
                    },
                  ],
                },
                { status: ProductStatus.OnHold },
                { status: ProductStatus.Reject },
                { status: ProductStatus.Idle },
              ],
            },
            { sell_status: { $ne: 'Sold' } },
            expiredCondition,
            { trade_in: { $ne: true } },
          ],
        },
      };
      const options = [
        matchCondition,
        lookup('categories', 'category_id', '_id', 'category_id'),
        lookup('brands', 'brand_id', '_id', 'brand_id'),
        unwind('$brand_id'),
        lookup('device_models', 'model_id', '_id', 'model_id'),
        unwind('$model_id'),
        lookup('varients', 'varient_id', '_id', 'varient_id'),
        unwind('$varient_id'),
        lookup('promocodes', 'promocode', '_id', 'promocode'),
        {
          $project: {
            _id: 1,
            user_id: 1,
            category_id: 1,
            brand_id: 1,
            model_id: 1,
            varient_id: 1,
            varient: 1,
            sell_price: 1,
            bid_price: 1,
            product_images: 1,
            defected_images: 1,
            body_cracks: 1,
            description: 1,
            answer_to_questions: 1,
            answer_to_questions_ar: 1,
            score: 1,
            grade: 1,
            current_bid_price: 1,
            sell_status: 1,
            status: 1,
            save_as_draft_step: 1,
            createdDate: 1,
            expiryDate: 1,
            promocode: 1,
            rejected_reasons: 1,
            condition_id: 1,
            productCurrentStatus: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        { $eq: ['$status', 'On hold'] },
                        { $eq: ['$isApproved', false] },
                      ],
                    },
                    then: 'Pending',
                  },
                  {
                    case: {
                      $and: [{ $eq: ['$status', 'Reject'] }],
                    },
                    then: 'Rejected',
                  },
                  {
                    case: {
                      $and: [{ $eq: ['$status', 'Idle'] }],
                    },
                    then: 'Idle',
                  },
                ],
                default: 'Approved',
              },
            },
            isBiddingProduct: 1,
            billingSettings: 1,
            listingGroupId: 1,
            listingQuantity: 1,
          },
        },
        {
          $sort: {
            createdDate: sort === 'latest' ? -1 : 1,
            expiryDate: -1,
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: (page - 1) * size }, { $limit: size }],
            pagination: [{ $count: 'total' }],
          },
        },
      ];
      const products = await ProductModel.aggregate(options).exec();

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: products },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
          message: exception.message,
        },
      ];
    }
  }

  async getMySellProductsBySubmodule(
    userId: string,
    productIds: string[],
    size: number,
    skip: number,
    isExpired?: boolean,
    sort?: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      let matchCondition: any;
      if (isExpired) {
        matchCondition = {
          $match: {
            $and: [
              { user_id: new mongoose.Types.ObjectId(userId) },
              { trade_in: { $ne: true } },
              { isConsignment: { $ne: true } },
              { status: { $ne: ProductStatus.Delete } },
              {
                $or: [
                  { isExpired: true },
                  { status: ProductStatus.Idle },
                  { expiryDate: { $lte: new Date() } },
                ],
              },
            ],
          },
        };
      } else {
        matchCondition = {
          $match: {
            $and: [
              { user_id: new mongoose.Types.ObjectId(userId) },
              { trade_in: { $ne: true } },
              { isConsignment: { $ne: true } },
              { isExpired: false },
              { expiryDate: { $gt: new Date() } },
              {
                $or: [
                  { status: ProductStatus.Active },
                  { status: ProductStatus.Reject },
                  { status: ProductStatus.OnHold },
                ],
              },
              { sell_status: { $eq: ProductOrderStatus.Available } },
            ],
          },
        };
      }
      if (productIds?.length) {
        skip = 0;
        matchCondition = {
          $match: {
            $and: [
              { user_id: new mongoose.Types.ObjectId(userId) },
              { isConsignment: { $ne: true } },
              {
                _id: {
                  $in: productIds.map(elem => mongoose.Types.ObjectId(elem)),
                },
              },
            ],
          },
        };
      }
      const options = [
        matchCondition,
        lookup('categories', 'category_id', '_id', 'category_id'),
        lookup('brands', 'brand_id', '_id', 'brand_id'),
        unwind('$brand_id'),
        lookup('device_models', 'model_id', '_id', 'model_id'),
        unwind('$model_id'),
        lookup('varients', 'varient_id', '_id', 'varient_id'),
        unwind('$varient_id'),
        lookup('promocodes', 'promocode', '_id', 'promocode'),
        {
          $project: {
            _id: 1,
            user_id: 1,
            category_id: 1,
            brand_id: 1,
            model_id: 1,
            varient_id: 1,
            varient: 1,
            sell_price: 1,
            bid_price: 1,
            product_images: 1,
            defected_images: 1,
            body_cracks: 1,
            description: 1,
            answer_to_questions: 1,
            answer_to_questions_ar: 1,
            score: 1,
            grade: 1,
            current_bid_price: 1,
            sell_status: 1,
            status: 1,
            save_as_draft_step: 1,
            createdDate: 1,
            expiryDate: 1,
            promocode: 1,
            rejected_reasons: 1,
            condition_id: 1,
            productCurrentStatus: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        { $eq: ['$status', 'On hold'] },
                        { $eq: ['$isApproved', false] },
                      ],
                    },
                    then: 'Pending',
                  },
                  {
                    case: {
                      $and: [{ $eq: ['$status', 'Reject'] }],
                    },
                    then: 'Rejected',
                  },
                  {
                    case: {
                      $and: [{ $eq: ['$status', 'Idle'] }],
                    },
                    then: 'Idle',
                  },
                ],
                default: 'Approved',
              },
            },
            isBiddingProduct: 1,
            billingSettings: 1,
            listingGroupId: 1,
            listingQuantity: 1,
          },
        },
        {
          $sort: {
            createdDate: sort === 'latest' ? -1 : 1,
            expiryDate: -1,
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: skip }, { $limit: size }],
            pagination: [{ $count: 'total' }],
          },
        },
      ];
      const products = await ProductModel.aggregate(options).exec();
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: products },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
          message: exception.message,
        },
      ];
    }
  }

  async getProductDetails(
    productIds: string[]
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const options = [
        {
          $match: {
            _id: {
              $in: productIds.map(elem => mongoose.Types.ObjectId(elem)),
            },
          },
        },
        lookup('categories', 'category_id', '_id', 'category_id'),
        unwind('$category_id'),
        lookup('brands', 'brand_id', '_id', 'brand_id'),
        unwind('$brand_id'),
        lookup('device_models', 'model_id', '_id', 'model_id'),
        unwind('$model_id'),
        lookup('varients', 'varient_id', '_id', 'varient_id'),
        unwind('$varient_id'),
        lookup('promocodes', 'promocode', '_id', 'promocode'),
        lookup('users', 'user_id', '_id', 'seller'),
        unwind('$seller'),
        {
          $project: {
            _id: 1,
            user_id: 1,
            category_id: 1,
            brand_id: 1,
            model_id: 1,
            varient_id: 1,
            varient: 1,
            sell_price: 1,
            bid_price: 1,
            product_images: 1,
            defected_images: 1,
            body_cracks: 1,
            description: 1,
            answer_to_questions: 1,
            answer_to_questions_ar: 1,
            score: 1,
            grade: 1,
            current_bid_price: 1,
            sell_status: 1,
            status: 1,
            save_as_draft_step: 1,
            createdDate: 1,
            expiryDate: 1,
            promocode: 1,
            rejected_reasons: 1,
            condition_id: 1,
            isBiddingProduct: 1,
            billingSettings: 1,
            listingGroupId: 1,
            listingQuantity: 1,
            sellerIsMerchant: '$seller.isMerchant',
            sellerId: '$seller._id',
            sellerName: '$seller.name',
          },
        },
      ];
      const products = await ProductModel.aggregate(options).exec();
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: products },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
          message: exception.message,
        },
      ];
    }
  }

  async getMyBidProducts(
    userId: string,
    size: number,
    page: number,
    status?: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const options = [
        {
          $match: {
            'bidding.user_id': mongoose.Types.ObjectId(userId),
            status: 'Active',
            trade_in: { $ne: true },
            $or: [{ sell_status: 'Locked' }, { sell_status: 'Available' }],
          },
        },
        {
          $addFields: {
            bidding: {
              $filter: {
                input: '$bidding',
                as: 'bidding',
                cond: {
                  $eq: ['$$bidding.user_id', mongoose.Types.ObjectId(userId)],
                },
              },
            },
          },
        },
        lookup('categories', 'category_id', '_id', 'category_id'),
        unwind('$category_id'),
        lookup('brands', 'brand_id', '_id', 'brand_id'),
        unwind('$brand_id'),
        lookup('device_models', 'model_id', '_id', 'model_id'),
        unwind('$model_id'),
        lookup('varients', 'varient_id', '_id', 'varient_id'),
        unwind('$varient_id'),
        lookup('users', 'user_id', '_id', 'seller'),
        unwind('$seller'),
        {
          $project: {
            _id: 1,
            product_id: '$_id',
            user_id: 1,
            bidding: 1,
            varient: 1,
            sell_price: 1,
            bid_price: 1,
            product_images: 1,
            defected_images: 1,
            body_cracks: 1,
            description: 1,
            answer_to_questions: 1,
            answer_to_questions_ar: 1,
            score: 1,
            grade: 1,
            current_bid_price: 1,
            my_bid: { $arrayElemAt: ['$bidding.bid_price', -1] },
            bid_status: { $arrayElemAt: ['$bidding.bid_status', -1] },
            bid_id: { $arrayElemAt: ['$bidding.bid_id', -1] },
            payment_take: { $arrayElemAt: ['$bidding.payment_take', -1] },
            remaining_bid_amount: {
              $arrayElemAt: ['$bidding.remaining_bid_amount', -1],
            },
            grand_total: { $arrayElemAt: ['$bidding.grand_total', -1] },
            'category_id.category_name': 1,
            'category_id.category_name_ar': 1,
            'brand_id.brand_name': 1,
            'brand_id.brand_name_ar': 1,
            'model_id.model_name': 1,
            'model_id.model_name_ar': 1,
            'model_id.current_price': 1,
            seller_id: '$seller._id',
            seller_name: '$seller.name',
            'varient_id._id': 1,
            'varient_id.varient': 1,
            'varient_id.current_price': 1,
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: (page - 1) * size }, { $limit: size }],
          },
        },
      ];
      if (status && status.length > 0) {
        options[0].$match = {
          ...options[0].$match,
          'bidding.bid_status': status,
        } as any;
      }
      const products = await ProductModel.aggregate(options).exec();
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: products },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_BID_PRODUCT_PAGINATION,
          message: exception.message,
        },
      ];
    }
  }

  async getBidsInMySellProducts(
    userId: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const options = [
        {
          $match: {
            user_id: new mongoose.Types.ObjectId(userId),
            status: 'Active',
            sell_status: { $ne: 'Sold' },
            bidding: { $ne: [] as any },
            trade_in: { $ne: true },
          },
        },
        lookup('categories', 'category_id', '_id', 'category'),
        unwind('$category'),
        lookup('brands', 'brand_id', '_id', 'brand'),
        unwind('$brand'),
        lookup('device_models', 'model_id', '_id', 'model'),
        unwind('$model'),
        lookup('varients', 'varient_id', '_id', 'varient_id'),
        unwind('$varient_id'),
        lookup('promocodes', 'promocode', '_id', 'promocode'),
        {
          $project: {
            _id: 1,
            user_id: 1,
            category: 1,
            brand: 1,
            model: 1,
            varient_id: 1,
            varient: 1,
            sell_price: 1,
            bid_price: 1,
            product_images: 1,
            defected_images: 1,
            body_cracks: 1,
            description: 1,
            answer_to_questions: 1,
            answer_to_questions_ar: 1,
            score: 1,
            grade: 1,
            current_bid_price: 1,
            sell_status: 1,
            status: 1,
            isExpired: 1,
            isListedBefore: 1,
            createdDate: 1,
            expiryDate: 1,
            promocode: 1,
            bidding: 1,
            highlights: 1,
          },
        },
        { $sort: { createdDate: 1 } },
      ];
      const products = await ProductModel.aggregate(options).exec();
      products.map((product: any) => {
        return getNewConditionName(product);
      });
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: products },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
          message: exception.message,
        },
      ];
    }
  }

  async getProductsOfUser(
    userId: string,
    selectedFields: string,
    includeSoldItem: boolean = false
  ): Promise<
    [boolean, { code: number; result: ILegacyProductModel[]; message?: string }]
  > {
    const productsQuery = ProductModel.find({
      user_id: userId,
      status: 'Active',
      trade_in: { $ne: true },
      ...(!includeSoldItem && { sell_status: { $ne: 'Sold' } }),
    });

    if (selectedFields) {
      productsQuery.select(selectedFields);
    }
    const products = await productsQuery.sort({ createdDate: -1 }).exec();

    return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: products }];
  }

  async getEditListingProduct(productId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: LeanDocument<ILegacyProductModel> | string;
        message?: string;
      }
    ]
  > {
    try {
      const product = await ProductModel.findById(productId)
        .populate({
          path: 'brand_id',
          model: Brand,
          select: { _id: 1, brand_name: 1, brand_name_ar: 1 },
        })
        .populate({
          path: 'category_id',
          model: Category,
          select: { _id: 1, category_name_ar: 1, category_name: 1 },
        })
        .populate({
          path: 'model_id',
          model: DeviceModel,
          select: { _id: 1, model_name_ar: 1, model_name: 1 },
        })
        .populate({
          path: 'varient_id',
          model: Variant,
          select: { _id: 1, varient: 1, varient_ar: 1 },
        })
        .select(
          'sell_status sell_price bid_price bidding expiryDate user_id ' +
            'condition_id brand_id category_id model_id varient_id varient varient_ar listingGroupId'
        )
        .lean()
        .exec();
      if (!product) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.PRODUCT_ID_NOT_FOUND,
            message: Constants.MESSAGE.PRODUCT_ID_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: product }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DETAIL_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async updatePriceListing(
    productId: string,
    sellPrice: number,
    bidPrice: number
  ): Promise<
    [
      boolean,
      { code: number; result: ILegacyProductModel | string; message?: string }
    ]
  > {
    try {
      let isUpdated: boolean;

      const product = await ProductModel.findById(productId).exec();
      if (product.sell_price != sellPrice) {
        product.sell_price = sellPrice;
        isUpdated = true;
      }
      if (product.bid_price != bidPrice) {
        product.bid_price = bidPrice;
        product.current_bid_price = bidPrice;
        isUpdated = true;
      }
      if (isUpdated) {
        const updatedProduct = await product.save();
        return [
          false,
          { code: Constants.SUCCESS_CODE.SUCCESS, result: updatedProduct },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: product }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_PRICE_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async rejectBid(
    productId: string,
    bidId: string
  ): Promise<
    [
      boolean,
      { code: number; result: ILegacyProductModel | string; message?: string }
    ]
  > {
    try {
      await ProductModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(productId),
          'bidding.bid_id': mongoose.Types.ObjectId(bidId),
        },
        {
          $set: {
            'bidding.$.bid_status': Constants.BID_STATUS.REJECTED,
            'bidding.$.reject_date': moment().toDate(),
          },
        }
      );
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: Constants.MESSAGE.REJECTED_BID_SUCCESS,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_REJECT_BIDS_IN_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }
  async getTotalCountPerModel(
    models: string[],
    priceMin: number,
    priceMax: number
  ): Promise<[boolean, { code: number; result: any[]; message?: string }]> {
    const aggregate = [
      {
        $match: {
          model_id: {
            $in: models.map(elem => mongoose.Types.ObjectId(elem)),
          },
          isApproved: true,
          sell_status: 'Available',
          status: 'Active',
          $and: [
            { sell_price: { $lte: priceMax } },
            { sell_price: { $gte: priceMin } },
          ],
          expiryDate: { $gte: new Date(new Date().toISOString()) },
        },
      },
      {
        $group: {
          _id: '$model_id',
          totalAvailableProducts: { $sum: 1 },
        },
      },
    ];
    const totalProductsCount = await ProductModel.aggregate(aggregate);
    return [
      false,
      { code: Constants.SUCCESS_CODE.SUCCESS, result: totalProductsCount },
    ];
  }

  async getTotalCountPerModelByCategory(
    categoryId: string
  ): Promise<[boolean, { code: number; result: any[]; message?: string }]> {
    try {
      const aggregate = [
        {
          $match: {
            category_id: categoryId,
            isApproved: true,
            sell_status: 'Available',
            status: 'Active',
            expiryDate: { $gte: new Date(new Date().toISOString()) },
          },
        },
        {
          $lookup: {
            from: 'device_models',
            localField: 'model_id',
            foreignField: '_id',
            as: 'model',
          },
        },
        {
          $unwind: {
            path: '$model',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            varientId: { $first: '$varient_id' },
            productId: { $first: '$_id' },
            _id: '$model_id',
            totalAvailableProducts: { $sum: 1 },
            categoryId: { $first: categoryId },
            brandId: { $first: '$brand_id' },
            modelId: { $first: '$model_id' },
            modelName: { $first: '$model.model_name' },
            modelNameAr: { $first: '$model.model_name_ar' },
            modelIcon: { $first: '$model.model_icon' },
          },
        },
      ];
      const totalProductsCount = await ProductModel.aggregate(aggregate);
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: totalProductsCount },
      ];
    } catch (err) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: [Constants.ERROR_MAP.FAILED_TO_GET_PRODUCTS],
          message: err.message,
        },
      ];
    }
  }

  async getTotalAvailableProduct(
    prodIds: mongoose.Types.ObjectId[]
  ): Promise<[boolean, { code: number; result: number; message?: string }]> {
    const totalAvailable = await ProductModel.countDocuments({
      _id: { $in: prodIds },
      status: 'Active',
      sell_status: 'Available',
    }).exec();

    return [
      false,
      { code: Constants.SUCCESS_CODE.SUCCESS, result: totalAvailable },
    ];
  }

  async updateProductHighlights(
    prodId: mongoose.Types.ObjectId,
    highlights: mongoose.Types.ObjectId[],
    highlightStatus: string
  ): Promise<[boolean, { code: number; result: number; message?: string }]> {
    const totalAvailable = await ProductModel.updateOne(
      { _id: prodId },
      {
        highlights,
        highlightsAdded: highlightStatus,
      }
    ).exec();

    return [
      false,
      { code: Constants.SUCCESS_CODE.SUCCESS, result: totalAvailable },
    ];
  }
  async getNewProducts(): Promise<
    [
      boolean,
      { code: number; result: string | ILegacyProductModel[]; message: string }
    ]
  > {
    try {
      const data = await ProductModel.find({
        highlightsAdded: {
          $nin: [
            ProductHighlights.NoHighlightsAvailable,
            ProductHighlights.Highlighted,
          ],
        },
        sell_status: 'Available',
        trade_in: { $ne: true },
      })
        .sort({ createdDate: -1 })
        .limit(5)
        .populate('response');
      if (!data)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCTS,
            message: Constants.MESSAGE.FAILED_TO_GET_PRODUCTS,
          },
        ];
      return [
        false,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: data,
          message: null,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCTS,
          message: exception.message,
        },
      ];
    }
  }
  async changeProductStatus(
    productId: mongoose.Types.ObjectId,
    sellStatus: ProductOrderStatus
  ) {
    try {
      await ProductModel.findOneAndUpdate(
        { _id: productId },
        { $set: { sell_status: sellStatus } }
      );
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: Constants.ERROR_MAP.PRODUCT_UPDATED,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async deleteProduct(productId: string, reason: string) {
    try {
      if (!productId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ID_NOT_FOUND,
          },
        ];
      }
      const result = await ProductModel.findByIdAndUpdate(
        productId,
        {
          status: 'Delete',
          deletedDate: new Date(),
          updatedDate: new Date(),
          reason: reason,
        },
        { new: true }
      );
      await LegacyUser.findByIdAndUpdate(result?.user_id, {
        $set: { rates_scan: false },
      });

      return [false, result];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_DELETE_PRODUCT,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getDeletedListings(page: number, size: number) {
    try {
      const aggregate: Array<Record<string, any>> = [
        {
          $match: {
            $or: [{ status: 'Delete' }, { status: 'Reject' }],
          },
        },
        {
          $sort: { deletedDate: -1 },
        },
        {
          $skip: (page - 1) * size,
        },
        {
          $limit: size,
        },
        lookup('device_models', 'model_id', '_id', 'model'),
        unwind('$model', false),
        lookup('varients', 'varient_id', '_id', 'varient'),
        unwind('$varient', false),
        lookup('users', 'user_id', '_id', 'userData'),
        unwind('$userData', false),
        calculateMismatchedDiscount('$sell_price', '$varient.current_price'),
        {
          $project: {
            product_id: '$_id',
            phone_number: '$userData.mobileNumber',
            status: 1,
            rejected_reasons: 1,
            model: {
              model_name: '$model.model_name',
              model_name_ar: '$model.model_name_ar',
              model_icon: '$model.model_icon',
            },
            listing_photos: '$product_images',
            isFraudDetected: 1,
            condition: {
              grade: '$grade',
              grade_ar: '$grade_ar',
            },
            buy_now_price: '$sell_price',
            reported_timestamp: '$reportedDate',
            deleted_timestamp: '$deletedDate',
            listing_date: '$createdDate',
            reason: '$reason',
            discount: 1,
            deletedBy: 1,
          },
        },
      ];
      const data: any = await ProductModel.aggregate(aggregate).allowDiskUse(
        true
      );
      const totalRecord: number = await ProductModel.count({
        status: 'Delete',
      });

      if (!totalRecord || totalRecord <= 0) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.FAILED_TO_COUNT_DELETED_LISTINGS,
          },
        ];
      }

      if (!data || data?.length === 0) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.FAILED_TO_GET_DELETED_LISTINGS,
          },
        ];
      }

      const returnedData = {
        totalResult: totalRecord,
        data: data,
      };

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: returnedData,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DELETED_LISTINGS,
          message: exception.message,
        },
      ];
    }
  }

  async getMismatchedListings(
    page: number,
    size: number,
    id: string,
    sortByMostRecent: boolean
  ) {
    try {
      let matchCondition = {};

      if (id !== '') {
        matchCondition = {
          $match: {
            $and: [
              {
                expiryDate: { $gte: new Date() },
              },
              {
                status: 'Active',
              },
              {
                sell_status: 'Available',
              },
              {
                _id: mongoose.Types.ObjectId(id),
              },
            ],
          },
        };
      } else {
        matchCondition = {
          $match: {
            $and: [
              {
                expiryDate: { $gte: new Date() },
              },
              {
                status: 'Active',
              },
              {
                sell_status: 'Available',
              },
            ],
          },
        };
      }
      const aggregate: Array<Record<string, any>> = [
        matchCondition,
        lookup('users', 'user_id', '_id', 'user'),
        unwind('$user', false),
        lookup('device_models', 'model_id', '_id', 'model'),
        unwind('$model', false),
        lookup('varients', 'varient_id', '_id', 'varient'),
        unwind('$varient', false),
        {
          $addFields: {
            discount: {
              $round: [
                {
                  $subtract: [
                    100,
                    {
                      $divide: [
                        {
                          $multiply: [100, '$sell_price'],
                        },
                        '$varient.current_price',
                      ],
                    },
                  ],
                },
                2,
              ],
            },
          },
        },
        {
          $addFields: {
            days_until_expiry: {
              $dateDiff: {
                startDate: new Date(),
                endDate: '$expiryDate',
                unit: 'day',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            model: 1,
            product_id: '$_id',
            phone_number: '$user.mobileNumber',
            language: '$user.language',
            buy_now_price: '$sell_price',
            new_device_price: '$varient.current_price',
            discount: 1,
            listing_date: '$createdDate',
            days_until_expiry: '$days_until_expiry',
            expiry_date: '$expiryDate',
            product_link: 1,
            pictures: '$product_images',
          },
        },
      ];

      if (sortByMostRecent) {
        aggregate.push({
          $sort: {
            listing_date: -1,
          },
        });
      } else {
        aggregate.push({
          $sort: {
            discount: -1,
          },
        });
      }

      if (page !== -1 && size !== -1) {
        aggregate.push({
          $facet: {
            metadata: [{ $count: 'totalResult' }],
            data: [{ $skip: (page - 1) * size }, { $limit: size }],
          },
        });
      } else {
        aggregate.push({
          $facet: {
            metadata: [{ $count: 'totalResult' }],
            data: [{ $skip: 0 }],
          },
        });
      }
      const data = await ProductModel.aggregate([aggregate]);

      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.FAILED_TO_GET_FLAGGED_PRODUCTS,
          },
        ];
      }

      const returnedResult = {
        ...data[0]?.metadata[0],
        ...{ data: data[0].data },
      };

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: returnedResult,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DELETED_LISTINGS,
          message: exception.message,
        },
      ];
    }
  }

  async reportProduct(productId: string, reason: string, userId: string) {
    try {
      if (!productId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ID_NOT_FOUND,
          },
        ];
      }
      const result = await ProductModel.findByIdAndUpdate(
        { _id: productId },
        {
          $push: {
            reportedBy: {
              userId: userId,
              reportedReason: reason,
              reportedAt: new Date(),
            },
          },
        },
        { new: true }
      );

      return [false, result];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_REPORT_PRODUCT,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getReportedListings(page: number, size: number) {
    try {
      const aggregate: Array<Record<string, any>> = [
        {
          $addFields: {
            numberOfReports: {
              $size: {
                $ifNull: ['$reportedBy', []],
              },
            },
          },
        },
        {
          $match: {
            $and: [
              {
                numberOfReports: { $gt: 0 },
              },
              {
                status: 'Active',
              },
            ],
          },
        },
        lookup('users', 'user_id', '_id', 'user'),
        unwind('$user', false),
        lookup('device_models', 'model_id', '_id', 'model'),
        unwind('$model', false),
        lookup('varients', 'varient_id', '_id', 'varient'),
        unwind('$varient', false),
        {
          $addFields: {
            days_until_expiry: {
              $dateDiff: {
                startDate: new Date(),
                endDate: '$expiryDate',
                unit: 'day',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            model: 1,
            product_id: '$_id',
            phone_number: '$user.mobileNumber',
            buy_now_price: '$sell_price',
            reported_timestamp: { $last: '$reportedBy.reportedAt' },
            days_until_expiry: '$days_until_expiry',
            expiry_date: '$expiryDate',
            listing_date: '$createdDate',
          },
        },
        {
          $sort: {
            reported_timestamp: -1,
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'totalResult' }],
            data: [{ $skip: (page - 1) * size }, { $limit: size }],
          },
        },
      ];

      const data: any = await ProductModel.aggregate(aggregate);

      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.FAILED_TO_GET_FLAGGED_PRODUCTS,
          },
        ];
      }

      const returnedResult = {
        ...data[0]?.metadata[0],
        ...{ data: data[0].data },
      };

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: returnedResult,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_REPORTED_LISTINGS,
          message: exception.message,
        },
      ];
    }
  }
  async countRecords(
    matchCondition: Array<Record<string, string | boolean | unknown>>
  ): Promise<number> {
    const object = Object.assign({}, ...matchCondition);
    const totalAvailable = await ProductModel.countDocuments(object).exec();
    return totalAvailable;
  }
  async getProductsFilter(filter: ProductFilterDto): Promise<
    [
      boolean,
      {
        code: number;
        result: PaginationDto<ILegacyProductModel> | string;
        message?: string;
      }
    ]
  > {
    const {
      models,
      deviceTypes,
      price,
      grades,
      brands,
      page,
      size,
      sortBy,
      capacities,
      varients,
      tags,
    } = filter;

    const _models = [];
    const _deviceTypes = [];
    const _brands = [];
    const _tags = [];

    for (const tag of tags) {
      _tags.push({ name: tag });
    }

    for (const model of models) {
      _models.push(new mongoose.Types.ObjectId(model));
    }

    for (const deviceType of deviceTypes) {
      _deviceTypes.push(new mongoose.Types.ObjectId(deviceType));
    }
    for (const brand of brands) {
      _brands.push(new mongoose.Types.ObjectId(brand));
    }

    const productSortBy = ((sort: ProductSortBy) => {
      switch (sort) {
        case ProductSortBy.LOW_TO_HIGH: {
          return { sellPrice: 1 };
        }
        case ProductSortBy.HIGH_TO_LOW: {
          return { sellPrice: -1 };
        }
        case ProductSortBy.NEW_ARRIVALS: {
          return { createdDate: -1 };
        }
        default:
          return { sellPrice: 1 };
      }
    })(sortBy);

    const matchCondition: Array<Record<string, string | boolean | unknown>> = [
      { status: ProductStatus.Active },
      { isApproved: true },
      { sell_status: ProductOrderStatus.Available },
      { expiryDate: { $gte: moment().toDate() } },
      { trade_in: { $ne: true } },
    ];

    if (models.length > 0) {
      matchCondition.push({ model_id: { $in: _models } });
    }
    if (deviceTypes.length > 0) {
      matchCondition.push({ category_id: { $in: _deviceTypes } });
    }
    if (brands.length > 0) {
      matchCondition.push({ brand_id: { $in: _brands } });
    }
    if (grades.length > 0) {
      matchCondition.push({ grade: { $in: grades } });
    }

    if (capacities?.length > 0) {
      matchCondition.push({ varient: { $in: capacities } });
    }

    if (varients?.length > 0) {
      matchCondition.push({
        $and: await this.formatVariantFilters(varients),
      });
    }

    if (price) {
      const priceFilter: Array<Record<string, unknown>> = [];
      const _priceFilter = price.split(',').reduce((acc, num) => {
        acc.push({ range: num });
        return acc;
      }, []);
      _priceFilter.forEach(minMaxPrice => {
        const _minMaxPrice = minMaxPrice.range.split('-');
        priceFilter.push({
          sell_price: {
            $gte: parseFloat(_minMaxPrice[0]),
            $lt: parseFloat(_minMaxPrice[1]),
          },
        });
      });
      matchCondition.push({ $or: priceFilter });
    }

    const recordsCount = await this.countRecords(matchCondition);

    const aggregate: Array<Record<string, unknown>> = [
      {
        $match: {
          $and: matchCondition as Array<
            Record<string, string | boolean | unknown>
          >,
        },
      },
      {
        $addFields: {
          sortNum: this.sortNum,
        },
      },
      {
        $sort: {
          sortNum: 1,
          sell_price: productSortBy?.sellPrice ? productSortBy.sellPrice : -1,
        },
      },
      { $skip: size * (page - 1) },
      {
        $limit: size,
      },
      lookup('varients', 'varient_id', '_id', 'varientData'),
      unwind('$varientData', false),
      lookup('users', 'user_id', '_id', 'seller'),
      unwind('$seller', true),
      lookup('device_models', 'model_id', '_id', 'device_model'),
      unwind('$device_model', false),
      {
        $group: {
          _id: '$_id',
          varientId: { $first: '$varient_id' },
          modelId: { $first: '$model_id' },
          categoryId: { $first: '$category_id' },
          grade: { $first: '$grade' },
          arGrade: { $first: '$grade_ar' },
          sortNum: { $first: '$sortNum' },
          modelName: { $first: '$device_model.model_name' },
          arModelName: { $first: '$device_model.model_name_ar' },
          sellerId: { $first: '$user_id' },
          sellerCity: { $first: '$seller.address.city' },
          sellPrice: { $first: '$sell_price' },
          createdDate: { $first: '$createdDate' },
          productImages: { $first: '$product_images' },
          variantName: { $first: '$varientData.varient' },
          arVariantName: { $first: '$varientData.varient_ar' },
          originalPrice: { $first: '$varientData.current_price' },
          tags: { $first: '$seller.tags' },
          listingQuantity: { $first: '$listingQuantity' },
          isMerchant: { $first: '$seller.isMerchant' },
          modelImage: { $first: '$device_model.model_icon' },
          billingSettings: { $first: '$billingSettings' },
          isBiddingProduct: { $first: '$isBiddingProduct' },
        },
      },
      {
        $sort: {
          sortNum: 1,
          sellPrice: productSortBy?.sellPrice ? productSortBy.sellPrice : -1,
        },
      },
    ];

    const data = await ProductModel.aggregate([...aggregate]);

    data.map((product: any) => {
      return getNewConditionName(product);
    });

    return [
      false,
      {
        code: Constants.SUCCESS_CODE.SUCCESS,
        result: {
          docs: data || [],
          totalDocs: recordsCount,
          hasNextPage: recordsCount > page * size,
        },
      },
    ];
  }

  async formatVariantFilters(varients: any) {
    const variantFilters = [];
    for (const varient of varients) {
      const $or = [];
      const escapedVarient = varient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const options = escapedVarient.split(':');
      if (options[1].split(',').length > 0) {
        for (const option of options[1].split(',')) {
          $or.push({
            varient: {
              $regex: '.*' + option + '.*',
              $options: 'i',
            },
          });
        }
      }
      variantFilters.push({ $or });
    }
    return variantFilters;
  }
  async productsToBeAutoApproved(catIds: string[] = []): Promise<string[]> {
    const isValidObjectId = (id: string): boolean =>
      mongoose.Types.ObjectId.isValid(id);
    const categoryIds: mongoose.Types.ObjectId[] =
      catIds.length > 0
        ? catIds.reduce((acc: mongoose.Types.ObjectId[], category: string) => {
            try {
              if (isValidObjectId(category)) {
                acc.push(new mongoose.Types.ObjectId(category));
              } else {
                console.error(`Invalid ObjectId: ${category}`);
              }
            } catch (error) {
              console.error(
                `Error processing objectId ${category}: ${error.message}`
              );
            }
            return acc;
          }, [])
        : [];

    const productsToBeAutoApproved = await ProductModel.find(
      {
        status: ProductStatus.OnHold,
        auto_approve_at: { $lte: new Date() },
        category_id: { $nin: categoryIds },
        isApproved: false,
      },
      '_id'
    ).exec();

    return (
      productsToBeAutoApproved.map(
        (product: ILegacyProductModel) => product.id
      ) || []
    );
  }

  async autoApproveProduct(categoryIds?: string[]): Promise<
    [
      boolean,
      {
        code: number;
        result: string[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const productsToBeAutoApproved: string[] =
        await this.productsToBeAutoApproved(categoryIds);

      if (productsToBeAutoApproved.length > 0) {
        await ProductModel.updateMany(
          {
            _id: { $in: productsToBeAutoApproved },
            isConsignment: { $ne: true },
          },
          {
            $set: {
              status: ProductStatus.Active,
              isApproved: true,
              approve_source: 'auto',
            },
          }
        );
      }

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: productsToBeAutoApproved,
        },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_AUTO_APPROVE_PRODUCT,
            message: exception.message,
          },
        ];
      }
    }
  }

  async approveProduct(
    productId: string,
    isApprove: boolean,
    autoApproveAt: Date
  ) {
    try {
      await ProductModel.updateOne(
        {
          _id: mongoose.Types.ObjectId(productId),
          $or: [
            { status: ProductStatus.OnHold },
            { status: ProductStatus.Active },
          ],
        },
        {
          $set: {
            isApproved: isApprove,
            auto_approve_at: autoApproveAt,
            status: isApprove ? ProductStatus.Active : ProductStatus.OnHold,
            approve_source: 'admin',
          },
        }
      );

      return [false, Constants.MESSAGE.APPROVE_PRODUCT_SUCCESSFULLY];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_APPROVE_PRODUCT,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getOnHoldListings(page: number, size: number) {
    try {
      const aggregate: Array<Record<string, any>> = [
        {
          $match: {
            $and: [
              {
                status: 'On hold',
              },
              {
                sell_status: 'Available',
              },
            ],
          },
        },
        lookup('users', 'user_id', '_id', 'user'),
        unwind('$user', false),
        lookup('varients', 'varient_id', '_id', 'varient'),
        unwind('$varient', false),
        {
          $addFields: {
            days_until_expiry: {
              $dateDiff: {
                startDate: new Date(),
                endDate: '$expiryDate',
                unit: 'day',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            product_image: { $first: '$product_images' },
            product_id: '$_id',
            phone_number: '$user.mobileNumber',
            buy_now_price: '$sell_price',
            new_device_price: '$varient.current_price',
            listing_date: '$createDate',
            reason: '$reason',
          },
        },
        {
          $sort: {
            listing_date: -1,
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'totalResult' }],
            data: [{ $skip: (page - 1) * size }, { $limit: size }],
          },
        },
      ];
      const data: any = await ProductModel.aggregate(aggregate);

      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.FAILED_TO_GET_ON_HOLD_PRODUCTS,
          },
        ];
      }

      const returnedResult = {
        ...data[0]?.metadata[0],
        ...{ data: data[0].data },
      };

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: returnedResult,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_ON_HOLD_LISTINGS,
          message: exception.message,
        },
      ];
    }
  }

  async getFraudListings(page: number, size: number) {
    try {
      const aggregate: Array<Record<string, any>> = [
        {
          $match: {
            $and: [
              {
                $or: [
                  {
                    status: 'Active',
                  },
                  {
                    status: 'On hold',
                  },
                ],
              },
              {
                sell_status: 'Available',
              },
              {
                isFraudDetected: true,
              },
            ],
          },
        },
        lookup('users', 'user_id', '_id', 'user'),
        unwind('$user', false),
        lookup('varients', 'varient_id', '_id', 'varient'),
        unwind('$varient', false),
        lookup('fraudproducts', '_id', 'productId', 'fraudProduct'),
        {
          $addFields: {
            discount: {
              $round: [
                {
                  $subtract: [
                    100,
                    {
                      $divide: [
                        {
                          $multiply: [100, '$sell_price'],
                        },
                        '$varient.current_price',
                      ],
                    },
                  ],
                },
                2,
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            product_image: {
              $map: {
                input: '$fraudProduct',
                as: 'fraudProduct',
                in: {
                  product_image: '$$fraudProduct.productImage',
                },
              },
            },
            product_id: '$_id',
            phone_number: '$user.mobileNumber',
            buy_now_price: '$sell_price',
            new_device_price: '$varient.current_price',
            reason: '$reason',
            is_fraud: '$isFraudDetected',
            discount: 1,
            isApproved: 1,
          },
        },
        {
          $sort: {
            discount: -1,
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'totalResult' }],
            data: [{ $skip: (page - 1) * size }, { $limit: size }],
          },
        },
      ];
      const data: any = await ProductModel.aggregate(aggregate);

      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.FAILED_TO_GET_FRAUD_PRODUCTS,
          },
        ];
      }

      const returnedResult = {
        ...data[0]?.metadata[0],
        ...{ data: data[0].data },
      };

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: returnedResult,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_FRAUD_LISTINGS,
          message: exception.message,
        },
      ];
    }
  }

  async updateFraudStatus(productId: string, fraudStatus: boolean) {
    try {
      if (!productId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ID_NOT_FOUND,
          },
        ];
      }
      const result = await ProductModel.findByIdAndUpdate(
        productId,
        { isFraudDetected: fraudStatus },
        { new: true }
      );
      return [false, result];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_FRAUD_STATUS_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async getFlaggedListings(
    page: number,
    size: number,
    sortBy: string,
    isOnHold: boolean = false,
    isConsignment: boolean = false
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const aggregate: Array<Record<string, any>> = [
        {
          $match: {
            $and: [
              {
                expiryDate: { $gte: new Date() },
              },
              {
                status: isOnHold ? ProductStatus.OnHold : ProductStatus.Active,
              },
              {
                sell_status: 'Available',
              },
              {
                trade_in: { $ne: true },
              },
              {
                //condition seems complex but is needed for null cases
                isConsignment: isConsignment ? true : { $ne: true },
              },
            ],
          },
        },
        lookup('users', 'user_id', '_id', 'user'),
        unwind('$user', false),
        lookup('device_models', 'model_id', '_id', 'model'),
        unwind('$model', false),
        lookup('varients', 'varient_id', '_id', 'varient'),
        unwind('$varient', false),
        {
          $addFields: {
            discount: {
              $cond: [
                {
                  $eq: ['$varient.current_price', 0],
                },
                0,
                {
                  $round: [
                    {
                      $subtract: [
                        100,
                        {
                          $divide: [
                            {
                              $multiply: [100, '$sell_price'],
                            },
                            '$varient.current_price',
                          ],
                        },
                      ],
                    },
                    2,
                  ],
                },
              ],
            },
          },
        },
        {
          $addFields: {
            days_until_expiry: {
              $dateDiff: {
                startDate: new Date(),
                endDate: '$expiryDate',
                unit: 'day',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            model_name: '$model.model_name',
            actual_product_picture: '$model.model_icon',
            product_id: '$_id',
            phone_number: '$user.mobileNumber',
            discount: 1,
            listing_date: '$createdDate',
            pictures: '$product_images',
            is_fraud_detected: '$isFraudDetected',
            product_condition: '$grade',
            product_description: '$description',
            buy_now_price: '$sell_price',
            new_device_price: '$varient.current_price',
            user_id: 1,
            isApproved: 1,
            condition_id: 1,
            is_verified_by_admin: {
              $cond: {
                if: { $not: ['$isVerifiedByAdmin'] },
                then: false,
                else: '$isVerifiedByAdmin',
              },
            },
            pause_status: {
              $cond: {
                if: { $eq: ['$status', 'Active'] },
                then: false,
                else: true,
              },
            },
          },
        },
      ];

      if (sortBy?.toLowerCase() === 'most_recent') {
        aggregate.push({
          $sort: {
            listing_date: -1,
          },
        });
      }

      if (sortBy?.toLowerCase() === 'positive_flag') {
        aggregate.push({
          $sort: {
            is_fraud_detected: -1,
          },
        });
      }

      if (sortBy?.toLowerCase() === 'discount') {
        aggregate.push({
          $sort: {
            discount: -1,
          },
        });
      }

      if (sortBy?.toLowerCase() === 'uncheck') {
        aggregate.push({
          $sort: {
            is_verified_by_admin: 1,
          },
        });
      }

      if (sortBy === '') {
        aggregate.push({
          $sort: {
            is_verified_by_admin: 1,
          },
        });
      }
      aggregate.push({
        $facet: {
          metadata: [{ $count: 'totalResult' }],
          data: [{ $skip: (page - 1) * size }, { $limit: size }],
        },
      });

      const data = await ProductModel.aggregate([aggregate]);

      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.FAILED_TO_GET_FLAGGED_PRODUCTS,
          },
        ];
      }

      const returnedResult = {
        ...data[0]?.metadata[0],
        ...{ data: data[0].data },
      };

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: returnedResult,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAIL_TO_GET_FLAGGED_LISTING,
          message: exception.message,
        },
      ];
    }
  }

  async verifyProduct(
    productId: string,
    userId: string,
    verifyStatus: boolean
  ) {
    try {
      if (!productId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ID_NOT_FOUND,
          },
        ];
      }
      const result = await ProductModel.findByIdAndUpdate(
        { _id: productId },
        {
          $set: {
            isVerifiedByAdmin: verifyStatus,
            verifiedAdmin: userId,
            verifiedByAdminDate: new Date(),
          },
        },
        { new: true }
      );

      return [false, result];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_VERIFY_STATUS,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getProductsByIds(ids: string[]): Promise<
    [
      boolean,
      {
        code: number;
        result: ILegacyProductModel[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const idArr = ids.map((id: string) => new mongoose.Types.ObjectId(id));
      const data = await ProductModel.find({ _id: { $in: idArr } }).exec();
      if (!data)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT,
            message: Constants.MESSAGE.FAILED_TO_GET_PRODUCT,
          },
        ];
      else
        return [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: data,
          },
        ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async getProductById(id: string): Promise<
    [
      boolean,
      {
        code: number;
        result: ILegacyProductModel | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await ProductModel.findById(id).exec();
      if (!data)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT,
            message: Constants.MESSAGE.FAILED_TO_GET_PRODUCT,
          },
        ];
      else
        return [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: data,
          },
        ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async getProductDetailById(id: string): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const options = [
        {
          $match: {
            _id: mongoose.Types.ObjectId(id),
          },
        },
        lookup('device_models', 'model_id', '_id', 'models'),
        unwind('$models'),
        {
          $project: {
            product_id: '$_id',
            model_id: 1,
            user_id: 1,
            status: 1,
            'models.model_name': 1,
            'models.model_name_ar': 1,
            sell_price: 1,
            imagesQualityScore: 1,
            varient_id: 1,
            promocode: 1,
          },
        },
      ];
      const products = await ProductModel.aggregate(options).exec();
      if (!products || products?.length == 0)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: null,
          },
        ];

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: products[0],
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async getPreviewProductById(
    productId: string,
    userId: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      if (!productId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ID_NOT_FOUND,
          },
        ];
      }

      const aggregate: Array<Record<string, any>> = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(productId),
            $or: [{ isPriceUpdating: false }, { isPriceUpdating: null }],
          },
        },
        {
          $lookup: {
            from: 'Favorite',
            localField: '_id',
            foreignField: 'productId',

            let: {
              productId: {
                $ifNull: [{ $toObjectId: '$_id' }, ''],
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$productId', '$$productId'] },
                      {
                        $eq: ['$userId', mongoose.Types.ObjectId(userId)],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  productId: 1,
                  userId: 1,
                  created_at: 1,
                },
              },
            ],
            as: 'favoriteData',
          },
        },
        {
          $unwind: { path: '$favoriteData', preserveNullAndEmptyArrays: true },
        },
        lookup('categories', 'category_id', '_id', 'category'),
        unwind('$category', false),
        lookup('brands', 'brand_id', '_id', 'brands'),
        unwind('$brands', false),
        lookup('device_models', 'model_id', '_id', 'models'),
        unwind('$models', false),
        lookup('varients', 'varient_id', '_id', 'varients'),
        unwind('$varients', false),
        lookup('users', 'user_id', '_id', 'seller'),
        unwind('$seller', false),
        {
          $lookup: {
            from: 'product_questions',
            localField: '_id',
            foreignField: 'product_id',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  question: 1,
                  answer: 1,
                  status: 1,
                  user_id: 1,
                  created_at: 1,
                },
              },
            ],
            as: 'product_questions',
          },
        },
        {
          $project: {
            product_id: '$_id',
            varient: 1,
            condition_id: 1,
            sell_price: 1,
            bid_price: 1,
            product_images: 1,
            defected_images: 1,
            body_cracks: 1,
            description: 1,
            answer_to_questions: 1,
            answer_to_questions_ar: 1,
            score: 1,
            grade: 1,
            grade_ar: 1,
            current_bid_price: 1,
            favourited_by: 1,
            code: 1,
            sell_status: 1,
            status: 1,
            expiryDate: 1,
            isListedBefore: 1,
            createdDate: 1,
            listingQuantity: 1,
            listingGroupId: 1,
            'category._id': 1,
            'category.category_name': 1,
            'category.category_name_ar': 1,
            'brands._id': 1,
            'brands.brand_name': 1,
            'brands.brand_name_ar': 1,
            'brands.brand_icon': 1,
            'models._id': 1,
            'models.model_name': 1,
            'models.model_name_ar': 1,
            'models.model_icon': 1,
            'models.current_price': 1,
            seller_id: '$seller._id',
            isMerchant: '$seller.isMerchant',
            sellerRating: '$seller.rating',
            isUAE_listing: '$seller.sellerType.isUAE',
            seller_name: '$seller.name',
            seller_address: '$seller.address',
            'varients._id': 1,
            tags: { $first: '$seller.tags' },
            'varients.varient': 1,
            'varients.varient_ar': 1,
            'varients.current_price': 1,
            varient_id: 1,
            answer_to_questions_migration: 1,
            answer_to_questions_ar_migration: 1,
            reportedBy: 1,
            product_questions: '$product_questions',
            isReportedByUser: 1,
            variant_attributes_selections: 1,
            isApproved: 1,
            isFavorite: '$favoriteData.productId',
            conditions: '$conditionData',
            billingSettings: 1,
            rates: '$seller.rates',
            promocode: 1,
            isBiddingProduct: 1,
            isModelImage: 1,
            listingSource: 1,
            imagesQualityScore: 1,
            regaUrl: 1,
            listingAddress: 1,
            guaranteesUrl: 1,
            marketPercentage: 1,
            isConsignment: 1,
            consignment: 1,
          },
        },
      ];
      const data: any = await ProductModel.aggregate(aggregate);

      if (!data || data.length === 0) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
            message: Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND,
          },
        ];
      }

      data[0].isReportedByUser = false;
      if (userId && data[0].reportedBy) {
        data[0].reportedBy.forEach((report: any) => {
          if (report.userId.toString() === userId.toString()) {
            data[0].isReportedByUser = true;
          }
        });
      }
      data[0].reportedBy = null;

      const matchConditions: any = {
        product_id: new mongoose.Types.ObjectId(productId),
        status: 'Active',
      };

      if (data[0]?.seller_id?.toString() !== userId?.toString()) {
        matchConditions.answer = { $ne: null };
      }

      const pipeline = [
        {
          $match: matchConditions,
        },
        lookup('users', 'questioner_id', '_id', 'buyer'),
        unwind('$buyer', false),
        {
          $sort: { answer: 1, updated_date: -1 },
        },
        {
          $project: {
            product_id: 1,
            questioner_id: 1,
            seller_id: 1,
            question: 1,
            answer: 1,
            created_date: 1,
            updated_date: 1,
            deleted_date: 1,
            deleted_by: 1,
            deleted_reason: 1,
            status: 1,
            buyer_name: '$buyer.name',
          },
        },
      ];
      const questionsAndAnswers: AskSellerType[] = (await AskSeller.aggregate(
        pipeline
      ).exec()) as AskSellerType[];

      data[0].totalQuestions = questionsAndAnswers.length;
      data[0].questionsAndAnswers = questionsAndAnswers?.slice(0, 2);

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data[0],
        },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getMaxPossiblePrice(variantId: string): Promise<number> {
    const aggregate: Array<Record<string, any>> = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(variantId),
          status: 'Active',
        },
      },
      lookup('categories', 'category_id', '_id', 'category'),
      unwind('$category', false),
      {
        $project: {
          _id: 0,
          current_price: 1,
          max_percentage: '$category.max_percentage',
        },
      },
    ];
    const data: any = await Variant.aggregate(aggregate);

    return (
      data[0]?.current_price -
        (data[0]?.current_price * data[0]?.max_percentage) / 100 || 0
    );
  }
  async updatePrice(
    productId: string,
    userId: string,
    sellPrice: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const updatedData = {
        isPriceUpdating: false,
        sell_price: Number(sellPrice),
        priceUpdateTimestamp: new Date(),
      };
      const data: ILegacyProductModel = await ProductModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(productId),
          user_id: new mongoose.Types.ObjectId(userId),
        },
        {
          $set: updatedData,
        },
        {
          fields: {
            sell_price: 1,
            user_id: 1,
            model_id: 1,
            varient_id: 1,
            grade: 1,
            billingSettings: 1,
          },
          new: true,
        }
      ).exec();

      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.DATA_NOT_FOUND,
            message: Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND,
          },
        ];
      }

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
            message: exception.message,
          },
        ];
      }
    }
  }

  async updateEditPriceStatus(
    productId: string,
    userId: string,
    isEditing: boolean
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const data: ILegacyProductModel = await ProductModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(productId),
          user_id: new mongoose.Types.ObjectId(userId),
        },
        {
          $set: {
            isPriceUpdating: isEditing,
          },
        },
        { new: true }
      );

      if (!data) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRICE_PRODUCT,
          Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND
        );
      }

      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRICE_PRODUCT,
          exception.message
        );
      }
    }
  }
  async updateProductStatus(productId: string, status: ProductOrderStatus) {
    try {
      const data = await ProductModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(productId),
          sell_status: { $ne: ProductOrderStatus.Sold },
        },
        { $set: { sell_status: status } }
      );
      if (!data) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          'Failed to update product'
        );
      }
      if (status != ProductOrderStatus.Sold) {
        await syncProduct({
          productAction: ProductActions.SYSTEM_STATUS_UPDATE,
          productId: productId,
          status: data.status,
        });

        return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
      }
    } catch (exception) {
      return errorTemplate(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
        exception.message
      );
    }
  }

  async lockProduct(productId: string) {
    try {
      const updatedProduct = await ProductModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(productId),
          sell_status: { $eq: ProductOrderStatus.Available },
        },
        { $set: { sell_status: ProductOrderStatus.Locked } }
      );

      // If updatedProduct is null, it means the product was already locked or did not exist.
      return updatedProduct !== null;
    } catch (error) {
      console.error('Error locking product:', error);
      return false;
    }
  }

  async updateProductStatusForRelisting(productId: string): Promise<boolean> {
    try {
      const data = await ProductModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(productId),
        },
        {
          $set: {
            sell_status: ProductOrderStatus.Available,
            status: ProductStatus.Active,
          },
        }
      );
      if (!data) {
        return false;
      } else {
        return true;
      }
    } catch (exception) {
      return false;
    }
  }

  async updateProductActivationStatus(
    productId: string,
    isActivated: boolean
  ): Promise<boolean> {
    try {
      let status = ProductStatus.Idle;
      if (isActivated) {
        status = ProductStatus.Active;
      }
      const data = await ProductModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(productId),
        },
        {
          $set: {
            status,
          },
        }
      );
      if (!data) {
        return false;
      }
      return true;
    } catch (exception) {
      return false;
    }
  }

  async validateSellData(
    productId: string,
    sellPrice: number,
    status: string,
    sell_status: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const data: ILegacyProductModel = await ProductModel.findOne({
        _id: new mongoose.Types.ObjectId(productId),
        sell_price: sellPrice,
        status: status,
        sell_status: sell_status,
      }).select({
        sell_price: 1,
        status: 1,
        sell_status: 1,
        id: 1,
      });

      if (!data) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_VALIDATE_PRODUCT,
          Constants.MESSAGE.NO_MATCHED_PRODUCT
        );
      }

      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRICE_PRODUCT,
          exception.message
        );
      }
    }
  }

  async modelVariantMigrate(
    map_id: string,
    old_model_id: string,
    new_model_id: string,
    old_variant_id: string,
    new_variant_id: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const data: any = await ProductModel.updateMany(
        {
          model_id: mongoose.Types.ObjectId(old_model_id),
          varient_id: mongoose.Types.ObjectId(old_variant_id),
        },
        {
          $set: {
            model_id: new mongoose.Types.ObjectId(new_model_id),
            model_migration_source: `Updated old model_id = ${old_model_id} with ${new_model_id}`,
            varient_id: new mongoose.Types.ObjectId(new_variant_id),
            variant_migration_source: `Updated old variant_id with from ${old_variant_id} to ${new_variant_id}`,
            model_variant_map_id: new mongoose.Types.ObjectId(map_id),
          },
        },
        {
          new: true,
        }
      );

      if (!data || data.length === 0) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
            message: Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND,
          },
        ];
      }

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getProductIdsByMapId(
    map_id: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const data: any = await ProductModel.find(
        { model_variant_map_id: mongoose.Types.ObjectId(map_id) },
        { _id: 1 }
      );

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
          message: 'Get product ids by mapping id successfully',
        },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      }

      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_ADD_VARIANT,
          message: exception.message,
        },
      ];
    }
  }

  async updateProductVariant(
    productId: string,
    newVariantId: string,
    isForceUpdate: boolean,
    variant?: VariantDocument
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      let query = {};

      if (!isForceUpdate) {
        query = {
          _id: productId,
          category_id: variant.category_id,
          brand_id: variant.brand_id,
          model_id: variant.model_id,
        };
      } else {
        query = {
          _id: productId,
        };
      }

      const result = await ProductModel.findOneAndUpdate(
        query,
        {
          $set: {
            varient_id: new mongoose.Types.ObjectId(newVariantId),
          },
        },
        { new: true }
      );

      if (!result) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND
        );
      }

      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, result);
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);

        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          exception.message
        );
      }
    }
  }

  async rejectProduct(
    productId: string,
    rejected_reasons: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const result = await ProductModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(productId) },
        {
          $set: {
            status: 'Reject',
            rejected_reasons: rejected_reasons,
            rejected_timestamp: new Date(),
            deletedDate: new Date(),
          },
        },
        {
          fields: {
            _id: 1,
            rejected_reasons: 1,
            rejected_timestamp: 1,
            status: 1,
          },
          new: true,
        }
      );

      if (!result) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_REJECT_PRODUCT,
          Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND
        );
      }

      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, result);
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);

        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_REJECT_PRODUCT,
          exception.message
        );
      }
    }
  }
  async findProductsByUserId(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: ILegacyProductModel[];
        message?: string;
      }
    ]
  > {
    try {
      const data = await ProductModel.find({
        user_id: userId,
        status: { $ne: 'Delete' },
        trade_in: { $ne: true },
      }).exec();
      if (!data)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: [],
            message: Constants.MESSAGE.FAILED_TO_GET_PRODUCT,
          },
        ];
      else
        return [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: data,
          },
        ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: [],
          message: exception.message,
        },
      ];
    }
  }

  async findPendingProductsByUserId(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: ILegacyProductModel[];
        message?: string;
      }
    ]
  > {
    try {
      const data = await ProductModel.find({
        user_id: userId,
        $or: [
          { status: ProductStatus.Active },
          { status: ProductStatus.Reject },
          { status: ProductStatus.OnHold },
          { status: ProductStatus.Idle },
        ],
        sell_status: { $eq: ProductOrderStatus.Available },
        trade_in: { $ne: true },
        isConsignment: { $ne: true },
      }).exec();
      if (!data)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: [],
            message: Constants.MESSAGE.FAILED_TO_GET_PRODUCT,
          },
        ];
      else
        return [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: data,
          },
        ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: [],
          message: exception.message,
        },
      ];
    }
  }
  async countBetterPriceListings(
    variantId: string,
    score: number,
    listingPrice: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      let matchCond: any = {
        score: { $lt: 75 },
        trade_in: { $ne: true },
      };

      if (score >= 98 && score <= 100) {
        matchCond = {
          $and: [{ score: { $gt: 97 } }, { score: { $lt: 101 } }],
        };
      }

      if (score >= 90 && score < 98) {
        matchCond = {
          $and: [{ score: { $gt: 89 } }, { score: { $lt: 98 } }],
        };
      }

      if (score >= 75 && score < 90) {
        matchCond = {
          $and: [{ score: { $gt: 75 } }, { score: { $lt: 90 } }],
        };
      }
      matchCond.status = 'Active';
      matchCond.sell_status = 'Available';
      matchCond.isApproved = true;
      matchCond.isExpired = false;
      matchCond.expiryDate = { $gt: new Date() };
      matchCond.varient_id = new mongoose.Types.ObjectId(variantId);
      matchCond.sell_price = { $lt: listingPrice };
      const data: any = await ProductModel.countDocuments(matchCond);
      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_COUNT_BETTER_PRICE_LISTINGS,
          exception.message
        );
      }
    }
  }

  async updateModelMismatch(numberOfRecord: number): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const aggregate: Array<Record<string, any>> = [
        {
          $lookup: {
            from: 'device_models',
            localField: 'model_id',
            foreignField: '_id',
            as: 'product_model',
          },
        },
        {
          $unwind: {
            path: '$product_model',
          },
        },
        {
          $lookup: {
            from: 'varients',
            localField: 'varient_id',
            foreignField: '_id',
            as: 'variant',
          },
        },
        {
          $unwind: {
            path: '$variant',
          },
        },
        {
          $lookup: {
            from: 'device_models',
            localField: 'variant.model_id',
            foreignField: '_id',
            as: 'variant_model',
          },
        },
        {
          $unwind: {
            path: '$variant_model',
          },
        },
        {
          $match: {
            $expr: {
              $ne: ['$model_id', '$variant_model._id'],
            },
            mismatch_model_migration: null,
          },
        },
        {
          $limit: numberOfRecord,
        },
        {
          $project: {
            _id: 1,
            model_id: 1,
            product_model_name: '$product_model.model_name',
            status: 1,
            sell_status: 1,
            isApproved: 1,
            isExpired: 1,
            expiryDate: 1,
            variant_id: '$variant._id',
            variant_model_id: '$variant.model_id',
            variant_model_name: '$variant_model.model_name',
            variant_name: '$variant.varient',
          },
        },
      ];
      const data: any = await ProductModel.aggregate(aggregate);

      if (!data || data.length === 0) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_MISMATCHED_MODEL,
          Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND
        );
      }

      data.map(async (product: any) => {
        const variantData = await Variant.findOne({
          model_id: product?.model_id,
          varient: product?.variant_name,
        });
        await ProductModel.updateMany(
          {
            model_id: new mongoose.Types.ObjectId(product?.model_id),
            mismatch_model_migration: null,
            varient_id: new mongoose.Types.ObjectId(product?.variant_id),
          },
          {
            $set: {
              varient_id: new mongoose.Types.ObjectId(variantData?._id),
              mismatch_model_migration: `Update variant from ${product?.variant_id} to ${variantData?._id}`,
            },
          }
        );
      });

      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);

        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_MISMATCHED_MODEL,
          exception.message
        );
      }
    }
  }
  async getMySales(
    userId: string,
    orderId?: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      let queryCondition = {};

      if (orderId) {
        queryCondition = {
          $match: {
            'orderDetail.seller': new mongoose.Types.ObjectId(userId),
            _id: new mongoose.Types.ObjectId(orderId),
          },
        };
      } else {
        queryCondition = {
          $match: {
            'orderDetail.seller': new mongoose.Types.ObjectId(userId),
          },
        };
      }
      const aggregate: Array<Record<string, any>> = [
        lookup('orders', 'orderId', '_id', 'orderDetail'),
        unwind('$orderDetail', false),
        queryCondition,
        lookup('products', 'orderDetail.product', '_id', 'product'),
        unwind('$product', false),
        lookup('device_models', 'product.model_id', '_id', 'model'),
        unwind('$model', false),
        lookup('DeltaMachineStatuses', 'statusId', '_id', 'DMStatus'),
        unwind('$DMStatus', false),
        {
          $sort: { updatedAt: -1 },
        },
        {
          $project: {
            dmOrderId: '$_id',
            orderId: 1,
            statusId: 1,
            createdAt: 1,
            updatedAt: 1,
            confirmationDeadline: 1,
            variant_id: '$product.varient_id',
            statusName: '$DMStatus.name',
            attributes: 1,
            modelName: '$model.model_name',
            modelNameAr: '$model.model_name_ar',
            listingImages: '$product.product_images',
            orderNumber: '$orderDetail.order_number',
            trackingNumber: 1,
            _id: 0,
            product_id: '$product._id',
            grand_total: '$orderDetail.seller_grand_total',
          },
        },
      ];
      const data: any = await DeltaMachineOrder.aggregate(aggregate);

      if (!data || data.length === 0) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_GET_MY_SALES,
          Constants.MESSAGE.FAILED_TO_GET_MY_SALES
        );
      }

      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);

        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_GET_MY_SALES,
          exception.message
        );
      }
    }
  }

  async getExistingProducts(): Promise<
    [
      boolean,
      { code: number; result: string | ILegacyProductModel[]; message: string }
    ]
  > {
    try {
      const data = await ProductModel.find({
        status: 'Active',
        $or: [{ billingSettings: null }, { billingSettings: {} }],
        trade_in: { $ne: true },
      })
        .sort({ createdDate: 1 })
        .limit(50);
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: (data || []).length > 0 ? data : [],
          message: null,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_PRODUCTS,
          message: exception.message,
        },
      ];
    }
  }
  async updateSellerCommissionListing(
    productId: string,
    commission: number
  ): Promise<[boolean, { code: number; result: string; message?: string }]> {
    try {
      await ProductModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(productId),
        },
        {
          $set: {
            'billingSettings.seller_commission_percentage': commission,
          },
        }
      ).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: Constants.MESSAGE.UPDATE_SELLER_COMMISSION_SUCCESSFULLY,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }
  async updateBillingSettingsOfProduct(
    productId: string,
    billingSettings: BillingSettings
  ) {
    try {
      const data = await ProductModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(productId),
        },
        { $set: { billingSettings: billingSettings } },
        { new: true }
      );
      if (!data) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          'Failed to update product'
        );
      } else {
        return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
      }
    } catch (exception) {
      return errorTemplate(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
        exception.message
      );
    }
  }

  async removeBillingSettingsOfOldProducts(): Promise<
    [
      boolean,
      { code: number; result: ProductDocument[] | string; message?: string }
    ]
  > {
    try {
      const data = await ProductModel.updateMany(
        {
          status: 'Active',
          createdDate: { $lte: new Date('2023-05-01T00:00:00Z') },
        },
        { $unset: { billingSettings: 1 } }
      );
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: (data || []).length > 0 ? data : [],
          message: null,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async countNumberOfActiveProducts(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const numberOfListing: number = await ProductModel.countDocuments({
        user_id: new mongoose.Types.ObjectId(userId),
        status: ProductStatus.Active,
        sell_status: ProductOrderStatus.Available,
        isApproved: true,
        isExpired: false,
        expiryDate: { $gt: new Date() },
      });

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        numberOfListing
      );
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);

        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_COUNT_ACTIVE,
          exception.message
        );
      }
    }
  }

  async changeImageProductUrls(
    numberOfRecords: number,
    searchString: string,
    cdnPath?: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    const productIds: string[] = [];
    const search =
      searchString || 'https://soum01.fra1.digitaloceanspaces.com/soum-prod';
    const productCollection = mongoose.connection.db.collection('products');
    await productCollection
      .find({ image_updated: null })
      .limit(numberOfRecords || 1000)
      .forEach(document => {
        const urls = document.product_images;
        const newUrls = urls.map((url: string) => {
          return url.replace(search, cdnPath);
        });
        productIds.push(document._id);
        productCollection.updateOne(
          { _id: new mongoose.Types.ObjectId(document._id) },
          { $set: { product_images: newUrls, image_updated: new Date() } }
        );
      });

    return [
      true,
      {
        code: Constants.SUCCESS_CODE.SUCCESS,
        result: productIds,
        message: 'Migration successful',
      },
    ];
  }

  async countExcellentActiveListings(
    condition: string,
    price: number,
    variantId: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const numberOfListing: number = await ProductModel.count({
        grade: { $regex: condition, $options: 'i' },
        sell_price: { $lte: price },
        status: ProductStatus.Active,
        sell_status: ProductOrderStatus.Available,
        isApproved: true,
        isExpired: false,
        expiryDate: { $gt: new Date() },
        varient_id: new mongoose.Types.ObjectId(variantId),
      });

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        numberOfListing
      );
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);

        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_COUNT_EXCELLENT_LISTING,
          exception.message
        );
      }
    }
  }

  async getProducts(
    req: string[]
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const productIds = req?.map((item: string) => {
        return new mongoose.Types.ObjectId(item);
      });
      const options = [
        {
          $match: { _id: { $in: productIds } },
        },
        lookup('device_models', 'model_id', '_id', 'models'),
        unwind('$models'),
        lookup('users', 'user_id', '_id', 'seller'),
        unwind('$seller'),
        lookup('varients', 'varient_id', '_id', 'variant'),
        unwind('$variant'),
        {
          $project: {
            product_id: '$_id',
            model_id: 1,
            varient_id: 1,
            condition_id: 1,
            category_id: 1,
            grade: 1,
            user_id: 1,
            seller_name: '$seller.name',
            'models.model_name': 1,
            'models.model_name_ar': 1,
            billingSettings: 1,
            isExpired: 1,
            product_images: 1,
            expiryDate: 1,
            status: 1,
            sell_status: 1,
            sell_price: 1,
            seller_city: '$seller.address.city',
            'variant.attributes': 1,
          },
        },
      ];
      const products = await ProductModel.aggregate(options).exec();
      if (!products || products?.length == 0)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: null,
          },
        ];

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: products,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DETAIL_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async GetViewedProductsData(
    req: string[],
    shouldSkipExpire: boolean,
    categoryId: string = '',
    getSpecificCategory: boolean = false
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    const productIds = req?.map((item: string) => {
      return new mongoose.Types.ObjectId(item);
    });
    const matchCondition: Array<Record<string, string | boolean | unknown>> = [
      { _id: { $in: productIds } },
      { status: ProductStatus.Active },
      { isApproved: true },
      shouldSkipExpire ? {} : { expiryDate: { $gte: moment().toDate() } },
      { trade_in: { $ne: true } },
    ];
    if (getSpecificCategory) {
      matchCondition.push({
        category_id: new mongoose.Types.ObjectId(categoryId),
      });
    } else if (categoryId) {
      matchCondition.push({
        category_id: { $ne: new mongoose.Types.ObjectId(categoryId) },
      });
    }
    const aggregate: Array<Record<string, unknown>> = [
      {
        $match: {
          $and: matchCondition as Array<
            Record<string, string | boolean | unknown>
          >,
        },
      },
      lookup('varients', 'varient_id', '_id', 'varientData'),
      unwind('$varientData', false),
      lookup('device_models', 'model_id', '_id', 'device_model'),
      unwind('$device_model', false),
      lookup('orders', '_id', 'product', 'orderData'),
      unwind('$orderData', true),
      lookup('users', 'user_id', '_id', 'seller'),
      unwind('$seller', true),
      lookup('brands', 'brand_id', '_id', 'brand'),
      unwind('$brand', true),
      lookup('categories', 'category_id', '_id', 'category'),
      unwind('$category', true),
      {
        $match: {
          $or: [
            { sell_status: ProductOrderStatus.Available },
            {
              $and: [
                { sell_status: ProductOrderStatus.Sold },
                {
                  'orderData.transaction_status':
                    TransactionOrderStatus.SUCCESS,
                },
                {
                  'orderData.created_at': {
                    $gt: new Date(
                      new Date().getTime() - 7 * 24 * 60 * 60 * 1000
                    ),
                  },
                },
              ],
            },
          ],
        },
      },
      {
        $group: {
          _id: '$_id',
          varientId: { $first: '$varient_id' },
          modelId: { $first: '$model_id' },
          isConsignment: { $first: '$isConsignment' },
          categoryId: { $first: '$category_id' },
          conditionId: { $first: '$condition_id' },
          grade: { $first: '$grade' },
          arGrade: { $first: '$grade_ar' },
          sellDate: { $first: '$orderData.created_at' },
          modelName: { $first: '$device_model.model_name' },
          arModelName: { $first: '$device_model.model_name_ar' },
          sellPrice: { $first: '$sell_price' },
          sellStatus: { $first: '$sell_status' },
          createdDate: { $first: '$createdDate' },
          productImages: { $first: '$product_images' },
          variantName: { $first: '$varientData.varient' },
          arVariantName: { $first: '$varientData.varient_ar' },
          originalPrice: { $first: '$varientData.current_price' },
          tags: { $first: '$seller.tags' },
          conditions: { $first: '$conditionData' },
          listingQuantity: { $first: '$listingQuantity' },
          isMerchant: { $first: '$seller.isMerchant' },
          modelImage: { $first: '$device_model.model_icon' },
          billingSettings: { $first: '$billingSettings' },
          isBiddingProduct: { $first: '$isBiddingProduct' },
          seller: { $first: '$seller' },
          brand: { $first: '$brand' },
          category: { $first: '$category' },
        },
      },
    ];

    const data = await ProductModel.aggregate([...aggregate]);
    return [
      false,
      {
        code: Constants.SUCCESS_CODE.SUCCESS,
        result: data,
      },
    ];
  }
  async getActiveListingByUserID(
    userId: string,
    page?: number,
    size?: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const data = await ProductModelPaginated.paginate(
        {
          user_id: new mongoose.Types.ObjectId(userId),
          status: ProductStatus.Active,
          sell_status: ProductOrderStatus.Available,
          isApproved: true,
          isExpired: false,
          expiryDate: { $gt: new Date() },
        },
        {
          select: `product_images
            sell_price
            grade
            grade_ar
            status
            sell_status
            listingQuantity
            varient_id
            billingSettings
            createdDate
            model_id
            category_id
            condition_id`,
          offset: (page - 1) * size,
          limit: size,
          sort: { createdDate: -1 },
        }
      );

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        data,
        Constants.MESSAGE.GET_LISTINGS_BY_USER_ID_SUCCESSFULLY
      );
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);

        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_COUNT_ACTIVE,
          exception.message
        );
      }
    }
  }
  async updateHighestBidProduct(productId: string, bid: number) {
    try {
      const data = await ProductModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(productId),
        },
        { $set: { 'billingSettings.highest_bid': bid } },
        { new: true }
      );
      if (!data) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          'Failed to update product'
        );
      } else {
        return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
      }
    } catch (exception) {
      return errorTemplate(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
        exception.message
      );
    }
  }

  async updateProductImages(
    productId: string,
    listingImages: string[]
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const data = await ProductModel.findOneAndUpdate(
        { _id: productId },
        { $set: { product_images: listingImages } },
        { new: true }
      );

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        data,
        Constants.MESSAGE.UPDATE_LISTING_IMAGES
      );
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);

        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_LISTING_IMAGES,
          exception.message
        );
      }
    }
  }

  async updateProductsCondition(data: {
    categoryId: string;
    conditionId: string;
    scoreRangeMax: number;
    scoreRangeMin: number;
  }) {
    try {
      // re-assign to new range
      const assignConditionProducts = await ProductModel.find(
        {
          status: ProductStatus.Active,
          isApproved: true,
          sell_status: ProductOrderStatus.Available,
          expiryDate: { $gte: moment().toDate() },
          $or: [
            {
              $and: [
                { condition_id: data.conditionId },
                {
                  $or: [
                    { score: { $gt: data.scoreRangeMax } },
                    { score: { $lte: data.scoreRangeMin } },
                  ],
                },
              ],
            },

            {
              $and: [
                { category_id: mongoose.Types.ObjectId(data.categoryId) },
                {
                  $and: [
                    { score: { $lte: data.scoreRangeMax } },
                    { score: { $gt: data.scoreRangeMin } },
                  ],
                },
              ],
            },
          ],
        },
        { _id: 1 }
      );
      await ProductModel.updateMany(
        {
          category_id: mongoose.Types.ObjectId(data.categoryId),
          $and: [
            { score: { $lte: data.scoreRangeMax } },
            { score: { $gt: data.scoreRangeMin } },
          ],
        },
        { $set: { condition_id: data.conditionId } }
      );
      // clear in correct old assign

      await ProductModel.updateMany(
        {
          condition_id: data.conditionId,
          $or: [
            { score: { $gt: data.scoreRangeMax } },
            { score: { $lte: data.scoreRangeMin } },
          ],
        },
        { $set: { condition_id: null } }
      );
      // return list of updated ids
      return (assignConditionProducts || []).map(elem => elem._id.toString());
    } catch (err) {
      console.log(err);
    }
  }
  async updateProductDetails(
    productId: string,
    productUpdate: ProductUpdateDto
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: ILegacyProductModel | string;
        message?: string;
      }
    ]
  > {
    try {
      const updateFields: any = {};

      if (productUpdate?.imagesQualityScore) {
        updateFields.imagesQualityScore = productUpdate.imagesQualityScore;
      }

      if (productUpdate?.isUpranked !== undefined) {
        updateFields.isUpranked = productUpdate.isUpranked;
      }

      if (productUpdate?.regaUrl !== undefined) {
        updateFields.regaUrl = productUpdate.regaUrl;
      }

      if (productUpdate?.description !== undefined) {
        updateFields.description = productUpdate.description;
      }

      if (productUpdate?.guaranteesUrl !== undefined) {
        updateFields.guaranteesUrl = productUpdate.guaranteesUrl;
      }

      if (productUpdate?.isApproved) {
        updateFields.isApproved = productUpdate.isApproved;
      }

      if (productUpdate?.status) {
        updateFields.status = productUpdate.status;
      }

      if (productUpdate?.consignment) {
        updateFields.consignment = productUpdate.consignment;
      }

      if (productUpdate?.conditionId) {
        updateFields.condition_id = productUpdate.conditionId;
      }

      if (productUpdate.sellPrice) {
        updateFields.sell_price = productUpdate.sellPrice;
      }

      const result = await ProductModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(productId) },
        {
          $set: updateFields,
        },
        {
          new: true,
        }
      );

      if (!result) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          Constants.MESSAGE.PRODUCT_ID_NOT_FOUND
        );
      }

      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, result);
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);

        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          exception.message
        );
      }
    }
  }
  async activateProduct(userId: string, productId: string) {
    try {
      const data = await ProductModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(productId),
          user_id: mongoose.Types.ObjectId(userId),
          status: ProductStatus.Idle,
        },
        { $set: { status: ProductStatus.Active } }
      );
      if (!data) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          Constants.MESSAGE.FAILED_TO_UPDATE_PRODUCT
        );
      } else {
        return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
      }
    } catch (exception) {
      return errorTemplate(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
        exception.message
      );
    }
  }

  async getGroupListingProducts(groupListingIds: string[]) {
    try {
      await ProductModel.updateMany(
        {
          listingGroupId: {
            $in: groupListingIds.map(elem => mongoose.Types.ObjectId(elem)),
          },
          status: ProductStatus.Active,
          sell_status: ProductOrderStatus.Available,
          isApproved: true,
          isExpired: false,
          expiryDate: { $gt: new Date() },
        },
        { $set: { search_sync: ProductSyncStatus.UNSYNCED } }
      );
      return;
    } catch (exception) {
      return;
    }
  }
  async countAskQuestionsOfUserWithin(
    userId: string,
    from: Moment,
    to: Moment
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: number;
        message?: string;
      }
    ]
  > {
    try {
      const numberQuestionsAskedToday: number = await AskSeller.countDocuments({
        questioner_id: new mongoose.Types.ObjectId(userId),
        created_date: {
          $gt: from,
          $lt: to,
        },
      });

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        numberQuestionsAskedToday
      );
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);

        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_COUNT_ACTIVE,
          exception.message
        );
      }
    }
  }
  async getConsignmentProductsByUserId(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: Partial<ILegacyProductModel>[] | null;
        message?: string;
      }
    ]
  > {
    try {
      const products = await ProductModel.find(
        {
          user_id: userId,
          isConsignment: true,
        },
        {
          _id: 1,
          status: 1,
          sell_status: 1,
          isApproved: 1,
          isConsignment: 1,
          consignment: 1,
        }
      ).exec();

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: products,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: null,
          message: exception.message,
        },
      ];
    }
  }

  async findProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
    categoryId?: string
  ): Promise<ILegacyProductModel> {
    try {
      const product = await ProductModel.findOne({
        sell_price: {
          $gte: minPrice,
          $lte: maxPrice || 10000000000,
        },
        category_id: categoryId,
        isApproved: true,
        sell_status: 'Available',
        status: ProductStatus.Active,
        expiryDate: { $gte: new Date(new Date().toISOString()) },
      });
      return product;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findProductsByDateRange(
    startDate: Date,
    endDate: Date,
    categoryId?: string
  ): Promise<ILegacyProductModel> {
    try {
      const product = await ProductModel.findOne({
        createdDate: {
          $gte: startDate,
          $lte: endDate,
        },
        category_id: categoryId,
        isApproved: true,
        sell_status: 'Available',
        status: ProductStatus.Active,
        expiryDate: { $gte: new Date(new Date().toISOString()) },
      });
      return product;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
