import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '@src/auth/auth.module';
import { V2Module } from '../v2/v2.module';
import { Option } from './entities/option';
import { OptionController } from './option.controller';
import { OptionService } from './option.service';
import { AttributeService } from '../attribute/attribute.service';
import { Attribute } from '../attribute/entities/attribute';
import { AttributeRepository } from '../attribute/attribute.repository';
@Module({
  imports: [
    AuthModule,
    MikroOrmModule.forFeature({ entities: [Option, Attribute] }),
    V2Module,
  ],
  controllers: [OptionController],
  providers: [OptionService, AttributeRepository, AttributeService],
  exports: [OptionService],
})
export class OptionModule {}
