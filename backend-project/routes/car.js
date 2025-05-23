const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
    const { PlateNumber, DriverName, PhoneNumber } = req.body;
    db.query('INSERT INTO Car VALUES (?, ?, ?)', [PlateNumber, DriverName, PhoneNumber], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Car added' });
    });
});

router.get('/', (req, res) => {
    db.query('SELECT * FROM Car', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;
