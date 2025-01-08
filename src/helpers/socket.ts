import { Server, Socket } from 'socket.io';

interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
}

export const handleSocketConnection = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    socket.on(
      'sendMessage',
      ({ senderId, receiverId, text }: Message & { roomId: string }) => {
        const message: Message = {
          senderId,
          receiverId,
          text,
          timestamp: new Date(),
        };
      }
    );

    socket.on('disconnect', () => {});
  });
};
