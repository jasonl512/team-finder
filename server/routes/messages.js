import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from './auth.js';

const router = Router();

// Get the list of people you have chatted with
// GET /api/messages
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT u.id, u.username
       FROM messages m
       JOIN users u ON u.id = CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
       WHERE m.sender_id = $1 OR m.receiver_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Get all messages between you and another user
// GET /api/messages/:userId
router.get('/:userId', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [req.user.id, req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Send a message to another user
// POST /api/messages/:userId
router.post('/:userId', requireAuth, async (req, res) => {
  const { body } = req.body;

  if (!body || !body.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, body) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, req.params.userId, body.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

export default router;
