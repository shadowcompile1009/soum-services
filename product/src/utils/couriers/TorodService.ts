import { CreateShipmentReq } from '@modules/grpc/proto/ler.pb';
import { LerService } from '@modules/ler/ler.service';
import { Injectable, Logger } from '@nestjs/common';
import { GenerateTrackingDto } from './dto/generate-tracking.dto';

@Injectable()
export class TorodService {
  private readonly logger = new Logger(TorodService.name);

  constructor(private readonly lerService: LerService) {}

  async generateTrackingNumber(params: GenerateTrackingDto): Promise<string> {
    try {
      const shipmentParams: CreateShipmentReq = {
        sender: {
          name: params.senderName,
          mobileNumber: params.senderPhone,
          address: params.senderAddress,
          email: 'soum.seller@soum.sa',
          userType: 'IndividualSeller',
          city: params.senderCity,
        },
        receiver: {
          name: params.receiverName,
          mobileNumber: params.receiverPhone,
          address: params.receiverAddress,
          email: 'soum.buyer@soum.sa',
          userType: null,
          city: params.receiverCity,
        },
        trackingNumber: params.trackingNumber,
        description: params.description,
        grandTotal: params.grandTotal,
        shipmentType: params.shipmentType,
        serviceName: params.serviceName,
        isConsignment: true,
      };

      const response = await this.lerService.createShipment(shipmentParams);

      if (!response?.trackingNumber) {
        this.logger.error(
          'Failed to generate tracking number from LER service',
        );
        return null;
      }

      return response.trackingNumber;
    } catch (error) {
      this.logger.error('Error generating tracking number:', error);
      return null;
    }
  }

  private generateRandomTrackingNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `TOROD${timestamp}${random}`;
  }
}
