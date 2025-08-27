import { Migration } from '@mikro-orm/migrations';

export class Migration20250521104247 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product_inspection_settings" add column "order_number" varchar(255) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product_inspection_settings" drop column "order_number";',
    );
  }
}
