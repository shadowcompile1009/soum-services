import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { QuestionType } from '../enum/questionType.enum';
import { InspectionStatus } from '@src/modules/inspection/enum/inspection.status.enum';
import { Product } from './product.entity';

@Entity()
export class ProductInspectionSettings {
  @PrimaryKey({ type: 'uuid', onCreate: uuidv4 })
  id!: string;

  @Property()
  productId: string;

  @Property({
    nullable: true,
    default: InspectionStatus.UNKNOWEN,
  })
  status?: InspectionStatus;

  @Property({ nullable: true })
  adminId!: string;

  @Property({ nullable: true })
  message?: string;

  @Property({ nullable: true })
  description?: string;

  @Property({
    nullable: true,
  })
  userId: string;

  @Property({
    nullable: true,
  })
  orderNumber: string;

  @Property({
    nullable: true,
  })
  categoryId?: string;

  @Property()
  categoryName: string;

  @Property({ type: 'jsonb', nullable: true })
  inspectionReport: InspectionReport[] = [];

  @Property({ type: 'jsonb', nullable: true })
  specificationReport: SpecificationReport[] = [];

  @Property({
    type: 'date',
    onCreate: () => new Date(),
  })
  createdAt: Date;

  @Property({
    type: 'date',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt?: Date;

  constructor(
    productId: string,
    categoryName: string,
    inspectionReport?: InspectionReport[],
    specificationReport?: SpecificationReport[],
  ) {
    this.productId = productId;
    this.inspectionReport = inspectionReport;
    this.specificationReport = specificationReport;
    this.categoryName = categoryName;
  }
}

export interface InspectionReport {
  nameEn: string;
  nameAr: string;
  checks: InspectionReportData[];
  allPassed: boolean;
}

export interface InspectionReportImage {
  name?: string;
  status?: boolean;
  url?: string;
  imageUrl?: string;
}

export interface InspectionReportData {
  nameEn: string;
  nameAr: string;
  status: boolean;
  showInSPP?: boolean;
  images?: InspectionReportImage[];
  comment?: string;
  completed: boolean;
}

export interface SpecificationReport {
  nameEn: string;
  nameAr: string;
  status: boolean;
  questionType?: QuestionType;
  data?: SpecificationReportData[];
  value?: string;
  icon?: string;
  placeHolder?: string;
}

export interface SpecificationReportData {
  nameEn?: string;
  nameAr?: string;
  status?: boolean;
  value?: string;
}
