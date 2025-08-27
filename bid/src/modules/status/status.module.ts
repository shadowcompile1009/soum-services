import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@src/auth/auth.module';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { Status, StatusSchema } from './schemas/status.schema';

@Module({
  providers: [StatusService],
  controllers: [StatusController],
  imports: [
    MongooseModule.forFeature([{ name: Status.name, schema: StatusSchema }]),
    AuthModule,
  ],
  exports: [StatusService],
})
export class StatusModule {}
