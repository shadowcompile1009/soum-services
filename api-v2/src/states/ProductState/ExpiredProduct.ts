/* eslint-disable @typescript-eslint/no-unused-vars */
import { State } from '../State';
import { AbstractProduct } from './AbstractProduct';

export class ExpiredProduct extends AbstractProduct {
  getCurrentStatus() {
    return State.PRODUCT_STATUS.EXPIRED;
  }
  renewListing(currentState: string, testNextState: string): boolean {
    if (this.getCurrentStatus() === currentState) {
      return testNextState === State.PRODUCT_STATUS.AVAILABLE ? true : false;
    }
    return false;
  }
}
