// Original file: node_modules/soum-proto/proto/commission.proto

export interface Reservation {
  reservationAmount?: number | string;
  reservationRemainingAmount?: number | string;
}

export interface Reservation__Output {
  reservationAmount: number;
  reservationRemainingAmount: number;
}
