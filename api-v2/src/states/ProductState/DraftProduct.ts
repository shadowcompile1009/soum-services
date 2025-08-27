/* eslint-disable @typescript-eslint/no-unused-vars */
import { State } from '../State';
import { AbstractProduct } from './AbstractProduct';
import { AvailableProduct } from './AvailableProduct';

export class DraftProduct extends AbstractProduct {
  getCurrentStatus() {
    return State.PRODUCT_STATUS.DRAFT;
  }
  listingSuccessful(currentState: string, testNextState: string): boolean {
    if (this.getCurrentStatus() === currentState) {
      this.productState.changeState(new AvailableProduct(this.productState));
      return testNextState === State.PRODUCT_STATUS.AVAILABLE ? true : false;
    }
    return false;
  }
  deleteListing(currentState: string, testNextState: string): boolean {
    if (this.getCurrentStatus() === currentState) {
      return testNextState === State.PRODUCT_STATUS.DELETED_DRAFT
        ? true
        : false;
    }
    return false;
  }
}
