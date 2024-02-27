import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const connectToDatabase = async () => {
  const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
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
