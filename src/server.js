import express from 'express';
import cors from 'cors';
import { db } from './database/databaseConnection.js';
import { QueryTypes } from 'sequelize';

export const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.get('/', async (_req, res) => {
    res.status(200).json('hej');
  });
  app.get('/health', async (_req, res) => {
    res.status(200).json('Im healthy!');
  });
  app.get('/what', async(_req, res) => {
    const result = await db.query(
      `SELECT 
      user_id,
      is_finished,
      faults,
      CAST(timestamp_started AS DATE),
      CAST(timestamp_finished AS DATE),
      correct_diagnosis,
      nbr_of_tests_performed,
      medical_case.name as "Case name",
      published,
      medical_field.name as "medical field name"
      FROM attempt
      left outer join medical_case on attempt.case_id = medical_case.id
      left outer join medical_field on medical_case.medical_field_id = medical_field.id
      `,
      { type: QueryTypes.SELECT },
    );
    res.status(200).json(result);
  })
  return app;
}