import { Request, Response } from 'express';
import db from '../models';

export const getPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    const post = await db.Post.findOne({
      where: { id: postId },
      attributes: [
        'id',
        'userId',
        'content',
        'mediaUrl',
        'likesCount',
        'commentsCount',
        'createdAt',
      ],
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await db.Comment.findAll({
      where: { postId: post.id },
      attributes: ['id', 'userId', 'comment', 'likesCount', 'createdAt'],
      order: [['createdAt', 'ASC']],
    });

    const responseData = {
      ...post.dataValues,
      comments,
    };

    res.status(200).json({
      message: 'Post fetched successfully',
      post: responseData,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      message: 'Failed to fetch post',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};