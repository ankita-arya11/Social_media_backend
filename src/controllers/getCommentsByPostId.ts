import { Request, Response } from 'express';
import db from '../models';

export const getCommentsByPostId = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }
    const comments = await db.Comment.findAll({
      where: { postId },
      attributes: ['id', 'userId', 'comment', 'likesCount', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    if (!comments.length) {
      return res.status(404).json({ message: 'No comments yet' });
    }

    res.status(200).json({
      message: 'comments fetched successfully',
      comments,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      message: 'Failed to fetch comments',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
