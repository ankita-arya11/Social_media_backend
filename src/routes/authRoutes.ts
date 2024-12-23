import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

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

    const {
      username,
      email,
      password,
      full_name,
      profile_picture,
      other_data,
    } = req.body;

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

export default router;
