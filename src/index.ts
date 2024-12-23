import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes';
import sequelize from './db/db';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.sync({ force: false });
    console.log('Database synchronized!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});