import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const medical_case = db.define(
  'medical_case',
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
      unique: true,
    },
    medical_field_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    creator_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    published: {
      type: DataTypes.BOOLEAN,
    },
    active: {
      type: DataTypes.BOOLEAN,
    }
  },
  {
    // Other model information goes here
    freezeTableName: true,
    timestamps: false,
  },
);
