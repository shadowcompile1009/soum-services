import { Body, Controller, Post } from '@nestjs/common';
import { TamamService } from './tamam.service';
import {
  PoConfirmationRequest,
  StatusCallbackRequest,
} from './types/tamam.types';

@Controller('tamam')
export class TamamController {
  constructor(private readonly service: TamamService) {}

  @Post('/status')
  hadleTamamStatus(@Body() payload: StatusCallbackRequest) {
    return this.service.handleTamamStatus(payload);
  }

  @Post('/po')
  hadleTamamPo(@Body() payload: PoConfirmationRequest) {
    return this.service.handleTamamPo(payload);
  }
}
