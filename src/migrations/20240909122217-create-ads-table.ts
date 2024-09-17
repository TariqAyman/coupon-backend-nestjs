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
        name: 'ads_locations',
        columns: [
          {
            name: 'ads_id',
            type: 'char',
            length: '36',
            isNullable: false,
          },
          {
            name: 'location_id',
            type: 'char',
            length: '36',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'ads_locations',
      new TableForeignKey({
        columnNames: ['ads_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ads',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'ads_locations',
      new TableForeignKey({
        columnNames: ['location_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'locations',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const adsLocationsTable = await queryRunner.getTable('ads_locations');
    if (adsLocationsTable) {
      const adsForeignKey = adsLocationsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('ads_id') !== -1,
      );
      const locationForeignKey = adsLocationsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('location_id') !== -1,
      );
      if (adsForeignKey) {
        await queryRunner.dropForeignKey('ads_locations', adsForeignKey);
      }
      if (locationForeignKey) {
        await queryRunner.dropForeignKey('ads_locations', locationForeignKey);
      }
      await queryRunner.dropTable('ads_locations');
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
