import express from 'express';
import * as db from '../models/object_index.js';
import { comparePasswords } from '../utils/encryption.js';
import { createRefreshCookie, createToken } from '../utils/jwtHandler.js';

export const authRouter = () => {
  const router = express.Router();

  router.post('/login', async (req, res, _next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json('Missing body');
    }
    try {
      const user = await db.end_user.findOne({
        where: {
          email: email,
        },
      });
      
      if (user === null) {
        return res.status(404).send({ message: 'Username or password incorrect' });
      }

      const compareResult = await comparePasswords(password, user.password);

      if (!compareResult) {
        return res.status(404).json('Username or password incorrect');
      }

      const token = createToken(user.id);
      const refreshToken = createRefreshCookie(user.id);
      user.refresh_token = refreshToken;
      user.last_login = Date();
      await user.save();

      res
          .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
          .status(200)
          .send({
            id: user.id,
            email: user.email,
            token: token,
            isAdmin: user.is_admin,
          });

    } catch (error) {
      console.error('Error login: ', error);
      res.status(500).json('Something went wrong');
    }
  });

  return router;
}