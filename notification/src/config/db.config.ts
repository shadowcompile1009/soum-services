import { Options } from '@mikro-orm/core';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { Notification } from '../modules/notification/entities/notification.entity';
import { Migrator } from '@mikro-orm/migrations';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export class DBService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key] || '';
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getConfig(): MikroOrmModuleSyncOptions {
    const database = this.getValue('POSTGRES_DATABASE');
    const config: Options = {
      entities: [Notification],
      dbName: database,
      type: 'postgresql',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      debug: false,
      user: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      allowGlobalContext: true,
      extensions: [Migrator],
    };
    return config;
  }
}

const dbService = new DBService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
]);

export default dbService.getConfig();

export { dbService };
