import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';

interface MyNotificationAttributes {
  id: number;
  userId: number;
  type: string;
  notifyData: Record<string, any>;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MyNotificationCreationAttributes
  extends Optional<MyNotificationAttributes, 'id'> {}

class MyNotification
  extends Model<MyNotificationAttributes, MyNotificationCreationAttributes>
  implements MyNotificationAttributes
{
  public id!: number;
  public userId!: number;
  public type!: string;
  public notifyData!: Record<string, any>;
  public isRead!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MyNotification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notifyData: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'MyNotification',
    tableName: 'my_notifications',
    timestamps: true,
  }
);

export default MyNotification;
