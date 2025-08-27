import { Migration } from '@mikro-orm/migrations';

export class Migration20250518130652 extends Migration {
  async up(): Promise<void> {

    this.addSql('drop index "product_image_section_product_id_index";');

    this.addSql(
      'alter table "product_inspection_settings" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "product_inspection_settings" alter column "updated_at" drop not null;',
    );

    this.addSql(
      'alter table "product" add column "listing_sell_price" int null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" drop column "listing_sell_price";');

    this.addSql(
      'create index "product_image_section_product_id_index" on "product_image_section" ("product_id");',
    );

    this.addSql(
      'alter table "product_inspection_settings" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "product_inspection_settings" alter column "updated_at" set not null;',
    );
  }
}
