const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
    const { SlotNumber, SlotStatus } = req.body;
    db.query('INSERT INTO ParkingSlot VALUES (?, ?)', [SlotNumber, SlotStatus], (err) => {
        if (err){
            console.log(err)
return res.status(500).json(err);
        } 
            
        res.json({ message: 'Slot added' });
    });
});

router.get('/', (req, res) => {
    db.query('SELECT * FROM ParkingSlot', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;
