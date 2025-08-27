import {
  IsNumber,
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsArray,
  IsDateString,
  Min,
  Max,
  MinLength,
  MaxLength,
  Length,
  IsInt,
} from 'class-validator';
import {
  UserType,
  PromoType,
  PromoGenerator,
  PromoCodeStatus,
  PromoCodeScopeTypeEnum,
  PaymentProvider,
  PaymentProviderType,
} from '@modules/promo-code/enum';
import { Type } from 'class-transformer';

export class PromoCodeScopeDto {
  @IsEnum(PromoCodeScopeTypeEnum)
  promoCodeScopeType: PromoCodeScopeTypeEnum;

  @IsArray()
  @IsString({ each: true })
  ids: string[];
}

export class PromoCodePayment {
  @IsEnum(PaymentProvider)
  paymentProvider: PaymentProvider;

  @IsEnum(PaymentProviderType)
  paymentProviderType: PaymentProviderType;
}

export class BasePromoCodeDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsOptional()
  @IsEnum(UserType)
  userType: UserType = UserType.BUYER;

  @IsEnum(PromoType)
  promoType: PromoType;

  @IsOptional()
  @IsEnum(PromoCodeStatus)
  status: PromoCodeStatus = PromoCodeStatus.ACTIVE;

  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'Name should not be less than 2 letters or numbers.',
  })
  @MaxLength(15, { message: 'Name should not exceeds 15 letters or numbers .' })
  code: string = null;

  @IsString()
  @IsOptional()
  userId: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Promo discount is not correct.Minimum value must be 0.' })
  discount: number;

  @IsOptional()
  @IsNumber()
  @Min(0, {
    message: 'Promo percentage is not correct.Minimum value must be 0.',
  })
  @Max(100, {
    message: 'Promo percentage is not correct.Maximum value must be 100.',
  })
  percentage: number;

  @IsOptional()
  @IsDateString()
  fromDate: Date;

  @IsOptional()
  @IsDateString()
  toDate: Date;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'PromoLimit is not correct.Minimum value must be 0.' })
  promoLimit: number = null;

  @IsOptional()
  @IsBoolean()
  isDefault = false;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromoCodeScopeDto)
  promoCodeScope: PromoCodeScopeDto[] = [];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromoCodeScopeDto)
  excludedPromoCodeScope: PromoCodeScopeDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromoCodePayment)
  availablePayment: PromoCodePayment[] = [];

  @IsOptional()
  @IsNumber()
  totalAllowedUsage: number = null;

  @IsOptional()
  @IsString()
  note = '';

  @IsOptional()
  @IsString()
  @Length(3, 3, { message: 'Prefix must be exactly 3 characters long.' })
  bulkPrefix: string = null;
}

export class ReadPromoCodeDto extends BasePromoCodeDto {
  @IsString()
  id: string;

  @IsDateString()
  createdDate: Date;

  @IsDateString()
  updatedDate: Date;

  @IsOptional()
  @IsNumber()
  totalUsage: number;

  @IsOptional()
  @IsEnum(PromoGenerator)
  promoGenerator: PromoGenerator;
}

export class WritePromoCodeDto extends BasePromoCodeDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsOptional()
  @IsInt()
  @Max(1000, { message: 'You can generate a maximum of 1000 promo codes.' })
  totalCodes: number = null;
}

export class IncreaseUsageCountDto {
  @IsString()
  id: string;
}

export class BulkGenerationPromoCodeDto extends WritePromoCodeDto {
  @IsString()
  parentPromoCodeId: string;

  @IsString()
  taskId: string;
}

export class ValidatePromoCodeDto {
  @IsString()
  code: string;

  @IsString()
  productId: string;

  @IsEnum(PaymentProvider)
  paymentProvider: PaymentProvider;

  @IsEnum(PaymentProviderType)
  paymentProviderType: PaymentProviderType;
}
