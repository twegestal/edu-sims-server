import express from 'express';
import * as db from '../models/object_index.js';
import { comparePasswords, hashPassword } from '../utils/auth/encryption.js';
import { createRefreshCookie, createToken } from '../utils/auth/jwtHandler.js';
import { HTTPResponses } from '../utils/serverResponses.js';

/**
 * @access: /api/auth/
 * @description Router as defined by Express. 
 * @returns: Router for all end-points concerning authentication
 */

export const authRouter = () => {
  const router = express.Router();
  /**
   * @access: /api/auth/login
   * @method: POST
   * @description: Login-function for both super-user and user.
   * @argument {
   *    email : string
   *    password : string
   * }
   * @return {
   *    email : string
   *    token : string
   *    isAdmin : boolean
   * }
   */

  router.post('/login', async (req, res, _next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json(HTTPResponses.Error[400]);
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
        return res.status(404).json('Le kuk');
      }
      const token = createToken(user.id);
      const refreshToken = createRefreshCookie(user.id);
      user.refresh_token = refreshToken;
      user.last_login = Date();
      await user.save();

      res
        .cookie('refresh-token', refreshToken, { httpOnly: true, sameSite: 'strict' })
        .status(200)
        .send({
          email: user.email,
          token: token,
          isAdmin: user.is_admin,
        });
    } catch (error) {
      console.error('Error login: ', error);
      res.status(500).json('Something went wrong');
    }
  });

  /**
   * @access: /api/auth/register
   * @method: POST
   * @description: Register for end-users only. 
   * @argument {
   *    email : string
  *     token : string
  *     group_id : string
   * }
   * @return {
   *    id : string,
   *    message : string
   * }
   */

  router.post('/register', async (req, res, _next) => {
    const { email, password, group_id } = req.body;

    if (!email || !password || !group_id) {
      return res.status(400).json(HTTPResponses.Error[400]);
    }
    try {
      const result = await db.end_user.findOne({
        where: {
          email: email,
        },
      });
      if (result) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const groupIdResult = await db.user_group.findOne({
        where: {
          registration_link: group_id,
          is_active: true,
        }
      });
      if (!groupIdResult) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      const hashedPassword = await hashPassword(password);
      const user = await db.end_user.create({
        group_id: group_id,
        email: email,
        password: hashedPassword,
        is_admin: false,
      });
      res.status(201).send({
        id: user.id,
        message: 'Registration successful',
      });

    } catch (error) {
      console.error('Error registering user', error);
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  /**
   * @access: /api/auth/refresh-token
   * @method: GET
   * @description: Authorization with refresh token found in cookies from request
   * @argument {
   *    none
   * }
   * @return {
   *    email : string,
   *    token : string,
   *    isAdmin : boolean
   * }
   */

  router.get('/refresh-token', async (req, res, _next) => {
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) {
      return res.status(400).json(HTTPResponses.Error[400]);
    }

    try {
      const userId = await validateRefreshToken(refreshToken);
      if (userId === null) {
        return res.status(401).json(HTTPResponses.Error[401]);
      }

      const user = await db.end_user.findOne({
        where: {
          id: userId,
        },
      });

      if (user === null) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      const token = createToken(user.id);
      res.status(200).send({
        email: user.email,
        token: token,
        isAdmin: user.is_admin,
      });
    } catch (error) {
      if (error.message === 'Invalid refresh token') {
        res.status(401).json('Token expired');
      } else {
        res.status(500).json(HTTPResponses.Error[500]);
      }
    }
  });
  return router;
}