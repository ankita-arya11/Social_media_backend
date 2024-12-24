import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/db';
import Post from './post';
import User from './user';

class PostLike extends Model {
  public id!: number;
  public postId!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PostLike.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: 'id',
      },
      onDelete: 'CASCADE',
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
  },
  {
    sequelize,
    modelName: 'PostLike',
    tableName: 'post_likes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['postId', 'userId'],
      },
    ],
  }
);

export default PostLike;
