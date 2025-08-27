import { DraftProduct } from './DraftProduct';
import { AbstractProduct } from './AbstractProduct';
import { AvailableProduct } from './AvailableProduct';
import { ExpiredProduct } from './ExpiredProduct';
import { State } from '../State';

export class ProductState {
  action: AbstractProduct;

  constructor(initState: string) {
    switch (initState) {
      case State.PRODUCT_STATUS.AVAILABLE:
        this.action = new AvailableProduct(this);
        break;
      case State.PRODUCT_STATUS.EXPIRED:
        this.action = new ExpiredProduct(this);
        break;
      case State.PRODUCT_STATUS.DRAFT:
      default:
        this.action = new DraftProduct(this);
        break;
    }
  }

  changeState(action: AbstractProduct) {
    this.action = action;
  }
}
