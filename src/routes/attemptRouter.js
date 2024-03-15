import { Router } from 'express';
import * as db from '../models/object_index.js';
import { sortAttempts } from '../utils/caseUtils.js';
import { ConsoleResponses, HTTPResponses } from '../utils/serverResponses.js';

/**
 * @access: /api/attempt/
 * @description Router as defined by Express.
 * @returns: Router for all end-points concerning case attempts
 */

export const attemptRouter = () => {
  const router = Router();

  /**
   * @access: /api/attempt
   * @method: GET
   * @description: Endpoint for providing a specific attempt when provided with an
   * attempt ID or all attempts concerning a specific user when provided a user ID.
   * @argument {
   *    userId : string
   *    attemptId : string
   * }
   * @return {
   *    result : attempt || attempt[]
   * }
   */
  router.get('/', async (req, res, _next) => {
    const userId = req.id;
    const attemptId = req.query.attemptId;

    try {
      if (attemptId) {
        const result = await db.attempt.findOne({ where: { id: attemptId } });
        if (!result) {
          return res.status(404).json(HTTPResponses.Error[404]);
        }
        return res.status(200).json(result);
      } else if (userId) {
        const result = await db.attempt.findAll({ where: { user_id: userId } });
        if (!result) {
          return res.status(404).json(HTTPResponses.Error[404]);
        }
        const sortedResults = sortAttempts(result);
        return res.status(200).json(sortedResults);
      } else {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.SERVER_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  /**
   * @access: /api/attempt
   * @method: POST
   * @description: Endpoint for creating a new attempt
   * @argument {
   *    userId : string
   *    caseId : string
   * }
   * @return {
   *    result : Attempt
   * }
   */
  router.post('/', async (req, res, _next) => {
    try {
      const { caseId } = req.body;
      const userId = req.id;
      if (!userId || !caseId) {
        res.status(404).json(HTTPResponses.Error[404]);
      } else {
        const result = await db.attempt.create({
          user_id: userId,
          case_id: caseId,
          is_finished: false,
        });
        if (!result) {
          return res.status(400).json(HTTPResponses.Error[400]);
        }
        res.status(200).send(result);
      }
    } catch (error) {
      console.error(ConsoleResponses.SERVER_ERROR);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  /**
   * @access: /api/attempt
   * @method: PATCH
   * @description: Endpoint for updating an existing attempt
   * @argument {
   *   attempt_id : string,
   *   is_finished : boolean,
   *   faults : number,
   *   timestamp_finished : Object { LocalTime }
   *   correct_diagnosis : boolean,
   *   nbr_of_tests_performed : number,
   *   examination_results : string[]
   *   feedback : string
   *   index : number
   * }
   * @return {
   *   https : response { No data returned besides HTTP Status }
   * }
   */
  router.patch('/', async (req, res, _next) => {
    const {
      attempt_id,
      is_finished,
      faults,
      timestamp_finished,
      correct_diagnosis,
      nbr_of_tests_performed,
      examination_results,
      feedback,
      index,
    } = req.body;

    if (!attempt_id) {
      return res.status(400).json(HTTPResponses.Error[400]);
    }

    if (Object.keys(timestamp_finished).length === 0) {
      try {
        const result = await db.attempt.update(
          {
            is_finished: is_finished,
            faults: faults,
            correct_diagnosis: correct_diagnosis,
            nbr_of_tests_performed: nbr_of_tests_performed,
            examination_results: examination_results,
            feedback: feedback,
            index: index,
          },
          {
            where: {
              id: attempt_id,
            },
          },
        );
        if (!result) {
          return res.status(400).json(HTTPResponses.Error[400]);
        }
        return res.status(200).json(HTTPResponses.Success[200]);
      } catch (error) {
        console.error(ConsoleResponses.SERVER_ERROR, error);
        return res.status(500).json(HTTPResponses.Error[500]);
      }
    } else {
      try {
        await db.attempt.update(
          {
            is_finished: is_finished,
            faults: faults,
            timestamp_finished: timestamp_finished,
            correct_diagnosis: correct_diagnosis,
            nbr_of_tests_performed: nbr_of_tests_performed,
            examination_results: examination_results,
            feedback: feedback,
            index: index,
          },
          {
            where: {
              id: attempt_id,
            },
          },
        );
        return res.status(200).json(HTTPResponses.Success[200]);
      } catch (error) {
        console.error(ConsoleResponses.SERVER_ERROR, error);
        return res.status(500).json(HTTPResponses.Error[500]);
      }
    }
  });

  return router;
};
