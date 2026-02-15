import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOrdersTable1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "orders",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "user_id",
            type: "int",
          },
          {
            name: "order_number",
            type: "varchar",
            length: "50",
            isUnique: true,
          },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            default: "'pending'",
          },
          { name: "subtotal", type: "decimal", precision: 10, scale: 2 },
          { name: "tax", type: "decimal", precision: 10, scale: 2, default: 0 },
          { name: "discount", type: "decimal", precision: 10, scale: 2, default: 0 },
          { name: "total", type: "decimal", precision: 10, scale: 2 },
          {
            name: "payment_method",
            type: "varchar",
            length: "50",
          },
          {
            name: "payment_status",
            type: "enum",
            enum: ["pending", "success", "failed"],
            default: "'pending'",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("orders");
  }
}
