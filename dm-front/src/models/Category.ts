import { apiClientV2 } from '@/api';

export const CategoriesTypes = {
  SUPER_CATEGORY: 'superCategory',
  CATEGORY: 'category',
  BRAND: 'brand',
  MODEL: 'model',
} as const;

export type CategoriesValues =
  (typeof CategoriesTypes)[keyof typeof CategoriesTypes];

export interface IGetCategoriesResponse {
  mini_category_icon: string;
  listing_photo: string;
  browsing_photo: string;
  position: string;
  max_percentage: string;
  status: string;
  created_at: string;
  updated_at: string;
  _id: string;
  category_name: string;
  category_name_ar: string;
  category_icon: string;
  active: string;
}

export interface ICategory {
  id: string;
  name: string;
  nameAr: string;
  maxPercentage: string;
  status: string;
  type: string;
  parentId: string;
  icon: string;
  position: string;
}

export const CategoriesEndpoints = {
  getCategories(
    type: CategoriesValues,
    categoryId: string,
    page: number,
    pageSize: number,
  ) {
    if (type === CategoriesTypes.SUPER_CATEGORY) {
      return `/rest/api/v1/category?isSuperCategory=true&page=${page}&size=${pageSize}`;
    }
    if (type === CategoriesTypes.CATEGORY) {
      return `/rest/api/v1/category/super/${categoryId}?page=${page}&size=${pageSize}`;
    }

    return '';
  },
};

export class Category {
  static async getCategories(
    type: CategoriesValues,
    categoryId: string,
    page: number,
    pageSize: number,
  ) {
    const response = await apiClientV2.client.get(
      CategoriesEndpoints.getCategories(type, categoryId, page, pageSize),
    );

    const categories = Category.mapCategories(response?.data?.responseData);
    return {
      categories,
      total: Number(
        response?.data?.responseData?.totalResult || categories.length,
      ),
    };
  }

  static mapCategories(data: IGetCategoriesResponse[]) {
    return data.map((item: IGetCategoriesResponse) => ({
      id: item._id,
      name: item.category_name,
      nameAr: item.category_name_ar,
      maxPercentage: item.max_percentage,
      status: item.status,
      type: item._id,
      parentId: item._id,
      icon: item.category_icon,
      position: item.position,
    }));
  }

  public id: string;
  public name: string;
  public nameAr: string;
  public maxPercentage: string;
  public status: string;
  public type: string;
  public parentId: string;
  public icon: string;
  public position: string;

  constructor({
    id,
    name,
    nameAr,
    maxPercentage,
    status,
    type,
    parentId,
    icon,
    position,
  }: ICategory) {
    this.id = id;
    this.name = name;
    this.nameAr = nameAr;
    this.maxPercentage = maxPercentage;
    this.status = status;
    this.type = type;
    this.parentId = parentId;
    this.icon = icon;
    this.position = position;
  }
}
