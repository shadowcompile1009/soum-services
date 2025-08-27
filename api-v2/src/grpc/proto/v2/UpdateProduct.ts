// Original file: node_modules/soum-proto/proto/v2.proto

import type { Consignment as _v2_Consignment, Consignment__Output as _v2_Consignment__Output } from '../v2/Consignment';

export interface UpdateProduct {
  'status'?: (string);
  'sellStatus'?: (string);
  'isApproved'?: (boolean);
  'consignment'?: (_v2_Consignment | null);
  'conditionId'?: (string);
  'sellPrice'?: (number | string);
}

export interface UpdateProduct__Output {
  'status': (string);
  'sellStatus': (string);
  'isApproved': (boolean);
  'consignment': (_v2_Consignment__Output | null);
  'conditionId': (string);
  'sellPrice': (number);
}
