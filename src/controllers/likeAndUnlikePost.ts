import { Request, Response } from 'express';
import db from '../models';

export const likeAndUnlikePost = async (req: Request, res: Response) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({
      message: 'user id and post id are required',
    });
  }

  try {
    const existingLike = await db.PostLike.findOne({
      where: { userId, postId },
    });

    if (existingLike) {
      await existingLike.destroy();
      await db.Post.decrement('likesCount', { where: { id: postId } });

      return res.status(200).json({
        message: 'post unliked successfully',
      });
    } else {
      const newLike = await db.PostLike.create({
        userId,
        postId,
      });

      await db.Post.increment('likesCount', { where: { id: postId } });
      return res.status(201).json({
        message: 'post liked successfully',
        like: newLike,
      });
    }
  } catch (error) {
    console.error('error toggling post like', error);
    return res.status(500).json({
      message: 'failed to toggle post like',
    });
  }
};
