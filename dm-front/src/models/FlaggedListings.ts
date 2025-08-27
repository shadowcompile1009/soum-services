import { instanceToPlain } from 'class-transformer';

import { apiClientV2 } from '@/api/client';
import { ProductListing } from './ProductListing';

export const FlaggedListingTypes = {
  RECENT: 'listing_date',
  DISCOUNT: 'discount',
  POSITIVE: 'positive_flag',
  UNCHECKED: 'uncheck',
  UNFILTERED: 'unfiltered',
  CONSIGNMENT: 'consignment',
  ONHOLD: 'on_hold',
} as const;

export type FlaggedListingType = keyof typeof FlaggedListingTypes;
export type FlaggedListingValues =
  typeof FlaggedListingTypes[FlaggedListingType];

export const FlaggedListingEndpoints = {
  getFlaggedListingByType(
    listingType: FlaggedListingValues,
    pageNumber: number,
    pageSize: number = 50
  ) {
    if (listingType === 'consignment') {
      return `rest/api/v1/product/flagged-listings?size=${pageSize}&page=${pageNumber}&isConsignment=true`;
    }

    if (listingType === 'on_hold') {
      return `rest/api/v1/product/flagged-listings?size=${pageSize}&page=${pageNumber}&isOnHold=true`;
    }

    const filteredListingType = listingType === 'unfiltered' ? '' : listingType;
    return `rest/api/v1/product/flagged-listings?size=${pageSize}&page=${pageNumber}&sortBy=${filteredListingType}`;
  },
  updateVerifiedStatus(productId: string) {
    return `rest/api/v1/product/verify-product/${productId}`;
  },
  updateApproveStatus(productId: string) {
    return `rest/api/v1/product/${productId}/approve`;
  },
  lockUser(userId: string) {
    return `rest/api/v1/user/change-status/${userId}`;
  },
  deleteListing(productId: string) {
    return `rest/api/v1/product/delete/${productId}`;
  },
  rejectListing(productId: string) {
    return `rest/api/v1/product/${productId}/reject`;
  },
};

export interface IFlaggedListingResponse {
  isApproved: boolean;
  user_id: string;
  discount: number;
  model_name: string;
  actual_product_picture: string;
  product_id: string;
  phone_number: string;
  listing_date: Date;
  pictures: string[];
  is_fraud_detected: boolean;
  product_condition: string;
  product_description: string;
  buy_now_price: number;
  new_device_price: number;
  is_verified_by_admin: boolean;
  pause_status: boolean;
}

export interface IFlaggedListing {
  isApproved: boolean;
  userId: string;
  discount: number;
  modelName: string;
  actualProductImage: string;
  productId: string;
  phoneNumber: string;
  listingDate: Date;
  images: string[];
  isFraudDetected: string;
  productCondition: string;
  productDescription: string;
  buyNowPrice: number;
  newDevicePrice: number;
  isVerifiedByAdmin: boolean;
  pauseStatus: string;
}

export const InvalidReasons = {
  broken: 'Broken',
  scam: 'Scam',
  mismatch: 'Mismatch',
  misgraded: 'Mis-graded',
  invalid: 'Invalid',
  fake: 'Fake',
  other: 'Other',
} as const;

export type InvalidReasonsType = keyof typeof InvalidReasons;
export type InvalidReasonsValues = typeof InvalidReasons[InvalidReasonsType];

export class FlaggedListing {
  static async deleteListing({
    listing,
    reason,
  }: {
    listing: FlaggedListing | ProductListing;
    reason: InvalidReasonsValues;
  }) {
    const endpoint = FlaggedListingEndpoints.deleteListing(listing.productId);
    const data = { reason };

    const result = await apiClientV2.client.put(endpoint, data);
    return result;
  }
  static async rejectListing({
    listing,
    reason,
  }: {
    listing: FlaggedListing;
    reason: InvalidReasonsValues;
  }) {
    const endpoint = FlaggedListingEndpoints.rejectListing(listing.productId);

    const data = {
      rejected_reasons: reason,
    };

    const result = await apiClientV2.client.put(endpoint, data);
    return result;
  }
  static async lockUser(userId: string) {
    const endpoint = FlaggedListingEndpoints.lockUser(userId);
    const data = { isBlockUser: true, status: 'Inactive' };

    const result = await apiClientV2.client.put(endpoint, data);
    return result;
  }

