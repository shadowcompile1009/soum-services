import { Inject, Injectable } from '@nestjs/common';
import { PrompterProvider } from './interface/prompter.provider.interface';
import { generate256Hash } from '@src/utils/hash';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class AIPrompterService {
  constructor(
    @Inject('PrompterProvider')
    private readonly prompterProvider: PrompterProvider,
    private readonly cacheService: CacheService,
  ) {}

  async inferSearchTerm(data: string): Promise<string> {
    const key = `search-term:${generate256Hash(data)}`;

    const [cache] = await this.cacheService.getData<{
      term: string;
      text: string;
    } | null>({
      keys: [key],
    });

    if (cache) {
      return cache.term;
    }

    return this.prompterProvider.inferSearchTerm(data).then(async (result) => {
      await this.cacheService.putData({
        key,
        data: { text: data, term: result },
      });

      return result;
    });
  }
}
