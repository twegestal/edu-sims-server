import express from 'express';
import * as object from '../models/object_index.js';
import { ForeignKeyConstraintError } from 'sequelize';
import { ConsoleResponses, HTTPResponses } from '../utils/serverResponses.js';

export const treatmentRouter = () => {
  const router = express();

/**
 * @access: /api/treatment
 * @method: GET
 * @description: Route for retrieving treatments pertaining
 *               to a specific category or sub-category
 * @argument {
 *    treatmentSubtypeId : string
 *    treatmentTypeId : string
 * }
 * @return {
 *    result : TreatmentList[] { Filtered on treatment type or treatment subtype }
 * }
 */
  router.get('/', async (req, res, _next) => {
    try {
      let whereClause = {};
      const treatmentSubtypeId = req.query.treatment_subtype_id;
      const treatmentTypeId = req.query.id;

      if (treatmentSubtypeId) {
        whereClause = { where: { treatment_subtype_id: treatmentSubtypeId } };
      } else if (treatmentTypeId) {
        whereClause = { where: { treatment_type_id: treatmentTypeId } };
      }
      const treatments = await object.treatment_list.findAll(whereClause);
      if (!treatments) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      res.status(200).json(treatments);
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/treatment
 * @method: POST
 * @description: Route for adding a new treatment
 * @argument {
 *    name : string
 *    subtypeId : string
 *    treatmentId : string
 * }
 * @return {
 *    result : HTTPStatus
 * }
 */
  router.post('/', async (req, res, _next) => {
    try {
      const { name, subtypeId, treatmentId } = req.body;
      if (subtypeId && treatmentId && name) {
        const exists = await object.treatment_list.findOne(
            { where : { name : name } }
        )
        if(exists === null) {
            const response = await object.treatment_list.create({
              name: name,
              treatment_type_id: treatmentId,
              treatment_subtype_id: subtypeId,
            });
            if (!response) {
              return res.status(400).json(HTTPResponses.Error[400]);
            }
            res.status(201).send(response);
        }
        return res.status(400).json(HTTPResponses.Error[400]);
      } else {
        res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/treatment
 * @method: PATCH
 * @description: Route for changing the name of a treatment
 * @argument {
 *    id : string
 *    name : string
 * }
 * @return {
 *    result : HTTPStatus
 * }
 */
  router.patch('/', async (req, res, _next) => {
    try {
      const { id, newName } = req.body;
      if (id && newName) {
        const result = await object.treatment_list.update({ name: newName }, { where: { id: id } });
        if (result > 0) {
          return res.status(200).json(HTTPResponses.Success[200]);
        }
        return res.status(500).json(HTTPResponses.Error[500]);
      } else {
        res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/treatment
 * @method: DELETE
 * @description: Route for deleting a treatment
 * @argument {
 *    id : string
 * }
 * @return {
 *    result : HTTPStatus
 * }
*/
  router.delete('/', async (req, res, _next) => {
    try {
      const { id } = req.body;
      const result = await object.treatment_list.destroy({ where: { id: id } });
      if (result) {
        return res.status(200).json(HTTPResponses.Success[200]);
      } else {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(409).json(HTTPResponses.Error[409]);
      } else {
        console.error(ConsoleResponses.DELETE_ERROR, error);
        res.status(500).json(HTTPResponses.Error[500]);
      }
    }
  });

/**
 * @access: /api/type
 * @method: GET
 * @description: Route for retrieving treatment types
 * @return {
 *    response : TreatmentType[]
 * }
*/
  router.get('/type', async (_req, res, _next) => {
    try {
      const result = await object.treatment_type.findAll({ order: [['name', 'ASC']] });
      res.status(200).send(result);
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/type
 * @method: POST
 * @description: Route for adding a treatment type
 * @argument {
*    name : string
* }
* @return {
*    response : TreatmentType
* }
*/

  router.post('/type', async (req, res, _next) => {
    const { name } = req.body;
    try {
      if (name) {
        const exists = await object.treatment_type.findOne({
            where: {
                name : name
            }
        })
        if(exists === null) {
            const response = await object.treatment_type.create({ name: name });
            if (!response) {
              return res.status(500).json(HTTPResponses.Error[500]);
            }
            return res.status(201).send(response);
        }
        return res.status(400).json(HTTPResponses.Error[400])
      } else {
        res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/type
 * @method: PATCH
 * @description: Route for adding a treatment type
 * @argument {
 *    id : string
 *    name : string
 * }
 * @return {
 *    response : TreatmentType
 * }
 */
  router.patch('/type', async (req, res, _next) => {
    try {
      const { id, name } = req.body;
      if (!id || !name) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const treatmentType = await object.treatment_type.findOne({ where: { id: id } });
      if (!treatmentType) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      const response = await treatmentType.update({ name: name });
      if (!response) {
        return res.status(500).json(HTTPResponses.Error[500]);
      }
      return res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/type
 * @method: DELETE
 * @description: Route for deleting a treatment type
 * @argument {
 *    id : string
 * }
 * @return {
 *    response : HTTPStatus
 * }
 */
  router.delete('/type', async (req, res, _next) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const response = await object.treatment_type.destroy({ where: { id: id } });
      if (!response) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }

      return res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      console.error(ConsoleResponses.DELETE_ERROR, error);
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(409).json(HTTPResponses.Error[409]);
      }
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/subtype
 * @method: GET
 * @description: Route for retrieving a specific subtype when given an ID,
 *               or all subtypes if not.
 * @argument {
 *    id : string
 * }
 * @return {
 *    response : TreatmentSubtype || TreatmentSubtype[]
 * }
 */
  router.get('/subtype', async (req, res, _next) => {
    try {
      const id = req.query.id;
      const whereClause = id ? { where: { treatment_type_id: id } } : {};
      const response = await object.treatment_subtype.findAll(whereClause);
      if (response) {
        return res.status(200).send(response);
      }
      return res.status(404).json(HTTPResponses.Error[404]);
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/subtype
 * @method: POST
 * @description: Route for adding a treatment subtype
 * @argument {
 *    id : string
 *    name : string
 * }
 * @return {
 *    response : TreatmentSubtype
 * }
 */
  router.post('/subtype', async (req, res, _next) => {
    try {
      const { name, id } = req.body;
      if (name && id) {
        const exists = await object.treatment_subtype.findOne({
            where : {
                name : name,
                treatment_type_id: id
            }
        })
        if(exists === null) {
            const response = await object.treatment_subtype.create({
              name: name,
              treatment_type_id: id,
            });
            if (!response) {
              return res.status(400).json(HTTPResponses.Error[400]);
            }
            return res.status(201).send(response);
        }
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      res.status(400).json(HTTPResponses.Error[400]);
    } catch (error) {
      console.error(ConsoleResponses.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/subtype
 * @method: PATCH
 * @description: Route for modifying a treatment subtype
 * @argument {
 *    id : string
 *    name : string
 * }
 * @return {
 *    response : HTTPStatus
 * }
 */
  router.patch('/subtype', async (req, res, _next) => {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).json(HTTPResponses.Error[400]);
    }
    try {
      const treatmentSubtype = await object.treatment_subtype.findOne({ where: { id: id } });
      if (!treatmentSubtype) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      const result = await treatmentSubtype.update({ name: name });
      if (!result) {
        return res.status(500).json(HTTPResponses.Error[500]);
      }
      return res.status(201).json(HTTPResponses.Success[201]);
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/subtype
 * @method: DELETE
 * @description: Route for removing a treatment subtype
 * @argument {
 *    id : string
 * }
 * @return {
 *    response : HTTPStatus
 * }
 */
  router.delete('/subtype', async (req, res, _next) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json(HTTPResponses.Error[400]);
    }
    try {
      const response = await object.treatment_subtype.destroy({ where: { id: id } });
      if (!response) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      return res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(409).json(HTTPResponses.Error[409]);
      }
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  return router;
};
