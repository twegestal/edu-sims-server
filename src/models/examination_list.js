import { DataTypes, FLOAT } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const examination_list = db.define(
  'examination_list',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
    },
    examination_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    examination_subtype_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    min_value: {
      type: DataTypes.TEXT,
    },
    max_value: {
      type: DataTypes.TEXT,
    },
    is_randomizable: {
      type: DataTypes.BOOLEAN,
    },
    unit: {
      type: DataTypes.TEXT,
    },
  },
  {
    // Other model information goes here
    freezeTableName: true,
    timestamps: false,
  },
);
