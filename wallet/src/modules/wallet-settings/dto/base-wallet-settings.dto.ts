import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class BaseWalletSettingsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(['Global', 'Automation'])
  @IsNotEmpty()
  type: string;
}
