import { Inject, Injectable } from '@nestjs/common';
import { EmbeddingsProvider } from './interface/embeddings.provider.interface';
import { CacheService } from '../../cache/cache.service';
import { generate256Hash } from '@src/utils/hash';

@Injectable()
export class AIVectorizerService {
  constructor(
    @Inject('EmbeddingsProvider')
    private readonly embeddingsProvider: EmbeddingsProvider,
    private readonly cacheService: CacheService,
  ) {}

  private isTextArabic(text: string): boolean {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicPattern.test(text);
  }

  async generateEmbeddings(data: string[]): Promise<Array<number[]>> {
    data = data.map((text) => {
      if (this.isTextArabic(text)) {
        return text.toLocaleLowerCase('ar-SA');
      }

      return text.toLocaleLowerCase('en');
    });

    const keys = data.map((key) => `vector:${generate256Hash(key)}`);

    const cacheResults = await this.cacheService.getData<{
      text: string;
      vector: number[];
    } | null>({
      keys,
    });

    const embeddings = cacheResults.reduce((previous, current, index) => {
      return {
        ...previous,
        [index]: current?.vector,
      };
    }, {});

    const dataToVector = data
      .map((datum, index) => {
        return {
          index,
          datum,
        };
      })
      .filter((_, index) => {
        return !embeddings[index];
      });

    if (!dataToVector.length) {
      return Object.values(embeddings);
    }

    return this.embeddingsProvider
      .generateEmbeddings(dataToVector.map(({ datum }) => datum))
      .then(async (results) => {
        await Promise.all(
          results.map((result, index) => {
            embeddings[dataToVector[index].index] = result;

            return this.cacheService.putData({
              key: keys[dataToVector[index].index],
              data: {
                vector: result,
                text: data[dataToVector[index].index],
              },
              expiration: 2629800,
            });
          }),
        );

        return Object.values(embeddings);
      });
  }
}
