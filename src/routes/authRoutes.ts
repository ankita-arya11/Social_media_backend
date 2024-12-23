import express, { Request, Response } from 'express';
import User from '../models/User';
import { generateOTP } from '../helpers/handleOtp';
import { sendEmail } from '../helpers/email';

const router = express.Router();

router.post('/send-otp', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  const otp = generateOTP();

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      user.otp = otp;
      await user.save();
    } else {
      await User.create({
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
      isNewUser: !user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to process OTP request' });
  }
});

router.post('/verify-otp', async (req: Request, res: Response) => {
  const { email, otp, username, profile_picture, full_name, other_data } =
    req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (username || full_name || profile_picture || other_data) {
      user.username = username || user.username;
      user.full_name = full_name || user.full_name;
      user.profile_picture = profile_picture || user.profile_picture;
      user.other_data = other_data || user.other_data;
    }

    user.otp = null;
    await user.save();

    return res.status(200).json({
      message: 'OTP verified successfully',
      user,
    });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
