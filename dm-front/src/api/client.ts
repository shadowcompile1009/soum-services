import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private _client: AxiosInstance;

  constructor(private baseURL: string) {
    this._client = axios.create({
      baseURL,
    });
  }

  get client(): AxiosInstance {
    if (!this._client) {
      this._client = axios.create({
        baseURL: this.baseURL,
      });
    }
    return this._client;
  }

  addAuthTokens(token: string) {
    this.client.defaults.headers.common['token'] = token;
    this.client.defaults.headers.common['client-id'] = 'admin-web';
  }
}

export const apiClientV1 = new ApiClient(process.env.NEXT_PUBLIC_API_V1!);

export const apiClientV2 = new ApiClient(process.env.NEXT_PUBLIC_API_V2!);

// Api client for making request to next.js api
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API! + 'api/')
  .client;

export const apiGatewayClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_GATEWAY!
);
