import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Injectable } from '@nestjs/common';
import { EmbeddingsProvider } from '../../interface/embeddings.provider.interface';
import { chunkArray } from '@src/utils/chunk';
import { setTimeout } from 'node:timers/promises';
import { backOff } from 'exponential-backoff';

@Injectable()
export class GeminiEmbeddingsProvider implements EmbeddingsProvider {
  constructor(private readonly client: GoogleGenerativeAIEmbeddings) {}

  async generateEmbeddings(data: string[]): Promise<Array<number[]>> {
    const results: Array<number[]> = [];

    const chunkedData = chunkArray(data, 5);

    let batch = 0;

    for (const chunkedDataItem of chunkedData) {
      const result = await backOff(
        async () => {
          const vectors = await this.client.embedDocuments(chunkedDataItem);

          if (vectors.some((vector) => !vector.length)) {
            throw new Error(
              `Failed to generate vector data possible rate limiting: ${vectors}`,
            );
          }

          return vectors;
        },
        {
          numOfAttempts: 5,
        },
      ).catch((error) => {
        console.error(error.message);

        throw error;
      });

      results.push(...result);

      if (batch > 0) {
        await setTimeout(5000); // add delay of 5 seconds to avoid rate limiting
      }

      batch += 1;
    }

    return results;
  }
}
