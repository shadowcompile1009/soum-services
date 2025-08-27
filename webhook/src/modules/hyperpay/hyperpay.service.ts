import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class HyperpayService {
  constructor() {}

  handleHyperPay(): string {
    return 'Hello hayperPay!';
  }
}
