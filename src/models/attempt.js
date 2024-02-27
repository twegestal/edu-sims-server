import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const attempt = db.define(
  'attempt',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    case_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    is_finished: {
      type: DataTypes.BOOLEAN,
    },
    faults: {
      type: DataTypes.INTEGER,
    },
    timestamp_finished: {
      type: DataTypes.TIME,
    },
    correct_diagnosis: {
      type: DataTypes.BOOLEAN,
    },
    nbr_of_tests_performed: {
      type: DataTypes.INTEGER,
    },
    examination_results: {
      type: DataTypes.JSON,
    },
    feedback: {
      type: DataTypes.JSON,
    },
    index: {
      type: DataTypes.INTEGER,
    },
  },
  {
    // Other model are go here
    freezeTableName: true,
    updatedAt: false,
    createdAt: 'timestamp_started',
  },
);
