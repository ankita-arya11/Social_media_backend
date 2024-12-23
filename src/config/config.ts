import dotenv from 'dotenv';
dotenv.config();

export interface DBConfig {
  host: string;
  username: string;
  password: string;
  database: string;
  dialect: 'postgres';
  port: number;
}

const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'social_hiteshi',
    dialect: 'postgres',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  },
};

export default config;
