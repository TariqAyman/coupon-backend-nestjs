import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRefreshTokensTable20240929122111
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'access_tokens',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36', // UUID will be inserted by the application or query
            isPrimary: true,
          },
          {
            name: 'identifier',
            type: 'varchar',
          },
          {
            name: 'accessToken',
            type: 'text',
          },
          {
            name: 'refreshToken',
            type: 'text',
          },
          {
            name: 'userId',
            type: 'varchar',
          },
          {
            name: 'deviceIP',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'deviceName',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'deviceLocation',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'expiration',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'refreshExpiration',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('access_tokens');
  }
}
