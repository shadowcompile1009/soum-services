import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { CreateInspectionDTO } from './dto/inspection.dto';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CreateProductService } from '../product/createProduct.service';
import {
  InspectionStatus,
  InspectionType,
} from './enum/inspection.status.enum';
import { UUID } from 'mongodb';
import { Specification } from './entity/Specification';
import { ProductInspectionSettings } from '../product/entity/product-inspection-settings.entity';
import { ProductInspectionReport } from './dto/product-inspection-report.dto';
import { InspectionFilterDTO } from './dto/Inspection-filter.dto';
import { PaginatedDto } from '@src/dto/paginated.dto';
import { VaultInstance } from '@src/utils/vault.util';
import { Category } from '../product/entity/category.entity';
import { ProductInspectionListQueryDto } from './dto/product-inspection-list-query.dto';
import { ProductInspectionListItemDto } from './dto/product-inspection-list.dto';
import { AdminUpdateProductService } from '../product/adminUpdateProduct.service';
import { ProductActionsEnum } from '../product/enum/productActions.enum';
import { AdminUpdateProductDTO } from '../product/dto/adminUpdateProduct.dto';
import { Product } from '../product/entity/product.entity';
import { SoumUser } from '../product/entity/user.entity';
import { ProductService } from '../product/product.service';
import { CategoryType } from '../product/enum/categoryType.enum';

@Injectable()
export class InspectionService {
  constructor(
    @InjectRepository(Specification)
    private readonly specificationRepo: EntityRepository<Specification>,
    @InjectRepository(ProductInspectionSettings)
    private readonly productInspectionRepo: EntityRepository<ProductInspectionSettings>,
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
    @InjectRepository(SoumUser)
    private readonly soumUserRepo: EntityRepository<SoumUser>,
    @Inject(forwardRef(() => CreateProductService))
    private readonly createProductService: CreateProductService,
    @Inject(forwardRef(() => AdminUpdateProductService))
    private readonly adminUpdateProductService: AdminUpdateProductService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    private readonly vaultInstance: VaultInstance,
  ) {}
  async createProductAndInspection(
    params: CreateInspectionDTO,
    adminId: string,
  ) {
    const result = await this.createProductService.addNewProduct(
      params,
      params.userId,
    );
    return this.createInspection(result, adminId);
  }

