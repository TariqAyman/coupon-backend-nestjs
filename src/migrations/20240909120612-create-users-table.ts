import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable20240909120612 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36', // UUID will be inserted by the application or query
            isPrimary: true,
          },
          { name: 'fullName', type: 'varchar', isNullable: false },
          { name: 'email', type: 'varchar', isNullable: false, isUnique: true },
          { name: 'password', type: 'varchar', isNullable: false },
          { name: 'changePasswordTime', type: 'timestamp', isNullable: true },
          { name: 'phoneNumber', type: 'varchar', isNullable: true },
          { name: 'countryCode', type: 'varchar', isNullable: true },
          {
            name: 'role',
            type: 'enum',
            enum: ['User', 'Admin', 'Employee'],
            default: "'User'",
          },
          { name: 'confirmAccount', type: 'boolean', default: true },
          {
            name: 'status',
            type: 'enum',
            enum: ['offline', 'online', 'blocked'],
            default: "'offline'",
          },
          { name: 'image', type: 'varchar', isNullable: true },
          { name: 'DOB', type: 'timestamp', isNullable: true },
          { name: 'joined', type: 'timestamp', isNullable: true },
          {
            name: 'gender',
            type: 'enum',
            enum: ['male', 'female'],
            isNullable: true,
          },
          {
            name: 'provider',
            type: 'enum',
            enum: ['system', 'facebook', 'GOOGLE'],
            default: "'system'",
          },

          { name: 'verificationCode', type: 'varchar', isNullable: true },
          {
            name: 'verificationCodeExpiresAt',
            type: 'timestamp',
            isNullable: true,
          },
          { name: 'isDeleted', type: 'boolean', default: false },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'lastLogin', type: 'timestamp', isNullable: true },
          { name: 'lastLogout', type: 'timestamp', isNullable: true },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
