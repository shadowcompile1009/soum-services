import { GetCachedDataRequest, PutCachedDataRequest } from '../type/cache.type';

export interface CacheInterface {
  getData<Schema>(request: GetCachedDataRequest): Promise<Array<Schema | null>>;
  putData<Schema>(request: PutCachedDataRequest<Schema>): Promise<void>;
}
