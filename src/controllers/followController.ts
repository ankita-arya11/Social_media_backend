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

    const usersExist = await db.User.findAll({
      where: {
        id: [userId, followingId],
      },
    });

    if (usersExist.length !== 2) {
      return res
        .status(404)
        .json({ message: 'One or more users do not exist' });
    }

    const followingList = await db.FollowingList.findOne({
      where: { userId },
    });

    if (!followingList) {
      return res.status(404).json({ message: 'Following list not found' });
    }

    if (followingList.following.includes(followingId)) {
      return res
        .status(400)
        .json({ message: 'User is already being followed' });
    }

    const updatedFollowing = [...followingList.following, followingId];
    await followingList.update({ following: updatedFollowing });

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

//add follower
export const addFollower = async (req: Request, res: Response) => {
  try {
    const { followerId } = req.body;
    const { userId } = req.params;

    if (!userId || !followerId) {
      return res.status(400).json({
        message: 'userId and followerId are required',
      });
    }

    const usersExist = await db.User.findAll({
      where: {
        id: [userId, followerId],
      },
    });

    if (usersExist.length !== 2) {
      return res.status(404).json({
        message: 'One or more users do not exist',
      });
    }

    const followerList = await db.FollowerList.findOne({
      where: { userId },
    });

    if (!followerList) {
      return res.status(404).json({
        message: 'Follower list not found',
      });
    }

    if (followerList.followers.includes(followerId)) {
      return res.status(400).json({
        message: 'User is already a follower',
      });
    }

    followerList.followers = [...followerList.followers, followerId];
    await followerList.save();

    res.status(200).json({
      message: 'Follower added successfully',
      followerList,
    });
  } catch (error) {
    console.error('Error adding follower:', error);
    res.status(500).json({
      message: 'Failed to add follower',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
