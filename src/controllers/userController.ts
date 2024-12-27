import { Request, Response } from 'express';
import db from '../models';

//get current user
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

//get all users
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

//get user by id
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
