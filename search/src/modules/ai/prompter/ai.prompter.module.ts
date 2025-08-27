import { Module } from '@nestjs/common';
import { AIPrompterService } from './ai.prompter.service';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@src/modules/cache/cache.module';
import { GeminiPrompterProvider } from './provider/gemini.prompter.provider';

@Module({
  imports: [CacheModule],
  providers: [
    {
      provide: ChatGoogleGenerativeAI,
      useFactory: (configService: ConfigService) => {
        return new ChatGoogleGenerativeAI({
          model: configService.get('prompter.PROMPT_MODEL'),
          temperature: 0.1,
          apiKey: configService.get('prompter.PROMPT_API_KEY'),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'PrompterProvider',
      useClass: GeminiPrompterProvider,
    },
    AIPrompterService,
  ],
  exports: [AIPrompterService],
})
export class AIPrompterModule {}
