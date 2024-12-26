import { Request, Response } from 'express';
import db from '../models';

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }

    const user = await db.User.findByPk(userId, {
      attributes: [
        'id',
        'username',
        'full_name',
        'email',
        'profile_picture',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User fetched successfully',
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      message: 'Failed to fetch user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
