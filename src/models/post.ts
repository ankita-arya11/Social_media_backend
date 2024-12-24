import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';
import User from './user';

interface PostAttributes {
  id: number;
  userId: number;
  content: string;
  mediaUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PostCreationAttributes
  extends Optional<
    PostAttributes,
    'id' | 'mediaUrl' | 'likesCount' | 'commentsCount'
  > {}

class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: number;
  public userId!: number;
  public content!: string;
  public mediaUrl?: string;
  public likesCount!: number;
  public commentsCount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    commentsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true,
  }
);

export default Post;