import { Sequelize, Dialect } from 'sequelize';
import config, { DBConfig } from '../config/config';

// Destructure the database configuration from the config file
const { database, username, password, host, dialect, port }: DBConfig =
  config.db;

// Initialize Sequelize with the database configuration
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  port,
});

// Test the database connection
const testDbConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testDbConnection();

export default sequelize;
