import { Server, Socket } from 'socket.io';
import db from '../models';

interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
}

export const handleSocketConnection = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    console.log('socket connected', socket.id);
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
        const senderId = parseData.senderId;
        const receiverId = parseData.receiverId;
        const text = parseData.text;
        await db.Messsages.create({
          sender_id: senderId,
          receiver_id: receiverId,
          message: text,
        });


        const receiver = await db.User.findOne({
          where: { id: receiverId },
          attributes: ['socket_id'],
        });

        const senderInfo = await db.User.findOne({
          where: { id: senderId },
          attributes: ['id', 'username', 'full_name', 'profile_picture'],
        });

        if (receiver && receiver.socket_id) {
          io.to(receiver.socket_id).emit('receiveMessage', {
            senderId,
            text,
            receiverId,
            senderInfo,
            timestamp: new Date(),
          });
          console.log(`Message sent to receiver ${receiverId}`);
        }
      } catch (err) {
        console.error('Error handling sendMessage event:', err);
      }
    });

    socket.on('disconnect', async () => {});
  });
};
