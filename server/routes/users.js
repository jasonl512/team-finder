import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { requireAuth } from './auth.js';

const router = Router();

// Register a new user
// POST /api/users/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username or email already taken.' });
    }
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Log in
// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    delete user.password;
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Get the logged in user's profile
// GET /api/users/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, bio, game, platform, rank FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Update the logged in user's profile
// PUT /api/users/me
router.put('/me', requireAuth, async (req, res) => {
  const { bio, game, platform, rank } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET bio = $1, game = $2, platform = $3, rank = $4 WHERE id = $5 RETURNING id, username, email, bio, game, platform, rank',
      [bio, game, platform, rank, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

export default router;
