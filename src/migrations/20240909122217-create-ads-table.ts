import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAdsTable120240909122217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ads',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36', // UUID will be inserted by the application or query
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'link',
            type: 'varchar',
          },
          {
            name: 'image',
            type: 'varchar',
            isNullable: true,
          },
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
      'ads',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'ads',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const adsTable = await queryRunner.getTable('ads');
    if (adsTable) {
      const createdByForeignKey = adsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('createdById') !== -1,
      );
      const updatedByForeignKey = adsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('updatedById') !== -1,
      );
      if (createdByForeignKey) {
        await queryRunner.dropForeignKey('ads', createdByForeignKey);
      }
      if (updatedByForeignKey) {
        await queryRunner.dropForeignKey('ads', updatedByForeignKey);
      }
      await queryRunner.dropTable('ads');
    }
  }
}
