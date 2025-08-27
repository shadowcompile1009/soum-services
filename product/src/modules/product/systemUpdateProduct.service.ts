import { EntityRepository, Loaded } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Product } from './entity/product.entity';
import {
  ActionData,
  ProductAction,
  SoldActionData,
  UpdateSellPriceData,
} from './entity/productActions.entity';
import { ProductService } from './product.service';
import { ProductActionsEnum } from './enum/productActions.enum';
import { CustomException } from '@src/custom-exception';
import { CustomCodeErrors } from './enum/customErrorCodes.enum';
import { AdminUpdateProductDTO } from './dto/adminUpdateProduct.dto';
import { ProductStatus } from './enum/productStatus.enum';

interface HandlerResult {
  product: Product;
  actionData: ActionData;
}

@Injectable()
export class SystemUpdateProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    @InjectRepository(ProductAction)
    private readonly productActionRepository: EntityRepository<ProductAction>,
    private readonly productService: ProductService,
  ) {}

  async systemUpdateActions(payload: AdminUpdateProductDTO) {
    // get product from DB
    let { product, isOldCollection } =
      await this.productService.getProductFromOldOrNew(payload.id);

    if (!product) throw new CustomException(CustomCodeErrors.PRODUCT_NOT_FOUND);
    await this.validateUserAction(product, payload);

    let result: HandlerResult;
    switch (payload.productAction) {
      case ProductActionsEnum.SYSTEM_STATUS_UPDATE:
        result = await this.handleStatusUpdate(product, payload);
        break;
      case ProductActionsEnum.SYSTEM_SOLD_UPDATE:
        result = await this.handleSoldUpdate(product, payload);
        break;

      case ProductActionsEnum.SYSTEM_SELL_PRICE_UPDATE:
        result = await this.handleSellPriceUpdate(product, payload);
        break;
    }

    product = result.product;
    const actionData = result.actionData;
    if (!product) throw new CustomException(CustomCodeErrors.PRODUCT_NOT_FOUND);
    const deepLoadProduct = await this.productService.productDeepLoad(
      product.id,
      product,
      {
        isGetseller: true,
        isGetCategories: true,
      },
    );
    product.updatedAt = new Date();

    if (!isOldCollection)
      product = await this.productRepository.upsert(product);

    const userUpdateAction = this.productActionRepository.create({
      productId: product.id,
      actionData,
      type: payload.productAction,
    });
    await this.productActionRepository
      .getEntityManager()
      .persistAndFlush(userUpdateAction);

    await this.productService.postUpdateProductEvents(
      product,
      deepLoadProduct,
      userUpdateAction,
      null,
    );
  }

  private async handleStatusUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    product.status = payload.status;
    return {
      product,
      actionData: {},
    };
  }

  private async handleSoldUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    product.status = ProductStatus.SOLD;
    return {
      product,
      actionData: { orderNumber: payload.orderNumber } as SoldActionData,
    };
  }

  private async handleSellPriceUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    product.sellPrice = payload.sellPrice;
    return {
      product,
      actionData: { sellPrice: payload.sellPrice } as UpdateSellPriceData,
    };
  }

  validateUserAction(product: Product, payload: AdminUpdateProductDTO) {}
}
