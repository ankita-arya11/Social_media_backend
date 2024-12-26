import { Request, Response } from 'express';
import db from '../models';

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userEmail = (req as any).user?.email;
    const user = await db.User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User fetched Successfully', user });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      message: 'Failed to fetch post',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
