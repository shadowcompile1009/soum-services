import { Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { StatusesController } from './statuses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Status, StatusSchema } from './schemas/status.schema';
import { AuthModule } from '@src/auth/auth.module';
import { StatusGroup, StatusGroupSchema } from './schemas/status-group.schema';

@Module({
  providers: [StatusesService],
  controllers: [StatusesController],
  imports: [
    MongooseModule.forFeature([
      { name: Status.name, schema: StatusSchema },
      { name: StatusGroup.name, schema: StatusGroupSchema },
    ]),
    AuthModule,
  ],
  exports: [StatusesService],
})
export class StatusesModule {}
