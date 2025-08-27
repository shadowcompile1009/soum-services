import { IsString } from 'class-validator';

export type SecomType = {
  link: string;
  passKey: string;
};

export class SmsaOrderDTO {
  @IsString()
  passkey: string;

  @IsString()
  refno: string;

  @IsString()
  sentDate: string;

  @IsString()
  idNo: string;

  @IsString()
  cName: string;

  @IsString()
  cntry: string;

  @IsString()
  cCity: string;

  @IsString()
  cZip: string;

  @IsString()
  cPOBox: string;

  @IsString()
  cMobile: string;

  @IsString()
  cTel1: string;

  @IsString()
  cTel2: string;

  @IsString()
  cAddr1: string;

  @IsString()
  cAddr2: string;

  @IsString()
  shipType: string;

  @IsString()
  PCs: string;

  @IsString()
  cEmail: string;

  @IsString()
  carrValue: string;

  @IsString()
  carrCurr: string;

  @IsString()
  codAmt: string;

  @IsString()
  weight: string;

  @IsString()
  itemDesc: string;

  @IsString()
  custVal: string;

  @IsString()
  custCurr: string;

  @IsString()
  insrAmt: string;

  @IsString()
  insrCurr: string;

  @IsString()
  sName: string;

  @IsString()
  sContact: string;

  @IsString()
  sAddr1: string;

  @IsString()
  sAddr2: string;

  @IsString()
  sCity: string;

  @IsString()
  sPhone: string;

  @IsString()
  sCntry: string;

  @IsString()
  prefDelvDate: string;

  @IsString()
  gpsPoints: string;
}

export class OrderData {
  @IsString()
  orderId: string;

  @IsString()
  orderNumber: string;

  @IsString()
  buyerName: string;

  @IsString()
  sellerName: string;

  @IsString()
  buyerPhone: string;

  @IsString()
  buyerCity: string;

  @IsString()
  buyerPostalCode: string;

  @IsString()
  buyerAddress: string;

  @IsString()
  sellerCity: string;

  @IsString()
  sellerPhone: string;

  @IsString()
  sellerAddress: string;

  @IsString()
  sellerPostalCode: string;

  @IsString()
  productName: string;
}
