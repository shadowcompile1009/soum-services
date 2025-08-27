import { IsString } from 'class-validator';

export class MikroOrmIdDto {
  @IsString()
  id: string;
}
