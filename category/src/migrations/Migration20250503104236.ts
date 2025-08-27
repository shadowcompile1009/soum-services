import { Migration } from '@mikro-orm/migrations';

export class Migration20250503104236 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "category_attribute" ("id" varchar(255) not null, "category_id" varchar(255) not null, "attribute_id" varchar(255) not null, "option_id" varchar(255) null, constraint "category_attribute_pkey" primary key ("id"));');

    this.addSql('alter table "category_attribute" add constraint "category_attribute_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;');
    this.addSql('alter table "category_attribute" add constraint "category_attribute_attribute_id_foreign" foreign key ("attribute_id") references "attribute" ("id") on update cascade;');
    this.addSql('alter table "category_attribute" add constraint "category_attribute_option_id_foreign" foreign key ("option_id") references "option" ("id") on update cascade on delete set null;');

    this.addSql('alter table "attribute" alter column "scanned" type boolean using ("scanned"::boolean);');
    this.addSql('alter table "attribute" alter column "scanned" set not null;');

    this.addSql('alter table "category" add column "images" jsonb null, add column "max_percentage" int null, add column "current_price" int null;');
    this.addSql('alter table "category" alter column "updated_at" drop default;');
    this.addSql('alter table "category" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
    this.addSql('alter table "category" alter column "updated_at" drop not null;');
    this.addSql('alter table "category" drop column "icons";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "category_attribute" cascade;');

    this.addSql('alter table "attribute" alter column "scanned" type bool using ("scanned"::bool);');
    this.addSql('alter table "attribute" alter column "scanned" drop not null;');

    this.addSql('alter table "category" add column "icons" jsonb[] null default null;');
    this.addSql('alter table "category" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
    this.addSql('alter table "category" alter column "updated_at" set default now();');
    this.addSql('alter table "category" alter column "updated_at" set not null;');
    this.addSql('alter table "category" drop column "images";');
    this.addSql('alter table "category" drop column "max_percentage";');
    this.addSql('alter table "category" drop column "current_price";');
  }

}
