import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Product } from './entity/product.entity';
import { PaginatedDto } from '@src/dto/paginated.dto';
import { CheckoutPageCommissionSummaryReq } from './dto/checkoutCommSumReq.dto';
import { DeepLoadReq } from './dto/deepLoadReq.dto';
import { CustomException } from '@src/custom-exception';
import { CustomCodeErrors } from './enum/customErrorCodes.enum';
import { ProductService } from './product.service';

@Injectable()
export class ViewProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    private readonly productService: ProductService,
  ) {}
  async findAll(payload: { size: number; limit: number }) {
    const products = await this.productRepository.findAll({
      limit: payload.limit,
      offset: (payload.limit - 1) * payload.size,
    });

    const count = await this.productRepository.count({});

    return {
      items: products,
      limit: payload.limit,
      offset: (payload.limit - 1) * payload.size,
      total: count,
    } as PaginatedDto<Product>;
  }

  async getById(prodId: any, deepLoodReq: DeepLoadReq) {
    let { product } = await this.productService.getProductFromOldOrNew(prodId);
    if (!product) throw new CustomException(CustomCodeErrors.PRODUCT_NOT_FOUND);

    const deepLoadProduct = await this.productService.productDeepLoad(
      product.id,
      product,
      deepLoodReq,
    );
    return {
      deepLoadProduct,
    };
  }

  async getByIdForInspector(prodId: any) {
    let { product } = await this.productService.getProductFromOldOrNew(prodId);
    if (!product) throw new CustomException(CustomCodeErrors.PRODUCT_NOT_FOUND);
    
    const deepLoadProducts = await this.productService.productDeepLoadInspection(
      [product.id],
      {
        isGetCategories: true,
        isGetImages: true,
        isGetseller: true,
      },
    );

    const deepLoadProduct = deepLoadProducts[0];
    if (!deepLoadProduct) {
      throw new CustomException(CustomCodeErrors.PRODUCT_NOT_FOUND);
    }

    return {
      id: deepLoadProduct.id,
      sellPrice: deepLoadProduct.sellPrice,
      storageLocation: deepLoadProduct.storageLocation,
      categories: deepLoadProduct.categories || [],
      description: deepLoadProduct.description,
      status: deepLoadProduct.status,
      images: deepLoadProduct.images || [],
      seller: deepLoadProduct.seller,
    };
  }
}
