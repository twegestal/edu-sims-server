import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/authRouter.js';
import { validateToken } from './utils/jwtHandler.js';
import cookieParser from 'cookie-parser';

export const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use('/auth', authRouter());
  app.use(validateToken);
  return app;
};
