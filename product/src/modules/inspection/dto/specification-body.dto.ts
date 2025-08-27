import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SpecificationReport, InspectionReport } from '../entity/Specification';

export class SpecificationBodyDto {
  @ApiProperty({
    type: [SpecificationReport],
    description: 'List of specification reports',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationReport)
  specificationReport: SpecificationReport[];

  @ApiProperty({
    type: [InspectionReport],
    description: 'List of inspection reports',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InspectionReport)
  inspectionReport: InspectionReport[];
}
