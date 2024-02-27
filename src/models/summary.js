import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const summary = db.define(
  'summary',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    process: {
      type: DataTypes.TEXT,
    },
    additional_info: {
      type: DataTypes.TEXT,
    },
    additional_links: {
      type: DataTypes.TEXT,
    },
  },
  {
    // Other model information goes here
    freezeTableName: true,
    timestamps: false,
  },
);
