import { Injectable } from '@nestjs/common';
import { AIVectorizerService } from '../ai/embedding/ai.vectorizer.service';
import { AIPrompterService } from '../ai/prompter/ai.prompter.service';

@Injectable()
export class VectorService {
  constructor(
    private readonly aiVectorizerService: AIVectorizerService,
    private readonly aiPrompterService: AIPrompterService,
  ) {}

  async vectorize(data: string[], infer: boolean): Promise<Array<number[]>> {
    if (infer) {
      data = await Promise.all(
        data.map((datum) => this.aiPrompterService.inferSearchTerm(datum)),
      );
    }

    return this.aiVectorizerService.generateEmbeddings(data);
  }
}
