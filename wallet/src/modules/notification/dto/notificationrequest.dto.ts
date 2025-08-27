import { IsMongoId, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class NotificationRequestEventDto {
  @IsString()
  @IsNotEmpty()
  eventType: string;
  @IsMongoId()
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  @IsString()
  service: string;
  @IsString()
  @IsNotEmpty()
  messageTitle: string;
  @IsString()
  @IsNotEmpty()
  messageBody: string;
  @IsString()
  @IsNotEmpty()
  platform: string;
  @IsBoolean()
  @IsNotEmpty()
  isRead: boolean;
}
