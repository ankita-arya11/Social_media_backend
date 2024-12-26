import User from './user';
import Post from './post';
import PostLike from './postLike';
import Comment from './comment';
import CommentLike from './commentLike';
import { setupAssociations } from './association';

setupAssociations();

const db = {
  User,
  Post,
  PostLike,
  Comment,
  CommentLike,
};
export default db;
