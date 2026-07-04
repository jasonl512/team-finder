import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from './auth.js';

const router = Router();

// Get all posts
// GET /api/posts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Create a new post
// POST /api/posts
router.post('/', requireAuth, async (req, res) => {
  const { title, description, game } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO posts (user_id, username, title, description, game) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, req.user.username, title, description, game]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Delete a post (only the author can delete their own post)
// DELETE /api/posts/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT user_id FROM posts WHERE id = $1',
      [req.params.id]
    );

    const post = result.rows[0];
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    if (post.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own posts.' });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    res.json({ message: 'Post deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

export default router;
