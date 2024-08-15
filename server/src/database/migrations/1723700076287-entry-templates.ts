import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class EntryTemplates1723700076287 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "user_settings",
      new TableColumn({
        name: "entryTemplates",
        type: "json",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("user_settings", "entryTemplates");
  }
}
