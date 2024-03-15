import { Router } from 'express';
import * as object from '../models/object_index.js';
import { Op, QueryTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';
import { ConsoleResponses, HTTPResponses } from '../utils/serverResponses.js';

/**
 * This file defines a set of routes used for the application statistics
 */

export const statisticsRouter = () => {
  const router = Router();

/**
 * @access: /api/statistics/count/users
 * @method: GET
 * @description: Route which returns a single integer representing the amount of users
 *               which are currently registered.
 * @argument {
 *    null
 * }
 * @return {
 *    result : number
 * }
 */
  router.get('/count/users', async (_req, res, _next) => {
    try {
      const amount = await object.end_user.count({
        where: { email: { [Op.ne]: 'DeletedUser' } },
      });
      res.status(200).json(amount);
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/statistics/count/recent-activity
 * @method: GET
 * @description: Route which returns a single integer representing the amount of users
 *               which have logged in past a date
 * @argument {
*    startDate : date { Format: YYYY-MM-DD }
* }
* @return {
*    result : number
* }
*/
  router.get('/count/recent-activity', async (req, res, _next) => {    
    try {
      const startDate = req.query.startdate
      if (!startDate) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const amount = await object.end_user.count({
        where: { last_login: { [Op.gt]: startDate } },
      });
      res.status(200).json(amount);
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/statistics/cases
 * @method: GET
 * @description: Route which returns a long list of cases. 
 * @argument {
*    null
* }
* @return {
*   Some sort of data structure : Case[]
* }
*/
  router.get('/cases', async (_req, res, _next) => {
    try {
      const result = await db.query(
        `SELECT 
        user_id,
        is_finished,
        faults,
        CAST(timestamp_started AS DATE),
        CAST(timestamp_finished AS DATE),
        correct_diagnosis,
        nbr_of_tests_performed,
        medical_case.name as "Case name",
        published,
        medical_field.name as "medical field name"
        FROM attempt
        left outer join medical_case on attempt.case_id = medical_case.id
        left outer join medical_field on medical_case.medical_field_id = medical_field.id
        `,
        { type: QueryTypes.SELECT },
      );
      res.status(200).json(result);
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });
  
  return router;
};
