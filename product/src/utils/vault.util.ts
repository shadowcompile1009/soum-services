import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class VaultInstance {
  private readonly vaultClient: any;

  constructor() {
    this.vaultClient = axios.create({
      baseURL: process.env.VAULT_ADDR,
      headers: {
        'X-Vault-Token': process.env.VAULT_TOKEN,
      },
    });
  }

  public async getSecretData(path: string) {
    try {
      const res = await this.vaultClient.get(`/v1/secret/data/${path}`);
      return res?.data?.data?.data ?? {};
    } catch (error) {
      console.log('Fail to get secret data ' + error);
      return {};
    }
  }
}
