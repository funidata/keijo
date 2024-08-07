import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migrations1721115925197 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "user_settings",
      new TableColumn({
        name: "jiraNotificationIgnore",
        type: "boolean",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("user_settings", "jiraNotificationIgnore");
  }
}
