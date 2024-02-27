import express from 'express';
import { HTTPResponses } from '../utils/serverResponses.js';
import * as db from '../models/object_index.js';

export const userRouter = () => {
  const router = express.Router();

  router.patch('/logout', async (req, res, _next) => {
    const id = req.id;

    if (!id) {
      return res.status(400).json(HTTPResponses.Error[400]);
    }

    try {
      const user = await db.end_user.findOne({ where: { id: id }});
      if (user === null) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      user.refresh_token = null;
      await user.save();
      res.status(200).json(HTTPResponses.Success[200]);
      await user.save();
    } catch (error) {
      console.error('Error in logout ', error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  return router;
}