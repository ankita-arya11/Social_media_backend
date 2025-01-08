import { Request, Response } from 'express';
import db from '../models';
import { Op } from 'sequelize';

export const getMessages = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.params;

  if (!senderId || !receiverId) {
    return res
      .status(400)
      .json({ message: 'senderId and receiverId are required' });
  }

  const senderIdInt = parseInt(senderId);
  const receiverIdInt = parseInt(receiverId);

  if (isNaN(senderIdInt) || isNaN(receiverIdInt)) {
    return res
      .status(400)
      .json({ message: 'senderId and receiverId must be valid numbers' });
  }

  try {
    const senderExists = await db.User.findByPk(senderIdInt);
    const receiverExists = await db.User.findByPk(receiverIdInt);

    if (!senderExists || !receiverExists) {
      return res.status(404).json({ message: 'Sender or Receiver not found' });
    }

    const messages = await db.Messages.findAll({
      where: {
        [Op.or]: [
          {
            sender_id: senderIdInt,
            receiver_id: receiverIdInt,
          },
          {
            sender_id: receiverIdInt,
            receiver_id: senderIdInt,
          },
        ],
      },
      order: [['createdAt', 'ASC']],
    });

    if (messages.length === 0) {
      return res.status(200).json({ messages: [] });
    }
    return res.status(200).json({ messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    return res
      .status(500)
      .json({ message: 'An error occurred while fetching messages' });
  }
};
