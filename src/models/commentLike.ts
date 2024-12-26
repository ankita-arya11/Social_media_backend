import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/db';
import Comment from './comment';
import User from './user';

class CommentLike extends Model {
  public id!: number;
  public commentId!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CommentLike.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Comment,
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
    modelName: 'CommentLike',
    tableName: 'comment_likes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['commentId', 'userId'],
      },
    ],
  }
);

export default CommentLike;
