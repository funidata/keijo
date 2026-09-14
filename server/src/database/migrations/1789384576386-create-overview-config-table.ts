import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOverviewConfigTable1789384576386 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_overview_config",
        columns: [
          {
            name: "employeeNumber",
            type: "int",
            isPrimary: true,
          },
          {
            name: "config",
            type: "jsonb",
          },
          {
            name: "updatedAt",
            type: "timestamptz",
            default: "now()",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_overview_config");
  }
}
