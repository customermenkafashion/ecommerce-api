import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateVariantAttributes1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'variant_attributes',
        columns: [
          // {
          //   name: 'id',
          //   type: 'char',
          //   length: '36',
          //   isPrimary: true,
          // },
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          {
            name: 'variant_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'key',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'value',
            type: 'varchar',
            length: '255',
          },
           {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
          'variant_attributes',
          new TableForeignKey({
            columnNames: ['variant_id'],
            referencedTableName: 'product_variants',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('variant_attributes');
  }
}
