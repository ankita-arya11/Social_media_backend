import { Sequelize, Dialect } from 'sequelize';
import config from '../config/config';

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect as Dialect,
    port: config.db.port,
  }
);

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
