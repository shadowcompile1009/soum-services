import { apiGatewayClient } from '@/api/client';

export const LogisticsEndpoints = {
  ImportVendors: 'ler/vendor/upload',
  ImportCitiesTiers: 'ler/cities/upload',
  ImportRules: 'ler/rules/upload',
};

export class Logistics {
  static async ImportVendorList(File: FormData) {
    const result = await apiGatewayClient.client.post(
      LogisticsEndpoints.ImportVendors,
      File
    );
    return result;
  }
  static async ImportCitiesTiers(File: FormData) {
    const result = await apiGatewayClient.client.post(
      LogisticsEndpoints.ImportCitiesTiers,
      File
    );
    return result;
  }
  static async ImportRulesList(File: FormData) {
    const result = await apiGatewayClient.client.post(
      LogisticsEndpoints.ImportRules,
      File
    );
    return result;
  }
}
