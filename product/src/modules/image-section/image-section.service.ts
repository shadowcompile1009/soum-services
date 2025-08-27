import { Inject, Injectable } from '@nestjs/common';
import { AmazonService } from '../aws/aws.service';
import { ImageSectionDto } from './dto/ImageSection.dto';
import { CustomCodeErrors } from '../product/enum/customErrorCodes.enum';
import { CustomException } from '@src/custom-exception';
import { v4 as uuidv4 } from 'uuid';
import { PaginatedDto } from '@src/dto/paginated.dto';
import { ConfigType } from '@nestjs/config';
import awsConfig from '@src/config/aws.config';
import { StockImageDto } from './dto/stockImage.dto';
@Injectable()
export class ImageSectionService {
  constructor(
    private amazonService: AmazonService,
    @Inject(awsConfig.KEY)
    private readonly awsConfigData: ConfigType<typeof awsConfig>,
  ) {}

  async delete(id: any) {
    const filedata = await this.amazonService.getFile('./imageSections.json');
    let allSections: ImageSectionDto[] = filedata ? JSON.parse(filedata) : [];
    allSections = allSections.filter((elem: ImageSectionDto) => elem.id !== id);
    var json = JSON.stringify(allSections);
    var buffer = Buffer.from(json);
    await this.amazonService.uploadFile('./imageSections.json', buffer);
  }
  async filter(filterObj: any, limit: number, offset: number) {
    try {
      const filedata = await this.amazonService.getFile('./imageSections.json');
      const allSections: ImageSectionDto[] = filedata
        ? JSON.parse(filedata)
        : [];
      let categorySections = allSections.filter((elem: ImageSectionDto) => {
        const categoryMatch =
          !filterObj.categoryId || elem.categoryId === filterObj.categoryId;
        const sectionMatch =
          !filterObj.sectionType || elem.sectionType === filterObj.sectionType;
        const activeMatch = filterObj.isActive ? elem.isActive : true;

        return categoryMatch && sectionMatch && activeMatch;
      });

      categorySections.forEach((elem) => {
        elem.fullURL = `${elem.base}/${elem.iconURL}`;
      });
      return {
        items: categorySections
          .sort((a, b) => a?.position - b?.position)
          .slice(
            Math.min(offset, categorySections.length - 1),
            Math.min(offset + limit, categorySections.length),
          ),
        total: categorySections.length,
        limit,
        offset,
      } as PaginatedDto<ImageSectionDto>;
    } catch (error) {
      console.log(error);
      return {
        items: [],
        total: 0,
        limit,
        offset,
      } as PaginatedDto<ImageSectionDto>;
    }
  }

  async create(payload: ImageSectionDto, userId: any) {
    try {
      payload.id = uuidv4();
      payload.createdAt = new Date();
      payload.base = this.awsConfigData.imageBucketEndpoint;
      const filedata = await this.amazonService.getFile('./imageSections.json');
      const allSections: ImageSectionDto[] = filedata
        ? JSON.parse(filedata)
        : [];
      payload.position =
        allSections.filter((elem) => elem.categoryId === payload.categoryId)
          ?.length || 0;
      allSections.push(payload);

      var json = JSON.stringify(allSections);
      var buffer = Buffer.from(json);
      await this.amazonService.uploadFile('./imageSections.json', buffer);
      return payload;
    } catch (error) {
      console.log(error);
      throw new CustomException(CustomCodeErrors.CREATE_OPERATION_FAILED);
    }
  }

  async updateFull(payload: ImageSectionDto) {
    try {
      const filedata = await this.amazonService.getFile('./imageSections.json');
      let allSections: ImageSectionDto[] = filedata ? JSON.parse(filedata) : [];
      let sec = allSections.find((elem) => elem.id === payload.id);
      Object.assign(sec, {
        id: sec.id,
        categoryId: sec.categoryId,
        sectionType: payload.sectionType,
        sectionTypeAr: payload.sectionTypeAr,
        description: payload.description,
        descriptionAr: payload.descriptionAr,
        header: payload.header,
        headerAr: payload.headerAr,
        minImageCount: payload.minImageCount,
        maxImageCount: payload.maxImageCount,
        isActive: payload.isActive,
        iconURL: payload.iconURL,
        createdAt: sec.createdAt,
        position: sec.position,
        base:
          payload.iconURL === sec.iconURL
            ? sec.base
            : this.awsConfigData.imageBucketEndpoint,
      });
      var json = JSON.stringify(allSections);
      var buffer = Buffer.from(json);
      await this.amazonService.uploadFile('./imageSections.json', buffer);
      return payload;
    } catch (error) {
      throw new CustomException(CustomCodeErrors.UPDATE_OPERATION_FAILED);
    }
  }

  async filterStockImages(modelId: string, limit: number, offset: number) {
    try {
      const filedata = await this.amazonService.getFile('/stockImages.json');
      let allImages: StockImageDto[] = filedata ? JSON.parse(filedata) : [];
      if (modelId)
        allImages = allImages.filter((elem) => elem.modelId == modelId);
      return {
        items: allImages.slice(
          Math.min(offset, allImages.length - 1),
          Math.min(offset + limit, allImages.length),
        ),
        total: allImages.length,
        limit,
        offset,
      } as PaginatedDto<StockImageDto>;
    } catch (error) {
      console.log(error);
      return {
        items: [],
        total: 0,
        limit,
        offset,
      } as PaginatedDto<StockImageDto>;
    }
  }

  async updateStockImagesFull(payload: StockImageDto) {
    try {
      const filedata = await this.amazonService.getFile('/stockImages.json');
      let allSections: StockImageDto[] = filedata ? JSON.parse(filedata) : [];
      let sec = allSections.find((elem) => elem.id === payload.id);
      Object.assign(sec, {
        id: sec.id,
        modelId: sec.modelId,
        modelName: payload.modelName,
        brandName: payload.brandName,
        url: payload.urls,
      });
      var json = JSON.stringify(allSections);
      var buffer = Buffer.from(json);
      await this.amazonService.uploadFile('/stockImages.json', buffer);
      return payload;
    } catch (error) {
      throw new CustomException(CustomCodeErrors.UPDATE_OPERATION_FAILED);
    }
  }

  async createStockImage(payload: StockImageDto) {
    try {
      payload.id = uuidv4();
      payload.createdAt = new Date();
      const filedata = await this.amazonService.getFile('/stockImages.json');
      const allSections: StockImageDto[] = filedata ? JSON.parse(filedata) : [];
      allSections.push(payload);

      var json = JSON.stringify(allSections);
      var buffer = Buffer.from(json);
      await this.amazonService.uploadFile('/stockImages.json', buffer);
      return payload;
    } catch (error) {
      console.log(error);
      throw new CustomException(CustomCodeErrors.CREATE_OPERATION_FAILED);
    }
  }

  async deleteStockImage(id: string) {
    const filedata = await this.amazonService.getFile('/stockImages.json');
    let allSections: StockImageDto[] = filedata ? JSON.parse(filedata) : [];
    allSections = allSections.filter((elem: StockImageDto) => elem.id !== id);
    var json = JSON.stringify(allSections);
    var buffer = Buffer.from(json);
    await this.amazonService.uploadFile('/stockImages.json', buffer);
  }
}
