import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db/db';
import User from './user';

export interface EventAttributes {
  id: number;
  userId: number;
  name: string;
  description?: string;
  eventDate: Date;
  location?: string;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'today';
  mediaUrls?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id'> {}

export default class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public id!: number;
  public userId!: number;
  public name!: string;
  public description?: string;
  public eventDate!: Date;
  public location?: string;
  public status!: 'upcoming' | 'ongoing' | 'completed';
  public mediaUrls?: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'ongoing', 'completed'),
      allowNull: false,
    },
    mediaUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events', // Changed to plural
    timestamps: true,
  }
);

// Association with User model
Event.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});
