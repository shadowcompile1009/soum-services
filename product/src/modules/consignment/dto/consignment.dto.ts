import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDTO } from '@src/modules/product/dto/createProduct.dto';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import {
  ConsignmentStatus,
  MySalesStatus,
} from '../enum/consignment.status.enum';

export class CheckEligibilityRequestDTO {
  @ApiProperty({
    example: '66bde8a6c3fea800565de708',
    required: true,
    type: Types.ObjectId,
  })
  @IsString()
  variantId: Types.ObjectId;

  @ApiProperty({
    example: '0a56e983-a4a2-4a6b-9e3c-5ecd852f98c2',
    required: true,
  })
  @IsString()
  conditionId: Types.UUID;
}

export class CheckEligibilityResponseDTO {
  @ApiProperty({
    example: true,
    required: true,
  })
  @IsString()
  isEligible: boolean;

  @ApiProperty({
    example: 32000,
    required: true,
  })
  @IsString()
  @IsOptional()
  offerPrice?: number;
}

export class TradeInPriceResponseDTO {
  @ApiProperty({
    example: 3200,
    required: true,
  })
  @IsString()
  price: number;
}

export class CreateConsignmentDTO extends CreateProductDTO {
  @ApiProperty({
    example: '66bde8a6c3fea800565de708',
    required: true,
  })
  @IsString()
  @IsOptional()
  userId?: string;
}

export class ListConsignmentRequestDTO {
  @ApiProperty({
    description: 'Filter by one or more status values',
    required: false,
    enum: ConsignmentStatus,
    isArray: true,
    example: [ConsignmentStatus.NEW, ConsignmentStatus.APPROVED],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) {
      return undefined;
    }
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  @IsEnum(ConsignmentStatus, { each: true })
  status?: ConsignmentStatus[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 0))
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Filter by search',
    required: false,
    type: String,
    example: 'SOUMCON17428838774727',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @IsString()
  @IsOptional()
  userId?: string;
}

export class ListConsignmentResponseDTO {
  @ApiProperty({
    description: 'Array of consignment records',
    type: () => ConsignmentResponseDto,
    isArray: true,
    example: [
      {
        id: '678d2b563dc99d39c4eaaac5',
        product: '678d2b553dc99d39c4eaaac4',
        status: 'New',
        userId: '607cae098063582dd8ec689a',
        payoutAmount: 1736,
        orderNumber: 'SOUMCON17373049183372',
        trackingNumber: 'SMSA123456789',
        shippingLabel:
          'https://track.smsaexpress.com/getPDF2.aspx?awbNo=293057088844',
        createdAt: '2025-01-19T16:41:58.000Z',
        updatedAt: '2025-01-22T12:00:00.000Z',
      },
    ],
  })
  @IsArray()
  items: ConsignmentResponseDto[];

  @ApiProperty({
    description: 'Total number of matching records',
    example: 42,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: 'Maximum number of items returned in this page',
    example: 10,
  })
  @IsNumber()
  limit: number;

  @ApiProperty({
    description: 'Starting offset of items returned',
    example: 0,
  })
  @IsNumber()
  offset: number;
}

export class UpdateConsignmentStatusDto {
  @ApiProperty({
    description: 'The new status of the consignment',
    enum: ConsignmentStatus,
    example: ConsignmentStatus.NEW,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(ConsignmentStatus)
  status: ConsignmentStatus;
}

export class UpdateConsignmentConditionDto {
  @ApiProperty({
    description: 'Id of new condition of the consignment',
    example: '60661c60fdc090d1ce2d4914',
  })
  @IsNotEmpty()
  @IsString()
  conditionId: string;
}

export class UserConsignmentApprovalDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsBoolean()
  isApproved: boolean;
}

export class UpdateConsignmentPayoutAmountDto {
  @ApiProperty({
    description: 'The payout amount associated with this consignment',
    example: 1736,
  })
  @IsNumber()
  payoutAmount: number;
}

export class ConsignmentResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the consignment',
    example: '678d2b563dc99d39c4eaaac5',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Product ID associated with this consignment',
    example: '678d2b553dc99d39c4eaaac4',
  })
  @IsString()
  product: string;

  @ApiProperty({
    description: 'Current status of the consignment',
    enum: ConsignmentStatus,
    example: ConsignmentStatus.NEW,
  })
  @IsEnum(ConsignmentStatus)
  status: ConsignmentStatus;

  @ApiProperty({
    description: 'User ID who owns or created this consignment',
    example: '607cae098063582dd8ec689a',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The payout amount associated with this consignment',
    example: 1736,
  })
  @IsNumber()
  payoutAmount: number;

  @ApiProperty({
    description: 'Order number for the consignment',
    example: 'SOUMCON17373049183372',
  })
  @IsString()
  orderNumber: string;

  @ApiProperty({
    description: 'Tracking number for the consignment',
    example: 'SMSA123456789',
  })
  @IsString()
  trackingNumber: string;

  @ApiProperty({
    description: 'Shipping label URL for the consignment',
    example: 'https://track.smsaexpress.com/getPDF2.aspx?awbNo=293057088844',
  })
  @IsString()
  shippingLabel: string;

  @ApiProperty({
    description: 'Delivery provider for the consignment',
    example: 'Torod',
  })
  @IsString()
  deliveryProvider: string;

  @ApiProperty({
    description: 'Date and time when the consignment was created',
    example: '2025-01-19T16:41:58.000Z',
  })
  @IsDateString()
  createdAt: string;

  @ApiProperty({
    description: 'Date and time when the consignment was last updated',
    example: '2025-01-19T16:41:58.000Z',
  })
  @IsDateString()
  updatedAt: string;
}

