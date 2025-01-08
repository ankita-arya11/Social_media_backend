import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes';
import sequelize from './db/db';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { handleSocketConnection } from './helpers/socket';
dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = 5000;

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());
app.use(authRoutes);

handleSocketConnection(io);

server.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.sync({ alter: true });
    console.log('Database synchronized!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});
