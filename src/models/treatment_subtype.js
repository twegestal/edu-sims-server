import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const treatment_subtype = db.define(
  'treatment_subtype',
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
    treatment_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    // Other model are go here
    freezeTableName: true,
    timestamps: false,
  },
);
