import { Options } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { Consignment } from '@src/modules/consignment/entity/consignment.entity';
import { Specification } from '@src/modules/inspection/entity/Specification';
import { ProductView } from '@src/modules/product-views/entities/product-views.entity';
import { Category } from '@src/modules/product/entity/category.entity';
import { ProductInspectionSettings } from '@src/modules/product/entity/product-inspection-settings.entity';
import { Product } from '@src/modules/product/entity/product.entity';
import { ProductAction } from '@src/modules/product/entity/productActions.entity';
import { ProductImageSection } from '@src/modules/product/entity/productImageSection.entity';
import { Settings } from '@src/modules/product/entity/settings.entity';
import { SoumUser } from '@src/modules/product/entity/user.entity';
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
    const config: Options = {
      entities: [
        ProductView,
        Product,
        Settings,
        ProductAction,
        ProductInspectionSettings,
        ProductImageSection,
        Consignment,
        Specification,
        Category,
        SoumUser,
      ],
      dbName: this.getValue('POSTGRES_DATABASE'),
      type: 'postgresql',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      debug: false,
      user: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      allowGlobalContext: true,
      discovery: { warnWhenNoEntities: true },
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
