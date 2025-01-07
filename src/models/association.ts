import User from './user';
import Post from './post';
import PostLike from './postLike';
import Comment from './comment';
import CommentLike from './commentLike';
import FollowerList from './followerList';
import FollowingList from './followingList';
import Event from './event';

export const setupAssociations = () => {
  User.hasMany(Post, { foreignKey: 'userId' });
  Post.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(Comment, { foreignKey: 'userId' });
  Comment.belongsTo(User, { foreignKey: 'userId' });

  Post.hasMany(Comment, { foreignKey: 'postId' });
  Comment.belongsTo(Post, { foreignKey: 'postId' });

  User.hasMany(PostLike, { foreignKey: 'userId' });
  PostLike.belongsTo(User, { foreignKey: 'userId' });

  Post.hasMany(PostLike, { foreignKey: 'postId' });
  PostLike.belongsTo(Post, { foreignKey: 'postId' });

  User.hasMany(CommentLike, { foreignKey: 'userId' });
  CommentLike.belongsTo(User, { foreignKey: 'userId' });

  Comment.hasMany(CommentLike, { foreignKey: 'commentId' });
  CommentLike.belongsTo(Comment, { foreignKey: 'commentId' });

  User.hasMany(FollowerList, { foreignKey: 'userId' });
  FollowerList.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(FollowingList, { foreignKey: 'userId' });
  FollowingList.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(Event, { foreignKey: 'userId' });
  Event.belongsTo(User, { foreignKey: 'userId', as: 'user' });
};
