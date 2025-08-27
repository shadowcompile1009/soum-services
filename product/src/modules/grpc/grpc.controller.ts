import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductImageSectionDto } from '../product/dto/productImages.dto';
import { ProductService } from '../product/product.service';
import { ProductImageService } from '../product/productImageSec.service';
import {
  GetPreSignURLProductImgsRequest,
  GetPreSignURLProductImgsResponse,
  getProductDataForFeedsReq,
  getProductDataForFeedsRes,
  MigrateImagesRequest,
  MigrateImagesResponse,
  PRODUCT_SERVICE_NAME,
  UpdateConsignmentStatusRequest,
  UpdateConsignmentStatusResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from './proto/product.pb';
import { ConsignmentService } from '../consignment/consignment.service';
import { ConsignmentStatus } from '../consignment/enum/consignment.status.enum';
import { ProductActionsEnum } from '../product/enum/productActions.enum';
import { AdminUpdateProductDTO } from '../product/dto/adminUpdateProduct.dto';
import { SystemUpdateProductService } from '../product/systemUpdateProduct.service';
import {
  SendEmailRequest,
  SendEmailResponse,
  EMAIL_SERVICE_NAME,
} from './proto/email.pb';
import { EmailService } from '../email/email.service';

@Controller('grpc')
export class GrpcController {
  constructor(
    private readonly productImageService: ProductImageService,
    private readonly productService: ProductService,
    private readonly consignmentService: ConsignmentService,
    private readonly systemUpdateProductService: SystemUpdateProductService,
    private readonly emailService: EmailService,
  ) {}
  @GrpcMethod(PRODUCT_SERVICE_NAME, 'migrateImages')
  async migrateImages(
    payload: MigrateImagesRequest,
  ): Promise<MigrateImagesResponse> {
    try {
      await this.productImageService.migrateProductImages(
        payload.imagesUrl,
        payload.productId,
        payload.categoryId,
        payload.productImgSections as ProductImageSectionDto[],
      );
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'GetProductDataForFeeds')
  async getProductDataForFeeds(
    payload: getProductDataForFeedsReq,
  ): Promise<getProductDataForFeedsRes> {
    try {
      return this.productService.getProductDataForFeeds(
        payload.products,
        payload.promoCode,
      );
    } catch (error) {
      return null;
    }
  }
  @GrpcMethod(PRODUCT_SERVICE_NAME, 'GetPreSignURLProductImgs')
  async getPreSignURLProductImgs(
    payload: GetPreSignURLProductImgsRequest,
  ): Promise<GetPreSignURLProductImgsResponse> {
    try {
      const productImages: ProductImageSectionDto[] = payload.productImages.map(
        (image) => {
          return {
            sectionId: image.sectionId,
            urls: image.urls,
          } as ProductImageSectionDto;
        },
      );
      const data =
        await this.productImageService.getMappingImagesUploadForBulkListing(
          productImages,
          payload.categoryId,
        );
      return {
        imgURLs: data,
      };
    } catch (error) {
      console.log(`Failed to getPreSignURLProductImgs: ${error}`);
      return null;
    }
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'UpdateConsignmentStatus')
  async updateConsignmentStatus(
    payload: UpdateConsignmentStatusRequest,
  ): Promise<UpdateConsignmentStatusResponse> {
    try {
      await this.consignmentService.updateStatus(
        payload.status as ConsignmentStatus,
        payload.id,
        payload.orderNumber,
      );
      return {};
    } catch (error) {
      console.log(`Failed to updateConsignmentStatus: ${payload.orderNumber}`);
      return {};
    }
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'UpdateProduct')
  async updateProduct(
    payload: UpdateProductRequest,
  ): Promise<UpdateProductResponse> {
    try {
      await this.systemUpdateProductService.systemUpdateActions({
        productAction: payload.productAction as ProductActionsEnum,
        id: payload.productId,
        orderNumber: payload?.order?.soumNumber,
        status: payload?.status,
      } as AdminUpdateProductDTO);
      return {
        status: 'success',
      } as UpdateProductResponse;
    } catch (error) {
      return {
        status: 'fail',
      };
    }
  }

  @GrpcMethod(EMAIL_SERVICE_NAME, 'sendEmailFinance')
  async sendEmailFinance(
    payload: SendEmailRequest,
  ): Promise<SendEmailResponse> {
    const fileNames = Array.isArray(payload.fileNames) ? payload.fileNames : [];
    const fileContents = Array.isArray(payload.fileContents) ? payload.fileContents : [];

    const files: Express.Multer.File[] = fileNames.map((name, index) => ({
      originalname: name,
      buffer: Buffer.from(fileContents[index] || ''),
      fieldname: '',
      encoding: '',
      mimetype: '',
      size: (fileContents[index] || '').length,
      stream: null,
      destination: '',
      filename: '',
      path: '',
    }));

    const result = await this.emailService.sendEmailFinance(
      files,
      {
        fullName: payload.fullName,
        orderId: payload.orderId,
        productId: payload.productId,
      },
      payload.userId,
    );

    return result;
  }
}
