import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import askBragRouter from './routes/askBrag.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/askBrag', askBragRouter);

// Health check
app.get('/', (req, res) => {
  res.send('BikeBrag backend is running 🚴');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
