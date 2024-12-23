export interface DBConfig {
  host: string;
  username: string;
  password: string;
  database: string;
  dialect: 'postgres';
  port: number;
}

const config: { db: DBConfig } = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'practice_user1',
    password: process.env.DB_PASSWORD || 'practice_password1',
    database: process.env.DB_NAME || 'practice_db1',
    dialect: 'postgres',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  },
};

export default config;
