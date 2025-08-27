import { Migration } from '@mikro-orm/migrations';

export class Migration20250525100549 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "consignment" add column "seller_notification_record" jsonb not null default \'{}\';',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "consignment" drop column "seller_notification_record";',
    );
  }
}
