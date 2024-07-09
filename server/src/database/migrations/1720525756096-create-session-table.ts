import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSessionTable1720525756096 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "session",
        columns: [
          {
            name: "sid",
            type: "character varying",
            isPrimary: true,
          },
          {
            name: "expire",
            type: "timestamp without time zone",
          },
          {
            name: "sess",
            type: "json",
          },
        ],
      }),
    );
  }

  public async down(): Promise<void> {}
}
