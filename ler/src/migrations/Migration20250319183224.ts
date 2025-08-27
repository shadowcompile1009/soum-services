import { Migration } from '@mikro-orm/migrations';

export class Migration20250319183224 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "shipment" ("id" varchar(255) not null, "soum_order_number" varchar(255) not null, "tracking_numbers" jsonb null, "created_at" varchar(255) not null, constraint "shipment_pkey" primary key ("id"));');
    this.addSql('alter table "shipment" add constraint "shipment_soum_order_number_unique" unique ("soum_order_number");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "shipment" cascade;');
  }

}
