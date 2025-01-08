import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';
import User from './user';

interface MesssagesAttributes {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string | null;
}

interface MesssagesCreationAttributes
  extends Optional<
    MesssagesAttributes,
    'id' | 'sender_id' | 'receiver_id' | 'message'
  > {}

class Messsages
  extends Model<MesssagesAttributes, MesssagesCreationAttributes>
  implements MesssagesAttributes
{
  public id!: number;
  public sender_id!: number;
  public receiver_id!: number;
  public message!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Messsages.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Messages',
    tableName: 'messages',
    timestamps: true,
  }
);

export default Messsages;
