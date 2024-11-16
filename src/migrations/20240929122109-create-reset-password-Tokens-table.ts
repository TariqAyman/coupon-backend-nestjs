import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateResetPasswordTokensTable20240929122109
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_EMAIL',
        columnNames: ['email'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'reset_password_tokens',
        columns: [
          {
            name: 'email',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'reset_token',
            type: 'varchar',
          },
          {
            name: 'expires_at',
            type: 'timestamp',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'reset_password_tokens',
      new TableForeignKey({
        columnNames: ['email'],
        referencedColumnNames: ['email'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');

    const table = await queryRunner.getTable('reset_password_tokens');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('email') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('reset_password_tokens', foreignKey);
    }
    await queryRunner.dropTable('reset_password_tokens');
  }
}
