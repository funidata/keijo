import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddShowJiraIssueStatus1752625000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "user_settings",
      new TableColumn({
        name: "showJiraIssueStatus",
        type: "boolean",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("user_settings", "showJiraIssueStatus");
  }
}
