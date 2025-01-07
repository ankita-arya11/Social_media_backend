import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';
import User from './user';

interface FollowingListAttributes {
  id: number;
  userId: number;
  following: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface FollowingListCreationAttributes
  extends Optional<FollowingListAttributes, 'id'> {}

class FollowingList
  extends Model<FollowingListAttributes, FollowingListCreationAttributes>
  implements FollowingListAttributes
{
  public id!: number;
  public userId!: number;
  public following!: number[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FollowingList.init(
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
    following: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'FollowingList',
    tableName: 'following_lists',
    timestamps: true,
  }
);

export default FollowingList;
