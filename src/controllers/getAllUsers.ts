import { Request, Response } from 'express';
import db from '../models';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.User.findAll({
      attributes: [
        'id',
        'username',
        'full_name',
        'profile_picture',
        'createdAt',
        'updatedAt',
      ],
    });

    res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      message: 'Failed to fetch users',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
