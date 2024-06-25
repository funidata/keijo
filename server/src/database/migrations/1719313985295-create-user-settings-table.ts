import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserSettingsTable1719313985295 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_settings",
        columns: [
          {
            name: "employeeNumber",
            type: "int",
            isPrimary: true,
          },
          {
            name: "productPreset",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "activityPreset",
            type: "varchar",
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(): Promise<void> {}
}
