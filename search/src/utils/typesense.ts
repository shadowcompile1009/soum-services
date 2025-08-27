import { Injectable } from '@nestjs/common';
import Typesense, { Client } from 'typesense';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

@Injectable()
export class TypesenseUtil {
  public static init = async (): Promise<Client> => {
    try {
      const client = new Typesense.Client({
        nodes: [
          {
            host: process.env.TYPESENSE_HOST,
            port: parseInt(process.env.TYPESENSE_PORT),
            protocol: process.env.TYPESENSE_PROTOCOL,
          },
        ],
        apiKey: process.env.TYPESENSE_API_KEY,
        connectionTimeoutSeconds: 36000,
      });
      return client;
    } catch (exception) {
      console.log(exception);
    }
  };

  public static saveOneOrMany = async (
    indexKey: string,
    data: any,
  ): Promise<[boolean, any]> => {
    try {
      const client = await TypesenseUtil.init();
      const response = await client
        .collections(indexKey)
        .documents()
        .import(data, { action: 'emplace', return_id: true });
      return [false, response];
    } catch (error) {
      return [true, error];
    }
  };

  public static createCollection = async (client: Client, indexKey: string) => {
    const productsSchema = {
      name: indexKey,
      fields: [
        { name: '.*', type: 'auto' },
        { name: 'price_range', type: 'auto', facet: true, optional: true },
        { name: 'originalPrice', type: 'float', optional: true },
        { name: 'sellPrice', type: 'float', facet: true, optional: true },
      ],
    } as CollectionCreateSchema;

    return new Promise((resolve) => {
      client
        .collections()
        .create(productsSchema)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          resolve(error);
        });
    });
  };

  public static deleteOneOrMany = async (
    indexKey: string,
    objectIds: string[],
  ): Promise<[boolean, any]> => {
    try {
      const client = await TypesenseUtil.init();
      const response = await client
        .collections(indexKey)
        .documents()
        .delete({ filter_by: `id: [${objectIds?.join(', ')}]` });
      return [false, response];
    } catch (error) {
      console.error('error removing product from Typesense:', error);
      return [true, error];
    }
  };

  public static async fetchResults(
    indexKey: string,
    filters: any,
  ): Promise<any> {
    const client = await this.init();
    let res: any = [];
    res = await client.collections(indexKey).documents().search(filters);
    return res.hits.map((item) => item.document);
  }
}
