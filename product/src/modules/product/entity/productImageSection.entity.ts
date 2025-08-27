import {
  Embeddable,
  Embedded,
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Embeddable()
export class URLData {
  @Property({})
  base: string;
  @Property({})
  relativePath: string;
}
@Entity()
export class ProductImageSection {
  @PrimaryKey({ type: 'uuid', onCreate: uuidv4 })
  id!: string;

  @Property({})
  description?: string;

  @Property({})
  descriptionAr?: string;

  @Property({})
  header?: string;

  @Property({})
  headerAr?: string;

  @Property({ nullable: true })
  sectionType?: string;

  @Property({ nullable: true })
  sectionTypeAr?: string;

  @Property({})
  position?: number;

  @Property({})
  minImageCount?: number;

  @Property({})
  maxImageCount?: number;

  @Property({ nullable: true })
  iconURL?: string;

  @Property({ nullable: true })
  base?: string;

  @Embedded(() => URLData, { array: true })
  urls?: URLData[];

  // @ManyToOne(() => Product)
  // product: Product;
  @Property({})
  productId?: string;

  @Property({
    type: 'date',
    onCreate: () => new Date(),
  })
  createdAt: Date;

  @Property({
    type: 'date',
    nullable: true,
    onUpdate: () => new Date(),
  })
  updatedAt?: Date;
}
