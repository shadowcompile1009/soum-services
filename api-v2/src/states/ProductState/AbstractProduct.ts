import { ProductState } from './ProductState';

export abstract class AbstractProduct {
  productState: ProductState;
  constructor(productState: ProductState) {
    this.productState = productState;
  }

  abstract getCurrentStatus(): string;
  listingSuccessful(currentState: string, testNextState: string): boolean {
    return !testNextState ? false : true;
  }
  deleteListing(currentState: string, testNextState: string): boolean {
    return !testNextState ? false : true;
  }
  republish(currentState: string, testNextState: string): boolean {
    return !testNextState ? false : true;
  }
  exceedDuration(currentState: string, testNextState: string): boolean {
    return !testNextState ? false : true;
  }
  renewListing(currentState: string, testNextState: string): boolean {
    return !testNextState ? false : true;
  }
  delete(currentState: string, testNextState: string): boolean {
    return !testNextState ? false : true;
  }
  proceedPayment(currentState: string, testNextState: string): boolean {
    return !testNextState ? false : true;
  }
  failPayment(currentState: string, testNextState: string): boolean {
    return !testNextState ? false : true;
  }
  paymentSuccessful(currentState: string, testNextState: string): boolean {
    return !testNextState ? false : true;
  }
  disputeAccept(currentState: string, testNextState: string): boolean {
    return !testNextState ? false : true;
  }
}
