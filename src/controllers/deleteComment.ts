import { Request, Response } from 'express';
import db from '../models';

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