export class ConsignmentPayoutResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the consignment',
    example: '678d2b563dc99d39c4eaaac5',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Current status of the consignment',
    enum: ConsignmentStatus,
    example: ConsignmentStatus.NEW,
  })
  @IsEnum(ConsignmentStatus)
  status: ConsignmentStatus;
}

export class ConsignmentPayoutDetailsResponseDto {
  @ApiProperty({
    description: 'The payout amount associated with this consignment',
    example: 1736,
  })
  @IsNumber()
  payoutAmount: number;

  @ApiProperty({
    description: 'Account holder name',
    example: 'Abdulrahman Salim',
  })
  @IsString()
  accountHolderName: string;

  @ApiProperty({
    description: 'Account id',
    example: 'SA45600004496080160112345',
  })
  @IsString()
  accountId: string;

  @ApiProperty({
    description: 'Banc BIC',
    example: 'RJHISARI',
  })
  @IsString()
  bankBIC: string;

  @ApiProperty({
    description: 'Bank Name',
    example: 'AlRajhi Bank',
  })
  @IsString()
  bankName: string;
}

export class APPListMyConsignmentsResponseDTO {
  @ApiProperty({
    description: 'Unique identifier of the consignment',
    example: '678d2b563dc99d39c4eaaac5',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Order number en associated with this consignment',
    example: 'SOUMCON17405674849669',
  })
  @IsString()
  orderNumber: string;

  @ApiProperty({
    description: 'Tracking number for the consignment',
    example: '123456789',
  })
  @IsString()
  trackingNumber: string;

  @ApiProperty({
    description: 'Delivery provider for the consignment',
    example: 'Torod',
  })
  @IsString()
  deliveryProvider: string;

  @ApiProperty({
    description: 'Shipping label for the consignment',
    example: 'https://track.smsaexpress.com/getPDF2.aspx?awbNo=293057088844',
  })
  @IsString()
  shippingLabel: string;

  @ApiProperty({
    description: 'Product name en associated with this consignment',
    example: 'Iphone 16 pro max',
  })
  @IsString()
  productNameEn: string;

  @ApiProperty({
    description: 'Product name ar associated with this consignment',
    example: 'Iphone 16 pro max',
  })
  @IsString()
  productNameAr: string;

  @ApiProperty({
    description: 'Variant name associated with this product',
    example: '128 GB | Blue',
  })
  @IsString()
  variantNameEn: string;

  @ApiProperty({
    description: 'Variant name ar associated with this product',
    example: '128 GB | Blue',
  })
  @IsString()
  variantNameAr: string;

  @ApiProperty({
    description: 'User ID who owns or created this consignment',
    example: '607cae098063582dd8ec689a',
  })
  @IsString()
  productImages: string[];

  @ApiProperty({
    description: 'Current status of the consignment',
    enum: MySalesStatus,
    example: MySalesStatus.NEW,
  })
  @IsEnum(MySalesStatus)
  status: MySalesStatus;

  @ApiProperty({
    description: 'The payout amount associated with this consignment',
    example: 1736,
  })
  @IsNumber()
  payoutAmount: number;

  @ApiProperty({
    description:
      'Boolean to show to user to display price adjustment tag or not',
    example: true,
  })
  @IsBoolean()
  displayPriceAdjustmentTag: boolean;
}

export class ConsignmentMinimumPriceDTO {
  @ApiProperty({
    example: 100,
    required: true,
  })
  @IsNumber()
  amount: number;
}
