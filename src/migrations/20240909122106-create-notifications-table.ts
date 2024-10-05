import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateNotificationsTable20240909122106
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36', // UUID will be inserted by the application or query
            isPrimary: true,
          },
          { name: 'title', type: 'json', isNullable: false },
          { name: 'body', type: 'json', isNullable: false },
          { name: 'isWatched', type: 'boolean', default: false },
          { name: 'userId', type: 'char', length: '36', isNullable: true },
          { name: 'createdById', type: 'char', length: '36', isNullable: true },
          {
            name: 'sendAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('notifications');
    const foreignKeys = table?.foreignKeys.filter(
      (fk) =>
        fk.columnNames.includes('createdById') ||
        fk.columnNames.includes('userId'),
    );
    if (foreignKeys) {
      await Promise.all(
        foreignKeys.map((fk) =>
          queryRunner.dropForeignKey('notifications', fk),
        ),
      );
    }
    await queryRunner.dropTable('notifications');
  }
}
