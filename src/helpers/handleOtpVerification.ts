import { Request, Response } from 'express';
import { retrieveOTP } from './handleOtp';
import User from '../models/User';
import { client } from './handleOtp';

export const verifyOTP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, otp, username, full_name, profile_picture, other_data } =
    req.body;

  if (!email || !otp) {
    return res.status(400).send({ message: 'Email and OTP are required' });
  }

  const otpKey = `otp:${email}`;
  try {
    const storedOtp = await retrieveOTP(otpKey);

    if (!storedOtp) {
      return res.status(400).send({ message: 'OTP has expired or is invalid' });
    }

    if (storedOtp !== otp.toString()) {
      return res.status(400).send({ message: 'Invalid OTP' });
    }

    const user = await User.findOne({ where: { email } });
    await client.del(otpKey);

    if (user) {
      return res.status(200).send({
        message: 'OTP verified successfully and user exists',
        user,
      });
    }

    const newUser = await User.create({
      username: username,
      full_name: full_name,
      email: email,
      profile_picture: profile_picture || null,
      other_data: other_data || null,
    });

    return res.status(200).send({
      message: 'OTP verified successfully and user created',
      user: newUser,
    });
  } catch (error: unknown) {
    // Type assertion to 'Error'
    if (error instanceof Error) {
      console.error('Error verifying OTP:', error.message); // Safe access to 'message'
      return res
        .status(500)
        .send({ message: 'Server error', error: error.message });
    }
    return res.status(500).send({ message: 'Unknown error occurred' });
  }
};
