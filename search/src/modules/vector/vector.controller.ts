import { Controller, Get, Query } from '@nestjs/common';

import { VectorDto } from './dto/vector.dto';
import { VectorService } from './vector.service';

@Controller()
export class VectorController {
  constructor(private readonly vectorService: VectorService) {}

  @Get('/vectorize')
  async generateVectors(@Query() query: VectorDto) {
    const [vector] = await this.vectorService.vectorize(
      [query.data],
      query.infer == 'true',
    );

    return { data: vector };
  }
}
