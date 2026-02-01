const express = require('express');
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const [rows] = await db.query('SELECT id, username FROM User WHERE username = ? AND password = ?', [username, password]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.userId = rows[0].id;
    req.session.username = rows[0].username;
    res.json({ success: true, user: { username: rows[0].username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { username: req.session.username } });
});

module.exports = router;
