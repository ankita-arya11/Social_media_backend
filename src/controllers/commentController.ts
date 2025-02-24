import { Request, Response } from 'express';
import db from '../models';
import { io } from '../index';

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

    const post = await db.Post.findByPk(postId, {
      attributes: ['userId'],
    });

    if (post) {
      const commenter = await db.User.findByPk(userId, {
        attributes: ['id', 'username', 'full_name', 'profile_picture'],
      });

      const postUser = await db.User.findOne({
        where: { id: userId },
        attributes: [
          'username',
          'full_name',
          'socket_id',
          'id',
          'profile_picture',
        ],
      });

      if (commenter) {
        await db.MyNotification.create({
          userId: post.userId,
          type: 'comment',
          isRead: false,
          notifyData: {
            postId: postId,
            comment: {
              id: newComment.id,
              text: comment,
            },
            user: {
              id: commenter.id,
              username: commenter.username,
              full_name: commenter.full_name,
              profile_picture: commenter.profile_picture,
            },
          },
        });
        if (postUser?.socket_id) {
          io.to(postUser.socket_id).emit('newComment');
        }
      }
    }

    return res.status(201).json({
      message: 'Comment created successfully',
      comment: newComment,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({ message: 'Failed to create comment' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({ message: 'Comment ID is required' });
    }
    const comment = await db.Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    await comment.destroy();

    await db.Post.decrement('commentsCount', {
      where: { id: comment.postId },
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      message: 'Failed to delete comment',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

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
