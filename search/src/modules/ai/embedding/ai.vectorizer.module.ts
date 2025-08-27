import { Module } from '@nestjs/common';
import { GeminiEmbeddingsProvider } from './provider/gemini.embeddings/gemini.embeddings.provider';
import { AIVectorizerService } from './ai.vectorizer.service';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { CacheModule } from '../../cache/cache.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [CacheModule],
  providers: [
    {
      provide: GoogleGenerativeAIEmbeddings,
      useFactory: (configService: ConfigService) => {
        return new GoogleGenerativeAIEmbeddings({
          apiKey: configService.get('embedding.EMBEDDING_API_KEY'),
          model: configService.get('embedding.EMBEDDING_MODEL'),
          stripNewLines: true,
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'EmbeddingsProvider',
      useClass: GeminiEmbeddingsProvider,
    },
    AIVectorizerService,
  ],
  exports: [AIVectorizerService],
})
export class AIVectorizerModule {}
