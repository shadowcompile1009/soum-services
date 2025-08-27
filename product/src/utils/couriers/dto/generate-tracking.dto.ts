export class GenerateTrackingDto {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity: string;
  description: string;
  trackingNumber: string;
  grandTotal: number;
  shipmentType?: string = 'firstMile';
  serviceName?: string = 'torod';
}
