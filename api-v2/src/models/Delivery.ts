// @ts-nocheck
export interface LatLong {
  latitude: number;
  longitude: number;
}

export interface Delivery {
  from: string;
  from_ar: string;
  delivery_rule: DeliveryRule[];
}

export interface DeliveryRule {
  to: string;
  to_ar: string;
  expected_delivery_time: number;
}

export interface CalcDelivery {
  user_city?: string;
  delivery_rule: DeliveryRule[];
}
