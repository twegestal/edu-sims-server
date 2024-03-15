import express from 'express';
import * as object from '../models/object_index.js';
import { ForeignKeyConstraintError } from 'sequelize';
import { ConsoleResponses, HTTPResponses } from '../utils/serverResponses.js';

export const examinationRouter = () => {
  const router = express();

/**
 * @access: /api/examination
 * @method: GET
 * @description: Route for retrieving a specific diagnosis when given
 *               an ID, or all if not.
 * @argument {
 *    id : string
 *    examinationSubtypeId : string
 * }
 * @return {
 *    result : Examination[]
 * }
 */
  router.get('/', async (req, res, _next) => {
    try {
      const examinationSubtypeId = req.query.examination_subtype_id
      const examinationTypeId = req.query.examination_type_id

      if (examinationSubtypeId) {
        const response = await object.examination_list.findAll({
          where: { examination_subtype_id: examinationSubtypeId },
          order: [['name', 'ASC']],
        });
        if (response) {
          return res.status(200).send(response);
        } else {
          return res.status(400).json(HTTPResponses.Error[400]);
        }
      } else if (examinationTypeId) {
        const response = await object.examination_list.findAll({
          where: { examination_type_id: examinationTypeId },
          order: [['name', 'ASC']]});
        if (response) { 
          return res.status(200).send(response); 
        } 
        return res.status(400).json(HTTPResponses.Error[400]);
    
      } else {
        const response = await object.examination_list.findAll({ order: [['name', 'ASC']] });
        if (response) {
          return res.status(200).send(response);
        } else {
          return res.status(400).json(HTTPResponses.Error[400]);
        }
      }
    } catch (error) {
      console.error(ConsoleResponses.SERVER_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/examination
 * @method: POST
 * @description: Route for adding an examination
 * @argument {
 *    name : string,
 *    subtypeId : string,
 *    examinationTypeId : string
 * }
 * @return {
 *    result : Examination
 * }
 */
  router.post('/', async (req, res, _next) => {    
    try {
      const { name, subtypeId, examinationTypeId } = req.body;
      if (subtypeId && examinationTypeId && name) {

        const exists = await object.examination_list.findOne({
          where: {
            name : name,
            examination_type_id : examinationTypeId,
            examination_subtype_id : subtypeId
          }
        })
        if(exists === null) {
          const response = await object.examination_list.create({
            name: name,
            examination_type_id: examinationTypeId,
            examination_subtype_id: subtypeId,
          });
          if (!response) {
            return res.status(400).json(HTTPResponses.Error[400]);
          }
          return res.status(201).send(response);
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
 * @access: /api/examination
 * @method: PATCH
 * @description: Route for modifying an examination
 * @argument {
 *    id : string,
 *    newName : string
 * }
 * @return {
 *    result : HTTPStatus
 * }
 */
  router.patch('/', async (req, res, _next) => {    
    try {
      const { id, newName } = req.body;
      if (id && newName) {
        const result = await object.examination_list.update(
          { name: newName },
          { where: { id: id } },
        );
        if (result > 0) {
          return res.status(200).json(HTTPResponses.Success[200]);
        }
        return res.status(400).json(HTTPResponses.Error[400]);
      } else {
        res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/examination
 * @method: DELETE
 * @description: Route for removing an examination
 * @argument {
 *    id : string,
 * }
 * @return {
 *    result : HTTPStatus
 * }
 */
  router.delete('/', async (req, res, _next) => {    
    try {
      const { id } = req.body;
      if(!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const result = await object.examination_list.destroy({ where: { id: id } });
      if (result) {
        return res.status(200).json(HTTPResponses.Success[200]);
      } else {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(400).json(HTTPResponses.Error[400]);
      } else {
        console.error(ConsoleResponses.DELETE_ERROR, error);
        res.status(500).json(HTTPResponses.Error[500]);
      }
    }
  });

/**
 * @access: /api/examination/type
 * @method: GET
 * @description: Route for getting all examination types given no ID, 
 *               or one specific when given an ID
 * @argument {
 *    id : string,
 * }
 * @return {
 *    result : ExaminationType || ExaminationType[]
 * }
 */
  router.get('/type', async (req, res, _next) => {
    try {
      const id = req.query.id;
      const result = id
        ? await object.examination_type.findOne({ where: { id: id } })
        : await object.examination_type.findAll();

      if (result) {
        res.status(200).send(result);
      } else {
        res.status(404).json();
      }
    } catch (error) {
      console.error(ConsoleResponses.SERVER_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/examination/type
 * @method: POST
 * @description: Route for adding an examination type
 * @argument {
 *    name : string,
 * }
 * @return {
 *    result : ExaminationType
 * }
 */
  router.post('/type', async (req, res, _next) => {    
    try {
      const { name } = req.body;
      if (name) {
        const exists = await object.examination_type.findOne({
          where : {
            name : name
          }
        });
        if(exists === null) {
          const response = await object.examination_type.create({ name: name });
          if (!response) {
            return res.status(500).json(HTTPResponses.Error[500]);
          }
          return res.status(201).send(response);
        }
        res.status(400).json(HTTPResponses.Error[400]);
      } else {
        res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/examination/type
 * @method: PATCH
 * @description: Route for modifying an examination type
 * @argument {
 *    id : string,
 *    name : string
 * }
 * @return {
 *    result : HTTPStatus
 * }
 */
  router.patch('/type', async (req, res, _next) => {
    try {
      const { id, name } = req.body;  
      if (!id || !name) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const examinationType = await object.examination_type.findOne({ where: { id: id } });
      if (!examinationType) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      const result = await examinationType.update({ name: name });
      if (!result) {
        return res.status(500).json(HTTPResponses.Error[500]);
      }
      res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/examination/type
 * @method: DELETE
 * @description: Route for deleting an examination type
 * @argument {
 *    id : string
 * }
 * @return {
 *    result : HTTPStatus
 * }
 */
  router.delete('/type', async (req, res, _next) => {
    try {
      const { id } = req.body;  
      if (!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const response = await object.examination_type.destroy({ where: { id: id } });
      if (!response) {
        return res.status(500).json(HTTPResponses.Error[500]);
      }
      res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      console.error(ConsoleResponses.DELETE_ERROR, error);
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(409).json(HTTPResponses.Error[409]);
      } else {
        return res.status(500).json(HTTPResponses.Error[500]);
      }
    }
  });

/**
 * @access: /api/examination/subtype
 * @method: GET
 * @description: Route for retrieving examination subtypes. 
 *               Returns all examinations subtypes corresponding to an examination subtype ID if given
 *               Returns a specific examination subtype if given a unique identifier
 *               Returns all examination subtypes with no arguments
 * @argument {
 *    id : string
 *    examinationTypeId : string
 * }
 * @return {
 *    result : HTTPStatus
 * }
 */
  router.get('/subtype', async (req, res, _next) => {
    try {
      const examinationTypeId = req.query.examination_type_id
      const id = req.query.id
      if (examinationTypeId) {
        const response = await object.examination_subtype.findAll({
          where: { examination_type_id: examinationTypeId },
        });
        return res.status(200).send(response);
      } else if (id) {
        const response = await object.examination_subtype.findOne({ where: { id: id } });
        res.status(200).send(response);
      } else {
        const response = await object.examination_subtype.findAll();
        return res.status(200).send(response);
      }
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/examination/subtype
 * @method: POST
 * @description: Route for adding an examination subtype
 * @argument {
 *    id : string
 *    name : string
 * }
 * @return {
 *    result : ExaminationSubtype
 * }
 */
  router.post('/subtype', async (req, res, _next) => {    
    try {
      const { name, id } = req.body;
      if (name && id) {
        const response = await object.examination_subtype.create({
          name: name,
          examination_type_id: id,
        });
        if (!response) {
          return res.status(400).json(HTTPResponses.Error[400]);
        }
        res.status(201).send(response);
      } else {
        res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/examination/subtype
 * @method: PATCH
 * @description: Route for modifying an examination subtype
 * @argument {
 *    id : string
 *    name : string
 * }
 * @return {
 *    result : HTTPStatus
 * }
 */
  router.patch('/subtype', async (req, res, _next) => {
    try {
      const { id, name } = req.body;
      if (!id || !name) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const examinationSubtype = await object.examination_subtype.findOne({ where: { id: id } });

      if (!examinationSubtype) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }

      const result = await examinationSubtype.update({ name: name });
      if (!result) {
        return res.status(500).json(HTTPResponses.Error[500]);
      }

      res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/examination/subtype
 * @method: DELETE
 * @description: Route for removing an examination subtype
 * @argument {
 *    id : string
 * }
 * @return {
 *    result : HTTPStatus
 * }
 */
  router.delete('/subtype', async (req, res, _next) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const response = await object.examination_subtype.destroy({ where: { id: id } });
      if (!response) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(409).json(HTTPResponses.Error[409]);
      } else {
        console.error(ConsoleResponses.DELETE_ERROR, error);
        return res.status(500).json(HTTPResponses.Error[500]);
      }
    }
  });

/**
 * @access: /api/examination/range
 * @method: PATCH
 * @description: Route for modifying an existing ranges for a given examination 
 * @argument {
 *    id : string
 *    min : number
 *    max : number
 *    unit : string
 * }
 * @return {
 *    result : HTTPStatus
 * }
 */
  router.patch('/range', async (req, res, _next) => {
    try {
      const { id, min, max, unit } = req.body;  
      if (!id || !min || !max || !unit) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const examination = await object.examination_list.findOne({ where: { id: id } });
      if (!examination) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }

      const result = await examination.update({ min_value: min, max_value: max, unit: unit });
      if (!result) {
        return res.status(500).json(HTTPResponses.Error[500]);
      }
      res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });
  return router;
}