const express = require('express');
const router = express.Router();
const db = require('../db');

// In your parking record route file
router.post('/', (req, res) => {
    const { EntryTime, ExitTime, Duration, PlateNumber, SlotNumber } = req.body;
    
    // Validate required fields
    if (!EntryTime || !ExitTime || !PlateNumber || !SlotNumber) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Convert datetime strings to MySQL format
    const mysqlEntryTime = toMySQLDateTime(EntryTime);
    const mysqlExitTime = toMySQLDateTime(ExitTime);
    
    // First check if referenced records exist
    db.query(
        'SELECT 1 FROM Car WHERE PlateNumber = ? UNION SELECT 1 FROM ParkingSlot WHERE SlotNumber = ?', 
        [PlateNumber, SlotNumber],
        (err, results) => {
            if (err) return res.status(500).json(err);
            
            // Check if both exist (should get 2 rows)
            if (results.length !== 2) {
                const plateExists = results.some(r => r.PlateNumber === PlateNumber);
                const slotExists = results.some(r => r.SlotNumber === SlotNumber);
                
                return res.status(400).json({ 
                    message: 'Invalid reference',
                    details: {
                        plateExists: plateExists,
                        slotExists: slotExists
                    }
                });
            }
            
            // Proceed with insert
            db.query(
                'INSERT INTO ParkingRecord (EntryTime, ExitTime, Duration, PlateNumber, SlotNumber) VALUES (?, ?, ?, ?, ?)',
                [mysqlEntryTime, mysqlExitTime, Duration, PlateNumber, SlotNumber],
                (err, result) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json(err);
                    }
                    res.json({ 
                        message: 'Record added', 
                        recordId: result.insertId 
                    });
                }
            );
        }
    );
});


function toMySQLDateTime(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toISOString().slice(0, 19).replace('T', ' ');
}

router.post('/', (req, res) => {
    const { EntryTime, ExitTime, Duration, PlateNumber, SlotNumber } = req.body;
    
    // Convert datetime strings to MySQL format
    const mysqlEntryTime = toMySQLDateTime(EntryTime);
    const mysqlExitTime = toMySQLDateTime(ExitTime);
    
    // First check if referenced records exist
    db.query(
        'SELECT 1 FROM Car WHERE PlateNumber = ? UNION SELECT 1 FROM ParkingSlot WHERE SlotNumber = ?', 
        [PlateNumber, SlotNumber],
        (err, results) => {
            if (err) return res.status(500).json(err);
            
            // Should get 2 rows if both exist
            if (results.length !== 2) {
                return res.status(400).json({ 
                    message: 'Invalid PlateNumber or SlotNumber',
                    details: {
                        plateExists: results.some(r => r.Table === 'Car'),
                        slotExists: results.some(r => r.Table === 'ParkingSlot')
                    }
                });
            }
            
            // Proceed with insert
            db.query(
                'INSERT INTO ParkingRecord (EntryTime, ExitTime, Duration, PlateNumber, SlotNumber) VALUES (?, ?, ?, ?, ?)',
                [mysqlEntryTime, mysqlExitTime, Duration, PlateNumber, SlotNumber],
                (err, result) => {
                    if (err) {
                        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                            return res.status(400).json({ 
                                message: 'Referenced Car or ParkingSlot does not exist'
                            });
                        }
                        return res.status(500).json(err);
                    }
                    res.json({ message: 'Record added', recordId: result.insertId });
                }
            );
        }
    );
});

router.get('/', (req, res) => {
    db.query('SELECT * FROM ParkingRecord', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { EntryTime, ExitTime, Duration, PlateNumber, SlotNumber } = req.body;
    
    // Convert datetime strings to MySQL format
    const mysqlEntryTime = toMySQLDateTime(EntryTime);
    const mysqlExitTime = toMySQLDateTime(ExitTime);
    
    db.query(
        'UPDATE ParkingRecord SET EntryTime=?, ExitTime=?, Duration=?, PlateNumber=?, SlotNumber=? WHERE RecordID=?',
        [mysqlEntryTime, mysqlExitTime, Duration, PlateNumber, SlotNumber, id],
        (err) => {
            if (err) {
                console.log(err)
                return res.status(500).json(err);
            }
            res.json({ message: 'Record updated' });
        }
    );
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM ParkingRecord WHERE RecordID=?', [id], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json(err);
        }
        res.json({ message: 'Record deleted' });
    });
});

module.exports = router;

