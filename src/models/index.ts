import User from './user';
import Post from './post';
import PostLike from './postLike';
import Comment from './comment';
import CommentLike from './commentLike';
import FollowingList from './followingList';
import FollowerList from './followerList';
import Event from './event';
import { setupAssociations } from './association';
import Messages from './messages';
import EventNotification from './eventNotification';
import MyNotification from './myNotification';

setupAssociations();

const db = {
  User,
  Post,
  PostLike,
  Comment,
  CommentLike,
  FollowingList,
  FollowerList,
  Event,
  Messages,
  EventNotification,
  MyNotification,
};

export default db;
