import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Product } from './entity/product.entity';
import { AdminUpdateProductDTO } from './dto/adminUpdateProduct.dto';
import { CustomCodeErrors } from './enum/customErrorCodes.enum';
import { CustomException } from '@src/custom-exception';
import { ProductActionsEnum } from './enum/productActions.enum';
import { ProductStatus } from './enum/productStatus.enum';
import {
  ActionData,
  DeleteActionData,
  ProductAction,
  UpdateDescriptionData,
  UpdateSellPriceData,
} from './entity/productActions.entity';
import { ProductService } from './product.service';
import { ProductImageService } from './productImageSec.service';

interface HandlerResult {
  product: Product;
  actionData: ActionData;
}

@Injectable()
export class UserUpdateProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    @InjectRepository(ProductAction)
    private readonly productActionRepository: EntityRepository<ProductAction>,
    private readonly productImgSecService: ProductImageService,
    private readonly productService: ProductService,
  ) {}

  async userUpdateActions(payload: AdminUpdateProductDTO, userId: string) {
    // get product from DB
    let { product, isOldCollection } =
      await this.productService.getProductFromOldOrNew(payload.id);

    if (!product) throw new CustomException(CustomCodeErrors.PRODUCT_NOT_FOUND);

    await this.validateUserAction(product, payload, userId);

    let result: HandlerResult;
    switch (payload.productAction) {
      case ProductActionsEnum.USER_DELETE_UPDATE:
        result = await this.handleDeleteUpdate(product, payload);
        break;
      case ProductActionsEnum.USER_IMAGE_UPDATE:
        result = await this.handleImageUpdate(product, payload);
        break;
      case ProductActionsEnum.USER_DESCRIPTION_UPDATE:
        result = await this.handleDescriptionUpdate(product, payload);
        break;
      case ProductActionsEnum.USER_SELL_PRICE_UPDATE:
        result = await this.handleSellPriceUpdate(product, payload);
        break;
    }

    product = result.product;
    const actionData = result.actionData;
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

    let deepLoadProduct = await this.productService.productDeepLoad(
      product.id,
      product,
      {
        isGetseller: true,
        isGetCategories: true,
        isGetImages: true,
      },
    );
    await this.productService.postUpdateProductEvents(
      product,
      deepLoadProduct,
      userUpdateAction,
      userId,
    );
  }

  private async handleDeleteUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    product.status = ProductStatus.DELETED;
    product.statusSummary.isDeleted = true;
    return {
      product,
      actionData: { reason: payload.deleteReason } as DeleteActionData
    };
  }

  private async handleImageUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    product.status = ProductStatus.ON_HOLD;
    product.statusSummary.isApproved = false;
    product.productImageSections = await this.productImgSecService.updateList(
      payload.productImageSections,
    );
    return {
      product,
      actionData: {}
    };
  }

  private async handleDescriptionUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    product.status = ProductStatus.ON_HOLD;
    product.statusSummary.isApproved = false;
    product.description = payload.description;
    return {
      product,
      actionData: { description: payload.description } as UpdateDescriptionData
    };
  }

  private async handleSellPriceUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    product.sellPrice = payload.sellPrice;
    return {
      product,
      actionData: { sellPrice: payload.sellPrice } as UpdateSellPriceData
    };
  }

  validateUserAction(
    product: Product,
    payload: AdminUpdateProductDTO,
    userId: string,
  ) {
    // status and status summary valdiation
    // no action can be done after delete
    if (product.statusSummary.isDeleted) {
      throw new CustomException(CustomCodeErrors.INCORRECT_USER_ACTION);
    }
    // only seller can update his products
    if (product.userId !== userId) {
      throw new CustomException(CustomCodeErrors.INCORRECT_USER_ACTION);
    }
    // update sell price should check on variantCurrentprice
  }
}
