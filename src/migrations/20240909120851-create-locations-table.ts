import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCountriesTable20240909120851 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'countries',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36', // UUID will be inserted by the application or query
            isPrimary: true,
          },
          { name: 'name', type: 'varchar', isNullable: false },
          { name: 'countryCode', type: 'varchar', isNullable: false },
          { name: 'image', type: 'varchar', isNullable: true },
          {
            name: 'seoDescription',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'seoKeywords',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'ogTitle',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'ogDescription',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'ogImage',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'ogUrl',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'twitterCard',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'twitterTitle',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'twitterDescription',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'twitterImage',
            type: 'text',
            isNullable: true,
          },
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
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'countries',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'countries',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('countries');
    const foreignKeys = table?.foreignKeys.filter(
      (fk) =>
        fk.columnNames.includes('createdById') ||
        fk.columnNames.includes('updatedById'),
    );
    if (foreignKeys) {
      await Promise.all(
        foreignKeys.map((fk) => queryRunner.dropForeignKey('countries', fk)),
      );
    }
    await queryRunner.dropTable('countries');
  }
}
