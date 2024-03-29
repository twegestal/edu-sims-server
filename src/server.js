import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/authRouter.js';
import { caseRouter } from './routes/caseRouter.js';
import { validateToken } from './utils/auth/jwtHandler.js';
import { attemptRouter } from './routes/attemptRouter.js';
import { userRouter } from './routes/userRouter.js';
import { treatmentRouter } from './routes/treatmentRouter.js';
import { diagnosisRouter } from './routes/diagnosisRouter.js';
import { medicalFieldRouter } from './routes/medicalFieldRouter.js';
import { statisticsRouter } from './routes/statisticsRouter.js';
import { examinationRouter } from './routes/examinationRouter.js';

/**
 * Server entry point
 * @returns server express instance with attached middleware
 */

export const createServer = () => {
  const app = express();

  app.use(cors({
    origin: process.env.CLIENT_DOMAIN,
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());
  app.use('/auth', authRouter());
  app.use(validateToken);
  app.use('/case', caseRouter());
  app.use('/attempt', attemptRouter());
  app.use('/treatment', treatmentRouter());
  app.use('/diagnosis', diagnosisRouter());
  app.use('/medical-field', medicalFieldRouter());
  app.use('/examination', examinationRouter());
  app.use('/statistics', statisticsRouter());
  app.use('/user', userRouter());
  return app;
};