  static async updateApproveStatus({
    listing,
    status,
  }: {
    listing: FlaggedListing;
    status: boolean;
  }) {
    const endpoint = FlaggedListingEndpoints.updateApproveStatus(
      listing.productId
    );
    const data = { isApproved: status };

    const result = await apiClientV2.client.put(endpoint, data);
    return result;
  }

  static async updateVerifiedStatus({
    listing,
    status,
  }: {
    listing: FlaggedListing;
    status: boolean;
  }) {
    const endpoint = FlaggedListingEndpoints.updateVerifiedStatus(
      listing.productId
    );
    const data = { verifyStatus: status };

    const result = await apiClientV2.client.put(endpoint, data);
    return result;
  }
  static async getFlaggedListingByType(
    listingType: FlaggedListingValues,
    pageNumber: number,
    pageSize: number = 50
  ) {
    const endpoint = FlaggedListingEndpoints.getFlaggedListingByType(
      listingType,
      pageNumber,
      pageSize
    );

    const result = await apiClientV2.client.get(endpoint);
    const listings = await FlaggedListing.mapFlaggedListings(
      result.data.responseData.result.data
    );

    return {
      listings: instanceToPlain(listings) as FlaggedListing[],
      total: Number(result.data.responseData.result.totalResult),
    };
  }

  static async mapFlaggedListings(listings: IFlaggedListingResponse[]) {
    return listings.map(
      (listing) =>
        new FlaggedListing({
          isApproved: listing.isApproved,
          userId: listing.user_id,
          discount: listing.discount,
          modelName: listing.model_name,
          actualProductImage: listing.actual_product_picture,
          productId: listing.product_id,
          phoneNumber: listing.phone_number,
          listingDate: listing.listing_date,
          images: listing.pictures,
          isFraudDetected:
            listing.is_fraud_detected || Boolean(listing.is_fraud_detected)
              ? 'Positive'
              : 'Negative',
          productCondition: listing.product_condition,
          productDescription: listing.product_description,
          buyNowPrice: listing.buy_now_price,
          newDevicePrice: listing.new_device_price,
          isVerifiedByAdmin: listing.is_verified_by_admin,
          pauseStatus: listing.pause_status ? 'True' : 'False',
        })
    );
  }

  public isApproved: boolean;
  public userId: string;
  public discount: number;
  public modelName: string;
  public actualProductImage: string;
  public productId: string;
  public phoneNumber: string;
  public listingDate: Date;
  public images: string[];
  public isFraudDetected: string;
  public productCondition: string;
  public productDescription: string;
  public buyNowPrice: number;
  public newDevicePrice: number;
  public isVerifiedByAdmin: boolean;
  public pauseStatus: string;

  constructor({
    isApproved,
    userId,
    discount,
    modelName,
    actualProductImage,
    productId,
    phoneNumber,
    listingDate,
    images,
    isFraudDetected,
    productCondition,
    productDescription,
    buyNowPrice,
    newDevicePrice,
    isVerifiedByAdmin,
    pauseStatus,
  }: IFlaggedListing) {
    this.isApproved = isApproved;
    this.userId = userId;
    this.discount = discount;
    this.modelName = modelName;
    this.actualProductImage = actualProductImage;
    this.productId = productId;
    this.phoneNumber = phoneNumber;
    this.listingDate = listingDate;
    this.images = images;
    this.isFraudDetected = isFraudDetected;
    this.productCondition = productCondition;
    this.productDescription = productDescription;
    this.buyNowPrice = buyNowPrice;
    this.newDevicePrice = newDevicePrice;
    this.isVerifiedByAdmin = isVerifiedByAdmin;
    this.pauseStatus = pauseStatus;
  }
}
