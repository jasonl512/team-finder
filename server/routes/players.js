import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// Get all players, with optional game and platform filters
// GET /api/players?game=Valorant&platform=PC
router.get('/', async (req, res) => {
  const { game, platform } = req.query;

  try {
    let queryText = 'SELECT id, username, bio, game, platform, rank FROM users';
    const values = [];
    const conditions = [];

    if (game && game !== 'All') {
      values.push(game);
      conditions.push(`game = $${values.length}`);
    }

    if (platform && platform !== 'All') {
      values.push(platform);
      conditions.push(`platform = $${values.length}`);
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += ' ORDER BY username ASC';

    const result = await pool.query(queryText, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

export default router;
