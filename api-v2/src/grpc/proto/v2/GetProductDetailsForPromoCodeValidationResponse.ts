// Original file: node_modules/soum-proto/proto/v2.proto

import type { ValidIDsForPromoCodeResponse as _v2_ValidIDsForPromoCodeResponse, ValidIDsForPromoCodeResponse__Output as _v2_ValidIDsForPromoCodeResponse__Output } from '../v2/ValidIDsForPromoCodeResponse';

export interface GetProductDetailsForPromoCodeValidationResponse {
  'sellPrice'?: (number | string);
  'detailsForScopeValidation'?: (_v2_ValidIDsForPromoCodeResponse | null);
}

export interface GetProductDetailsForPromoCodeValidationResponse__Output {
  'sellPrice': (number);
  'detailsForScopeValidation': (_v2_ValidIDsForPromoCodeResponse__Output | null);
}
