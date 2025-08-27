import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import { LegacyAdminJwtStrategy } from '@src/auth/strategies/admin-jwt.strategy';
import { CustomException } from '@src/custom-exception';
import { CustomResponse, CustomResponseStatus } from '@src/customResponse';
import { MongoIdDto } from '@src/dto/valid-id.dto';
import { getCache, setCache } from '@src/utils/redis';
import { v4 as uuidv4 } from 'uuid';
import { VaultInstance } from '../../utils/vault.util';
import { ImageSectionService } from '../image-section/image-section.service';
import { AdminUpdateProductService } from './adminUpdateProduct.service';
import { CreateProductService } from './createProduct.service';
import defaultCarsInspectionReport from './data/defaultCarsInspectionReport';
import defaultCarsSpecificationReport from './data/defaultCarsSpecificationReport';
import defaultRealEstateInspectionReport from './data/defaultRealEstateInspectionReport';
import defaultRealEstateSpecificationReport from './data/defaultRealEstateSpecification';
import { AdminUpdateProductDTO } from './dto/adminUpdateProduct.dto';
import { BestListingSettingsResponseDto } from './dto/bestListingSettings.dto';
import { CreateProductDTO } from './dto/createProduct.dto';
import { DeepLoadReq } from './dto/deepLoadReq.dto';
import { MikroOrmIdDto } from './dto/valid-id.dto';
import { SpecificationReport } from './entity/product-inspection-settings.entity';
import { ProductImageSection } from './entity/productImageSection.entity';
import { CustomCodeErrors } from './enum/customErrorCodes.enum';
import { ProductInspectionSettingsService } from './product-inspection-settings.service';
import { ProductService } from './product.service';
import { ProductImageService } from './productImageSec.service';
import { UserUpdateProductService } from './userUpdateProduct.service';
import { ViewProductService } from './viewProduct.service';

