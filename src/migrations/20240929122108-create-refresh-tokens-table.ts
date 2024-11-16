import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRefreshTokensTable20240929122108
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'refresh_tokens',
        columns: [
          {
            name: 'device_id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'refresh_token',
            type: 'varchar',
          },
          {
            name: 'device_ip',
            type: 'varchar',
          },
          {
            name: 'device_name',
            type: 'varchar',
          },
          {
            name: 'device_location',
            type: 'varchar',
          },
          {
            name: 'expiry',
            type: 'timestamp',
          },
          {
            name: 'tenant_id',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('refresh_tokens');
  }
}
