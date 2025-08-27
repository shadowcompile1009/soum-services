import { Response } from 'express';
import { TorodService } from './torod.service';
import { TorodWebHookDto } from './dto/torod-web-hook.dto';
import { Body, Controller, Post, Res } from '@nestjs/common';

@Controller('torod')
export class TorodController {
  constructor(private readonly service: TorodService) {}
  @Post('/')
  async handelTorod(@Body() payload: TorodWebHookDto, @Res() res: Response) {
    try {
      await this.service.handelTorod(payload);
      return res.status(200).json({ message: 'Success' });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  }
}
