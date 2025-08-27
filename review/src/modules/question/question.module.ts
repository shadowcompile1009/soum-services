import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionSchema } from './schemas/question.schema';
import { QuestionnaireSchema } from './schemas/questionnaire.schema';
import { ResponseSchema } from './schemas/response.schema';
import { CategoryModule } from '../category/category.module';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { RecommendController } from './recommend.controller';
import { RecommendService } from './recommend.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Question', schema: QuestionSchema },
      { name: 'Questionnaire', schema: QuestionnaireSchema },
      { name: 'Response', schema: ResponseSchema },
    ]),
    CategoryModule,
    HttpModule,
  ],
  controllers: [QuestionController, ResponseController, RecommendController],
  providers: [
    QuestionService,
    QuestionnaireService,
    ResponseService,
    RecommendService,
  ],
  exports: [QuestionService, QuestionnaireService, ResponseService],
})
export class QuestionModule {}
