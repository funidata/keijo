import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDefaultProjects1721644095053 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "user_settings",
      new TableColumn({
        name: "projectsPreset",
        type: "varchar[]",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("user_settings", "projectsPreset");
  }
}
