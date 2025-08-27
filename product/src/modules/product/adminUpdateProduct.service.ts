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
  RejectActionData,
  UpdateDescriptionData,
  UpdateRegaUrlActionData,
  UpdateGuaranteesUrlActionData,
  UpdateSellPriceData,
  UpdateBINData,
} from './entity/productActions.entity';
import { ProductService } from './product.service';
import { ProductImageService } from './productImageSec.service';

interface HandlerResult {
  product: Product;
  actionData: ActionData;
}

@Injectable()
export class AdminUpdateProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    @InjectRepository(ProductAction)
    private readonly productActionRepository: EntityRepository<ProductAction>,
    private readonly productImgSecService: ProductImageService,
    private readonly productService: ProductService,
  ) {}

  async AdminUpdateActions(
    payload: AdminUpdateProductDTO,
    AdminUserId: string,
  ) {
    // get product from DB
    let { product, isOldCollection } =
      await this.productService.getProductFromOldOrNew(payload.id);

    if (!product) throw new CustomException(CustomCodeErrors.PRODUCT_NOT_FOUND);

    let actionData: ActionData = {};
    let deepLoadProduct = null;

    await this.validateAdminAction(product, payload);

    // Handle different actions using switch
    let result: HandlerResult;
    switch (payload.productAction) {
      case ProductActionsEnum.ADMIN_VERIFY_UPDATE:
        result = await this.handleVerifyUpdate(product);
        break;
      case ProductActionsEnum.ADMIN_APPROVE_UPDATE:
        result = await this.handleApproveUpdate(product);
        deepLoadProduct = await this.productService.productDeepLoad(
          product.id,
          result.product,
          {
            isGetCategories: true,
            isGetseller: true,
          },
        );
        break;
      case ProductActionsEnum.ADMIN_REJECT_UPDATE:
        result = await this.handleRejectUpdate(product, payload);
        break;
      case ProductActionsEnum.ADMIN_DELETE_UPDATE:
        result = await this.handleDeleteUpdate(product, payload);
        break;
      case ProductActionsEnum.ADMIN_REGA_URL_UPDATE:
        result = await this.handleRegaUrlUpdate(product, payload);
        break;
      case ProductActionsEnum.ADMIN_IMAGE_UPDATE:
        result = await this.handleImageUpdate(product, payload);
        break;
      case ProductActionsEnum.ADMIN_DESCRIPTION_UPDATE:
        result = await this.handleDescriptionUpdate(product, payload);
        break;
      case ProductActionsEnum.ADMIN_GUARANTEES_URL_UPDATE:
        result = await this.handleGuaranteesUrlUpdate(product, payload);
        break;
      case ProductActionsEnum.ADMIN_SELL_PRICE_UPDATE:
        result = await this.handleSellPriceUpdate(product, payload);
        break;
      case ProductActionsEnum.ADMIN_BIN_UPDATE:
        result = await this.handleBinUpdate(product, payload);
        break;
    }

    product = result.product;
    actionData = result.actionData;
    product.updatedAt = new Date();

    if (!isOldCollection)
      product = await this.productRepository.upsert(product);

    const adminUpdateAction = this.productActionRepository.create({
      productId: product.id,
      actionData,
      type: payload.productAction,
    });
    await this.productActionRepository
      .getEntityManager()
      .persistAndFlush(adminUpdateAction);

    await this.productService.postUpdateProductEvents(
      product,
      deepLoadProduct,
      adminUpdateAction,
      AdminUserId,
    );
  }

  private async handleVerifyUpdate(product: Product): Promise<HandlerResult> {
    product.statusSummary.isVerifiedByAdmin =
      !product.statusSummary.isVerifiedByAdmin;
    return {
      product,
      actionData: {},
    };
  }

  private async handleApproveUpdate(product: Product): Promise<HandlerResult> {
    product.statusSummary.isApproved = !product.statusSummary.isApproved;
    product.status = product.statusSummary.isApproved
      ? ProductStatus.ACTIVE
      : ProductStatus.ON_HOLD;
    return {
      product,
      actionData: {},
    };
  }

  private async handleRejectUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    product.status = ProductStatus.REJECTED;
    return {
      product,
      actionData: { reason: payload.rejectReason } as RejectActionData,
    };
  }

  private async handleDeleteUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    product.status = ProductStatus.DELETED;
    product.statusSummary.isDeleted = true;
    return {
      product,
      actionData: { reason: payload.deleteReason } as DeleteActionData,
    };
  }

  private async handleRegaUrlUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    return {
      product,
      actionData: { regaUrl: payload.regaUrl } as UpdateRegaUrlActionData,
    };
  }

  private async handleImageUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    product.productImageSections = await this.productImgSecService.updateList(
      payload.productImageSections,
    );
    return {
      product,
      actionData: {},
    };
  }

  private async handleDescriptionUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    product.description = payload.description;
    return {
      product,
      actionData: { description: payload.description } as UpdateDescriptionData,
    };
  }

  private async handleGuaranteesUrlUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    return {
      product,
      actionData: {
        guaranteesUrl: payload.guaranteesUrl,
      } as UpdateGuaranteesUrlActionData,
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

  private async handleBinUpdate(
    product: Product,
    payload: AdminUpdateProductDTO,
  ): Promise<HandlerResult> {
    product.storageLocation = {
      BIN: payload.BIN || product?.storageLocation?.BIN || null,
      storageNumber:
        payload.storageNumber ||
        product?.storageLocation?.storageNumber ||
        null,
    };
    return {
      product,
      actionData: {
        BIN: payload.BIN,
        storageNumber: payload.storageNumber,
      } as UpdateBINData,
    };
  }

  validateAdminAction(product: Product, payload: AdminUpdateProductDTO) {
    // status and status summary valdiation
    // no action can be done after delete
    if (product.statusSummary.isDeleted) {
      throw new CustomException(CustomCodeErrors.INCORRECT_ADMIN_ACTION);
    }
    if (
      // approve product status change should be only for active or onhold products
      // approveProduct in v2 has some code after return do we need it ?
      ProductActionsEnum.ADMIN_APPROVE_UPDATE === payload.productAction &&
      ![ProductStatus.ACTIVE, ProductStatus.ON_HOLD].includes(product.status)
    ) {
      throw new CustomException(CustomCodeErrors.INCORRECT_ADMIN_ACTION);
    }

    // data validation
    if (
      ProductActionsEnum.ADMIN_DELETE_UPDATE === payload.productAction &&
      !payload.deleteReason
    ) {
      throw new CustomException(CustomCodeErrors.INCORRECT_ADMIN_ACTION);
    }
    if (
      ProductActionsEnum.ADMIN_REJECT_UPDATE === payload.productAction &&
      !payload.rejectReason
    ) {
      throw new CustomException(CustomCodeErrors.INCORRECT_ADMIN_ACTION);
    }
  }
}
