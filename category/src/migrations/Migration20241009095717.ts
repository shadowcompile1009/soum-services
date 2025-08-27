import { Migration } from '@mikro-orm/migrations';

export class Migration20241009095717 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "category_condition" alter column "created_at" drop default;',
    );
    this.addSql(
      'alter table "category_condition" alter column "created_at" type varchar(255) using ("created_at"::varchar(255));',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "category_condition" alter column "created_at" type varchar(255) using ("created_at"::varchar(255));',
    );
    this.addSql(
      'alter table "category_condition" alter column "created_at" set default 1728467308228;',
    );
  }
}
