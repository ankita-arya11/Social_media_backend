import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';
import User from './user';

interface FollowerListAttributes {
  id: number;
  userId: number;
  followers: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface FollowerListCreationAttributes
  extends Optional<FollowerListAttributes, 'id'> {}

class FollowerList
  extends Model<FollowerListAttributes, FollowerListCreationAttributes>
  implements FollowerListAttributes
{
  public id!: number;
  public userId!: number;
  public followers!: number[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FollowerList.init(
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
      onDelete: 'CASCADE',
    },
    followers: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'FollowerList',
    tableName: 'follower_lists',
    timestamps: true,
  }
);

export default FollowerList;
