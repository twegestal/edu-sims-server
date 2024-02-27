import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const introduction = db.define(
  'introduction',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    prompt: {
      type: DataTypes.TEXT,
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
