import { Request, Response } from 'express';
import db from '../models';
import { Sequelize } from 'sequelize';

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

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : null;
    const offset = req.query.limit
      ? parseInt(req.query.offset as string)
      : null;
    const users = await db.User.findAll({
      ...(limit ? { limit } : {}),
      ...(offset ? { offset } : {}),
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

export const latestUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const latestUsers = await db.User.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: [
        'id',
        'username',
        'full_name',
        'email',
        'profile_picture',
        'createdAt',
      ],
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

export const getConnectedUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;

  try {
    const followerList = await db.FollowerList.findOne({
      where: { userId },
    });

    const followingList = await db.FollowingList.findOne({
      where: { userId },
    });

    if (!followerList || !followingList) {
      return res.status(404).json({
        message: 'Follower or Following list not found',
      });
    }

    const { followers } = followerList;
    const { following } = followingList;

    const connectedUserIds = followers.filter((id) => following.includes(id));

    const connectedUsers = await db.User.findAll({
      where: { id: connectedUserIds },
      attributes: ['id', 'full_name', 'username', 'profile_picture'],
    });

    const unreadCounts = await db.Messages.findAll({
      where: {
        sender_id: connectedUserIds,
        receiver_id: userId,
        is_read: false,
      },
      attributes: ['sender_id', [Sequelize.fn('COUNT', '*'), 'unreadCount']],
      group: ['sender_id'],
    });

    const unreadCountMap: Record<number, number> = {};
    unreadCounts.forEach((count: any) => {
      unreadCountMap[count.sender_id] = parseInt(
        count.dataValues.unreadCount,
        10
      );
    });

    const connectedUsersWithCounts = connectedUsers.map((user) => ({
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      profile_picture: user.profile_picture,
      unreadCount: unreadCountMap[user.id] || 0,
    }));

    return res.status(200).json({
      message: 'Connected users with message counts fetched successfully',
      users: connectedUsersWithCounts,
    });
  } catch (error) {
    console.error('Error fetching connected users:', error);
    return res.status(500).json({
      message: 'Failed to fetch connected users',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const isUserConnected = async (req: Request, res: Response) => {
  const { userId, followingId } = req.params;

  if (!userId || !followingId) {
    return res
      .status(400)
      .json({ message: 'User ID and Following ID are required' });
  }

  try {
    const userIdNum = parseInt(userId, 10);
    const followingIdNum = parseInt(followingId, 10);

    const userFollows = await db.FollowingList.findOne({
      where: {
        userId: userIdNum,
      },
    });

    const followingFollows = await db.FollowerList.findOne({
      where: {
        userId: userIdNum,
      },
    });

    const userFollow = userFollows?.following.includes(followingIdNum);
    const userFriend = followingFollows?.followers.includes(followingIdNum);

    const isConnected = !!userFollow && !!userFriend;

    return res.status(200).json({ isConnected });
  } catch (error) {
    console.error('Error checking user connection:', error);
    return res.status(500).json({ message: 'Failed to check connection' });
  }
};
