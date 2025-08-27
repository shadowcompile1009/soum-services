// Original file: node_modules/soum-proto/proto/addon.proto

export interface GetAddonsRequest {
  addonIds?: string[];
  modelId?: string;
  price?: number | string;
}

export interface GetAddonsRequest__Output {
  addonIds: string[];
  modelId: string;
  price: number;
}
