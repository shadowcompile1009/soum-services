// Original file: node_modules/soum-proto/proto/v2.proto

import type {
  SMSATracking as _v2_SMSATracking,
  SMSATracking__Output as _v2_SMSATracking__Output,
} from '../v2/SMSATracking';

export interface CreateSMSATrackingRequest {
  trackingData?: _v2_SMSATracking[];
}

export interface CreateSMSATrackingRequest__Output {
  trackingData: _v2_SMSATracking__Output[];
}
