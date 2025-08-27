import { instanceToPlain } from 'class-transformer';

import { apiClientV1, apiClientV2, apiGatewayClient } from '@/api/client';

export const ProductListingEndpoints = {
  // apiClientV1 call
  getListingDetailsById(listingId: string) {
    return `admin/product/${listingId}`;
  },
  getInspectionReportDetailsById(listingId: string, categoryName: string) {
    return `product/settings/admin/${listingId}/${categoryName}`;
  },
  getSpecificationReportDetailsById(listingId: string, categoryName: string) {
    return `product/settings/admin/specification/${listingId}/${categoryName}`;
  },
  getRealEstateInspectionReportDetailsById(listingId: string) {
    return `product/settings/admin/specification/${listingId}/Real-estate`;
  },
  getProductConditions: (categoryId: string) => {
    return `/category/condition?categoryId=${categoryId}&offset=0&limit=100&isPreset=true`;
  },
  updateInspectionReportDetailsById(listingId: string) {
    return `product/settings/${listingId}`;
  },
  updateSpecificationReportDetailsById(listingId: string) {
    return `product/settings/specification/${listingId}`;
  },
  updateRealEstateInspectionReportDetailsById(listingId: string) {
    return `product/settings/specification/${listingId}`;
  },
  updateProductCondition: (productId: string) => {
    return `/product/adm/consignment/${productId}/product-condition`;
  },
  presignedURL(count: string, fileExtention: string, imageModule: string) {
    return `product/aws/pre-signed-url/?count=${count}&fileExtention=${fileExtention}&imageModule=${imageModule}`;
  },
  updateListingImages(listingId: string) {
    return `rest/api/v1/product/images/${listingId}`;
  },
  updateImageScore(listingId: string) {
    return `rest/api/v1/product/${listingId}/details`;
  },
  getListingActivationDetailsById(listingId: string) {
    return `rest/api/v1/product/status/${listingId}`;
  },
  toggleProductActivation(listingId: string) {
    return ProductListingEndpoints.getListingActivationDetailsById(listingId);
  },
};

export type Grade = 'Like New' | 'Lightly Used' | 'Fair' | 'Extensive Use';

interface IProductListingResponse {
  product_images: string[];
  categoryData: {
    category_name: string;
    category_id: string;
  };
  condition_id: string;
  modelData: {
    model_name: string;
  };
  brandData: {
    brand_name: string;
  };
  sell_price: number;
  bid_price: number;
  sell_status: string;
  code: string;
  isListedBefore: boolean;
  bidding: any[];
  varient: string;
  description: string;
  _id: string;
  deletedDate: Date;
  expiryDate: Date;
  grade: Grade;
  imagesQualityScore: number;
  isUpranked: boolean;
}
export interface IProductListing {
  images: string[];
  categoryName: string;
  categoryId: string;
  conditionId: string;
  modelName: string;
  brandName: string;
  variantName: string;
  sellPrice: number;
  bidPrice: number;
  sellStatus: string;
  code: string;
  isListedBefore: boolean;
  bidding: any[];
  description: string;
  productId: string;
  deleteDate: Date;
  expiryDate: Date;
  grade: Grade;
  isUpranked: boolean;
  imagesQualityScore: number;
}

export class ProductListing {
  static async toggleProductActivation({
    isActivated,
    listingId,
  }: {
    isActivated: boolean;
    listingId: string;
  }) {
    const endpoint = ProductListingEndpoints.toggleProductActivation(listingId);
    const result = apiClientV2.client.put(endpoint, { isActivated });

    return result;
  }

  static async updateImageScore({
    imagesQualityScore,
    isUpranked,
    listingId,
  }: {
    imagesQualityScore: number;
    isUpranked: boolean;
    listingId: string;
  }) {
    const endpoint = ProductListingEndpoints.updateImageScore(listingId);

    const result = await apiClientV2.client.put(endpoint, {
      isUpranked,
      imagesQualityScore,
    });

    return result;
  }

  static async toggleUprank({
    imagesQualityScore,
    isUpranked,
    listingId,
  }: {
    imagesQualityScore: number;
    isUpranked: boolean;
    listingId: string;
  }) {
    return ProductListing.updateImageScore({
      imagesQualityScore,
      isUpranked,
      listingId,
    });
  }
  static async getListingDetailsById(listingId: string) {
    const endpoint = ProductListingEndpoints.getListingDetailsById(listingId);

    const result = await apiClientV1.client.get(endpoint);

    return instanceToPlain(
      ProductListing.mapProductListing(result.data.productData)
    ) as ProductListing;
  }
  static async getInspectionReportDetailsById(
    listingId: string,
    categoryName: string
  ) {
    const endpoint = ProductListingEndpoints.getInspectionReportDetailsById(
      listingId,
      categoryName
    );
    const result = await apiGatewayClient.client.get(endpoint);
    return result?.data?.inspections;
  }

  static async getSpecificationReportDetailsById(
    listingId: string,
    categoryName: string
  ) {
    const endpoint = ProductListingEndpoints.getSpecificationReportDetailsById(
      listingId,
      categoryName
    );
    const result = await apiGatewayClient.client.get(endpoint);
    return result?.data?.specification;
  }

  static async getProductConditions(categoryId: string) {
    const endpoint = ProductListingEndpoints.getProductConditions(categoryId);
    const result = await apiGatewayClient.client.get(endpoint);

    return result?.data;
  }

