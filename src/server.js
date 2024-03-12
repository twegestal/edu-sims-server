import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/authRouter.js';
import { caseRouter } from './routes/caseRouter.js';
import { validateToken } from './utils/auth/jwtHandler.js';
import { attemptRouter } from './routes/attemptRouter.js';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/userRouter.js';

/**
 * Server entry point
 * @returns server express instance with attached middleware
 */

export const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use('/auth', authRouter());
  app.use(validateToken);
  app.use('/case', caseRouter());
  app.use('/attempt', attemptRouter());
  app.use('/user', userRouter());
  return app;
};
