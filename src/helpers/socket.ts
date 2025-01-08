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
          io.to(receiver.socket_id).emit('receiveMessage', {
            sender_id,
            message,
            receiver_id,
            senderInfo,
            timestamp: new Date(),
          });
          console.log(`Message sent to receiver ${receiver_id}`);
        }
      } catch (err) {
        console.error('Error handling sendMessage event:', err);
      }
    });

    socket.on('disconnect', async () => {});
  });
};
