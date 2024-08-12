import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddWeekendAndHourOptions1721728112062 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("user_settings", [
      new TableColumn({
        name: "showWeekend",
        type: "boolean",
        isNullable: true,
      }),
      new TableColumn({
        name: "setRemainingHours",
        type: "boolean",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns("user_settings", ["showWeekend", "setRemainingHours"]);
  }
}
