import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '@src/auth/auth.module';
import { V2Module } from '../v2/v2.module';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';
import { Attribute } from './entities/attribute';
import { Option } from '../option/entities/option';
@Module({
  imports: [
    AuthModule,
    MikroOrmModule.forFeature({ entities: [Attribute, Option] }),
    V2Module,
  ],
  controllers: [AttributeController],
  providers: [AttributeService],
  exports: [AttributeService],
})
export class AttributeModule {}
