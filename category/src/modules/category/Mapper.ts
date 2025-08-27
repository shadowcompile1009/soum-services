import {
  AdminCategoryDto,
  AppCategoryDto,
  AppListingCategoryDto,
  WebPagesCategoryDto,
} from './dto/category.dto';
import { Category } from './entities/category';

export class Mapper {
  // Static method

  static CategoryToWebPagesCategoryDtoMapper(from: Category) {
    return {
      id: from.id,
      name: from.name,
      nameAr: from.nameAr,
      type: from.type,
    } as WebPagesCategoryDto;
  }
  static CategoryToAppCateoryMapper(from: Category) {
    return {
      id: from.id,
      name: from.name,
      nameAr: from.nameAr,
      position: from.position,
      type: from.type,
      images: from.images,
    } as AppCategoryDto;
  }

  static CategoryToAppCateoryLookupMapper(from: Category[]) {
    return from.map((elem) => {
      return {
        id: elem.id,
        name: elem.name,
        nameAr: elem.nameAr,
        position: elem.position,
        type: elem.type,
        images: elem.images,
      } as AppListingCategoryDto;
    });
  }

  static CategoryToAdmCateoryLookupMapper(from: Category[]) {
    return from.map((elem) => {
      return {
        id: elem.id,
        name: elem.name,
        nameAr: elem.nameAr,
        position: elem.position,
        type: elem.type,
        images: elem.images,
        status: elem.status,
        currentPrice: elem.currentPrice,
        maxPercentage: elem.maxPercentage,
        parentId: elem.parentId,
      } as AdminCategoryDto;
    });
  }

  static CategoryToAdminCateoryMapper(from: Category) {
    return {
      id: from.id,
      name: from.name,
      nameAr: from.nameAr,
      position: from.position,
      type: from.type,
      images: from.images,
      status: from.status,
      currentPrice: from.currentPrice,
      maxPercentage: from.maxPercentage,
      parentId: from.parentId,
      categoryAttributes: from.categoryAttributes.map(elem => {
        return {
          attributeId : elem.attribute.id,
          featureId: elem.option.id,
        }
      }),
    } as AdminCategoryDto;
  }

  static CategoryArrayToAdminCateoryMapper(from: Category[]) {
    return from.map((elem) => {
      return {
        id: elem.id,
        name: elem.name,
        nameAr: elem.nameAr,
        position: elem.position,
        type: elem.type,
        images: elem.images,
        status: elem.status,
        currentPrice: elem.currentPrice,
        maxPercentage: elem.maxPercentage,
      } as AdminCategoryDto;
    });
  }
}
