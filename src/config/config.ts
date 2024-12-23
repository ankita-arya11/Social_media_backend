import { config } from './index';

export interface DBConfig {
  host: string;
  username: string;
  password: string;
  database: string;
  dialect: 'postgres';
  port: number;
}

const DBConfig: { db: DBConfig } = {
  db: {
    host: config.DB_HOST || 'localhost',
    username: config.DB_USER || 'postgres',
    password: config.DB_PASSWORD || 'root',
    database: config.DB_NAME || 'social_hiteshi',
    dialect: 'postgres',
    port: config.DB_PORT ? parseInt(config.DB_PORT, 10) : 5432,
  },
};

export default DBConfig;
