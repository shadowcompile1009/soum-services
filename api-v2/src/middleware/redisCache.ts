import { Response } from 'express';
import _isEmpty from 'lodash/isEmpty';
import { Constants } from '../constants/constant';
import { createUniqueCacheKey, getCache } from '../libs/redis';
import { isCacheEnable } from '../util/common';

export const redisCache = async function (req: any, res: Response, next: any) {
  if (!isCacheEnable(req) && req.baseUrl !== '/rest/api/v1/product') {
    return next();
  }
  const key: string = createUniqueCacheKey(req);
  const cacheSettings: any[] | string = await getCache<any[]>(key);
  if (_isEmpty(cacheSettings)) {
    next();
  } else {
    res.sendOk(cacheSettings, Constants.SUCCESS_CODE.SUCCESS);
  }
};
