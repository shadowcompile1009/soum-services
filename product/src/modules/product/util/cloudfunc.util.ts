import axios from 'axios';
import { DeepLoadReq } from '../dto/deepLoadReq.dto';
import { ProductViewerClickCloudFuncDto } from '@src/modules/product-views/dto/product-view-analysis.dto';

require('dotenv').config();
let cloudFuncBaseURL: string = process.env.CLOUD_FUNCTION_BASE_URL;

export const getViewersOrClicksProduct = async (productIds: string[]): Promise<ProductViewerClickCloudFuncDto[]> => {
  const eventName = 'product_buynow_clicks_webengage';
    cloudFuncBaseURL = process.env.CLOUD_FUNCTION_BASE_URL || 'https://us-central1-deft-orb-361609.cloudfunctions.net';
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          `${cloudFuncBaseURL}/${eventName}`,
          {
            product_ids: productIds,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (response?.data?.error_code === undefined) {
          return resolve(response?.data || [{"productId": "", "clickedBuyNow": 0, "sppViewed": 0}]);
        }
        return resolve([{"productId": "", "clickedBuyNow": 0, "sppViewed": 0}]);
      } catch (error) {
        resolve([{"productId": "", "clickedBuyNow": 0, "sppViewed": 0}]);
      }});
};
