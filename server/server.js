import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { setupDatabase } from './db.js';
import userRoutes from './routes/users.js';
import playerRoutes from './routes/players.js';
import postRoutes from './routes/posts.js';
import messageRoutes from './routes/messages.js';

const app = express();

app.use(cors());          // allow the React app to call this API
app.use(express.json());  // parse JSON request bodies

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Team Finder API is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

// Create tables first, then start listening
setupDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
