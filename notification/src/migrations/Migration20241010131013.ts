import { Migration } from '@mikro-orm/migrations';

export class Migration20241010131013 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table IF NOT EXISTS "notification" ("id" varchar(255) not null, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "user_id" varchar(255) not null, "event_type" varchar(255) not null, "platform" varchar(255) not null, "service" varchar(255) null, "message_title" varchar(255) not null, "message_body" varchar(255) not null, "is_read" boolean not null, "we_transaction_id" varchar(255) null, "override_data" varchar(255) null, "deleted_at" timestamptz(0) null, constraint "notification_pkey" primary key ("id"));',
    );
  }
}
