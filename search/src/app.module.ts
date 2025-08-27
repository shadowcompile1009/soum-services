import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '@src/config/database.config';
import kafkaConfig from './config/kafka-sync.config';
import { KafkaModule } from './kafka/kafka.module';
import { GrpcModule } from './modules/grpc/grpc.module';
import { SearchConsumer } from './search.consumer';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import redisConfig from './config/redis.config';
import embeddingsConfig from './config/ai.embedding.config';
import promptConfig from './config/ai.prompt.config';
import { VectorModule } from './modules/vector/vector.module';
import { AIVectorizerModule } from './modules/ai/embedding/ai.vectorizer.module';
import { CacheModule } from './modules/cache/cache.module';
import { AIPrompterModule } from './modules/ai/prompter/ai.prompter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        kafkaConfig,
        redisConfig,
        embeddingsConfig,
        promptConfig,
      ],
    }),
    CacheModule,
    AIVectorizerModule,
    AIPrompterModule,
    ProductsModule,
    KafkaModule,
    GrpcModule,
    VectorModule,
  ],
  providers: [AppService, SearchConsumer],
})
export class AppModule {}
