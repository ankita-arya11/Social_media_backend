import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';
import User from './user';
import PostLike from './postLike';

interface PostAttributes {
  id: number;
  userId: number;
  content: string;
  mediaUrls?: string[];
  reactionIds?: number[];
  likesCount: number;
  commentsCount: number;
  createdAt?: Date;
  updatedAt?: Date;
  PostLikes?: PostLike[];
}

interface PostCreationAttributes
  extends Optional<
    PostAttributes,
    'id' | 'mediaUrls' | 'likesCount' | 'commentsCount'
  > {}

class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: number;
  public userId!: number;
  public content!: string;
  public mediaUrls?: string[];
  public likesCount!: number;
  public commentsCount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly PostLikes?: PostLike[];
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
    mediaUrls: {
      type: DataTypes.JSON,
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
