import { Request, Response } from 'express';
import db from '../models';

export const createComment = async (req: Request, res: Response) => {
  const { userId, postId, comment } = req.body;

  if (!userId || !postId || !comment) {
    return res
      .status(400)
      .json({ message: 'User ID, Post ID, and comment are required' });
  }

  try {
    const newComment = await db.Comment.create({
      userId,
      postId,
      comment,
      likesCount: 0,
    });

    await db.Post.increment('commentsCount', { where: { id: postId } });

    return res.status(201).json({
      message: 'Comment created successfully',
      comment: newComment,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({ message: 'Failed to create comment' });
  }
};
