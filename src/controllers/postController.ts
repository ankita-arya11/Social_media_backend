import { Request, Response } from 'express';
import db from '../models';

//create post
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

//get post
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
      include: [
        {
          model: db.User,
          attributes: ['id', 'username', 'full_name', 'profile_picture'],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({
      message: 'Post fetched successfully',
      post,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      message: 'Failed to fetch post',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

//get all post
export const getAllPost = async (req: Request, res: Response) => {
  try {
    const posts = await db.Post.findAll({
      attributes: [
        'id',
        'userId',
        'content',
        'mediaUrl',
        'likesCount',
        'commentsCount',
        'createdAt',
      ],
      include: [
        {
          model: db.User,
          attributes: ['id', 'username', 'full_name', 'profile_picture'],
        },
        {
          model: db.PostLike,
          attributes: ['userId'],
        },
      ],
      order: [['createdAt', 'DESC']], // Change to DESC for recent posts first
    });

    res.status(200).json({
      message: 'Posts fetched successfully',
      posts,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      message: 'Failed to fetch post',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

//delete post
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    const post = await db.Post.findOne({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.destroy();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      message: 'Failed to delete post',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

//like and unlike
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