  static async updateProductCondition({
    productId,
    conditionId,
  }: {
    productId: string;
    conditionId: string;
  }) {
    const endpoint = ProductListingEndpoints.updateProductCondition(productId);

    const result = await apiGatewayClient.client.patch(endpoint, {
      conditionId,
    });

    return result;
  }

  static async updateSpecificationReport({
    listingId,
    categoryName,
    specification,
  }: {
    listingId: string;
    categoryName: string;
    specification: any;
  }) {
    const endpoint =
      ProductListingEndpoints.updateSpecificationReportDetailsById(listingId);

    const result = await apiGatewayClient.client.post(endpoint, {
      categoryName,
      specification,
    });
    return result;
  }

  static async getRealEstateInspectionReportDetailsById(listingId: string) {
    const endpoint =
      ProductListingEndpoints.getRealEstateInspectionReportDetailsById(
        listingId
      );
    const result = await apiGatewayClient.client.get(endpoint);
    return result?.data?.specification || result?.data?.inspections;
  }

  static async getListingActivationDetailsById(listingId: string) {
    const endpoint =
      ProductListingEndpoints.getListingActivationDetailsById(listingId);

    const result = await apiClientV2.client.get(endpoint);

    return result.data.responseData;
  }

  static async updateListingImages({
    listingId,
    images,
    newImages,
  }: {
    listingId: string;
    images: string[];
    newImages?: File[];
  }) {
    const endpoint = ProductListingEndpoints.updateListingImages(listingId);

    const formData = new FormData();

    if (newImages) {
      newImages.forEach((image) => {
        formData.append('new_images', image);
      });
    }

    images.forEach((image) => {
      formData.append('listingImages', image);
    });

    const result = await apiClientV2.client.put(endpoint, formData);
    return result;
  }

  static async updateInspectionReport({
    listingId,
    categoryName,
    inspectionReport,
  }: {
    listingId: string;
    categoryName: string;
    inspectionReport: any;
  }) {
    const endpoint =
      ProductListingEndpoints.updateInspectionReportDetailsById(listingId);

    const result = await apiGatewayClient.client.post(endpoint, {
      categoryName,
      inspectionReport,
    });
    return result;
  }

  static async updateRealEstateInspectionReport({
    listingId,
    categoryName,
    inspectionReport,
  }: {
    listingId: string;
    categoryName: string;
    inspectionReport: any;
  }) {
    const endpoint =
      ProductListingEndpoints.updateRealEstateInspectionReportDetailsById(
        listingId
      );

    const result = await apiGatewayClient.client.post(endpoint, {
      categoryName: categoryName,
      specification: inspectionReport,
    });

    return result;
  }

  static async getPresignedURL({
    count,
    fileExtension,
  }: {
    count: string;
    fileExtension: string;
  }) {
    const endpoint = ProductListingEndpoints.presignedURL(
      count,
      fileExtension,
      'productImage'
    );
    const result = await apiGatewayClient.client.get(endpoint);

    return result;
  }

  static async mapProductListing(productListing: IProductListingResponse) {
    return new ProductListing({
      images: productListing.product_images,
      categoryName: productListing.categoryData.category_name,
      categoryId: productListing.categoryData.category_id,
      conditionId: productListing.condition_id,
      modelName: productListing.modelData.model_name,
      brandName: productListing.brandData.brand_name,
      sellPrice: productListing.sell_price,
      sellStatus: productListing.sell_status,
      code: productListing.code,
      isListedBefore: productListing.isListedBefore,
      bidding: productListing.bidding,
      variantName: productListing.varient,
      bidPrice: productListing.bid_price,
      description: productListing.description,
      productId: productListing._id,
      deleteDate: productListing.deletedDate ?? '',
      expiryDate: productListing.expiryDate ?? '',
      grade: productListing.grade,
      isUpranked: productListing.isUpranked,
      imagesQualityScore: productListing.imagesQualityScore,
    });
  }

  public images: string[];
  public categoryName: string;
  public categoryId: string;
  public conditionId: string;
  public modelName: string;
  public brandName: string;
  public variantName: string;
  public sellPrice: number;
  public bidPrice: number;
  public sellStatus: string;
  public code: string;
  public isListedBefore: boolean;
  public bidding: any[];
  public description: string;
  public productId: string;
  public deleteDate: Date;
  public expiryDate: Date;
  public grade: Grade;
  public isUpranked: boolean;
  public imagesQualityScore: number;

  constructor({
    images,
    categoryName,
    conditionId,
    modelName,
    brandName,
    sellPrice,
    sellStatus,
    code,
    isListedBefore,
    bidding,
    variantName,
    bidPrice,
    description,
    productId,
    deleteDate,
    expiryDate,
    grade,
    categoryId,
    isUpranked,
    imagesQualityScore,
  }: IProductListing) {
    this.images = images;
    this.categoryName = categoryName;
    this.conditionId = conditionId;
    this.modelName = modelName;
    this.brandName = brandName;
    this.sellPrice = sellPrice;
    this.sellStatus = sellStatus;
    this.code = code;
    this.isListedBefore = isListedBefore;
    this.bidding = bidding;
    this.variantName = variantName;
    this.bidPrice = bidPrice;
    this.description = description;
    this.productId = productId;
    this.deleteDate = deleteDate;
    this.expiryDate = expiryDate;
    this.grade = grade;
    this.categoryId = categoryId;
    this.isUpranked = isUpranked ?? false;
    this.imagesQualityScore = imagesQualityScore ?? 0;
  }
}
