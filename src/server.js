import express from 'express';
import cors from 'cors';

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

  return app;
}