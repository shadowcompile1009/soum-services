import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecommendService {
  private readonly externalUrl =
    'https://us-central1-deft-orb-361609.cloudfunctions.net/pnt_v2';

  constructor(private readonly httpService: HttpService) {}

  async postVariantData(data: { variant_id: string; condition_id: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(this.externalUrl, data, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      return {
        statusCode: response.status,
        data: response.data,
      };
    } catch (error) {
      if (error?.response) {
        return {
          statusCode: error.response.status,
          data: error.response.data,
        };
      } else {
        return {
          statusCode: 500,
          data: {
            message: 'Internal Server Error',
            error: error?.code || 'Unknown Error',
          },
        };
      }
    }
  }
}
