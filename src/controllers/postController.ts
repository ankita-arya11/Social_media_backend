import { Request, Response } from 'express';
import db from '../models';

export const createPost = async (req: Request, res: Response) => {
  const { userId, content, mediaUrls } = req.body;

  if (!userId || !content || !mediaUrls) {
    return res
      .status(400)
      .json({ message: 'User ID, content, and media URL are required' });
  }

  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newPost = await db.Post.create({
      userId,
      content,
      mediaUrls,
      likesCount: 0,
      commentsCount: 0,
    });

    const otherData = user?.other_data || {};
    otherData.posts = (otherData?.posts || 0) + 1;

    user.other_data = otherData;

    user.changed('other_data', true);

    await user.save();

    return res.status(201).json({
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'Failed to create post' });
  }
};

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
        'mediaUrls',
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

export const getAllPost = async (req: Request, res: Response) => {
  try {
    const posts = await db.Post.findAll({
      attributes: [
        'id',
        'userId',
        'content',
        'mediaUrls',
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
      order: [['createdAt', 'DESC']],
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

export const getPostByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const posts = await db.Post.findAll({
      where: { userId },
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
      order: [['createdAt', 'DESC']],
    });

    return res
      .status(200)
      .json({ message: 'Posts retrieved successfully', posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

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

export const latestPosts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const latestPosts = await db.Post.findAll({
      order: [['createdAt', 'DESC']],
      limit: 4,
      attributes: [
        'id',
        'content',
        'userId',
        'likesCount',
        'commentsCount',
        'mediaUrls',
        'createdAt',
      ],
      include: [
        {
          model: db.User,
          attributes: ['id', 'username', 'full_name'],
        },
      ],
    });

    return res.status(200).json({
      message: 'Latest posts fetched successfully',
      posts: latestPosts,
    });
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return res.status(500).json({
      message: 'Failed to fetch latest posts',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
