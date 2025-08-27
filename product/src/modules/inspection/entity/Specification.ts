import {
  Embeddable,
  Embedded,
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { QuestionType } from '@src/modules/product/enum/questionType.enum';
import { ObjectId } from 'mongodb';

export class SpecificationReport {
  @Property({})
  nameEn: string;
  @Property({})
  nameAr: string;
  @Property({})
  status: boolean;
  @Property({})
  questionType?: QuestionType;
  @Property({})
  value?: string;
  @Property({})
  icon?: string;
  @Property({})
  placeHolder?: string;
}
export class InspectionReport {
  @Property({})
  nameEn: string;
  @Property({})
  nameAr: string;
  @Embedded(() => InspectionReportData, { array: true })
  checks: InspectionReportData[];
  @Property()
  allPassed : boolean;
}
export class InspectionReportData {
  @Property({})
  nameEn: string;
  @Property({})
  nameAr: string;
  @Property({})
  status: boolean;
  @Property({})
  showInSPP?: boolean;
  @Property({})
  images?: InspectionReportImage[];
  @Property({})
  comment?: string;
  @Property()
  completed : boolean;
}
export class InspectionReportImage {
  @Property({})
  name?: string;
  @Property({})
  status?: boolean;
  @Property({})
  url?: string;
  @Property({})
  imageUrl?: string;
}
@Entity()
export class Specification {
  @PrimaryKey({ type: 'ObjectId', onCreate: () => new ObjectId() })
  id!: string;

  @Property()
  categoryId: string;

  @Property({ type: 'text' })
  //SpecificationReport
  specificationReport: string;

  @Property({ type: 'text' })
  //InspectionReport
  inspectionReport: string;
}
