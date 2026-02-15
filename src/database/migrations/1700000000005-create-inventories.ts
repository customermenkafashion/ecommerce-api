// migrations/1700000000005-create-inventories.ts
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateInventories1700000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'inventories',
        columns: [
          // {
          //   name: 'id',
          //   type: 'char',
          //   length: '36',
          //   isPrimary: true,
          // },
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'variant_id', type: 'int', isNullable: false, },
          { name: 'quantity', type: 'int', default: 0 },
          { name: 'reserved', type: 'int', default: 0 },
          { name: 'safety_stock', type: 'int', default: 0 },

          
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'inventories',
      new TableForeignKey({
        columnNames: ['variant_id'],
        referencedTableName: 'product_variants',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('inventories');
  }
}
