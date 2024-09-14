import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { Ads } from 'src/ads/entities/ad.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

const result = dotenvConfig({ path: '.env' });

const databaseConfig = {
  type: 'mysql',
  host: `${process.env.DATABASE_HOST}`,
  port: parseInt(`${process.env.DATABASE_PORT}`),
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Adjust path as necessary
  migrations: ['dist/migrations/*.js'],
  subscribers: ['dist/subscribers/*.js'],
  autoLoadEntities: true,
  synchronize: false,
  logging: `${process.env.NODE_ENV}` === 'development',
  cli: {
    entitiesDir: 'dist/**/entities',
    migrationsDir: 'dist/migrations',
    subscribersDir: 'dist/subscribers',
  },
};

if (result.error) {
  console.error('Error loading .env file', result.error);
} else {
  console.log('.env file loaded successfully');
  console.log(databaseConfig);
}

export default registerAs('databaseConfig', () => databaseConfig);

export const connectionSource = new DataSource(
  databaseConfig as DataSourceOptions,
);
