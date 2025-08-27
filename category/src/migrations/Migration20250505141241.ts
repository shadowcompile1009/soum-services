import { Migration } from '@mikro-orm/migrations';

export class Migration20250505141241 extends Migration {

  async up(): Promise<void> {   
    this.addSql('create index "custom_idx_category_id_and_isPreset" on "condition" ("category_id", "is_preset");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "custom_idx_category_id_and_isPreset";');
  }

}
