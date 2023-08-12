import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV || 'local';
dotenv.config({
  path: `.env.${NODE_ENV}`,
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrations: ['src/database/migrations/*{.ts,.js}'],
  logging: true,
  ssl: {
    ca: process.env.SSL_CERT,
  },
});
