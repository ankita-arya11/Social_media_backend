import { Request, Response } from 'express';
import db from '../models';
import { generateToken } from '../helpers/jwt';

export const handleOtpVerification = async (req: Request, res: Response) => {
  const { email, otp, username, profile_picture, full_name, other_data } =
    req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const num_otp = Number(otp);
    if (user.otp !== num_otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (!user.username && (!username || !full_name)) {
      return res.status(400).json({
        message: 'Username and Full Name are required for new users',
      });
    }

    if (username || full_name || profile_picture || other_data) {
      user.username = username || user.username;
      user.full_name = full_name || user.full_name;
      user.profile_picture = profile_picture || user.profile_picture;
      user.other_data = other_data || user.other_data;

      await db.FollowerList.create({
        userId: user.id,
        followers: [],
      });

      await db.FollowingList.create({
        userId: user.id,
        following: [],
      });
    }

    user.otp = null;
    await user.save();

    const token = generateToken(email);

    return res.status(200).json({
      message: 'OTP verified successfully',
      token,
    });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
