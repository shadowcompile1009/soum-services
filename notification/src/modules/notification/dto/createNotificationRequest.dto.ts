/* eslint-disable prettier/prettier */
import { IsMongoId, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateNotificationRequest {
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
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  topic: string;
  @IsBoolean()
  @IsNotEmpty()
  isRead: boolean;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  platform: string;
}
