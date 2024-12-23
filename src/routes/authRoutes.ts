// import express, { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { body, validationResult } from 'express-validator';
// import User from '../models/User';

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET as string;

// router.post(
//   '/signup',
//   [
//     body('username').notEmpty().withMessage('Username is required'),
//     body('email').isEmail().withMessage('Valid email is required'),
//     body('password')
//       .isLength({ min: 6 })
//       .withMessage('Password must be at least 6 characters'),
//   ],
//   async (req: Request, res: Response): Promise<Response> => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { username, email, password } = req.body;

//     try {
//       // Check if user already exists
//       const existingUser = await User.findOne({ where: { email } });
//       if (existingUser) {
//         return res.status(400).json({ error: 'User already exists' });
//       }

//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Create the user and save to the database
//       const newUser = await User.create({
//         username,
//         email,
//         password: hashedPassword,
//       });

//       return res
//         .status(201)
//         .json({ message: 'User created successfully', user: newUser });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: 'Server error' });
//     }
//   }
// );

// // Login API
// router.post(
//   '/login',
//   [
//     body('email').isEmail().withMessage('Valid email is required'),
//     body('password').notEmpty().withMessage('Password is required'),
//   ],
//   async (req: Request, res: Response): Promise<Response> => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;

//     try {
//       // Find the user
//       const user = await User.findOne({ where: { email } });
//       if (!user) {
//         return res.status(400).json({ error: 'Invalid email or password' });
//       }

//       // Check the password
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ error: 'Invalid email or password' });
//       }

//       // Generate JWT
//       const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
//         expiresIn: '1h',
//       });

//       return res.status(200).json({ message: 'Login successful', token });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: 'Server error' });
//     }
//   }
// );

// export default router;
