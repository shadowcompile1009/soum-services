/* eslint-disable @typescript-eslint/no-unused-vars */
import { State } from '../State';
import { AbstractProduct } from './AbstractProduct';

export class AvailableProduct extends AbstractProduct {
  getCurrentStatus() {
    return State.PRODUCT_STATUS.AVAILABLE;
  }
  exceedDuration(currentState: string, testNextState: string): boolean {
    if (this.getCurrentStatus() === currentState) {
      return testNextState === State.PRODUCT_STATUS.EXPIRED ? true : false;
    }
    return false;
  }
  renewListing(currentState: string, testNextState: string): boolean {
    // This method unavailable at this state
    return false;
  }
  delete(currentState: string, testNextState: string): boolean {
    if (this.getCurrentStatus() === currentState) {
      return testNextState === State.PRODUCT_STATUS.DELETED ? true : false;
    }
    return false;
  }
  proceedPayment(currentState: string, testNextState: string): boolean {
    if (this.getCurrentStatus() === currentState) {
      return testNextState === State.PRODUCT_STATUS.RESERVED ? true : false;
    }
    return false;
  }
}
