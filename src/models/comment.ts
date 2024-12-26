import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';
import User from './user';
import Post from './post';

interface CommentAttributes {
  id: number;
  postId: number;
  userId: number;
  comment: string;
  likesCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentCreationAttributes
  extends Optional<CommentAttributes, 'id' | 'likesCount'> {}

class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  public id!: number;
  public postId!: number;
  public userId!: number;
  public comment!: string;
  public likesCount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
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
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
  }
);

export default Comment;
