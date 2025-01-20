import { Request, Response } from 'express';
import db from '../models';

export const addFollowing = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { followingId } = req.body;
    const { userId } = req.params;

    if (!userId || !followingId) {
      return res
        .status(400)
        .json({ message: 'userId and followingId are required' });
    }

    const userIdNum = parseInt(userId, 10);
    const followingIdNum = parseInt(followingId, 10);

    if (isNaN(userIdNum) || isNaN(followingIdNum)) {
      return res
        .status(400)
        .json({ message: 'userId and followingId must be valid numbers' });
    }

    const usersExist = await db.User.findAll({
      where: { id: [userIdNum, followingIdNum] },
    });

    if (usersExist.length !== 2) {
      return res
        .status(404)
        .json({ message: 'One or more users do not exist' });
    }

    const followingList = await db.FollowingList.findOne({
      where: { userId: userIdNum },
    });

    if (!followingList) {
      return res.status(404).json({ message: 'Following list not found' });
    }

    if (followingList.following.includes(followingIdNum)) {
      return res
        .status(400)
        .json({ message: 'User is already being followed' });
    }

    followingList.following = [...followingList.following, followingIdNum];
    await followingList.save();

    const followerList = await db.FollowerList.findOne({
      where: { userId: followingIdNum },
    });

    if (!followerList) {
      return res.status(404).json({ message: 'Follower list not found' });
    }

    followerList.followers = [...followerList.followers, userIdNum];
    await followerList.save();

    await updateOtherData(userIdNum, 'followings', true);
    await updateOtherData(followingIdNum, 'friends', true);

    const follower = await db.User.findOne({
      where: { id: userIdNum },
      attributes: ['id', 'username', 'full_name', 'profile_picture'],
    });

    if (follower) {
      await db.MyNotification.create({
        userId: followingIdNum,
        type: 'follow',
        isRead: false,
        notifyData: {
          user: {
            id: follower.id,
            username: follower.username,
            full_name: follower.full_name,
            profile_picture: follower.profile_picture,
          },
        },
      });
    }

    return res.status(200).json({
      message: 'User added to following list successfully',
      followingList,
    });
  } catch (error) {
    console.error('Error adding following:', error);
    return res.status(500).json({
      message: 'Failed to add following',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const addFollower = async (req: Request, res: Response) => {
  try {
    const { followerId } = req.body;
    const { userId } = req.params;

    const userIdNum = Number(userId);

    if (!userId || !followerId) {
      return res
        .status(400)
        .json({ message: 'userId and followerId are required' });
    }

    const usersExist = await db.User.findAll({
      where: { id: [userId, followerId] },
    });

    if (usersExist.length !== 2) {
      return res
        .status(404)
        .json({ message: 'One or more users do not exist' });
    }

    const followerList = await db.FollowerList.findOne({
      where: { userId },
    });

    if (!followerList) {
      return res.status(404).json({ message: 'Follower list not found' });
    }

    const currentFollowers = followerList.followers || [];
    if (currentFollowers.includes(followerId)) {
      return res.status(400).json({ message: 'User is already a follower' });
    }

    const updatedFollowers = [...currentFollowers, followerId];
    followerList.followers = updatedFollowers;

    await followerList.save();

    await updateOtherData(userIdNum, 'friends', true);

    return res.status(200).json({
      message: 'Follower added successfully',
      followerList,
    });
  } catch (error) {
    console.error('Error adding follower:', error);
    return res.status(500).json({
      message: 'Failed to add follower',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getFollowings = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params;

    const userIdNum = parseInt(userId, 10);

    if (isNaN(userIdNum)) {
      return res.status(400).json({ message: 'userId must be a valid number' });
    }

    const followingList = await db.FollowingList.findOne({
      where: { userId: userIdNum },
    });

    if (!followingList) {
      return res.status(404).json({ message: 'Following list not found' });
    }

    const followingUserIds = followingList.following;

    const followingUsers = await db.User.findAll({
      where: {
        id: followingUserIds,
      },
    });

    return res.status(200).json({
      message: 'Following list fetched successfully',
      following: followingUsers,
    });
  } catch (error) {
    console.error('Error fetching following list:', error);
    return res.status(500).json({
      message: 'Failed to fetch following list',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getFollowers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params;

    const userIdNum = parseInt(userId, 10);

    if (isNaN(userIdNum)) {
      return res.status(400).json({ message: 'userId must be a valid number' });
    }

    const followerList = await db.FollowerList.findOne({
      where: { userId: userIdNum },
    });

    if (!followerList) {
      return res.status(404).json({ message: 'Follower list not found' });
    }

    const followerUserIds = followerList.followers;

    const followers = await db.User.findAll({
      where: {
        id: followerUserIds,
      },
    });

    return res.status(200).json({
      message: 'Followers list fetched successfully',
      followers,
    });
  } catch (error) {
    console.error('Error fetching followers list:', error);
    return res.status(500).json({
      message: 'Failed to fetch followers list',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const removeFollowing = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { followingId } = req.body;
    const { userId } = req.params;

    const userIdNum = parseInt(userId, 10);
    const followingIdNum = parseInt(followingId, 10);

    if (isNaN(userIdNum) || isNaN(followingIdNum)) {
      return res
        .status(400)
        .json({ message: 'userId and followingId must be valid numbers' });
    }

    const usersExist = await db.User.findAll({
      where: { id: [userIdNum, followingIdNum] },
    });

    if (usersExist.length !== 2) {
      return res
        .status(404)
        .json({ message: 'One or more users do not exist' });
    }

    const followingList = await db.FollowingList.findOne({
      where: { userId: userIdNum },
    });

    if (!followingList) {
      return res.status(404).json({ message: 'Following list not found' });
    }

    followingList.following = followingList.following.filter(
      (id) => id !== followingIdNum
    );
    await followingList.save();

    const followerList = await db.FollowerList.findOne({
      where: { userId: followingIdNum },
    });

    if (!followerList) {
      return res.status(404).json({ message: 'Follower list not found' });
    }

    followerList.followers = followerList.followers.filter(
      (id) => id !== userIdNum
    );
    await followerList.save();

    await updateOtherData(userIdNum, 'followings', false);
    await updateOtherData(followingIdNum, 'friends', false);

    return res.status(200).json({
      message: 'User removed from following list successfully',
      followingList,
    });
  } catch (error) {
    console.error('Error removing following:', error);
    return res.status(500).json({
      message: 'Failed to remove following',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const removeFollower = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { followerId } = req.body;
    const { userId } = req.params;

    if (!userId || !followerId) {
      return res
        .status(400)
        .json({ message: 'userId and followerId are required' });
    }

    const userIdInt = parseInt(userId, 10);
    const followerIdInt = parseInt(followerId, 10);

    if (isNaN(userIdInt) || isNaN(followerIdInt)) {
      return res
        .status(400)
        .json({ message: 'userId and followerId must be valid numbers' });
    }

    const usersExist = await db.User.findAll({
      where: {
        id: [userIdInt, followerIdInt],
      },
    });

    if (usersExist.length !== 2) {
      return res
        .status(404)
        .json({ message: 'One or more users do not exist' });
    }

    const followerList = await db.FollowerList.findOne({
      where: { userId: userIdInt },
    });

    if (!followerList) {
      return res.status(404).json({ message: 'Follower list not found' });
    }

    if (followerList.followers.includes(followerIdInt)) {
      followerList.followers = followerList?.followers?.filter(
        (id) => id !== followerIdInt
      );
    }
    await followerList.save();

    const followingList = await db.FollowingList.findOne({
      where: { userId: followerIdInt },
    });

    if (!followingList) {
      return res.status(404).json({ message: 'Following list not found' });
    }

    if (followingList.following.includes(userIdInt)) {
      followingList.following = followingList.following.filter(
        (id) => id !== userIdInt
      );
    }
    await followingList.save();

    return res.status(200).json({
      message: 'Follower removed successfully',
      followerList,
      followingList,
    });
  } catch (error) {
    console.error('Error removing follower:', error);
    return res.status(500).json({
      message: 'Failed to remove follower',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

const updateOtherData = async (
  userId: number,
  field: 'friends' | 'followings',
  increment: boolean
) => {
  const user = await db.User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const otherData = user.other_data || {};
  const currentCount = otherData[field] || 0;

  otherData[field] = increment
    ? currentCount + 1
    : Math.max(0, currentCount - 1);

  user.other_data = otherData;
  user.changed('other_data', true);

  await user.save();
};

export const checkFollowing = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId, followingId } = req.params;

    const userIdNum = parseInt(userId, 10);
    const followingIdNum = parseInt(followingId, 10);

    if (isNaN(userIdNum) || isNaN(followingIdNum)) {
      return res
        .status(400)
        .json({ message: 'userId and followingId must be valid numbers' });
    }

    const followingList = await db.FollowingList.findOne({
      where: { userId: userIdNum },
    });

    if (!followingList) {
      return res.status(404).json({ message: 'Following list not found' });
    }

    const isFollowing = followingList.following.includes(followingIdNum);

    return res.status(200).json({
      isFollowing,
    });
  } catch (error) {
    console.error('Error checking following:', error);
    return res.status(500).json({
      message: 'Failed to check following status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
