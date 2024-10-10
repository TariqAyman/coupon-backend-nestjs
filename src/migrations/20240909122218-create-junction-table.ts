import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateJunctionTables20240909122218 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      {
        name: 'category_countries',
        columns: ['categoryId', 'countryId'],
        referencedTables: ['categories', 'countries'],
      },
      {
        name: 'brand_categories',
        columns: ['brandId', 'categoryId'],
        referencedTables: ['brands', 'categories'],
      },
      {
        name: 'brand_countries',
        columns: ['brandId', 'countryId'],
        referencedTables: ['brands', 'countries'],
      },
      {
        name: 'user_followed_brands',
        columns: ['userId', 'brandId'],
        referencedTables: ['users', 'brands'],
      },
      {
        name: 'user_followed_coupons',
        columns: ['userId', 'couponId'],
        referencedTables: ['users', 'coupons'],
      },
      {
        name: 'coupon_countries',
        columns: ['couponId', 'countryId'],
        referencedTables: ['coupons', 'countries'],
      },
      {
        name: 'coupon_categories',
        columns: ['couponId', 'categoryId'],
        referencedTables: ['coupons', 'categories'],
      },
      {
        name: 'coupon_brands',
        columns: ['couponId', 'brandId'],
        referencedTables: ['coupons', 'brands'],
      },
      {
        name: 'user_favorite_coupons',
        columns: ['userId', 'couponId'],
        referencedTables: ['users', 'coupons'],
      },
      {
        name: 'user_liked_coupons',
        columns: ['userId', 'couponId'],
        referencedTables: ['users', 'coupons'],
      },
      {
        name: 'user_disliked_coupons',
        columns: ['userId', 'couponId'],
        referencedTables: ['users', 'coupons'],
      },
      {
        name: 'ads_countries',
        columns: ['adsId', 'countryId'],
        referencedTables: ['ads', 'countries'],
      },
    ];

    for (const table of tables) {
      await queryRunner.createTable(
        new Table({
          name: table.name,
          columns: [
            ...table.columns.map((column) => ({
              name: column,
              type: 'char',
              length: '36',
              isNullable: false,
            })),
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
          ],
        }),
        true,
      );

      // await queryRunner.createPrimaryKey(table.name, table.columns);

      for (let i = 0; i < table.columns.length; i++) {
        const column = table.columns[i];
        const referencedTable = table.referencedTables[i];
        await queryRunner.createForeignKey(
          table.name,
          new TableForeignKey({
            name: `${table.name}_${column}_foreign_key`,
            columnNames: [column],
            referencedColumnNames: ['id'],
            referencedTableName: referencedTable,
            onDelete: 'CASCADE',
          }),
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'category_countries',
      'brand_categories',
      'brand_countries',
      'user_followed_brands',
      'user_followed_coupons',
      'coupon_countries',
      'coupon_categories',
      'coupon_brands',
      'user_favorite_coupons',
      'user_liked_coupons',
      'user_disliked_coupons',
      'ads_countries',
    ];

    for (const tableName of tables) {
      await queryRunner.dropTable(tableName);
    }
  }
}
