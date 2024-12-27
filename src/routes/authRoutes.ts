import express, { Request, Response } from 'express';
import { generateOTP } from '../helpers/handleOtp';
import { sendEmail } from '../helpers/email';
import db from '../models';
import { handleOtpVerification } from '../controllers/handleOtpVerification';
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
import { addFollower } from '../controllers/followController';
import { addFollowing } from '../controllers/followController';

const router = express.Router();

router.post('/send-otp', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }
  const otp = generateOTP();

  try {
    const user = await db.User.findOne({ where: { email } });
    const isNewUser = !(user?.full_name && user?.email);

    if (user) {
      user.otp = otp;
      await user.save();
    } else {
      await db.User.create({
        email,
        otp,
      });
    }

    const emailData = {
      receiver: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
    };

    const isEmailSent = await sendEmail(emailData);

    if (!isEmailSent) {
      return res.status(500).send({ message: 'Failed to send OTP email' });
    }

    res.status(200).send({
      message: 'OTP sent successfully',
      isNewUser: isNewUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to process OTP request' });
  }
});

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
router.get('/get-user-by-id/:id', getUserById);
router.get('/get-all-users', authenticate, getAllUsers);
router.post('/add-following/:userId', addFollowing);
router.post('add-follower/:userId', addFollower);

export default router;