@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly createService: CreateProductService,
    private readonly adminUpdateService: AdminUpdateProductService,
    private readonly userUpdateService: UserUpdateProductService,
    private readonly viewService: ViewProductService,
    private readonly productInspectionSettingsService: ProductInspectionSettingsService,
    private readonly productImageServiceService: ProductImageService,
    private imageSectionService: ImageSectionService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly vaultInstance: VaultInstance,
  ) {}
  @Post('settings/:productId')
  @ApiParam({ name: 'productId' })
  @UseGuards(LegacyAdminJwtStrategy)
  async create(@Param() params: any, @Body() payload) {
    return await this.productInspectionSettingsService.addNewInspectionReport(
      params.productId,
      payload.categoryName,
      payload.inspectionReport,
    );
  }

  @Post('settings/specification/:productId')
  @ApiParam({ name: 'productId' })
  @UseGuards(LegacyAdminJwtStrategy)
  async createSpecification(@Param() params: any, @Body() payload) {
    return await this.productInspectionSettingsService.addNewSpecificationReport(
      params.productId,
      payload.categoryName,
      payload.specification,
    );
  }

  @Get('settings/admin/specification/:productId/:categoryName')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiParam({ name: 'productId' })
  @ApiParam({ name: 'categoryName' })
  async loadSpecification(@Param() params: MikroOrmIdDto) {
    const productSettings = await this.productInspectionSettingsService.findOne(
      params.productId,
    );

    if (
      productSettings &&
      productSettings.specificationReport &&
      productSettings?.specificationReport?.length > 0
    ) {
      return { specification: productSettings.specificationReport };
    }

    return params?.categoryName === 'Cars'
      ? defaultCarsSpecificationReport
      : defaultRealEstateSpecificationReport;
  }

  @Get('vault/settings')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async getVaultSettings() {
    try {
      const key = 'product-secret';
      let secretData = await this.cacheManager.get<any>(key);
      if (secretData == null || secretData == undefined) {
        secretData = await this.vaultInstance.getSecretData('product');
        await this.cacheManager.set(key, secretData, 120 * 60 * 1000);
      }
      return {
        status: CustomResponseStatus.SUCCESS,
        data: secretData,
      } as CustomResponse<any>;
    } catch (error) {
      return {
        status: CustomResponseStatus.FAIL,
        data: null,
        message: error.message,
      } as CustomResponse<any>;
    }
  }

  @Get('settings/:productId')
  @ApiParam({ name: 'productId' })
  async loadOne(@Param() params: MikroOrmIdDto) {
    const productSettings = await this.productInspectionSettingsService.findOne(
      params.productId,
    );
    if (!productSettings) {
      throw new NotFoundException('Inspection report not found');
    }
    const formattedDate = new Date(
      productSettings.createdAt,
    ).toLocaleDateString('en-GB');
    let returnSpec;

    if (productSettings?.specificationReport?.length) {
      returnSpec = productSettings.specificationReport.map(
        (specification: SpecificationReport) => {
          const value =
            specification.nameEn === 'Odometer' &&
            specification.value?.toString() === '0'
              ? 'New - جديدة'
              : specification.value;

          const [valueEn, valueAr] = value?.split(' - ') || [];

          return {
            ...specification,
            value,
            valueEn,
            valueAr,
          };
        },
      );
    }

    return {
      inspections: productSettings.inspectionReport,
      specifications: returnSpec
        ? returnSpec
        : productSettings?.specificationReport,
      categoryName: productSettings.categoryName,
      createdAt: productSettings.createdAt,
      inspectionReportStaticData:
        productSettings.categoryName === 'Cars'
          ? {
              en: {
                headerTitle: 'Car Inspection Report',
                headerSubTitle: `Inspected on ${formattedDate}`,
                descriptionTitle: '+200 Point checked',
                descriptionSubtitle:
                  'Our used cars are carefully inspected and examined according to precise criteria',
              },
              ar: {
                headerTitle: 'فحص السيارة الشامل',
                headerSubTitle: `تم الفحص فى ${formattedDate}`,
                descriptionTitle: 'أكثر من 200 نقطة تم فحصها',
                descriptionSubtitle:
                  'نختار سياراتنا المستعملة وفق معايير دقيقة ونعرض فقط الأفضل',
              },
            }
          : {
              en: {
                headerTitle: 'Property inspection report',
                headerSubTitle: 'Inspected by expert engineers',
                descriptionTitle: 'For your peace of mind',
                descriptionSubtitle:
                  'We made it easy for you, we conducted a thorough and precise inspection to offer you the best',
              },
              ar: {
                headerTitle: 'فحص العقار الشامل',
                headerSubTitle: 'تم الفحص على أيدي خبراء في العقار',
                descriptionTitle: 'من أجل راحة بالك',
                descriptionSubtitle:
                  'سهلناها عليك، فحصنا العقار بشكل كامل ودقيق لتقديم الأفضل لك',
              },
            },
    };
  }

  @Get('settings/admin/:productId/:categoryName')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiParam({ name: 'productId' })
  @ApiParam({ name: 'categoryName' })
  async load(@Param() params: MikroOrmIdDto) {
    const productSettings = await this.productInspectionSettingsService.findOne(
      params.productId,
    );
    if (
      productSettings &&
      productSettings.inspectionReport &&
      productSettings?.inspectionReport?.length > 0
    ) {
      return { inspections: productSettings.inspectionReport };
    }
    return params?.categoryName === 'Cars'
      ? defaultCarsInspectionReport
      : defaultRealEstateInspectionReport;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(LegacyAdminJwtStrategy)
  async AdminUpdateActions(
    @Body() payload: AdminUpdateProductDTO,
    @Param() parm: any,
    @Req() request: any,
  ) {
    try {
      payload.id = parm.id;
      let result = null;
      if (payload.productAction.match(/admin/g)) {
        result = await this.adminUpdateService.AdminUpdateActions(
          payload,
          request.user.userId,
        );
      } else {
        result = await this.userUpdateService.userUpdateActions(
          payload,
          request.user.userId,
        );
      }

      return {
        status: CustomResponseStatus.SUCCESS,
        data: result,
      } as CustomResponse<any>;
    } catch (error) {
      return {
        status: CustomResponseStatus.FAIL,
        data: null,
        message: error.message,
      } as CustomResponse<any>;
    }
  }

  @Get(':id/deepload')
  async getByIdDeepLoad(@Param() param: any, @Query() query: any) {
    try {
      const prodId = param.id;
      const deepLoadReq: DeepLoadReq = {
        isGetImages: query.isGetImages || true,
        isGetStockImages: query.isGetStockImages || true,
      };
      const result = await this.viewService.getById(prodId, deepLoadReq);
      return {
        status: CustomResponseStatus.SUCCESS,
        data: result,
      } as CustomResponse<any>;
    } catch (error) {
      return {
        status: CustomResponseStatus.FAIL,
        data: null,
        message: error.message,
      } as CustomResponse<any>;
    }
  }

  // @Get('/:id')
  // @UseGuards(JwtAuthGuard)
  // @UseGuards(LegacyAdminJwtStrategy)
  // async getById(@Param() param: any) {
  //   try {
  //     const prodId = param.id;
  //     const result = await this.viewService.getById(prodId, {});
  //     return {
  //       status: CustomResponseStatus.SUCCESS,
  //       data: result,
  //     } as CustomResponse<any>;
  //   } catch (error) {
  //     return {
  //       status: CustomResponseStatus.FAIL,
  //       data: null,
  //       message: error.message,
  //     } as CustomResponse<any>;
  //   }
  // }

  @Post('')
  @UseGuards(JwtAuthGuard)
  @UseGuards(LegacyAdminJwtStrategy)
  async createProduct(@Body() payload: CreateProductDTO, @Req() request: any) {
    try {
      const userId = request.user.userId;
      const result = await this.createService.addNewProduct(payload, userId);
      return {
        status: CustomResponseStatus.SUCCESS,
        data: result,
        code: 200,
      } as CustomResponse<any>;
    } catch (error) {
      console.log(error);
      return {
        status: CustomResponseStatus.FAIL,
        data: null,
        code: 400,
        message: JSON.stringify(error),
      } as CustomResponse<any>;
    }
  }

  @Patch('dummy-section/:id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async addDummyImageSections(@Param() parm: any, @Query() query: any) {
    const res = await this.imageSectionService.filter(
      { categoryId: query.categoryId },
      100,
      0,
    );
    return this.productImageServiceService.createList(
      res.items
        .filter((elem) => elem.isActive)
        .map((elem) =>
          Object.assign(new ProductImageSection(), {
            id: uuidv4(),
            description: elem.description,
            descriptionAr: elem.descriptionAr,
            header: elem.header,
            headerAr: elem.headerAr,
            sectionType: elem.sectionType,
            sectionTypeAr: elem.sectionTypeAr,
            maxImageCount: elem.maxImageCount,
            minImageCount: elem.minImageCount,
            position: elem.position,
            urls: [],
            productId: parm.id,
            iconURL: elem.iconURL,
            base: elem.base,
            createdAt: new Date(),
          }),
        ),
    );
  }

  @Get('seller/:id/showcase')
  @ApiParam({ name: 'id' })
  async getSellerShowcase(@Param() params: MongoIdDto) {
    const sellerId = params.id;
    return await this.productService.getSellerShowcase(sellerId);
  }

  @Get('app/cards-and-models-count')
  async GetCategoryModelsCountResponse() {
    try {
      const key = `cars-category-count-app`;
      let countData = await getCache<any>(key);
      if (
        countData?.result?.brands === null ||
        countData?.result?.brands === undefined
      ) {
        countData = await this.productService.GetCategoryModelsCountResponse();
        await setCache(key, countData, 60 * 60);
      }
      return countData;
    } catch (err) {
      throw new CustomException(CustomCodeErrors.GET_OPERATION_FAILED);
    }
  }

  @Get('web/cards-and-models-count')
  async GetCategoryModelsCountResponseWeb() {
    try {
      const key = `cars-category-count-web`;
      let countData = await getCache<any>(key);
      if (
        countData?.result?.brands === null ||
        countData?.result?.brands === undefined
      ) {
        countData = await this.productService.GetCategoryModelsCountResponse();
        await setCache(key, countData, 60 * 60);
      }
      return countData;
    } catch (err) {
      throw new CustomException(CustomCodeErrors.GET_OPERATION_FAILED);
    }
  }

  @Get('best-listing/:categoryId/settings')
  @ApiResponse({
    status: 200,
    type: BestListingSettingsResponseDto,
  })
  async getBestListingSettings(@Param() params: { categoryId: string }) {
    return this.productService.getBestListingService(params.categoryId);
  }
}
