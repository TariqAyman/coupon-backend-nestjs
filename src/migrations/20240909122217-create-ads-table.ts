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
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
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

    await queryRunner.createTable(
      new Table({
        name: 'ads_countries',
        columns: [
          {
            name: 'ads_id',
            type: 'char',
            length: '36',
            isNullable: false,
          },
          {
            name: 'country_id',
            type: 'char',
            length: '36',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'ads_countries',
      new TableForeignKey({
        columnNames: ['ads_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ads',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'ads_countries',
      new TableForeignKey({
        columnNames: ['country_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'countries',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const adsCountriesTable = await queryRunner.getTable('ads_countries');
    if (adsCountriesTable) {
      const adsForeignKey = adsCountriesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('ads_id') !== -1,
      );
      const countryForeignKey = adsCountriesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('country_id') !== -1,
      );
      if (adsForeignKey) {
        await queryRunner.dropForeignKey('ads_countries', adsForeignKey);
      }
      if (countryForeignKey) {
        await queryRunner.dropForeignKey('ads_countries', countryForeignKey);
      }
      await queryRunner.dropTable('ads_countries');
    }

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
