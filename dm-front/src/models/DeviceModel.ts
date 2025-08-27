import { apiClientV1 } from '@/api';

export interface IGetDeviceModelsResponse {
  model_name_ar: string;
  questions: any[];
  position: number;
  _id: string;
  category_id: string;
  brand_id: string;
  model_name: string;
  model_icon: string;
  model_id: string;
  varients: any[];
}

export interface IDeviceModel {
  id: string;
  name: string;
  nameAr: string;
  position: number;
  modelIcon: string;
}

export const DeviceModelEndpoints = {
  getBrands(brandId: string, page: number, pageSize: number) {
    return `admin/model?brand_id=${brandId}&page=${page}&size=${pageSize}`;
  },
};

export class DeviceModel {
  static async getDeviceModels(
    modelId: string,
    page: number,
    pageSize: number,
  ) {
    const response = await apiClientV1.client.get(
      DeviceModelEndpoints.getBrands(modelId, page, pageSize),
    );

    const deviceModels = DeviceModel.mapDeviceModels(response?.data?.modelList);
    return {
      deviceModels,
      total: Number(
        response?.data?.modelList?.totalResult || deviceModels.length,
      ),
    };
  }

  static mapDeviceModels(data: IGetDeviceModelsResponse[]) {
    return data.map((item: IGetDeviceModelsResponse) => ({
      id: item._id,
      name: item.model_name,
      nameAr: item.model_name_ar,
      modelIcon: item.model_icon,
      position: item.position,
    }));
  }

  public id: string;
  public name: string;
  public nameAr: string;
  public position: number;
  public modelIcon: string;

  constructor({ id, name, nameAr, position, modelIcon }: IDeviceModel) {
    this.id = id;
    this.name = name;
    this.nameAr = nameAr;
    this.modelIcon = modelIcon;
    this.position = position;
  }
}
