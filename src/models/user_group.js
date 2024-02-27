import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const user_group = db.define(
  'user_group',
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
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    registration_link: {
      type: DataTypes.TEXT,
    },
  },
  {
    // Other model are go here
    freezeTableName: true,
    timestamps: false,
  },
);
