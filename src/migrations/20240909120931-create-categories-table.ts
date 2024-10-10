import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCategoriesTable20240909120931 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36', // UUID will be inserted by the application or query
            isPrimary: true,
          },
          { name: 'name', type: 'json', isNullable: false },
          { name: 'slug', type: 'json', isNullable: false },
          { name: 'description', type: 'json', isNullable: true },
          { name: 'image', type: 'varchar', isNullable: true },
          { name: 'icon', type: 'varchar', isNullable: true },
          { name: 'color', type: 'varchar', isNullable: true },
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
      'categories',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'categories',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('categories');
    const foreignKeys = table?.foreignKeys.filter(
      (fk) =>
        fk.columnNames.includes('createdById') ||
        fk.columnNames.includes('updatedById'),
    );
    if (foreignKeys) {
      await Promise.all(
        foreignKeys.map((fk) => queryRunner.dropForeignKey('categories', fk)),
      );
    }
    await queryRunner.dropTable('categories');
  }
}
