const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

router.post('/register', async (req, res) => {
  const { Username, Password } = req.body;
  if (!Username || !Password)
    return res.status(400).json({ error: 'All fields are required' });

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);

    db.query(
      'INSERT INTO User (Username, Password) VALUES (?, ?)',
      [Username, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username already exists' });
          }
          return res.status(500).json(err);
        }
        res.json({ message: 'User registered successfully', userId: result.insertId });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/login', (req, res) => {
  const { Username, Password } = req.body;
  if (!Username || !Password)
    return res.status(400).json({ error: 'All fields are required' });

  db.query('SELECT * FROM User WHERE Username = ?', [Username], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(Password, results[0].Password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ message: 'Login successful', user: results[0] });
  });
});


module.exports = router;
