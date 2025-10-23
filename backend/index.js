require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL using the credentials from .env
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// 🔹 Route 1: Get all notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// 🔹 Route 2: Add a new notification
app.post('/api/notifications', async (req, res) => {
  const { title, body, level } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO notifications (title, body, level) VALUES ($1, $2, $3) RETURNING *',
      [title, body, level || 'info']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting notification:', err.message);
    res.status(500).json({ error: 'Insert failed' });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Notification server running on port ${PORT}`);
});
