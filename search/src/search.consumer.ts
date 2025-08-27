import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerService } from './kafka/consumer.service';
import { TypesenseUtil } from './utils/typesense';
import { AIVectorizerService } from './modules/ai/embedding/ai.vectorizer.service';
@Injectable()
export class SearchConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly configService: ConfigService,
    private readonly aiVectorizerService: AIVectorizerService,
  ) {}
  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: [
          this.configService.get('kafka.PREFIX') +
            this.configService.get('kafka.TOPIC_SYNC_PRODUCTS'),
        ],
      },
      {
        eachMessage: async ({ message }) => {
          const _data: any = JSON.parse(message.value.toString());
          try {
            if (_data?.action === 'sync') {
              const [syncErr, syncRes] = await this.syncProduct(
                _data?.syncData,
              );
              if (syncErr) {
                console.log('syncErr', syncRes);
              }
            } else if (_data?.action === 'unsync') {
              const [unsyncErr, unsyncRes] = await this.unsyncProduct(
                _data?.syncData,
              );

              if (unsyncErr) {
                console.log('unsyncErr', unsyncRes);
              }
            }
          } catch (error) {
            console.log('error', error);
          }
        },
      },
      this.configService.get('kafka.SEARCH_GROUP_ID'),
    );
  }
  async syncProduct(syncDataReq: Record<string, unknown>[]) {
    const dataToVectorize: Array<string[]> = syncDataReq.map((syncDatumReq) => {
      const {
        categoryName,
        brandName,
        modelName,
        variantName,
        grade = '',
        keywords_en = [],
        collectionEn = [],
        condition,
      } = syncDatumReq as {
        categoryName: string;
        arCategoryName: string;
        brandName: string;
        arBrandName: string;
        modelName: string;
        arModelName: string;
        variantName: string;
        arVariantName: string;
        grade?: string;
        arGrade?: string;
        keywords_en?: string[];
        collectionEn?: string[];
        condition?: {
          name?: string;
          nameAr?: string;
        } | null;
      };

      const { name: conditionName = '' } = condition ?? {
        name: '',
        nameAr: '',
      };

      return [
        categoryName,
        brandName,
        modelName,
        variantName,
        grade,
        ...keywords_en.map((item) => item.trim()).filter(Boolean),
        ...collectionEn.map((item) => item.trim()).filter(Boolean),
        conditionName,
      ]
        .filter(Boolean)
        .map((text) => text.trim().toLocaleLowerCase('en'));
    });

    const vectorData = await Promise.all(
      dataToVectorize.map((englishData) =>
        this.aiVectorizerService.generateEmbeddings([englishData.join('. ')]),
      ),
    );

    let collection = 'products' + '_' + this.configService.get('kafka.PREFIX');
    if (process.env.NODE_ENV === 'production') {
      collection = 'products_production-sa';
    }
    const [saveErr, res] = await TypesenseUtil.saveOneOrMany(
      collection,
      syncDataReq.map((syncDatumReq, index) => {
        return {
          ...syncDatumReq,
          searchVector: vectorData[index][0],
        };
      }),
    );
    return [saveErr, res];
  }
  async unsyncProduct(ids: string[]) {
    let collection = 'products' + '_' + this.configService.get('kafka.PREFIX');
    if (process.env.NODE_ENV === 'production') {
      collection = 'products_production-sa';
    }
    const [deleteErr, res] = await TypesenseUtil.deleteOneOrMany(
      collection,
      ids,
    );
    return [deleteErr, res];
  }
}
