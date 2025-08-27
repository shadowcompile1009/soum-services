export type GetCachedDataRequest = {
  keys: string[];
};

export type PutCachedDataRequest<Schema> = {
  data: Schema;
  key: string;
  expiration?: number;
};
