// Original file: node_modules/soum-proto/proto/ler.proto

import type {
  User as _ler_User,
  User__Output as _ler_User__Output,
} from '../ler/User';

export interface CreateShipmentReq {
  sender?: _ler_User | null;
  receiver?: _ler_User | null;
  trackingNumber?: string;
  description?: string;
  grandTotal?: number;
  shipmentType?: string;
  serviceName?: string;
  isConsignment?: boolean;
  _isConsignment?: 'isConsignment';
}

export interface CreateShipmentReq__Output {
  sender: _ler_User__Output | null;
  receiver: _ler_User__Output | null;
  trackingNumber: string;
  description: string;
  grandTotal: number;
  shipmentType: string;
  serviceName: string;
  isConsignment?: boolean;
  _isConsignment: 'isConsignment';
}
