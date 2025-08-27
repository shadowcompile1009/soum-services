import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsString()
  @IsNotEmpty()
  public eventType: string;

  @IsString()
  public platform: string;

  @IsString()
  @IsNotEmpty()
  public messageTitle: string;

  @IsString()
  @IsNotEmpty()
  public messageBody: string;

  @IsBoolean()
  @IsNotEmpty()
  public isRead: boolean;
  @IsString()
  @IsNotEmpty()
  public service: string;

  public overrideData?: object;
}
