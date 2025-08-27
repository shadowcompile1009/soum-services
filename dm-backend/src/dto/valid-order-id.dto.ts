import { IsString } from 'class-validator';

export class MongoOrderIdDto {
  @IsString()
  orderId: string;
}
