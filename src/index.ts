import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes';
import sequelize from './db/db';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(authRoutes);
app.listen(PORT, async () => {
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
