import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Attribute } from '@src/modules/attribute/entities/attribute';
import { OptionStatus } from '../enums/option-status.enum';
import { OptionDTO } from '../dto/option.dto';
import { IsOptional } from 'class-validator';
import { CategoryAttribute } from '@src/modules/category/entities/categoryAttribute';

@Entity()
export class Option {
  private _id: string = uuidv4();

  @PrimaryKey()
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    if (!value.trim()) {
      this._id = uuidv4();
    } else {
      this._id = value;
    }
  }

  @Property()
  nameEn!: string;

  @Property()
  nameAr!: string;

  @Property({ default: 10000 })
  @IsOptional()
  positionAr?: number;

  @Property({ default: 10000 })
  @IsOptional()
  positionEn?: number;

  @Property({ default: false })
  @IsOptional()
  scanned?: boolean;

  @Property({
    onCreate: () => OptionStatus.ACTIVE,
    default: OptionStatus.ACTIVE,
  })
  status?: OptionStatus;

  @ManyToOne(() => Attribute, { onDelete: 'cascade' })
  attribute!: Attribute;

  @Property({ nullable: true })
  created_at?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at?: Date = new Date();

  @OneToMany(
    () => CategoryAttribute,
    (categoryAttribute) => categoryAttribute.option,
    {
      orphanRemoval: true,
    },
  )
  categoryAttributes: CategoryAttribute[];

  public assignDTOValues(dto: OptionDTO) {
    this.nameEn = dto.nameEn;
    this.nameAr = dto.nameAr;
    this.status = dto.status;
    this.positionEn = dto.positionEn ?? 0;
    this.positionAr = dto.positionAr ?? 0;
  }
}
