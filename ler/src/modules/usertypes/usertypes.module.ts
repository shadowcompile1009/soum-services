import { Module } from '@nestjs/common';
import { UserType } from './entities/userType.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserTypesService } from './usertypes.service';
import { UserTypesController } from './usertypes.controller';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [UserType] })],
  providers: [UserTypesService],
  controllers: [UserTypesController],
  exports: [UserTypesService]
})
export class UserTypesModule {}
