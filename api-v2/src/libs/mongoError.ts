import { Constants } from '../constants/constant';
export function mappingMongoError(error_code: number) {
  try {
    switch (error_code) {
      case 11000:
        return Constants.ERROR_MAP.DUPLICATE_REQUEST;
      default:
        return 'No instance of MongoError code map with config';
    }
  } catch (exception) {
    return 'Fail to map MongoError';
  }
}
