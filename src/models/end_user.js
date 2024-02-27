import { DataTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const end_user = db.define(
  'end_user',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    group_id: {
      type: DataTypes.TEXT,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
    last_login: {
      type: DataTypes.DATE,
    },
  },
  {
    // Other model are go here
    freezeTableName: true,
    timestamps: false,
  },
);
