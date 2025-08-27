import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { AttributeStatus } from '../enums/attribute-status.enum';
import { Option } from '@src/modules/option/entities/option';
import { AttributeDTO } from '../dto/attribute.dto';
import { v4 as uuidv4 } from 'uuid';
import { CategoryAttribute } from '@src/modules/category/entities/categoryAttribute';

@Entity()
export class Attribute {
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
  nameEn: string;

  @Property()
  nameAr: string;

  @Property({
    onCreate: () => AttributeStatus.ACTIVE,
    default: AttributeStatus.ACTIVE,
  })
  status!: AttributeStatus;

  @Property({ default: false })
  scanned?: boolean;

  @Property({ nullable: true })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @OneToMany(() => Option, (option) => option.attribute, {
    orphanRemoval: true,
  })
  options = new Collection<Option>(this);

  @OneToMany(
    () => CategoryAttribute,
    (categoryAttribute) => categoryAttribute.attribute,
    {
      orphanRemoval: true,
    },
  )
  categoryAttributes: CategoryAttribute[];
  
  public assignDTOValues(dto: AttributeDTO) {
    this.nameEn = dto.nameEn;
    this.nameAr = dto.nameAr;
    this.status = dto.status;
  }
}
