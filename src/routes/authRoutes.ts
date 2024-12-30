import express, { Request, Response } from 'express';
import {
  handleOtpVerification,
  handleSendOtp,
} from '../controllers/handleOtpVerification';
import { fileUpload } from '../controllers/fileUpload';
import { upload } from '../middlewares/multer';
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
} from '../controllers/postController';
import { authenticate } from '../middlewares/authToken';
import {
  getCurrentUser,
  getUserById,
  getAllUsers,
} from '../controllers/userController';
import { profileUpdate } from '../controllers/profileUpdate';
import {
  addFollower,
  addFollowing,
  getFollowers,
  getFollowings,
  removeFollower,
  removeFollowing,
} from '../controllers/followController';
import { getPostByUserId } from '../controllers/postController';

const router = express.Router();

router.post('/send-otp', handleSendOtp);
router.post('/verify-otp', handleOtpVerification);
router.get('/get-comments/:postId', authenticate, getCommentsByPostId);
router.post('/upload', authenticate, upload.single('file'), fileUpload);
router.post('/create-post', authenticate, createPost);
router.post('/create-comment', authenticate, createComment);
router.post('/post/like-unlike', authenticate, likeAndUnlikePost);
router.get('/get-post/:postId', authenticate, getPost);
router.get('/get-posts', authenticate, getAllPost);
router.get('/me', authenticate, getCurrentUser);
router.post('/profile-update', authenticate, profileUpdate);
router.delete('/delete-post/:postId', authenticate, deletePost);
router.delete('/delete-comment/:commentId', authenticate, deleteComment);
router.get('/get-user-by-id/:id', authenticate, getUserById);
router.get('/get-all-users', authenticate, getAllUsers);
router.get('/get-post-by-userId/:userId', authenticate, getPostByUserId);
router.post('/add-following/:userId', authenticate, addFollowing);
router.post('/add-follower/:userId', authenticate, addFollower);
router.get('/get-followings/:userId', authenticate, getFollowings);
router.get('/get-followers/:userId', authenticate, getFollowers);
router.post('/remove-following/:userId', removeFollowing);
router.post('/remove-follower/:userId', removeFollower);

export default router;
