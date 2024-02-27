import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/authRouter.js';
import { validateToken } from './utils/jwtHandler.js';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/userRouter.js';

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
  app.use('/user', userRouter());
  return app;
};
