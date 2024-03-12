import { Router } from 'express';
import { getTransaction } from '../database/databaseConnection.js';
import * as db from '../models/object_index.js';
import { insertSteps, updateSteps, deleteModules } from '../utils/databaseUtils.js';
import { fetchStepData } from '../utils/caseUtils.js';
import { ConsoleResponses, HTTPResponses } from '../utils/serverResponses.js';
import { validateCaseToPublish } from '../utils/validators/caseValidator.js';

/**
 * @access: /api/case/
 * @description Router as defined by Express.
 * @returns: Router for all end-points concerning cases
 */

export const caseRouter = () => {
  const router = Router();

  /**
   * @access: /api/case/
   * @method: GET
   * @description: Retrieves a specific case with ID as query param, all if no query param present
   * @param caseId : string
   * @return {
   *   https : Case[] || Case Object
   * }
   */
  router.get('/', async (req, res, _next) => {
    const caseId = req.query.caseId;
    if (caseId) {
      try {
        const medicalCase = await db.medical_case.findOne({
          where: {
            id: caseId,
          },
        });
        let steps = await db.step.findAll({
          where: {
            case_id: caseId,
          },
          order: [['index', 'ASC']],
        });
        steps = await fetchStepData(steps, medicalCase.medical_field_id);

        const caseObject = {
          name: medicalCase.name,
          caseId: caseId,
          steps: steps,
        };

        if (!medicalCase) {
          return res.status(404).json(HTTPResponses.Error[404]);
        }
        return res.status(200).send(caseObject);
      } catch (error) {
        console.error(ConsoleResponses.SERVER_ERROR, error);
        return res.status(500).json(HTTPResponses.Error[500]);
      }
    } else {
      try {
        const medicalCases = await db.medical_case.findAll();
        if (medicalCases.length < 1) {
          return res.status(404).json(HTTPResponses.Error[404]);
        }
        return res.status(200).send(medicalCases);
      } catch (error) {
        console.error(error);
        return res.status(500).json(HTTPResponses.Error[500]);
      }
    }
  });

  /**
   * @access: /api/case/
   * @method: DELETE
   * @description: Deletes a case from the database
   * @argument {
   *   caseId : string
   * }
   * @return {
   *   https : response { No data returned besides HTTP Status }
   * }
   */

  router.delete('/', async (req, res, _next) => {
    try {
      const { caseId } = req.body;
      if (!caseId) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const medicalCase = await db.medical_case.findOne({
        where: {
          id: caseId,
        },
      });
      if (!medicalCase) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      const response = await medicalCase.update({
        active: false,
      });
      if (!response) {
        return res.status(500).json(HTTPResponses.Error[500]);
      }
      return res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  /**
   * @access: /api/case/
   * @method: PATCH
   * @description: Updates an existing case
   * @argument {
   *   caseObject : JSON-object
   *   caseId : string,
   *   removedModules: Object[]
   * }
   * @return {
   *   https : response { No data returned besides HTTP Status }
   * }
   */

  router.patch('/', async (req, res, _next) => {
    let transaction = null;
    try {
      const { caseObject, caseId, removedModules } = req.body;
      if (!caseObject || !caseId) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      transaction = await getTransaction();

      const medicalCase = await db.medical_case.findOne({
        where: {
          id: caseId,
        },
      });

      if (!medicalCase) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }

      medicalCase.update(
        {
          name: caseObject.name,
          medical_field_id: caseObject.medical_field_id,
          creator_user_id: caseObject.creator_user_id,
        },
        { transaction: transaction },
      );
      await updateSteps(caseObject.steps, medicalCase.id, transaction);
      await deleteModules(removedModules);
      await transaction.commit();
      res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      console.error(ConsoleResponses.TRANSACTION_ERROR, error);
      await transaction.rollback();
      console.error(ConsoleResponses.TRANSACTION_ROLLBACK);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  /**
   * @access: /api/case/
   * @method: POST
   * @description: Creates a new case
   * @argument {
   *   caseObject : JSON-object
   * }
   * @return {
   *   https : response { No data returned besides HTTP Status }
   * }
   */

  router.post('/', async (req, res, _next) => {
    let transaction = null;
    try {
      const caseObject = req.body;
      if (!caseObject) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      transaction = await getTransaction();
      const existingMedicalCase = await db.medical_case.findOne({
        where: {
          name: caseObject.name,
        },
      });
      if (!existingMedicalCase) {
        const medicalCase = await db.medical_case.create(
          {
            name: caseObject.name,
            medical_field_id: caseObject.medical_field_id,
            creator_user_id: caseObject.creator_user_id,
            published: false,
          },
          { transaction: transaction },
        );

        await insertSteps(caseObject.steps, medicalCase.id, transaction);

        await transaction.commit();
        res.status(201).json(HTTPResponses.Success[201]);
      } else {
        res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.TRANSACTION_ERROR, error);
      await transaction.rollback();
      console.log(ConsoleResponses.TRANSACTION_ROLLBACK);
      res.status(500).send(HTTPResponses.Error[500]);
    }
  });

  /**
   * @access: /api/case/publish
   * @method: PATCH
   * @description: Updates the published status of a case
   * @argument {
   *   id : string,
   *   publish : boolean
   * }
   * @return {
   *   https : response { No data returned besides HTTP Status }
   * }
   */
  router.patch('/publish', async (req, res, next) => {
    try {
      const { id, publish } = req.body;
      if (!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      } else {
        const medicalCase = await db.medical_case.findOne({
          where: {
            id: id,
            published: !publish,
          },
        });
        if (!medicalCase) {
          return res.status(400).json(HTTPResponses.Error[400]);
        }
        const steps = await db.step.findAll({
          where: {
            case_id: medicalCase.id,
          },
        });
        const caseToValidate = {
          name: medicalCase.name,
          creator_user_id: medicalCase.creator_user_id,
          steps: steps,
          medical_field_id: medicalCase.medical_field_id,
        };
        const validationResult = validateCaseToPublish(caseToValidate);
        if (validationResult.success) {
          await medicalCase.update({
            published: publish,
          });
          return res.status(200).json(HTTPResponses.Success[200]);
        } else {
          return res.status(400).send(validationResult.errors);
        }
      }
    } catch (error) {
      console.error(ConsoleResponses.SERVER_ERROR, error);
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  /**
   * @access: /api/case/modules
   * @method: GET
   * @description: Returns all modules able to be added to a case
   * @argument {
   *   none
   * }
   * @return {
   *   response : Module[]
   * }
   */
  router.get('/modules', async (_req, res, _next) => {
    try {
      const response = await db.module_type.findAll();
      if (!response) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      res.status(200).send(response);
    } catch (error) {
      res.status(500).send(HTTPResponses.Error[500]);
    }
  });

  return router;
};
