// // migrations/1700000000002-create-product-variants.ts
// import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

// export class CreateProductVariants1700000000002 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createTable(
//       new Table({
//         name: 'product_variants',
//         columns: [
//           {
//             name: 'id',
//             type: 'char',
//             length: '36',
//             isPrimary: true,
//             default: 'UUID()',
//           },
//           { name: 'product_id', type: 'uuid' },
//           { name: 'sku', type: 'varchar', isUnique: true },
//           { name: 'status', type: 'varchar', default: `'active'` },
//           { name: 'created_at', type: 'timestamp', default: 'now()' },
//         ],
//       }),
//     );

//     await queryRunner.createForeignKey(
//       'product_variants',
//       new TableForeignKey({
//         columnNames: ['product_id'],
//         referencedTableName: 'products',
//         referencedColumnNames: ['id'],
//         onDelete: 'CASCADE',
//       }),
//     );

//     await queryRunner.createIndex(
//       'product_variants',
//       new TableIndex({
//         name: 'IDX_VARIANT_PRODUCT',
//         columnNames: ['product_id'],
//       }),
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropTable('product_variants');
//   }
// }






import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateProductVariants1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_variants',
        columns: [
          // {
          //   name: 'id',
          //   type: 'char',
          //   length: '36',
          //   isPrimary: true,
          // },
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          {
            name: 'product_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sku',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '255',
            default: `'active'`, // string default works
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP', // works in MariaDB
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP', // auto-update timestamp
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'product_variants',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'product_variants',
      new TableIndex({
        name: 'IDX_VARIANT_PRODUCT',
        columnNames: ['product_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_variants');
  }
}
