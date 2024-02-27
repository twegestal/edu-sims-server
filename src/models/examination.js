import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const examination = db.define(
  'examination',
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
    examination_to_display: {
      type: DataTypes.JSON,
    },
    feedback_correct: {
      type: DataTypes.TEXT,
    },
    feedback_incorrect: {
      type: DataTypes.TEXT,
    },
    max_nbr_tests: {
      type: DataTypes.INTEGER,
    },
  },
  {
    // Other model information goes here
    freezeTableName: true,
    timestamps: false,
  },
);
