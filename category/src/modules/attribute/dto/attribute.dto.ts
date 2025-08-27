import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { AttributeStatus } from '../enums/attribute-status.enum';
import { Type } from 'class-transformer';
import { OptionDTO } from '@src/modules/option/dto/option.dto';

export class GetAttributeDto {
  @IsString()
  attributeId: string;
}

export class AttributeDTO {
  @ApiProperty({ example: 'Sample Attribute' })
  @IsNotEmpty()
  @IsString()
  nameEn: string;

  @ApiProperty({ example: 'عينة الفئة' })
  @IsNotEmpty()
  @IsString()
  nameAr: string;

  @ApiProperty({ example: AttributeStatus.ACTIVE })
  @IsNotEmpty()
  @IsString()
  status: AttributeStatus;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OptionDTO)
  options?: OptionDTO[] = [];
}

export class CreateAttributeDto extends AttributeDTO {}

export class UpdateAttributeDto extends AttributeDTO {
  @ApiProperty({ example: '6063f95f929f926b67347b0d' })
  @IsOptional()
  @IsString()
  id: string;
}

export class DeleteAttributeDto {
  @IsString()
  attributeId: string;
}