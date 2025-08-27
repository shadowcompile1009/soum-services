import { Module } from '@nestjs/common';
import { VectorService } from './vector.service';
import { VectorController } from './vector.controller';
import { AIVectorizerModule } from '../ai/embedding/ai.vectorizer.module';
import { AIPrompterModule } from '../ai/prompter/ai.prompter.module';

@Module({
  imports: [AIVectorizerModule, AIPrompterModule],
  controllers: [VectorController],
  providers: [VectorService],
  exports: [VectorService],
})
export class VectorModule {}
