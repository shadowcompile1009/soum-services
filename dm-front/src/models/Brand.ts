import { apiClientV1 } from '@/api';

export interface IGetBrandsResponse {
  brand_name_ar: string;
  brand_icon: string;
  position: number;
  add_ons: any[];
  is_add_on_enabled: boolean;
  category_id: string;
  brand_name: string;
  brand_id: string;
}

export interface IBrand {
  id: string;
  name: string;
  nameAr: string;
  brandIcon: string;
  position: number;
  categoryId: string;
  isAddonEnabled: boolean;
}

export const BrandEndpoints = {
  getBrands(categoryId: string, page: number, pageSize: number) {
    return `admin/brand?category_id=${categoryId}&page=${page}&size=${pageSize}`;
  },
};

export class Brand {
  static async getBrands(categoryId: string, page: number, pageSize: number) {
    const response = await apiClientV1.client.get(
      BrandEndpoints.getBrands(categoryId, page, pageSize),
    );

    const brands = Brand.mapBrands(response?.data?.brandList);
    return {
      brands,
      total: Number(response?.data?.brandList?.totalResult || brands.length),
    };
  }

  static mapBrands(data: IGetBrandsResponse[]): IBrand[] {
    return data.map((item: IGetBrandsResponse) => ({
      id: item.brand_id,
      name: item.brand_name,
      nameAr: item.brand_name_ar,
      brandIcon: item.brand_icon,
      position: item.position,
      categoryId: item.category_id,
      isAddonEnabled: item.is_add_on_enabled,
    }));
  }

  public id;
  public name;
  public nameAr;
  public brandIcon;
  public position;
  public categoryId;
  public isAddonEnabled;

  constructor({
    id,
    name,
    nameAr,
    brandIcon,
    position,
    categoryId,
    isAddonEnabled,
  }: IBrand) {
    this.id = id;
    this.name = name;
    this.nameAr = nameAr;
    this.brandIcon = brandIcon;
    this.position = position;
    this.categoryId = categoryId;
    this.isAddonEnabled = isAddonEnabled;
  }
}
