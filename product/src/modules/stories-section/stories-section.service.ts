import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import awsConfig from '@src/config/aws.config';
import { CustomException } from '@src/custom-exception';
import { PaginatedDto } from '@src/dto/paginated.dto';
import { v4 as uuidv4 } from 'uuid';
import { AmazonService } from '../aws/aws.service';
import { CustomCodeErrors } from '../product/enum/customErrorCodes.enum';
import { FilterStoryDto, StoriesSectionDto } from './dto/storiesSection.dto';

@Injectable()
export class StoriesSectionService {
  constructor(
    private amazonService: AmazonService,
    @Inject(awsConfig.KEY)
    private readonly awsConfigData: ConfigType<typeof awsConfig>,
  ) {}

  async filter(
    filterObj: FilterStoryDto,
    limit: number,
    offset: number,
  ): Promise<PaginatedDto<StoriesSectionDto>> {
    try {
      const filedata = await this.amazonService.getFile('./storySections.json');
      const allSections: StoriesSectionDto[] = filedata
        ? JSON.parse(filedata)
        : [];
      let categorySections = [];
      if (filterObj.clientId === 'admin-web') {
        const lowerCaseSearchTerm =
          filterObj.search?.length > 0
            ? filterObj.search.trim().toLowerCase()
            : null;
        const filterDate = filterObj.date ? new Date(filterObj.date) : null;
        categorySections = allSections.filter((section: StoriesSectionDto) => {
          const startDate = new Date(section.startDate);
          const endDate = new Date(section.endDate);
          const inDateRange = filterDate
            ? startDate <= filterDate && endDate >= filterDate
            : false;
          if (lowerCaseSearchTerm && filterDate) {
            return (
              (section.nameEn.toLowerCase().includes(lowerCaseSearchTerm) ||
                section.nameAr.toLowerCase().includes(lowerCaseSearchTerm)) &&
              inDateRange
            );
          } else if (lowerCaseSearchTerm) {
            return (
              section.nameEn.toLowerCase().includes(lowerCaseSearchTerm) ||
              section.nameAr.toLowerCase().includes(lowerCaseSearchTerm)
            );
          } else if (filterDate) {
            return inDateRange;
          }
          return true;
        });
      } else {
        const today = new Date();
        categorySections = allSections.filter((section: StoriesSectionDto) => {
          const startDate = new Date(section.startDate);
          const endDate = new Date(section.endDate);
          const inDateRange = startDate <= today && endDate >= today;
          const isActive = section.isActive;
          return isActive && inDateRange;
        });
      }

      const total = categorySections?.length;
      const pages = Math.ceil(total / limit);
      const currentPage = Math.max(1, Math.min(offset, pages));
      const startIndex = (currentPage - 1) * limit;
      const endIndex = Math.min(startIndex + limit, total);

      const paginatedItems = categorySections
        .sort((a, b) => a?.position - b?.position)
        .slice(startIndex, endIndex);

      return {
        items: paginatedItems,
        total,
        limit,
        offset,
        pages,
      } as PaginatedDto<StoriesSectionDto>;
    } catch (error) {
      console.error(error);
      return {
        items: [],
        total: 0,
        limit,
        offset,
      } as PaginatedDto<StoriesSectionDto>;
    }
  }

  async get(storyId: string): Promise<StoriesSectionDto> {
    try {
      const filedata = await this.amazonService.getFile('./storySections.json');
      const allSections: StoriesSectionDto[] = filedata
        ? JSON.parse(filedata)
        : [];
      return allSections.find((elem: StoriesSectionDto) => elem.id === storyId);
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  async create(payload: StoriesSectionDto) {
    try {
      payload.id = uuidv4();
      payload.createdAt = new Date();
      const filedata = await this.amazonService.getFile('./storySections.json');
      const allSections: StoriesSectionDto[] = filedata
        ? JSON.parse(filedata)
        : [];
      allSections.push(payload);

      const json = JSON.stringify(allSections);
      const buffer = Buffer.from(json);
      await this.amazonService.uploadFile('./storySections.json', buffer);
      return payload;
    } catch (error) {
      console.log(error);
      throw new CustomException(CustomCodeErrors.CREATE_OPERATION_FAILED);
    }
  }

  async updatePosition(payloads: StoriesSectionDto[]) {
    try {
      const filedata = await this.amazonService.getFile('./storySections.json');
      const allSections: StoriesSectionDto[] = filedata
        ? JSON.parse(filedata)
        : [];
      payloads.forEach((payload) => {
        const sec = allSections.find((elem) => elem.id === payload.id);
        if (sec) {
          sec.position = payload.position;
        }
      });
      const json = JSON.stringify(allSections);
      const buffer = Buffer.from(json);
      await this.amazonService.uploadFile('./storySections.json', buffer);
      return payloads;
    } catch (error) {
      throw new CustomException(CustomCodeErrors.UPDATE_OPERATION_FAILED);
    }
  }

  async update(payload: StoriesSectionDto) {
    try {
      const filedata = await this.amazonService.getFile('./storySections.json');
      const allSections: StoriesSectionDto[] = filedata
        ? JSON.parse(filedata)
        : [];
      const sec = allSections.find((elem) => elem.id === payload.id);
      Object.assign(sec, {
        id: sec.id,
        nameEn: payload.nameEn,
        nameAr: payload.nameAr,
        isActive: payload.isActive,
        storyURLs: payload.storyURLs,
        iconURL: payload.iconURL,
        urlLink: payload.urlLink,
        createdAt: payload.createdAt,
        position: payload.position,
        startDate: payload.startDate,
        endDate: payload.endDate,
      });
      const json = JSON.stringify(allSections);
      const buffer = Buffer.from(json);
      await this.amazonService.uploadFile('./storySections.json', buffer);
      return payload;
    } catch (error) {
      throw new CustomException(CustomCodeErrors.UPDATE_OPERATION_FAILED);
    }
  }

  async delete(id: any) {
    const filedata = await this.amazonService.getFile('./storySections.json');
    let allSections: StoriesSectionDto[] = filedata ? JSON.parse(filedata) : [];
    allSections = allSections.filter(
      (elem: StoriesSectionDto) => elem.id !== id,
    );
    const json = JSON.stringify(allSections);
    const buffer = Buffer.from(json);
    await this.amazonService.uploadFile('./storySections.json', buffer);
  }
}
