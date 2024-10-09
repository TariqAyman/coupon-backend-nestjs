import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { ActionByUserSubscriber } from '../common/subscribers/action-by-user.subscriber';
import { DataSource, DataSourceOptions } from 'typeorm';

const result = dotenvConfig({ path: '.env' });

const databaseConfig = {
  type: 'mysql',
  host: `${process.env.DATABASE_HOST}`,
  port: parseInt(`${process.env.DATABASE_PORT}`),
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
  subscribers: [ActionByUserSubscriber],
  autoLoadEntities: true,
  synchronize: false,
  logging: `${process.env.NODE_ENV}` === 'development',
  logger: 'advanced-console',
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
}

export default registerAs('databaseConfig', () => databaseConfig);

export const connectionSource = new DataSource(
  databaseConfig as DataSourceOptions,
);
