import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { ProductActionsEnum } from '../enum/productActions.enum';
export class ActionData {}

export class RejectActionData {
  reason: string;
}

export class DeleteActionData {
  reason: string;
}
export class UpdateRegaUrlActionData {
  regaUrl: string;
}
export class UpdateSellPriceData {
  sellPrice: number;
}
export class UpdateDescriptionData {
  description: string;
}
export class UpdateGuaranteesUrlActionData {
  guaranteesUrl: string;
}

export class UpdateBINData {
  BIN: string;
  storageNumber: string;
}

export class SoldActionData {
  orderNumber: string;
}
@Entity()
export class ProductAction {
  @PrimaryKey({ type: 'uuid', onCreate: uuidv4 })
  id!: string;

  @Property()
  type: ProductActionsEnum;

  @Property()
  actionData: ActionData;

  // @ManyToOne(() => Product)
  // product!: Product;
  // this is replacement for the above 2 lines
  // get more context from khaled
  @Property({ nullable: true })
  productId!: string;

  @Property({
    type: 'date',
    onCreate: () => new Date(),
  })
  createdAt!: Date;
}
