import express from "express";
import * as object from '../models/object_index.js';
import { ForeignKeyConstraintError } from 'sequelize';
import { ConsoleResponses, HTTPResponses } from "../utils/serverResponses.js";


export const medicalFieldRouter = () => {
  const router = express();

/**
 * @access: /api/medical-field
 * @method: GET
 * @description: Route for retrieving all medical fields
 * @argument {
 *    null
 * }
 * @return {
 *    result : MedicalField[]
 * }
 */
  router.get('/', async (_req, res, _next) => {
    try {
      const result = await object.medical_field.findAll({});
      res.status(200).send(result);
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/medical-field
 * @method: POST
 * @description: Route for adding a medical field
 * @argument {
 *    name : string
 * }
 * @return {
 *    result : MedicalField
 * }
 */
  router.post('/', async (req, res, _next) => {    
    try {
      const { name } = req.body;
      if(!name) {
        return res.status(400).json(HTTPResponses.Error[400])
      }
      const exists = await object.medical_field.findOne({
        where: {
            name : name
        }
      })
      if(exists === null) {
          const response = await object.medical_field.create({ name: name });
          if (response) {
            return res.status(201).send(response);
          } else {
            return res.status(400).json(`Could not create resource ${name}`);
          }
      }
      return res.status(400).json(HTTPResponses.Error[400]);
    } catch (error) {
      console.error(ConsoleResponses.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/medical-field
 * @method: PATCH
 * @description: Route for modifying a medical field
 * @argument {
 *    id : string,
 *    name : string
 * }
 * @return {
 *    result : HTTPStatus
 * }
 */
  router.patch('/', async (req, res, _next) => {
    try {
      const { id, name } = req.body;
      if (!id || !name) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const medicalField = await object.medical_field.findOne({ where: { id: id } });
      if (!medicalField) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      const result = await medicalField.update({ name: name });
      if (!result) {
        return res.status(500).json(HTTPResponses.Error[500]);
      }
      res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

/**
 * @access: /api/medical-field
 * @method: DELETE
 * @description: Route for deleting a medical field
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
      if (!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const response = await object.medical_field.destroy({ where: { id: id } });
      if (!response) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }

      return res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(409).json(HTTPResponses.Error[409]);
      } else {
        return res.status(500).json(HTTPResponses.Error[500]);
      }
    }
  });
  
  return router;
}