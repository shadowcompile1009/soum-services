import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ListingSource } from '../enums/ListingSource';
import { createProductCommissionSummary } from '../grpc/commission';
import { migrateImages } from '../grpc/productMicroService';
import { deleteWithPattern } from '../libs/redis';
import { FeedDocument, FeedModel } from '../models/Feed';
import {
  ILegacyProductModel,
  LegacyProductInput,
  ProductModel,
} from '../models/LegacyProducts';
import {
  ListingGroup,
  ListingGroupDocument,
  ListingGroupInput,
  ProductImageSectionInput,
} from '../models/ListingGroup';
import { BaseRepository } from './BaseRepository';
import { ProductRepository } from './productRepository';
import { SettingRepository } from './settingRepository';
import {
  CalculationSettings,
  CreateCommissionSummaryRequest,
  Product,
} from '../grpc/proto/commission.pb';
import { PaymentModuleName } from '../enums/PO-module-name.enum';

@Service()
export class ListingGroupRepository extends BaseRepository {
  async deleteListing(listingID: string) {
    await ProductModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(listingID),
      {
        $set: {
          listingQuantity: 0,
          status: 'Delete',
          deletedBy: 'Seller',
          deletedDate: new Date(),
        },
      }
    );
  }
  async getById(listingGroupId: string): Promise<ListingGroupDocument> {
    return ListingGroup.findById(listingGroupId).exec();
  }
  async createListingGroup(
    listingGroupInput: ListingGroupInput
  ): Promise<[boolean, { code?: number; message?: string; result?: any }]> {
    try {
      const data = await ListingGroup.create(listingGroupInput);

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          message: Constants.MESSAGE.CREATE_BULK_LISTING_SUCCESSFULLY,
          result: data,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          message: exception.message,
          result: [],
        },
      ];
    }
  }

  async getAllListingGroups(
    page: number,
    size: number,
    user_id: string
  ): Promise<[boolean, { code: number; message?: string; result?: any }]> {
    try {
      const aggregate: Array<Record<string, any>> = [
        {
          $match: {
            status: 'Active',
            user_id: new mongoose.Types.ObjectId(user_id),
          },
        },
        { $skip: (page - 1) * size },
        { $limit: size },
        {
          $project: {
            _id: 1,
            product_images: 1,
            status: 1,
            category_id: 1,
            variant_id: 1,
            brand_id: 1,
            model_id: 1,
            variant: 1,
            variant_ar: 1,
            sell_price: 1,
            quantity: 1,
            active_listing: 1,
          },
        },
      ];

      const returnedResult = await ListingGroup.aggregate(aggregate);

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
          message: exception.message,
          result: [],
        },
      ];
    }
  }

  async getListingGroupByID(
    id: string,
    user_id?: string
  ): Promise<[boolean, { code: number; message?: string; result?: any }]> {
    try {
      const aggregate: Array<Record<string, any>> = [
        {
          $match: {
            status: 'Active',
            _id: new mongoose.Types.ObjectId(id),
            user_id: new mongoose.Types.ObjectId(user_id),
          },
        },
        {
          $project: {
            _id: 1,
            product_images: 1,
            status: 1,
            category_id: 1,
            variant_id: 1,
            brand_id: 1,
            model_id: 1,
            variant: 1,
            variant_ar: 1,
            sell_price: 1,
            quantity: 1,
            active_listing: 1,
          },
        },
      ];

      const returnedResult = await ListingGroup.aggregate(aggregate);

      if (returnedResult && returnedResult?.length === 0) {
        return [
          true,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND,
            message: Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND,
          },
        ];
      }

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: returnedResult[0],
          message: Constants.MESSAGE.GET_LISTING_GROUP_BY_ID_SUCCESSFULLY,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          message: exception.message,
          result: [],
        },
      ];
    }
  }

  async updateListingGroup(
    id: string,
    listingGroupInput: ListingGroupInput
  ): Promise<[boolean, { code: number; message?: string; result?: any }]> {
    try {
      const date = new Date();
      let isPriceUpdate = false;
      let isQuantityUpdate = false;
      let isProductImgUpdate = false;
      const setObject: {
        quantity?: number;
        sell_price?: number;
        updated_date?: Date;
        active_listing?: any;
        status?: string;
        product_images?: string[];
      } = {};

      if (listingGroupInput.quantity >= 0) {
        setObject.quantity = listingGroupInput.quantity;
        isQuantityUpdate = true;
        setObject.status =
          listingGroupInput.quantity === 0 ? 'Delete' : 'Active';
      }

      if (listingGroupInput.sell_price && listingGroupInput.sell_price > 0) {
        setObject.sell_price = listingGroupInput.sell_price;
        isPriceUpdate = true;
      }

      if (
        listingGroupInput.active_listing &&
        mongoose.Types.ObjectId.isValid(listingGroupInput.active_listing)
      ) {
        setObject.active_listing = listingGroupInput.active_listing;
      }

      if (listingGroupInput.product_images) {
        setObject.product_images = listingGroupInput.product_images;
        isProductImgUpdate = true;
      }

      setObject.updated_date = date;

      const returnedResult = await ListingGroup.findByIdAndUpdate(
        new mongoose.Types.ObjectId(id),
        { $set: setObject },
        { new: true }
      )
        .lean()
        .exec();

      if (!returnedResult) {
        return [
          true,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND,
            message: Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND,
          },
        ];
      }

      if (isQuantityUpdate) {
        if (listingGroupInput.quantity <= 0) {
          await this.deleteListing(returnedResult?.active_listing);
        } else {
          await ProductModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(returnedResult?.active_listing),
            {
              $set: {
                listingQuantity: listingGroupInput.quantity,
                updatedDate: date,
              },
            }
          );
        }
      }

      if (isProductImgUpdate) {
        await ProductModel.findByIdAndUpdate(
          new mongoose.Types.ObjectId(returnedResult?.active_listing),
          {
            $set: {
              product_images: listingGroupInput.product_images,
              updatedDate: date,
            },
          }
        );
      }

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: { ...returnedResult, isPriceUpdate },
          message: Constants.MESSAGE.UPDATE_LISTING_GROUP_SUCCESSFULLY,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          message: exception.message,
          result: [],
        },
      ];
    }
  }

  async deleteListingGroup(
    id: string
  ): Promise<[boolean, { code: number; message?: string; result?: any }]> {
    try {
      const returnedResult = await ListingGroup.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id), status: 'Active' },
        {
          $set: {
            status: 'Delete',
            deleted_date: new Date(),
            deleted_by: 'User',
          },
        },
        { new: true }
      );

      if (!returnedResult) {
        return [
          true,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND,
            message: Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND,
          },
        ];
      }
      await this.deleteListing(returnedResult?.active_listing);

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: returnedResult,
          message: Constants.MESSAGE.UPDATE_LISTING_GROUP_SUCCESSFULLY,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          message: exception.message,
          result: [],
        },
      ];
    }
  }

  allowGenerateProduct = (listingGroup: ListingGroupDocument) => {
    return listingGroup.status === 'Active' && listingGroup.quantity > 0;
  };

  generateProduct = async (
    listingGroupId: string,
    productRepo: ProductRepository,
    settingRepo: SettingRepository,
    sellerType?: string,
    priceRange?: string,
    quantity?: number | null,
    previousSale?: string | null,
    categoryId?: string | null,
    productImgSections?: ProductImageSectionInput[] | null,
    inventoryId?: string | null
  ): Promise<[boolean, { code: number; result: any; message?: string }]> => {
    const listingGroup = await this.getById(listingGroupId);

    if (!listingGroup) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.NOT_FOUND,
          result: listingGroup,
          message: Constants.MESSAGE.LISTING_GROUP_NOT_FOUND,
        },
      ];
    }

    if (this.allowGenerateProduct(listingGroup)) {
      const now = new Date();
      const [, settings]: any = await settingRepo.getSettingsObjectByKeys([
        'buyer_commission_percentage',
        'seller_commission_percentage',
        'shipping_charge_percentage',
        'vat_percentage',
        'referral_discount_type',
        'referral_percentage',
        'referral_fixed_amount',
        'apply_delivery_fee',
        'delivery_threshold',
        'delivery_fe',
        'price_quality_extra_commission',
      ]);
      const productId = new mongoose.Types.ObjectId();
      const productInput: LegacyProductInput = {
        _id: productId,
        category_id: listingGroup.category_id,
        brand_id: listingGroup.brand_id,
        model_id: listingGroup.model_id,
        product_images: listingGroup.product_images,
        defected_images: [],
        varient: listingGroup.variant,
        varient_ar: listingGroup.variant_ar,
        varient_id: listingGroup.variant_id,
        body_cracks: '',
        sell_price: listingGroup.sell_price,
        bid_price: 0,
        description: listingGroup.description || '',
        answer_to_questions: '',
        answer_to_questions_ar: '',
        grade: 'Like New',
        grade_ar: 'Like New',
        score: listingGroup.score,
        previous_grade: '',
        previous_score: null,
        pick_up_address: '',
        bidding: null,
        save_as_draft_step: '',
        current_bid_price: null,
        favourited_by: null,
        status: listingGroup.status,
        sell_status: 'Available',
        response: '',
        questionnaire_migration_status: '',
        isApproved: true,
        isExpired: false,
        isListedBefore: '',
        isFraudDetected: false,
        verified_date: now,
        promocode: '',
        expiryAfterInDays: 60,
        attributes: null,
        variant_attributes_selections: null,
        mismatch_model_migration: '',
        billingSettings: {
          buyer_commission_percentage: settings.buyer_commission_percentage,
          seller_commission_percentage: settings.seller_commission_percentage,
          shipping_charge_percentage: settings.shipping_charge_percentage,
          vat_percentage: settings.vat_percentage,
          referral_discount_type: settings.referral_discount_type,
          referral_percentage: settings.referral_percentage,
          referral_fixed_amount: settings.referral_fixed_amount,
          apply_delivery_fee: settings.apply_delivery_fee,
          delivery_threshold: settings.delivery_threshold,
          delivery_fee: settings.delivery_fee,
          price_quality_extra_commission:
            settings.price_quality_extra_commission,
        },
        recommended_price: 0,
        listingQuantity: quantity ? quantity : listingGroup.quantity,
        listingGroupId: listingGroup._id,
        isModelImage: listingGroup?.isModelImage,
        condition_id: listingGroup?.condition_id || '',
        listingSource: ListingSource.MERCHANT,
        inventoryId: inventoryId || '',
      };

      const commissionSummaryRequest: CreateCommissionSummaryRequest = {
        commission: {
          userType: sellerType,
          isBuyer: false,
        },
        product: {
          id: productId.toString(),
          sellPrice: listingGroup.sell_price,
          priceRange,
          categoryId: listingGroup.category_id,
          modelId: listingGroup.model_id,
        } as Product,
        calculationSettings: {
          vatPercentage: settings.vat_percentage,
          applyDeliveryFeeSPPs: settings.apply_delivery_fee_spps,
          applyDeliveryFeeMPPs: settings.apply_delivery_fee_mpps,
          applyDeliveryFee: settings.apply_delivery_fee,
          deliveryFeeThreshold: settings.delivery_threshold,
          deliveryFee: settings.delivery_fee,
          referralFixedAmount: settings.referral_fixed_amount,
        } as CalculationSettings,
        promoCode: null,
        order: null,
        addOns: null,
        reservation: null,
        financingRequest: null,
        paymentModuleName: PaymentModuleName.GENERAL_ORDER,
        paymentOption: null,
      };

      const commissionSummary = await createProductCommissionSummary(
        commissionSummaryRequest
      );

      if (!commissionSummary) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: null,
            message: Constants.ERROR_MAP.FAILED_TO_CREATE_COMMISSION,
          },
        ];
      }

      const [isError, productData] = await productRepo.createProduct(
        productInput,
        listingGroup.user_id
      );
      if (!isError) {
        await migrateImages({
          imagesUrl:
            (productData.result as ILegacyProductModel).product_images || [],
          productId: (productData.result as ILegacyProductModel)._id.toString(),
          categoryId,
          productImgSections,
        });
      }
      if (previousSale) {
        const feedData = await FeedModel.find({
          'items.productId': {
            $in: [new mongoose.Types.ObjectId(previousSale)],
          },
        });

        if (feedData && feedData?.length > 0) {
          await Promise.all(
            feedData.map(async (feedData: FeedDocument) => {
              await FeedModel.updateOne(
                { _id: new mongoose.Types.ObjectId(feedData._id) },
                {
                  $set: {
                    items: [
                      ...feedData.items,
                      {
                        position: feedData.items.length + 1,
                        productId: new mongoose.Types.ObjectId(
                          (productData.result as ILegacyProductModel)._id
                        ),
                        categoryId: new mongoose.Types.ObjectId(
                          (
                            productData.result as ILegacyProductModel
                          ).category_id
                        ),
                        brandId: new mongoose.Types.ObjectId(
                          (productData.result as ILegacyProductModel).brand_id
                        ),
                        modelId: new mongoose.Types.ObjectId(
                          (productData.result as ILegacyProductModel).model_id
                        ),
                        status: 0,
                      },
                    ],
                  },
                }
              );
            })
          );

          deleteWithPattern('feeds_*');
        }
      }

      return [isError, productData];
    }

    return [
      true,
      {
        code: Constants.ERROR_CODE.BAD_REQUEST,
        result: null,
        message: Constants.ERROR_MAP.FAIL_TO_CREATE_PRODUCT,
      },
    ];
  };
}
