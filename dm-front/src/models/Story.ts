// import { apiClientV2 } from '@/api/client';

import { apiGatewayClient } from '@/api';
import { AddNewStoriesDTO } from '@/types/dto';

export const StoryEndpoints = {
  getStories(offset: number, limit: number, search?: string, date?: string) {
    if (search && date) {
      return `product/story-section?limit=${limit}&offset=${offset}&search=${search}&date=${date}`;
    } else if (search) {
      return `product/story-section?limit=${limit}&offset=${offset}&search=${search}`;
    } else if (date) {
      return `product/story-section?limit=${limit}&offset=${offset}&date=${date}`;
    } else {
      return `product/story-section?limit=${limit}&offset=${offset}`;
    }
  },
  addNewStory: 'product/story-section',
  updateStory(id: string) {
    return `product/story-section/${id}`;
  },
  updatePositionStory() {
    return `product/story-section/position`;
  },
  deleteStory(id: string) {
    return `product/story-section/${id}`;
  },
  presignedURL(count: string, fileExtention: string, imageModule: string) {
    return `product/aws/pre-signed-url/?count=${count}&fileExtention=${fileExtention}&imageModule=${imageModule}`;
  },
};

interface IPositionStory {
  id: string;
  position: number;
}
export interface IStory {
  id: string;
  nameEn: string;
  nameAr: string;
  iconURL: string;
  storyURLs: string[];
  startDate: Date;
  endDate: Date;
  position: number;
  urlLink: string;
}
export class Story {
  static async getPresignedURL({
    count,
    fileExtension,
  }: {
    count: string;
    fileExtension: string;
  }) {
    const endpoint = StoryEndpoints.presignedURL(
      count,
      fileExtension,
      'productImage'
    );
    const result = await apiGatewayClient.client.get(endpoint);

    return result;
  }
  public id: string;
  public nameEn: string;
  public nameAr: string;
  public iconURL: string;
  public storyURLs: string[];
  public startDate: Date;
  public endDate: Date;

  constructor({
    id,
    storyURLs,
    nameEn,
    nameAr,
    iconURL,
    startDate,
    endDate,
  }: IStory) {
    this.id = id;
    this.nameEn = nameEn;
    this.nameAr = nameAr;
    this.iconURL = iconURL;
    this.storyURLs = storyURLs;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  static async getStories(
    offset: number,
    limit: number,
    search?: string,
    date?: string
  ) {
    const result = await apiGatewayClient.client.get(
      StoryEndpoints.getStories(offset, limit, search, date)
    );

    return result.data;
  }

  static async deleteStory(id: string) {
    const result = await apiGatewayClient.client.delete(
      StoryEndpoints.deleteStory(id)
    );

    return result;
  }

  static async addStory(formValues: AddNewStoriesDTO) {
    const result = await apiGatewayClient.client.post(
      StoryEndpoints.addNewStory,
      {
        nameEn: formValues.nameEn,
        nameAr: formValues.nameAr,
        iconURL: formValues.iconURL,
        storyURLs: formValues.storyURLs,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        position: formValues.position,
        isActive: true,
        urlLink: formValues.urlLink,
      }
    );

    return result.data;
  }

  static async updateStory({
    id,
    formValues,
  }: {
    id: string;
    formValues: AddNewStoriesDTO;
  }) {
    const result = await apiGatewayClient.client.put(
      StoryEndpoints.updateStory(id),
      {
        nameEn: formValues.nameEn,
        nameAr: formValues.nameAr,
        iconURL: formValues.iconURL,
        storyURLs: formValues.storyURLs,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        position: formValues.position,
        isActive: true,
        urlLink: formValues.urlLink,
      }
    );

    return result.data;
  }

  static async updatePositionStory({
    formValues,
  }: {
    formValues: IPositionStory[];
  }) {
    const result = await apiGatewayClient.client.put(
      StoryEndpoints.updatePositionStory(),
      formValues
    );

    return result.data;
  }
}
