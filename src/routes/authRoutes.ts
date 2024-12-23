import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import {
  generateOTP,
  storeOTP,
  retrieveOTP,
  client,
} from '../helpers/handleOtp';
import { sendEmail } from '../helpers/email';

const router = express.Router();

router.post(
  '/signup',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('profile_picture')
      .optional()
      .isString()
      .withMessage('Invalid profile picture URL'),
  ],
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, full_name, profile_picture, other_data } =
      req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const newUser = await User.create({
        username,
        email,
        full_name,
        profile_picture,
        other_data,
      });

      return res
        .status(201)
        .json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

router.post('/send-otp', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  const otp = generateOTP();
  const otpKey = `otp:${email}`;

  try {
    await storeOTP(otpKey, otp);

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

    res.status(200).send({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to process OTP request' });
  }
});

router.post('/verify-otp', async (req: Request, res: Response) => {
  const { email, otp } = req.body;

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

    await client.del(otpKey);

    res.status(200).send({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

export default router;
