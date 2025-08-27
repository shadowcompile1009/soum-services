import { Migration } from '@mikro-orm/migrations';

export class Migration20241010125949 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table IF NOT EXISTS "cities" ("id" varchar(255) not null, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "name" varchar(255) not null, "arabic_name" varchar(255) null, "seller_tier" int not null, "buyer_tier" int not null, "deleted_at" timestamptz(0) null, constraint "cities_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table IF NOT EXISTS "service" ("id" varchar(255) not null, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "name" varchar(255) not null, "arabic_name" varchar(255) null, "deleted_at" timestamptz(0) null, constraint "service_pkey" primary key ("id"));',
    );

    this.addSql(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 
              FROM information_schema.table_constraints 
              WHERE constraint_name = 'service_name_unique' 
              AND table_name = 'service'
          ) THEN
              alter table "service" add constraint "service_name_unique" unique ("name");
          END IF;
      END $$;
    `);

    this.addSql(
      'create table IF NOT EXISTS "user_type" ("id" varchar(255) not null, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "name" varchar(255) not null, "deleted_at" timestamptz(0) null, constraint "user_type_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table IF NOT EXISTS "vendor" ("id" varchar(255) not null, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "name" varchar(255) not null, "arabic_name" varchar(255) null, "seller_tiers" varchar(255) not null, "buyer_tiers" varchar(255) not null, "services" varchar(255) not null, "deleted_at" timestamptz(0) null, constraint "vendor_pkey" primary key ("id"));',
    );

    this.addSql(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 
              FROM information_schema.table_constraints 
              WHERE constraint_name = 'vendor_name_unique' 
              AND table_name = 'vendor'
          ) THEN
              alter table "vendor" add constraint "vendor_name_unique" unique ("name");
          END IF;
      END $$;
    `);
    this.addSql(
      'create table IF NOT EXISTS "rules" ("id" varchar(255) not null, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "vendor_id" varchar(255) not null, "user_type_id" varchar(255) not null, "seller_tier" int not null, "buyer_tier" int not null, "deleted_at" timestamptz(0) null, constraint "rules_pkey" primary key ("id"));',
    );

    this.addSql(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 
              FROM information_schema.table_constraints 
              WHERE constraint_name = 'rules_vendor_id_foreign' 
              AND table_name = 'rules'
          ) THEN
              alter table "rules" add constraint "rules_vendor_id_foreign" foreign key ("vendor_id") references "vendor" ("id") on update cascade;
          END IF;
      END $$;
    `);
    this.addSql(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 
              FROM information_schema.table_constraints 
              WHERE constraint_name = 'rules_user_type_id_foreign' 
              AND table_name = 'rules'
          ) THEN
              alter table "rules" add constraint "rules_user_type_id_foreign" foreign key ("user_type_id") references "user_type" ("id") on update cascade;
          END IF;
      END $$;
    `);
  }
}
