import { IsBoolean, IsObject, IsString } from 'class-validator';

export class SendOutboundMsgRequestDTO {
  @IsString()
  phoneNumber: string;

  @IsString()
  templateName: string;

  @IsString()
  productName: string;

  @IsString()
  productId: string;

  @IsString()
  pdfLink: string;
}

export class SendOutboundMsgResponseDTO {
  @IsBoolean()
  status: boolean;

  @IsObject()
  data: object;

  @IsString()
  message: string;
}
