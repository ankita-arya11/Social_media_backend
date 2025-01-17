import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';

interface EventNotificationAttributes {
  id: number;
  userId: number;
  type: string;
  eventNotify: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EventNotificationCreationAttributes
  extends Optional<EventNotificationAttributes, 'id'> {}

class EventNotification
  extends Model<
    EventNotificationAttributes,
    EventNotificationCreationAttributes
  >
  implements EventNotificationAttributes
{
  public id!: number;
  public userId!: number;
  public type!: string;
  public eventNotify!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EventNotification.init(
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
    eventNotify: {
      type: DataTypes.JSON,
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
    modelName: 'EventNotification',
    tableName: 'event_notifications',
    timestamps: true,
  }
);

export default EventNotification;
