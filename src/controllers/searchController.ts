import { Request, Response } from 'express';
import { Op } from 'sequelize';
import db from '../models';

export const searchQuery = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { query } = req.params;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        message: 'Search query is required',
      });
    }

    const posts = await db.Post.findAll({
      where: {
        content: {
          [Op.like]: `%${query}%`,
        },
      },
      attributes: ['id', 'content', 'userId', 'mediaUrls', 'createdAt'],
      include: [
        {
          model: db.User,
          attributes: ['id', 'username'],
        },
      ],
    });
    const users = await db.User.findAll({
      where: {
        username: {
          [Op.like]: `%${query}%`,
        },
      },
      attributes: ['id', 'username', 'profile_picture'],
    });

    return res.status(200).json({
      message: 'Search results fetched successfully',
      results: {
        posts,
        users,
      },
    });
  } catch (error) {
    console.error('Error in search query:', error);
    return res.status(500).json({
      message: 'Failed to fetch search results',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
