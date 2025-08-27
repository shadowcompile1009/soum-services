import { Controller, Post } from '@nestjs/common';
import { HyperpayService } from './hyperpay.service';

@Controller('hyper-pay')
export class HyperpayController {
  constructor(private readonly service: HyperpayService) {}

  @Post('/')
  handleHyperPay(): string {
    return this.service.handleHyperPay();
  }
}
