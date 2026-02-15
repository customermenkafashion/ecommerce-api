import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOrderItemsTable1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "order_items",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "order_id", type: "int" },
          { name: "product_id", type: "int" },
          { name: "variant_id", type: "int", isNullable: true },
          { name: "quantity", type: "int" },
          { name: "price", type: "decimal", precision: 10, scale: 2 },
          { name: "total", type: "decimal", precision: 10, scale: 2 },
        ],
        foreignKeys: [
          {
            columnNames: ["order_id"],
            referencedTableName: "orders",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
          {
            columnNames: ["product_id"],
            referencedTableName: "products",
            referencedColumnNames: ["id"],
          },
          {
            columnNames: ["variant_id"],
            referencedTableName: "product_variants",
            referencedColumnNames: ["id"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("order_items");
  }
}