  async createInspection(
    product: Product,
    adminId: string,
    orderNumber?: string,
  ) {
    
    try {
      const categoryId = product.categories.find(
        (elem) => elem.categoryType == CategoryType.CATEGORY,
      )?.categoryId;

      const defaultSpec = await this.specificationRepo.findOne({
        categoryId: categoryId,
      });

      const categoryData = await this.categoryRepo.findOne({ id: categoryId });
      await this.productInspectionRepo.upsert({
        id: new UUID().toString(),
        status: InspectionStatus.NEW,
        userId: product.userId,
        adminId: adminId,
        categoryName: categoryData?.name,
        categoryId: categoryId,
        inspectionReport: JSON.parse(defaultSpec?.inspectionReport || '[]'),
        specificationReport: JSON.parse(
          defaultSpec?.specificationReport || '[]',
        ),
        description: null,
        message: null,
        productId: product.id,
        orderNumber: orderNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async getDefaultSpecification(categoryId: string): Promise<Specification> {
    return this.specificationRepo.findOne({ categoryId });
  }

  async getProductInspection(productId: string, categoryId: string) {
    const productInspection = await this.productInspectionRepo.findOne({
      productId,
    });
    if (productInspection) return productInspection;
    const specification = await this.getDefaultSpecification(categoryId);
    return {
      categoryName: `category-${specification.categoryId}`,
      id: null,
      inspectionReport: JSON.parse(specification.inspectionReport) || [],
      specificationReport: JSON.parse(specification?.specificationReport) || [],
    } as ProductInspectionSettings;
  }

  async createOrupdateInspectionReport(
    productInspectionReport: ProductInspectionReport,
    adminId: string,
  ) {
    const { productId, status, description, message } = productInspectionReport;

    const productInspection = await this.productInspectionRepo.findOne({
      productId,
    });

    if (!productInspection) {
      throw new Error('No productInspection was found for this productId.');
    }

    productInspection.status = status || productInspection.status;
    productInspection.description =
      description || productInspection.description;
    productInspection.message = message || productInspection.message;

    const defaultSpec = await this.specificationRepo.findOne({
      categoryId: productInspection.categoryId,
    });

    const parsedDefaultSpec = {
      inspectionReport: JSON.parse(defaultSpec?.inspectionReport || '[]'),
      specificationReport: JSON.parse(defaultSpec?.specificationReport || '[]'),
    };

    productInspection.inspectionReport = this.resolveReport(
      productInspection,
      productInspectionReport,
      parsedDefaultSpec.inspectionReport,
      'inspectionReport',
    );

    productInspection.specificationReport = this.resolveReport(
      productInspection,
      productInspectionReport,
      parsedDefaultSpec.specificationReport,
      'specificationReport',
    );
    productInspection.updatedAt = new Date();
    await this.productInspectionRepo
      .getEntityManager()
      .persistAndFlush(productInspection);

    if (InspectionStatus.FAILED == productInspectionReport.status) {
      await this.adminUpdateProductService.AdminUpdateActions(
        {
          productAction: ProductActionsEnum.ADMIN_REJECT_UPDATE,
          id: productInspection.productId,
          rejectReason: productInspection.message,
        } as AdminUpdateProductDTO,
        adminId,
      );
    }
    return productInspection;
  }

  async getFilteredInspections(filters: InspectionFilterDTO) {
    const conditions: any = {};

    if (filters.status) {
      conditions.status = filters.status;
    }

    if (filters.userId) {
      conditions.userId = filters.userId;
    }

    if (filters.adminId) {
      conditions.adminId = filters.adminId;
    }

    // Optional: enforce at least one of userId or adminId for narrowing the result
    if (!filters.userId && !filters.adminId) {
      throw new Error('Must filter by userId or adminId');
    }

    return {
      items: await this.productInspectionRepo.find(conditions, {
        orderBy: { createdAt: 'DESC' },
      }),
      limit: 0,
      offset: 0,
      total: 0,
    } as PaginatedDto<any>;
  }

  async countByStatus(adminId: string, superCategoryId: string) {
    const secretData = await this.vaultInstance.getSecretData('product');

    const inspectionCategories = JSON.parse(
      secretData?.inspectionCategories || '[]',
    );

    const ids =
      inspectionCategories.find((elem) => elem.categoryId === superCategoryId)
        ?.ids || [];

    if (!ids.length) {
      const emptyStatusCounts: Record<InspectionStatus, number> = Object.values(
        InspectionStatus,
      ).reduce(
        (acc, status) => {
          acc[status] = 0;
          return acc;
        },
        {} as Record<InspectionStatus, number>,
      );

      return { 'NON-FBS': emptyStatusCounts, FBS: emptyStatusCounts };
    }

    const placeholders = ids.map(() => '?').join(', ');

    // Get all inspections for the given category IDs and admin
    const result = await this.productInspectionRepo
      .getEntityManager()
      .getConnection()
      .execute(
        `SELECT status, user_id, COUNT(*) as count 
         FROM product_inspection_settings 
         WHERE category_id IN (${placeholders})
         GROUP BY status, user_id`,
        ids,
      );

    const nonFbsSellers = JSON.parse(secretData?.nonFbsSellers || '[]');
    const fbsCounts: Record<InspectionStatus, number> = Object.values(
      InspectionStatus,
    ).reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {} as Record<InspectionStatus, number>,
    );

    const nonFbsCounts: Record<InspectionStatus, number> = Object.values(
      InspectionStatus,
    ).reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {} as Record<InspectionStatus, number>,
    );

    result.forEach(
      (row: {
        status: InspectionStatus;
        user_id: string;
        count: string | number;
      }) => {
        const count = Number(row.count);
        if (nonFbsSellers.includes(row.user_id)) {
          nonFbsCounts[row.status] += count;
        } else {
          fbsCounts[row.status] += count;
        }
      },
    );

    return { 'NON-FBS': nonFbsCounts, FBS: fbsCounts };
  }

  resolveReport(primary, fallback, defaultData, key) {
    const primaryData = primary?.[key];
    const fallbackData = fallback?.[key];

    if (
      (!primaryData || primaryData.length === 0) &&
      (!fallbackData || fallbackData.length === 0)
    ) {
      return defaultData;
    } else if (fallbackData && fallbackData.length > 0) {
      return fallbackData;
    } else if (primaryData && primaryData.length > 0) {
      return primaryData;
    }
  }

  async getProductInspectionList(
    query: ProductInspectionListQueryDto,
  ) {
    try {
      const secretData = await this.vaultInstance.getSecretData('product');
      const inspectionCategories = JSON.parse(
        secretData?.inspectionCategories || '[]',
      );
      const categoriesIds =
        inspectionCategories.find(
          (elem) => elem.categoryId === query.superCategoryId,
        )?.ids || [];

      let conditions: any = {};
      conditions.category_id = { $in: categoriesIds };
      if (query.status) {
        conditions.status = query.status;
      }

      if (query.userId) {
        conditions.userId = query.userId;
      }

      if (query.productId) {
        conditions.productId = query.productId;
      }

      // Add FBS/NON-FBS filtering at database level
      if (query.inspectionType) {
        const nonFbsSellers = JSON.parse(secretData?.nonFbsSellers || '[]');

        if (query.inspectionType === InspectionType.NON_FBS) {
          conditions.userId = { $in: nonFbsSellers };
        } else {
          conditions.userId = { $nin: nonFbsSellers };
        }
      }
      // If searchKey is provided, first search in SoumUser table
      if (query.searchKey) {
        const searchKey = query.searchKey.toLowerCase();
        const matchingUsers = await this.soumUserRepo.find({
          $or: [
            { name: { $ilike: `%${searchKey}%` } },
            { id: { $ilike: `%${searchKey}%` } },
            { mobileNumber: { $ilike: `%${searchKey}%` } },
          ],
        });

        const userIds = matchingUsers.map((user) => user.id);
        if (userIds.length > 0) {
          conditions.userId = { $in: userIds };
        } else {
          // If no users found, return empty result
          return {
            items: [],
            total: 0,
            page: query.page || 1,
            limit: query.limit || 10,
            offset: ((query.page || 1) - 1) * (query.limit || 10),
          } as PaginatedDto<ProductInspectionListItemDto>;
        }
      }

      // Calculate pagination
      const page = query.page || 1;
      const limit = query.limit || 10;
      const orderBy = query.orderBy || 'desc';
      const offset = (page - 1) * limit;

      // Get total count
      const total = await this.productInspectionRepo.count(conditions);

      // Get paginated inspections with populated product
      const inspections = await this.productInspectionRepo.find(conditions, {
        fields: ['id', 'productId', 'status', 'userId', 'createdAt'],
        orderBy: { createdAt: orderBy },
        limit,
        offset,
      });

      // Get deep load data for all products
      const deepLoadProducts =
        await this.productService.productDeepLoadInspection(
          inspections.map((elem) => elem.productId),
          {
            isGetImages: true,
            isGetseller: true,
            isGetCategories: true,
          },
        );

      // Map the results with deep load data
      const items = inspections
        .map((inspection) => {
          const product = deepLoadProducts.find(
            (p) => p.id === inspection.productId,
          );
          if (!product) {
            console.error('Product not found for inspection:', inspection.id);
            return null;
          }

          return {
            id: inspection.id,
            productId: inspection.productId,
            sellPrice: product.sellPrice || 0,
            inspectionStatus: inspection.status,
            status: product.status,
            categories: product.categories || [],
            storageLocation: product.storageLocation,
            user: product.seller || {
              id: inspection.userId,
              name: 'NOT FOUND',
              mobileNumber: 'NOT FOUND',
            },
            images: product.images || [],
            order: {
              id: null,
              soumNumber: inspection.orderNumber || 'NAN',
            },
            updatedAt: inspection.updatedAt,
          };
        })
        .filter(Boolean);

      // Return paginated response
      return {
        items,
        total,
        page,
        limit,
        offset,
      } as PaginatedDto<ProductInspectionListItemDto>;
    } catch (error) {
      console.error('Error in getProductInspectionList:', error);
      throw error;
    }
  }

  async shouldCreateInspectionWhenProductCreated(userId: string) {
    const secretData = await this.vaultInstance.getSecretData('product');
    const fbsSellers = JSON.parse(secretData?.fbsSellers || '[]');
    if (fbsSellers.includes(userId)) {
      return true;
    }
    return false;
  }

  async shouldCreateInspectionWhenOrderCreated(userId: string) {
    const secretData = await this.vaultInstance.getSecretData('product');
    const nonFbsSellers = JSON.parse(secretData?.nonFbsSellers || '[]');
    if (nonFbsSellers.includes(userId)) {
      return true;
    }
    return false;
  }
}
