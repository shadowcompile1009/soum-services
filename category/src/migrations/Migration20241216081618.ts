import { Migration } from '@mikro-orm/migrations';

export class Migration20241216081618 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "attribute" alter column "scanned" type boolean using ("scanned"::boolean);');
    this.addSql('alter table "attribute" alter column "scanned" set not null;');

    this.addSql('alter table "category" alter column "updated_at" drop default;');
    this.addSql('alter table "category" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');

    this.addSql('alter table "condition" alter column "position_en" type int using ("position_en"::int);');
    this.addSql('alter table "condition" alter column "position_en" set default 10000;');
    this.addSql('alter table "condition" alter column "position_en" set not null;');
    this.addSql('alter table "condition" alter column "position_ar" type int using ("position_ar"::int);');
    this.addSql('alter table "condition" alter column "position_ar" set default 10000;');
    this.addSql('alter table "condition" alter column "position_ar" set not null;');

    this.addSql('alter table "category_condition" add column "position" int not null default 10000;');
    this.addSql('alter table "category_condition" alter column "created_at" drop default;');
    this.addSql('alter table "category_condition" alter column "created_at" type varchar(255) using ("created_at"::varchar(255));');

    this.addSql('alter table "option" alter column "position_en" type int using ("position_en"::int);');
    this.addSql('alter table "option" alter column "position_en" set default 10000;');
    this.addSql('alter table "option" alter column "position_en" set not null;');
    this.addSql('alter table "option" alter column "position_ar" type int using ("position_ar"::int);');
    this.addSql('alter table "option" alter column "position_ar" set default 10000;');
    this.addSql('alter table "option" alter column "position_ar" set not null;');
    this.addSql('alter table "option" alter column "scanned" type boolean using ("scanned"::boolean);');
    this.addSql('alter table "option" alter column "scanned" set default false;');
    this.addSql('alter table "option" alter column "scanned" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "attribute" alter column "scanned" type bool using ("scanned"::bool);');
    this.addSql('alter table "attribute" alter column "scanned" drop not null;');

    this.addSql('alter table "category" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
    this.addSql('alter table "category" alter column "updated_at" set default now();');

    this.addSql('alter table "category_condition" alter column "created_at" type varchar(255) using ("created_at"::varchar(255));');
    this.addSql('alter table "category_condition" alter column "created_at" set default \'1717925011547\';');
    this.addSql('alter table "category_condition" drop column "position";');

    this.addSql('alter table "condition" alter column "position_en" drop default;');
    this.addSql('alter table "condition" alter column "position_en" type int4 using ("position_en"::int4);');
    this.addSql('alter table "condition" alter column "position_en" drop not null;');
    this.addSql('alter table "condition" alter column "position_ar" drop default;');
    this.addSql('alter table "condition" alter column "position_ar" type int4 using ("position_ar"::int4);');
    this.addSql('alter table "condition" alter column "position_ar" drop not null;');

    this.addSql('alter table "option" alter column "position_ar" drop default;');
    this.addSql('alter table "option" alter column "position_ar" type int4 using ("position_ar"::int4);');
    this.addSql('alter table "option" alter column "position_ar" drop not null;');
    this.addSql('alter table "option" alter column "position_en" drop default;');
    this.addSql('alter table "option" alter column "position_en" type int4 using ("position_en"::int4);');
    this.addSql('alter table "option" alter column "position_en" drop not null;');
    this.addSql('alter table "option" alter column "scanned" drop default;');
    this.addSql('alter table "option" alter column "scanned" type bool using ("scanned"::bool);');
    this.addSql('alter table "option" alter column "scanned" drop not null;');
  }

}
