import { Server, Socket } from 'socket.io';
import db from '../models';

export const handleSocketConnection = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    socket.on('userJoined', async (data) => {
      try {
        console.log('Incoming data:', data);
        const parseData = JSON.parse(data);
        const userId = parseData.userId;
        if (typeof userId !== 'number') {
          throw new Error('Invalid userId type. Expected a number.');
        }

        await db.User.update(
          { socket_id: socket.id },
          { where: { id: userId } }
        );
        console.log(`Socket ID updated for user ${userId}`);
      } catch (err) {
        console.error('Error updating socket_id:', err);
      }
    });

    socket.on('sendMessage', async (data) => {
      try {
        const parseData = JSON.parse(data);
        const sender_id = parseData.sender_id;
        const receiver_id = parseData.receiver_id;
        const message = parseData.message;
        await db.Messages.create({
          sender_id: sender_id,
          receiver_id: receiver_id,
          message: message,
          is_read: false,
        });

        const receiver = await db.User.findOne({
          where: { id: receiver_id },
          attributes: ['socket_id'],
        });

        const senderInfo = await db.User.findOne({
          where: { id: sender_id },
          attributes: ['id', 'username', 'full_name', 'profile_picture'],
        });

        if (receiver && receiver.socket_id) {
          const unreadMessagesCount = await db.Messages.count({
            where: { receiver_id, is_read: false },
          });
          io.to(receiver.socket_id).emit('receiveMessage', {
            sender_id,
            message,
            receiver_id,
            senderInfo,
            timestamp: new Date(),
          });
          io.to(receiver.socket_id).emit('newNotification', {
            sender_id,
            unreadMessagesCount,
            receiver_id,
          });
          console.log(`Message sent to receiver ${receiver_id}`);
        }
      } catch (err) {
        console.error('Error handling sendMessage event:', err);
      }
    });

    socket.on('markMessagesAsRead', async (data) => {
      try {
        const { userId, senderId } = JSON.parse(data);
        await db.Messages.update(
          { is_read: true },
          {
            where: { receiver_id: userId, sender_id: senderId, is_read: false },
          }
        ); // Count unread messages for the user
        const unreadMessagesCount = await db.Messages.count({
          where: { receiver_id: userId, is_read: false },
        });

        // Fetch the user's socket_id
        const user = await db.User.findOne({
          where: { id: userId },
          attributes: ['socket_id'],
        });

        if (user && user.socket_id) {
          // Notify the user with updated unread counts
          io.to(user.socket_id).emit('newNotification', {
            sender_id: senderId,
            unreadMessagesCount,
          });
        }
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    });

    socket.on('disconnect', async () => {});
  });
};
