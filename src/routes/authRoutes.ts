import express from 'express';
import {
  handleOtpVerification,
  handleSendOtp,
} from '../controllers/handleOtpVerification';
import { mulipleFileUpload, singleFileUpload } from '../controllers/fileUpload';
import { uploadMultipleFiles, uploadSingleFile } from '../middlewares/multer';
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
} from '../controllers/commentController';
import {
  createPost,
  getAllPost,
  getPost,
  likeAndUnlikePost,
  deletePost,
  latestPosts,
  editPost,
} from '../controllers/postController';
import { authenticate } from '../middlewares/authToken';
import {
  getCurrentUser,
  getUserById,
  getAllUsers,
  searchUser,
  latestUsers,
  getConnectedUser,
  isUserConnected,
  updateUserPermissions,
} from '../controllers/userController';
import { profileUpdate } from '../controllers/profileUpdate';
import {
  addFollowing,
  checkFollowing,
  getFollowers,
  getFollowings,
  removeFollower,
  removeFollowing,
} from '../controllers/followController';
import { getPostByUserId } from '../controllers/postController';
import { searchQuery } from '../controllers/searchController';
import {
  createEvent,
  deleteEvent,
  getEvents,
} from '../controllers/eventController';
import { deleteMessage, getMessages } from '../controllers/messageController';
import {
  getMyNotification,
  isMyNotification,
  isNewMessage,
} from '../controllers/notificationController';
import { isAdmin } from '../middlewares/adminCheck';

const router = express.Router();

router.post('/send-otp', handleSendOtp);
router.post('/verify-otp', handleOtpVerification);
router.get('/get-comments/:postId', authenticate, getCommentsByPostId);
router.post(
  '/multiple-upload',
  authenticate,
  uploadMultipleFiles,
  mulipleFileUpload
);
router.post('/single-upload', authenticate, uploadSingleFile, singleFileUpload);
router.post('/create-post', authenticate, createPost);
router.post('/create-comment', authenticate, createComment);
router.post('/post/like-unlike', authenticate, likeAndUnlikePost);
router.get('/get-post/:postId', authenticate, getPost);
router.get('/get-post-by-userId/:userId', authenticate, getPostByUserId);
router.get('/get-posts', authenticate, getAllPost);
router.delete('/delete-post/:postId', authenticate, deletePost);
router.get('/me', authenticate, getCurrentUser);
router.post('/profile-update', authenticate, profileUpdate);
router.delete('/delete-comment/:commentId', authenticate, deleteComment);
router.get('/get-user-by-id/:id', authenticate, getUserById);
router.get('/get-all-users', authenticate, getAllUsers);
router.post('/add-following', authenticate, addFollowing);
router.get('/latest-users', authenticate, latestUsers);
router.get('/get-followings/:userId', authenticate, getFollowings);
router.get('/get-followers/:userId', authenticate, getFollowers);
router.post('/remove-following', authenticate, removeFollowing);
router.post('/remove-follower', authenticate, removeFollower);
router.get('/search-user/:query', authenticate, searchUser);
router.get('/latest-posts', authenticate, latestPosts);
router.get('/search/:query', authenticate, searchQuery);
router.get(
  '/check-following/:userId/:followingId',
  authenticate,
  checkFollowing
);
router.post('/create-event', authenticate, createEvent);
router.get('/get-events', authenticate, getEvents);
router.delete('/delete-event/:eventId', authenticate, deleteEvent);
router.put('/edit-post/:postId', authenticate, editPost);
router.get('/get-connected-user', authenticate, getConnectedUser);
router.get('/get-messages/:senderId/:receiverId', authenticate, getMessages);
router.get(
  '/is-user-connected/:userId/:followingId',
  authenticate,
  isUserConnected
);
router.delete('/delete-message/:messageId', authenticate, deleteMessage);
router.get('/is-my-notification', authenticate, isMyNotification);
router.get('/get-my-notification', authenticate, getMyNotification);
router.get('/is-new-message', authenticate, isNewMessage);

//Admin routes

router.post(
  '/users/:userId/permissions',
  authenticate,
  isAdmin,
  updateUserPermissions
);

export default router;
