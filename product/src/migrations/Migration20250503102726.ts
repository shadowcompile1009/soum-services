import { Migration } from '@mikro-orm/migrations';

export class Migration20250503102726 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product_inspection_settings" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "product_inspection_settings" alter column "updated_at" drop not null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product_inspection_settings" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "product_inspection_settings" alter column "updated_at" set not null;',
    );
  }
}
