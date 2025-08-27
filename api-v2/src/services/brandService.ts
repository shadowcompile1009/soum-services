import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { BrandDocument, BrandFilterOptions, BrandInput } from '../models/Brand';
import { BrandRepository } from '../repositories/brandRepository';
import { CategoryRepository } from '../repositories/categoryRepository';
import { createCategory } from '../grpc/category';
import { CreateCategoryRequest, Icon } from '../grpc/proto/category.pb';
import { CategoryType } from '../enums/CategoryType';
import { CategoryIconType } from '../enums/CategoryIconType';

@Service()
export class BrandService {
  @Inject()
  error: ErrorResponseDto;
  @Inject()
  brandRepository: BrandRepository;
  @Inject()
  categoryRepository: CategoryRepository;

  async getAllBrands(filter?: BrandFilterOptions) {
    try {
      const [errBrand, brands] = await this.brandRepository.getAllBrands(
        filter
      );
      if (errBrand) {
        this.error.errorCode = brands.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = brands.result.toString();
        this.error.message = brands.message;
        throw this.error;
      }
      return brands.result as BrandDocument[];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_BRAND
        );
      }
    }
  }

  async getBrandViaId(brandId: string) {
    try {
      const [errBrand, brands] = await this.brandRepository.getById(brandId);
      if (errBrand) {
        this.error.errorCode = brands.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = brands.result.toString();
        this.error.message = brands.message;
        throw this.error;
      }
      return brands.result as BrandDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_BRAND,
          exception.message
        );
      }
    }
  }

  async getBrandListViaCategory(categoryId: string) {
    try {
      if (categoryId) {
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
      }
      const [errBrand, brands] =
        await this.brandRepository.getBrandListViaCategory(categoryId);
      if (errBrand) {
        this.error.errorCode = brands.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = brands.result.toString();
        this.error.message = brands.message;
        throw this.error;
      }
      return brands.result as BrandDocument[];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_BRAND,
          exception.message
        );
      }
    }
  }

  async createBrand(brand: BrandInput) {
    try {
      const [err, data] = await this.brandRepository.createBrand(brand);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result as BrandDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_BRAND,
          exception.message
        );
      }
    }
  }
  async migrateBrands() {
    const brands = await this.getAllBrands({
      limit: 4000,
      migratedToCategory: false,
    });
    const transformedBrands = brands.map(brand => {
      const icons: Icon[] = [
        {
          url: brand?.brand_icon,
          type: CategoryIconType.BRAND_ICON,
          source: '',
        },
      ];

      return {
        id: brand?.id,
        name: brand?.brand_name,
        nameAr: brand?.brand_name_ar,
        position: brand?.position,
        status: brand.status.toLowerCase(),
        type: CategoryType.BRAND,
        parentId: brand?.category_id,
        icons: icons,
      } as CreateCategoryRequest;
    });

    for (const createCategoryInput of transformedBrands) {
      await createCategory(createCategoryInput);
      await this.updateBrand({
        brand_id: createCategoryInput.id,
        migrated_to_category: true,
      } as BrandInput);
    }
  }
  async updateBrand(brand: BrandInput) {
    try {
      const [err, data] = await this.brandRepository.updateBrand(brand);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result as BrandDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATED_BRAND,
          exception.message
        );
      }
    }
  }
}
