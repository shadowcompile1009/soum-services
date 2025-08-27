import { Module } from '@nestjs/common';
import { GRPCController } from './grpc.controller';
import { ReviewModule } from '../review/review.module';
import { QuestionModule } from '../question/question.module';

@Module({
  controllers: [GRPCController],
  imports: [ReviewModule, QuestionModule],
})
export class GrpcModule {}
