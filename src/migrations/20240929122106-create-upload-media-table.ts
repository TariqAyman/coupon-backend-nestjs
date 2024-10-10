import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUploadMediaTable20240929122106
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'upload_media',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36', // UUID will be inserted by the application or query
            isPrimary: true,
          },
          {
            name: 'url',
            type: 'varchar',
            isNullable: true,
          },
          { name: 'filename', type: 'varchar', isNullable: true },
          { name: 'path', type: 'varchar', isNullable: true },
          { name: 'mimetype', type: 'varchar', isNullable: true },
          { name: 'size', type: 'integer', isNullable: true },
          { name: 'entityType', type: 'varchar', isNullable: true },
          { name: 'entityId', type: 'char', length: '36', isNullable: true },
          { name: 'createdById', type: 'char', length: '36', isNullable: true },
          { name: 'updatedById', type: 'char', length: '36', isNullable: true },
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
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'upload_media',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'upload_media',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('upload_media');
    const foreignKeys = table?.foreignKeys.filter(
      (fk) =>
        fk.columnNames.includes('createdById') ||
        fk.columnNames.includes('updatedById'),
    );
    if (foreignKeys) {
      await Promise.all(
        foreignKeys.map((fk) => queryRunner.dropForeignKey('upload_media', fk)),
      );
    }
    await queryRunner.dropTable('upload_media');
  }
}
