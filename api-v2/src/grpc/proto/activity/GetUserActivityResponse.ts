// Original file: node_modules/soum-proto/proto/activity.proto

export interface GetUserActivityResponse {
  userId?: string;
  eventType?: string;
  module?: string;
  createdAt?: string;
}

export interface GetUserActivityResponse__Output {
  userId: string;
  eventType: string;
  module: string;
  createdAt: string;
}
