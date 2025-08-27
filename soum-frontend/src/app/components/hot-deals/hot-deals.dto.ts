import { HotDealsItem } from './hot-deals.types';

export interface GetHotDealsDTO {
  message: null;
  responseData: {
    arName: string;
    enName: string;
    id: string;
    items: HotDealsItem[];
    status: string;
    timeStamp: string;
    violations: null;
  };
}
