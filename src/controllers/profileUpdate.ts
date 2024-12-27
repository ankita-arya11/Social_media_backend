import { Request, Response } from 'express';
import db from '../models';

export const profileUpdate = async (req: Request, res: Response) => {
  const { userId, full_name, username, profile_picture, other_data } = req.body;

  if (!full_name && !username && !profile_picture && !other_data) {
    return res.status(400).json({ error: 'No data provided to update.' });
  }

  try {
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const updatedUser = await user.update({
      full_name: full_name || user.full_name,
      username: username || user.username,
      profile_picture: profile_picture || user.profile_picture,
      other_data: other_data || user.other_data,
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
