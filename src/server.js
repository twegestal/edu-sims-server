import express from 'express';

export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.get('/', async (_req, res) => {
    res.status(200).json('hej');
  })

  return app;
}