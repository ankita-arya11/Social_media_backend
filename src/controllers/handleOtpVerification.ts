import { Request, Response } from 'express';
import db from '../models';
import { generateToken } from '../helpers/jwt';
import sendEmail from '../helpers/email';
import { generateOTP } from '../helpers/handleOtp';

export const handleSendOtp = async (req: Request, res: Response) => {
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
};

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
