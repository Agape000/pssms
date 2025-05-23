const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
    const { AmountPaid, PaymentDate, RecordID } = req.body;
    db.query(
        'INSERT INTO Payment (AmountPaid, PaymentDate, RecordID) VALUES (?, ?, ?)',
        [AmountPaid, PaymentDate, RecordID],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Payment recorded', paymentId: result.insertId });
        }
    );
});

router.get('/', (req, res) => {
    db.query('SELECT * FROM Payment', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;

