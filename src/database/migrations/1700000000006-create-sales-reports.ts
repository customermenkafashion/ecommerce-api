import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSalesReportsTable1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "sales_reports",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "date",
            type: "date",
            isUnique: true,
          },
          { name: "total_orders", type: "int", default: 0 },
          {
            name: "total_sales",
            type: "decimal",
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: "total_tax",
            type: "decimal",
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: "total_discount",
            type: "decimal",
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("sales_reports");
  }
}
