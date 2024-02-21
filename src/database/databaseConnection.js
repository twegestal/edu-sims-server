import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const environment = process.env.DEV_ENVIRONMENT;

const getDBName = () => (environment === 'development' ? 'edu_sims_test' : process.env.DB_NAME);
const getDBUser = () => (environment === 'development' ? 'am6110' : process.env.DB_USER);
const getDBPassword = () => (environment === 'development' ? 'eky5mc9s' : process.env.DB_PASSWORD);
const getDBHost = () => (environment === 'development' ? 'pgserver.mau.se' : process.env.DB_HOST);
const getDBPort = () => (environment === 'development' ? 5432 : process.env.DB_PORT);

const connectToDatabase = async () => {
  const db = new Sequelize(getDBName(), getDBUser(), getDBPassword(), {
    host: getDBHost(),
    dialect: 'postgres',
    port: getDBPort(),
    pool: {
      max: 90,
      min: 0,
    },
  });

  return db;
};

export const getTransaction = async () => {
  const transaction = await db.transaction();

  return transaction;
};

export const db = await connectToDatabase();
