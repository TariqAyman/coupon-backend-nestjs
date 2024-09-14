import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateCouponsTable20240909122031 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'coupons',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36', // UUID will be inserted by the application or query
            isPrimary: true,
          },
          { name: 'code', type: 'varchar', isNullable: false, isUnique: true },
          { name: 'amount', type: 'float', default: 1 },
          { name: 'description', type: 'json', isNullable: true },
          { name: 'status', type: 'json', isNullable: false },
          { name: 'expire', type: 'timestamp', isNullable: true },
          { name: 'qrCode', type: 'varchar', isNullable: true },
          { name: 'link', type: 'varchar', isNullable: true },
          { name: 'usedCount', type: 'integer', default: 0 },
          { name: 'likeCount', type: 'integer', default: 0 },
          { name: 'dislikeCount', type: 'integer', default: 0 },
          { name: 'isDeleted', type: 'boolean', default: false },
          { name: 'createdById', type: 'char', length: '36', isNullable: true },
          { name: 'updatedById', type: 'char', length: '36', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'coupons',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'coupons',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('coupons');
    const foreignKeys = table?.foreignKeys.filter(
      fk => fk.columnNames.includes('createdById') || fk.columnNames.includes('updatedById'),
    );
    if (foreignKeys) {
      await Promise.all(foreignKeys.map((fk) => queryRunner.dropForeignKey('coupons', fk)));
    }
    await queryRunner.dropTable('coupons');
  }
}
