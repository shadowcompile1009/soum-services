import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { CategoryDocument, CategoryInput } from '../models/Category';
import { CategoryRepository } from '../repositories/categoryRepository';
import { createCategory } from '../grpc/category';
import { CreateCategoryRequest } from '../grpc/proto/category/CreateCategoryRequest';
import { Icon } from '../grpc/proto/category/Icon';
import { CategoryType } from '../enums/CategoryType';
import { CategoryIconType } from '../enums/CategoryIconType';

@Service()
export class CategoryService {
  @Inject()
  error: ErrorResponseDto;
  @Inject()
  categoryRepository: CategoryRepository;

  async getAllCategory(like: string, isSuperCategory?: boolean) {
    try {
      const [errCat, categories] = await this.categoryRepository.getAllCategory(
        like,
        isSuperCategory
      );
      if (errCat) {
        this.error.errorCode = categories.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = categories.result.toString();
        this.error.message = categories.message;
        throw this.error;
      }
      return categories.result as CategoryDocument[];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY
        );
      }
    }
  }

  async getCategory(categoryId: string) {
    try {
      const [errCat, category] = await this.categoryRepository.getById(
        categoryId
      );
      if (errCat) {
        this.error.errorCode = category.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = category.result.toString();
        this.error.message = category.message;
        throw this.error;
      }
      return category.result as CategoryDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY,
          exception.message
        );
      }
    }
  }

  async createCategory(category: CategoryInput) {
    try {
      const [err, data] = await this.categoryRepository.createCategory(
        category
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }

      const catData = data.result as CategoryDocument;

      const icons: Icon[] = [
        {
          url: catData?.category_icon,
          type: CategoryIconType.CATEGORY_ICON,
          source: '',
        },
        {
          url: catData?.listing_photo,
          type: CategoryIconType.LISTING_PHOTO,
          source: '',
        },
        {
          url: catData?.browsing_photo,
          type: CategoryIconType.BROWSING_PHOTO,
          source: '',
        },
        {
          url: catData?.mini_category_icon,
          type: CategoryIconType.MINI_CATEGORY_ICON,
          source: '',
        },
      ];

      await this.createCat({
        id: catData?.id,
        name: catData?.category_name,
        nameAr: catData?.category_name_ar,
        position: catData?.position,
        status: catData.status.toLowerCase(),
        type: CategoryType.CATEGORY,
        parentId: catData?.parent_super_category_id,
        icons: icons,
      } as CreateCategoryRequest);

      return data.result as CategoryDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_CATEGORY,
          exception.message
        );
      }
    }
  }
  async updateCategory(category: CategoryInput) {
    try {
      const [err, data] = await this.categoryRepository.updateCategory(
        category
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result as CategoryDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATED_CATEGORY,
          exception.message
        );
      }
    }
  }

  async uploadBrowsingPhoto(categoryId: string, filePath: string) {
    try {
      if (!categoryId || !filePath) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS;
        throw this.error;
      }
      const [errCat, category] =
        await this.categoryRepository.uploadBrowsingPhoto(categoryId, filePath);
      if (errCat) {
        this.error.errorCode = category.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = category.result.toString();
        this.error.message = category.message;
        throw this.error;
      }
      return category.result as CategoryDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPLOAD,
          exception.message
        );
      }
    }
  }

  async uploadListingPhoto(categoryId: string, filePath: string) {
    try {
      if (!categoryId || !filePath) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS;
        throw this.error;
      }
      const [errCat, category] =
        await this.categoryRepository.uploadListingPhoto(categoryId, filePath);
      if (errCat) {
        this.error.errorCode = category.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = category.result.toString();
        this.error.message = category.message;
        throw this.error;
      }
      return category.result as CategoryDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPLOAD,
          exception.message
        );
      }
    }
  }

  async getCategoryBySuperCategory(categoryId: string) {
    try {
      const [errCat, category] =
        await this.categoryRepository.getBySuperCategoryId(categoryId);

      if (errCat) {
        this.error.errorCode = category.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = category.result.toString();
        this.error.message = category.message;
        throw this.error;
      }

      return category.result as CategoryDocument[];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY,
          exception.message
        );
      }
    }
  }

  async deleteCategory(categoryId: string) {
    try {
      const [getCatErr, getCat] = await this.categoryRepository.getById(
        categoryId
      );

      if (getCatErr) {
        this.error.errorCode = getCat.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = getCat.result.toString();
        this.error.message = Constants.MESSAGE.FAILED_TO_DELETE_CATEGORY;
        throw this.error;
      }

      const [errCat, category] = await this.categoryRepository.deleteCategory(
        categoryId
      );

      if (errCat) {
        this.error.errorCode = category.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = category.result.toString();
        this.error.message = category.message;
        throw this.error;
      }

      return category.result as CategoryDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_CATEGORY,
          exception.message
        );
      }
    }
  }
  async migrateCategories() {
    const categories = await this.getAllCategory(null);
    const transformedCategories = categories.map(category => {
      const icons: Icon[] = [
        {
          url: category?.category_icon,
          type: CategoryIconType.CATEGORY_ICON,
          source: '',
        },
        {
          url: category?.listing_photo,
          type: CategoryIconType.LISTING_PHOTO,
          source: '',
        },
        {
          url: category?.browsing_photo,
          type: CategoryIconType.BROWSING_PHOTO,
          source: '',
        },
        {
          url: category?.mini_category_icon,
          type: CategoryIconType.MINI_CATEGORY_ICON,
          source: '',
        },
      ];

      return {
        id: category?.id,
        name: category?.category_name,
        nameAr: category?.category_name_ar,
        position: category?.position,
        status: category.status.toLowerCase(),
        type: CategoryType.CATEGORY,
        parentId: category?.parent_super_category_id,
        icons: icons,
      } as CreateCategoryRequest;
    });

    for (const createCategoryInput of transformedCategories) {
      await this.createCat(createCategoryInput);
    }
  }

  async createCat(category: CreateCategoryRequest) {
    const createCategoryInput = {
      id: category?.id,
      name: category?.name,
      nameAr: category?.nameAr,
      position: category?.position,
      status: category.status.toLowerCase(),
      type: CategoryType.CATEGORY,
      parentId: category?.parentId,
      icons: category?.icons,
    } as CreateCategoryRequest;

    return await createCategory(createCategoryInput);
  }
}
