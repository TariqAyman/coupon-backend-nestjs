import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUserTokensTable20240929122107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_tokens',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36', // UUID will be inserted by the application or query
            isPrimary: true,
          },
          { name: 'userId', type: 'char', length: '36' },
          {
            name: 'token',
            type: 'text',
          },
          {
            name: 'os',
            type: 'varchar',
          },
          {
            name: 'osVersion',
            type: 'varchar',
          },
          {
            name: 'model',
            type: 'varchar',
          },
          {
            name: 'country',
            type: 'varchar',
          },
          {
            name: 'location',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'topics',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: true,
          },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'user_tokens',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('upload_media');
    const foreignKeys = table?.foreignKeys.filter((fk) =>
      fk.columnNames.includes('userId'),
    );
    if (foreignKeys) {
      await Promise.all(
        foreignKeys.map((fk) => queryRunner.dropForeignKey('user_tokens', fk)),
      );
    }
    await queryRunner.dropTable('user_tokens');
  }
}
