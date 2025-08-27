// Original file: node_modules/soum-proto/proto/recommendation.proto

export interface AddNewItemRequest {
  itemId?: string;
  isHidden?: boolean;
  labels?: string[];
  categories?: string[];
  timestamp?: string;
}

export interface AddNewItemRequest__Output {
  itemId: string;
  isHidden: boolean;
  labels: string[];
  categories: string[];
  timestamp: string;
}
