import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Category } from './category';
import { Attribute } from '@src/modules/attribute/entities/attribute';
import { Option } from '@src/modules/option/entities/option';

@Entity()
export class CategoryAttribute {
  @PrimaryKey()
  id: string = uuidv4();

  @ManyToOne(() => Category)
  category: Category;

  @ManyToOne(() => Attribute)
  attribute: Attribute;

  @ManyToOne(() => Option, { nullable: true })
  option!: Option;
}
