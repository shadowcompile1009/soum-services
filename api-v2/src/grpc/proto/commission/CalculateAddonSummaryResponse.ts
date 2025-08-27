// Original file: node_modules/soum-proto/proto/commission.proto

export interface CalculateAddonSummaryResponse {
  addOnsTotal?: number | string;
  addOnsVat?: number | string;
  addOnsGrandTotal?: number | string;
}

export interface CalculateAddonSummaryResponse__Output {
  addOnsTotal: number;
  addOnsVat: number;
  addOnsGrandTotal: number;
}
