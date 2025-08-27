// Original file: node_modules/soum-proto/proto/recommendation.proto

export interface AddFeedbackRequest {
  userId?: string;
  itemId?: string;
  type?: string;
}

export interface AddFeedbackRequest__Output {
  userId: string;
  itemId: string;
  type: string;
}
