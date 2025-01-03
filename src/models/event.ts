import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/db';

export interface EventAttributes {
  id: string;
  name: string;
  description?: string;
  eventDate: Date;
  location?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';

  mediaUrls?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default class Event
  extends Model<EventAttributes>
  implements EventAttributes
{
  public id!: string;
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
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
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
    tableName: 'event',
    timestamps: true,
  }
);
