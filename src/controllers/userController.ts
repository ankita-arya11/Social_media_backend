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
    console.error('Error fetching user:', error);
    res.status(500).json({
      message: 'Failed to fetch user',
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
        'other_data',
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
        'other_data',
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

// search for new user
export const searchUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (
      !username ||
      typeof username !== 'string' ||
      username.trim().length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Valid username is required' });
    }

    const user = await db.User.findOne({
      where: { username },
      attributes: [
        'id',
        'username',
        'full_name',
        'profile_picture',
        'other_data',
      ],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        username: user.username,
        full_name: user.full_name,
        profile_picture: user.profile_picture,
        other_data: user.other_data,
      },
    });
  } catch (error) {
    console.error('Error searching user by username:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

//latest 3 users
export const latestUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const latestUsers = await db.User.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'username', 'full_name', 'email', 'createdAt'],
    });

    return res.status(200).json({
      message: 'Latest 3 users fetched successfully',
      users: latestUsers,
    });
  } catch (error) {
    console.error('Error fetching latest users:', error);
    return res.status(500).json({
      message: 'Failed to fetch latest users',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
