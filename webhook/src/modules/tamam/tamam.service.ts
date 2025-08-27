import { Injectable } from '@nestjs/common';
import {
  PoConfirmationRequest,
  PoConfirmationResponse,
  StatusCallbackRequest,
  StatusCallbackResponse,
} from './types/tamam.types';

@Injectable()
export class TamamService {
  constructor() {}

  handleTamamPo(payload: PoConfirmationRequest): PoConfirmationResponse {
    return {
      po_id: payload.po_id,
      merchant_id: payload.merchant_id,
      order_id: payload.order_id,
      transaction_id: payload.transaction_id,
      accepted_at: new Date(),
      accept: true,
    };
  }

  handleTamamStatus(payload: StatusCallbackRequest): StatusCallbackResponse {
    console.log(payload);
    return {
      accept: true,
      accepted_at: new Date(),
    };
  }
}
