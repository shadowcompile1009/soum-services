// Original file: node_modules/soum-proto/proto/recommendation.proto

export interface RemoveFeedbackRequest {
  userId?: string;
  itemId?: string;
  type?: string;
}

export interface RemoveFeedbackRequest__Output {
  userId: string;
  itemId: string;
  type: string;
}
