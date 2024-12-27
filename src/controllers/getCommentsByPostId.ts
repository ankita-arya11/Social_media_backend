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
      attributes: [
        'id',
        'userId',
        'postId',
        'comment',
        'likesCount',
        'createdAt',
      ],
      include: [
        {
          model: db.User,
          attributes: ['id', 'full_name', 'username', 'profile_picture'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!comments.length) {
      return res.status(404).json({ message: 'No comments yet' });
    }

    res.status(200).json({
      message: 'Comments fetched successfully',
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
