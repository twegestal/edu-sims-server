import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const step_specific_values = db.define(
  'step_specific_values',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    examination_step_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    examination_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT,
    },
    is_normal: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    // Other model information goes here
    freezeTableName: true,
    timestamps: false,
  },
);
