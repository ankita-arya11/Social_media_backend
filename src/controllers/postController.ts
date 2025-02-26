import { Request, Response } from 'express';
import db from '../models';
import sendEmail from '../helpers/email';
import { io } from '../index';

export const createPost = async (req: Request, res: Response) => {
  const { userId, content, mediaUrls } = req.body;

  if (!userId || !mediaUrls) {
    return res
      .status(400)
      .json({ message: 'User ID, and media URL are required' });
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

    const postCount = await db.Post.count({ where: { userId } });

    user.posts = postCount;

    await user.save();
    io.emit('newPost', true);

    const emailTemplate = `
      <p>Hello {{recipientName}}!</p>
      <p>Guess what! {{creatorName}} (Username: {{creatorUsername}}) just shared a new post, and it's worth checking out!</p>
      <p>🔥 See what's trending now and join the buzz!</p>
      <p>👉 Click here to view the post: <a href="http://192.168.100.186:3000/dashboard/user/${userId}/posts">View Post</a></p>
      <p>Stay connected,<br /></p>
      <p>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxFIGZTCDVxnV5EcAxwEik-tGmTdim5vyyAw&s" alt="Socialize Hiteshi Logo" style="width: 15px; height: auto; vertical-align: middle;">Socialize@Hiteshi
      </p>
    `;

    const htmlContent = emailTemplate
      .replace('{{recipientName}}', 'Shubham')
      .replace('{{creatorName}}', user.full_name || 'A user')
      .replace('{{creatorUsername}}', user.username || 'unknown');

    const emailData = {
      receiver: 'lokendra.patidar@hiteshi.com',
      subject: 'New Post Created',
      text: `Admin! Guess what! ${user.full_name || 'A user'} (Username: ${
        user.username || 'unknown'
      }) just shared a brand-new post. Check it out at http://example.com/posts/${
        newPost.id
      }`,
      html: htmlContent,
    };

    const emailSent = await sendEmail(emailData);

    if (!emailSent) {
      console.error('Failed to send email notification');
    }

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
        {
          model: db.PostLike,
          attributes: ['userId', 'reactionId'],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const postJson = post.toJSON();
    const likes = postJson.PostLikes || [];
    const uniqueReactionIds = Array.from(
      new Set(likes.map((like) => like.reactionId))
    );

    res.status(200).json({
      message: 'Post fetched successfully',
      post: {
        ...postJson,
        reactionIds: uniqueReactionIds,
      },
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
    const limit = req.query.limit ? parseInt(req.query.limit as string) : null;
    const offset = req.query.limit
      ? parseInt(req.query.offset as string)
      : null;
    const posts = await db.Post.findAll({
      ...(limit ? { limit } : {}),
      ...(offset ? { offset } : {}),
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
          attributes: ['userId', 'reactionId'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const processedPosts = posts.map((post) => {
      const postJson = post.toJSON();
      const likes = postJson.PostLikes || [];
      const uniqueReactionIds = Array.from(
        new Set(likes.map((like) => like.reactionId))
      );
      return {
        ...postJson,
        reactionIds: uniqueReactionIds,
      };
    });

    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: processedPosts,
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
          attributes: ['userId', 'reactionId'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const postCount = await db.Post.count({ where: { userId } });

    user.posts = postCount;

    await user.save();

    const processedPosts = posts.map((post) => {
      const postJson = post.toJSON();
      const likes = postJson.PostLikes || [];
      const uniqueReactionIds = Array.from(
        new Set(likes.map((like) => like.reactionId))
      );
      return {
        ...postJson,
        reactionIds: uniqueReactionIds,
      };
    });

    res.status(200).json({
      message: 'Posts fetched by user successfully',
      posts: processedPosts,
    });
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

    const user = await db.User.findByPk(post.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await post.destroy();

    const postCount = await db.Post.count({ where: { userId: post.userId } });

    user.posts = postCount;

    await user.save();

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
  const { userId, postId, reactionId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({
      message: 'User ID and Post ID are required',
    });
  }

  try {
    const post = await db.Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingLike = await db.PostLike.findOne({
      where: { userId, postId },
    });

    if (existingLike) {
      if (reactionId) {
        // Update the reaction
        await existingLike.update({ reactionId });
        return res.status(200).json({
          message: 'Reaction updated successfully',
        });
      } else {
        // Unlike the post
        await existingLike.destroy();
        await db.Post.decrement('likesCount', { where: { id: postId } });

        await db.MyNotification.destroy({
          where: {
            userId: post.userId,
            type: 'like',
            notifyData: {
              postId,
              user: { id: userId },
            },
          },
        });

        return res.status(200).json({
          message: 'Post unliked successfully',
        });
      }
    } else {
      if (reactionId) {
        // Like the post with reaction
        const newLike = await db.PostLike.create({
          userId,
          postId,
          reactionId,
        });

        const user = await db.User.findOne({
          where: { id: userId },
          attributes: [
            'id',
            'username',
            'socket_id',
            'full_name',
            'profile_picture',
          ],
        });

        await db.Post.increment('likesCount', { where: { id: postId } });
        if (user) {
          await db.MyNotification.create({
            userId: post.userId,
            type: 'like',
            isRead: false,
            notifyData: {
              postId,
              user: {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                profile_picture: user.profile_picture,
              },
            },
          });
        }

        return res.status(201).json({
          message: 'Post liked successfully',
          like: newLike,
        });
      }

      return res.status(400).json({
        message: 'Reaction ID is required for liking a post',
      });
    }
  } catch (error) {
    console.error('Error toggling post like:', error);
    return res.status(500).json({
      message: 'Failed to toggle post like',
    });
  }
};

export const latestPosts = async (req: Request, res: Response) => {
  try {
    const latestPosts = await db.Post.findAll({
      order: [['createdAt', 'DESC']],
      limit: 4,
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
          attributes: ['userId', 'reactionId'],
        },
      ],
    });

    const processedPosts = latestPosts.map((post) => {
      const postJson = post.toJSON();
      const likes = postJson.PostLikes || [];
      const uniqueReactionIds = Array.from(
        new Set(likes.map((like) => like.reactionId))
      );
      return {
        ...postJson,
        reactionIds: uniqueReactionIds,
      };
    });

    res.status(200).json({
      message: 'Posts fetched by user successfully',
      posts: processedPosts,
    });
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return res.status(500).json({
      message: 'Failed to fetch latest posts',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const editPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { content, mediaUrls } = req.body;

    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    if (!content && !mediaUrls) {
      return res.status(400).json({
        message: 'Content or Media URLs must be provided to update the post',
      });
    }

    const post = await db.Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (content) {
      post.content = content;
    }

    if (mediaUrls) {
      post.mediaUrls = mediaUrls;
    }

    await post.save();

    return res.status(200).json({
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    console.error('Error editing post:', error);
    return res.status(500).json({
      message: 'Failed to edit post',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
