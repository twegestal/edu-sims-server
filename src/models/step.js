import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const step = db.define(
  'step',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    case_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    index: {
      type: DataTypes.INTEGER,
    },
    module_type_identifier: {
      type: DataTypes.INTEGER,
    },
    step_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    // Other model information goes here
    freezeTableName: true,
    timestamps: false,
  },
);
