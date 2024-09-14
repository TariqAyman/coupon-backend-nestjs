import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateJunctionTables20240909122216 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      {
        name: 'category_locations',
        columns: ['category_id', 'location_id'],
        referencedTables: ['categories', 'locations'],
      },
      {
        name: 'brand_categories',
        columns: ['brand_id', 'category_id'],
        referencedTables: ['brands', 'categories'],
      },
      {
        name: 'brand_locations',
        columns: ['brand_id', 'location_id'],
        referencedTables: ['brands', 'locations'],
      },
      {
        name: 'user_followed_brands',
        columns: ['user_id', 'brand_id'],
        referencedTables: ['users', 'brands'],
      },
      {
        name: 'user_followed_coupons',
        columns: ['user_id', 'coupon_id'],
        referencedTables: ['users', 'coupons'],
      },
      {
        name: 'coupon_locations',
        columns: ['coupon_id', 'location_id'],
        referencedTables: ['coupons', 'locations'],
      },
      {
        name: 'coupon_categories',
        columns: ['coupon_id', 'category_id'],
        referencedTables: ['coupons', 'categories'],
      },
      {
        name: 'coupon_brands',
        columns: ['coupon_id', 'brand_id'],
        referencedTables: ['coupons', 'brands'],
      },
      {
        name: 'user_favorite_coupons',
        columns: ['user_id', 'coupon_id'],
        referencedTables: ['users', 'coupons'],
      },
      {
        name: 'user_liked_coupons',
        columns: ['user_id', 'coupon_id'],
        referencedTables: ['users', 'coupons'],
      },
      {
        name: 'user_disliked_coupons',
        columns: ['user_id', 'coupon_id'],
        referencedTables: ['users', 'coupons'],
      },
      {
        name: 'user_notifications',
        columns: ['user_id', 'notification_id'],
        referencedTables: ['users', 'notifications'],
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
              isNullable: false,
            },
          ],
        }),
        true,
      );

      await queryRunner.createPrimaryKey(table.name, table.columns);

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
      'category_locations',
      'brand_categories',
      'brand_locations',
      'user_followed_brands',
      'user_followed_coupons',
      'coupon_locations',
      'coupon_categories',
      'coupon_brands',
      'user_favorite_coupons',
      'user_liked_coupons',
      'user_disliked_coupons',
      'user_notifications',
    ];

    for (const tableName of tables) {
      await queryRunner.dropTable(tableName);
    }
  }
}
