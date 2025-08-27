import { Migration } from '@mikro-orm/migrations';

export class Migration20241009094832 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table IF NOT EXISTS "attribute" ("id" varchar(255) not null, "name_en" varchar(255) not null, "name_ar" varchar(255) not null, "status" varchar(255) not null default \'Active\', "created_at" timestamptz(0) null, "updated_at" timestamptz(0) not null, constraint "attribute_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table IF NOT EXISTS "category" ("id" varchar(255) not null, "name" varchar(255) not null, "name_ar" varchar(255) not null, "position" int not null, "type" varchar(255) not null, "status" varchar(255) not null default \'active\', "created_at" timestamptz(0) null, "updated_at" timestamptz(0) not null, "parent_id" varchar(255) null, "icons" text[] null, constraint "category_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table IF NOT EXISTS "condition" ("id" varchar(255) not null, "name" varchar(255) not null, "name_ar" varchar(255) not null, "category_id" varchar(255) not null, "label_color" varchar(255) not null, "text_color" varchar(255) not null default \'\', "score_range" jsonb not null, "banners" jsonb not null, "status" varchar(255) not null, "is_preset" boolean not null, "is_synced" boolean not null default false, "created_at" varchar(255) null, "updated_at" varchar(255) null, constraint "condition_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table IF NOT EXISTS "category_condition" ("id" varchar(255) not null, "category_id" varchar(255) not null, "price_nudge" jsonb not null, "price_quality_list" jsonb not null, "created_at" varchar(255) not null default 1728467308228, "status" varchar(255) not null default \'Active\', "condition_id" varchar(255) not null, "updated_at" varchar(255) not null, "deleted_at" timestamptz(0) null, constraint "category_condition_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index IF NOT EXISTS "custom_idx_condition_id_and_category_id" on "category_condition" ("category_id", "condition_id");',
    );

    this.addSql(
      'create table IF NOT EXISTS "option" ("id" varchar(255) not null, "name_en" varchar(255) not null, "name_ar" varchar(255) not null, "status" varchar(255) not null default \'Active\', "attribute_id" varchar(255) not null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) not null, constraint "option_pkey" primary key ("id"));',
    );
    this.addSql(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 
              FROM information_schema.table_constraints 
              WHERE constraint_name = 'category_condition_condition_id_foreign' 
              AND table_name = 'category_condition'
          ) THEN
              ALTER TABLE "category_condition" 
              ADD CONSTRAINT "category_condition_condition_id_foreign" 
              FOREIGN KEY ("condition_id") 
              REFERENCES "condition" ("id") 
              ON UPDATE CASCADE;
          END IF;
      END $$;
    `);
    this.addSql(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 
              FROM information_schema.table_constraints 
              WHERE constraint_name = 'category_condition_condition_id_foreign' 
              AND table_name = 'category_condition'
          ) THEN
              ALTER TABLE "category_condition" 
              ADD CONSTRAINT "category_condition_condition_id_foreign" 
              FOREIGN KEY ("condition_id") 
              REFERENCES "condition" ("id") 
              ON UPDATE CASCADE;
          END IF;
      END $$;
    `);
  }
}
