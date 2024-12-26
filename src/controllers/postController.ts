import { Request, Response } from 'express';
import db from '../models';
import { uploadToCloudinary } from '../helpers/uploadToCloudinary';

export const createPost = async (req: Request, res: Response) => {
  const { userId, content, mediaUrl } = req.body;

  if (!userId || !content || !mediaUrl) {
    return res
      .status(400)
      .json({ message: 'User ID and content are required' });
  }
  try {
    const newPost = await db.Post.create({
      userId,
      content,
      mediaUrl,
      likesCount: 0,
      commentsCount: 0,
    });

    return res.status(201).json({
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'Failed to create post' });
  }
};
