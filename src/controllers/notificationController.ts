import { Request, Response } from 'express';
import db from '../models';

export const isMyNotification = async (req: Request, res: Response) => {
  const userId = (req as any)?.user?.id;

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' });
  }

  try {
    const notifications = await db.MyNotification.findAll({
      where: { userId, isRead: false },
    });

    return res.status(200).json({
      status: notifications.length > 0 ? true : false,
      message: `${
        notifications.length > 0 ? 'There are new' : 'No new'
      } notifications.`,
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getMyNotification = async (req: Request, res: Response) => {
  const userId = (req as any)?.user?.id;

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' });
  }

  try {
    const notifications = await db.MyNotification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    await db.MyNotification.update(
      { isRead: true },
      {
        where: {
          userId: userId,
          isRead: false,
        },
      }
    );

    return res.status(200).json({
      notifications: notifications,
      message: `${notifications ? 'There are new' : 'No new'} notifications.`,
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const isNewMessage = async (req: Request, res: Response) => {
  const userId = (req as any)?.user?.id;
  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' });
  }

  try {
    const unreadMessages = await db.Messages.findAll({
      where: {
        receiver_id: userId,
        is_read: false,
      },
    });

    if (unreadMessages.length > 0) {
      return res
        .status(200)
        .json({ status: true, message: 'New messages available' });
    }

    return res.status(200).json({ status: false, message: 'No new messages' });
  } catch (error) {
    console.error('Error checking messages:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
