import express from 'express';
import { HTTPResponses } from '../utils/serverResponses.js';
import * as db from '../models/object_index.js';

/**
 * @access: /api/user/
 * @description Router as defined by Express.
 * @returns: Router for all user endpoints
 */
export const userRouter = () => {
  const router = express.Router();

  /**
   * @access: /api/user/logout
   * @method: PATCH
   * @description: Logout-function that removes a users refresh token from the database
   */
  router.patch('/logout', async (req, res, _next) => {
    const id = req.id;

    if (!id) {
      return res.status(400).json(HTTPResponses.Error[400]);
    }

    try {
      const user = await db.end_user.findOne({ where: { id: id } });
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
};
