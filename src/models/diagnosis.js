import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const diagnosis = db.define(
  'diagnosis',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    prompt: {
      type: DataTypes.TEXT,
    },
    diagnosis_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    feedback_correct: {
      type: DataTypes.TEXT,
    },
    feedback_incorrect: {
      type: DataTypes.TEXT,
    },
  },
  {
    // Other model information goes here
    freezeTableName: true,
    timestamps: false,
  },
);
