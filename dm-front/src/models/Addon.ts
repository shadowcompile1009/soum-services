import { apiGatewayClient } from '@/api';

export interface IGetAddonsResponse {
  id: string;
  type: string;
  nameEn: string;
  nameAr: string;
  taglineEn: string[];
  taglineAr: string[];
  modelIds: string[];
  descriptionEn: string;
  descriptionAr: string;
  priceType: string;
  validity: number;
  validityType: string;
  image: string;
  // status: string;
  sellerIds: string[];
  price: number;
}

export interface IAddon {
  id: string;
  type: string;
  image: string;
  name: string;
  nameAr: string;
  price: number;
  tagLines: string[];
  tagLinesAr: string[];
  modelIds: string[];
  period: string;
  description: string;
  descriptionAr: string;
  priceType: string;
  sellerIds: string[];
}

export interface AddNewAddonsDTO {
  priceType: string;
  descriptionEn: string;
  price: number;
  validityType: string;
  descriptionAr: string;
  nameEn: string;
  nameAr: string;
  taglineAr: string;
  taglineEn: string;
  type: string;
  validity: string;
  modelIds: string;
  image: string;
}

export const AddonEndpoints = {
  getMainAddons(offset: number, limit: number) {
    return `addon?offset=${offset}&limit=${limit}`;
  },
  getSubAddons(modelId: string, offset: number, limit: number) {
    return `addon/?modelId=${modelId}&offset=${offset}&limit=${limit}`;
  },
  createAddons() {
    return `addon`;
  },
  deleteAddons(addonId: string) {
    return `addon/${addonId}`;
  },
  updateAddons(addonId: string) {
    return `addon/${addonId}`;
  },
  presignedURL(count: string, fileExtention: string, imageModule: string) {
    return `product/aws/pre-signed-url/?count=${count}&fileExtention=${fileExtention}&imageModule=${imageModule}`;
  },
};

export class Addon {
  static async getPresignedURL({
    count,
    fileExtension,
  }: {
    count: string;
    fileExtension: string;
  }) {
    const endpoint = AddonEndpoints.presignedURL(
      count,
      fileExtension,
      'addonImage'
    );

    const result = await apiGatewayClient.client.get(endpoint);

    return result;
  }

  static async getMainAddons(offset: number, limit: number) {
    const response = await apiGatewayClient.client.get(
      AddonEndpoints.getMainAddons(offset, limit)
    );

    const addons = Addon.mapAddons(response?.data?.items);

    return {
      deviceModels: addons,
      total: Number(response?.data?.total),
    };
  }

  static async getSubAddons(modelId: string, offset: number, limit: number) {
    const response = await apiGatewayClient.client.get(
      AddonEndpoints.getSubAddons(modelId, offset, limit)
    );

    const addons = Addon.mapAddons(response?.data?.items);
    return {
      deviceModels: addons,
      total: Number(response?.data?.items?.totalResult || addons.length),
    };
  }

  static async addNewAddons({ formValues }: { formValues: any }) {
    const result = await apiGatewayClient.client.post(
      AddonEndpoints.createAddons(),
      formValues
    );

    return result.data;
  }

  static async updateAddons({
    formValues,
    addonId,
  }: {
    formValues: any;
    addonId: string;
  }) {
    const result = await apiGatewayClient.client.put(
      AddonEndpoints.updateAddons(addonId),
      formValues
    );

    return result;
  }

  static async deleteAddons({ addonId }: { addonId: string }) {
    const result = await apiGatewayClient.client.delete(
      AddonEndpoints.deleteAddons(addonId)
    );

    return result.data;
  }

  static mapAddons(data: IGetAddonsResponse[]) {
    return data.map((item: IGetAddonsResponse) => ({
      id: item.id,
      type: item.type,
      image: item.image,
      name: item.nameEn,
      nameAr: item.nameAr,
      modelIds: item.modelIds,
      price: item.price,
      tagLines: item.taglineEn,
      tagLinesAr: item.taglineAr,
      period: `${item.validity} ${item.validityType}`,
      description: item.descriptionEn,
      descriptionAr: item.descriptionAr,
      sellerIds: item.sellerIds,
      priceType: item.priceType,
    }));
  }

  public id: string;
  public type: string;
  public image: string;
  public name: string;
  public nameAr: string;
  public price: number;
  public priceType: string;
  public tagLines: string[];
  public tagLinesAr: string[];
  public modelIds: string[];
  public period: string;
  public description: string;
  public descriptionAr: string;

  constructor(param: IAddon) {
    this.id = param.id;
    this.type = param.type;
    this.image = param.image;
    this.name = param.name;
    this.nameAr = param.nameAr;
    this.price = param.price;
    this.tagLines = param.tagLines;
    this.tagLinesAr = param.tagLinesAr;
    this.modelIds = param.modelIds;
    this.period = param.period;
    this.description = param.description;
    this.descriptionAr = param.descriptionAr;
    this.priceType = param.priceType;
  }
}
