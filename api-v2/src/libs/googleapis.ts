import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';
import { Service } from 'typedi';

@Service()
export class GoogleServices {
  private merchantId = process.env.GOOGLE_MERCHANT_ID;
  private accessToken = '';
  private tokenExpiry = 0;

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.getAccessToken();
    }
  }

  private async getAccessToken() {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    const googleKeyString = process.env.GOOGLE_KEYS || '{}';
    let googleKey;
    try {
      googleKey = JSON.parse(googleKeyString);
    } catch (parseError) {
      throw new Error(
        'Failed to parse GOOGLE_KEYS environment variable as JSON'
      );
    }

    const auth = new GoogleAuth({
      credentials: googleKey,
      scopes: ['https://www.googleapis.com/auth/content'],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    this.accessToken = tokenResponse.token!;
    this.tokenExpiry = Date.now() + 3600 * 1000;
  }

  private async ensureAccessToken() {
    if (Date.now() >= this.tokenExpiry) {
      await this.getAccessToken();
    }
  }

  public async insertProduct(product: any) {
    await this.ensureAccessToken();
    try {
      await axios.post(
        `https://content.googleapis.com/content/v2.1/${this.merchantId}/products`,
        product,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error(
        'Error inserting product:',
        error.response ? error.response.data : error.message
      );
    }
  }

  public async removeProduct(productId: string) {
    await this.ensureAccessToken();
    try {
      await axios.delete(
        `https://content.googleapis.com/content/v2.1/${this.merchantId}/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error(
        'Error removing product:',
        error.response ? error.response.data : error.message
      );
    }
  }
}
