const express = require('express');
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// INSERT only (per spec: insert on Car form)
router.post('/', async (req, res) => {
  try {
    const { PlateNumber, CarType, CarSize, DriverName, PhoneNumber } = req.body;
    if (!PlateNumber || !CarType || !CarSize || !DriverName || !PhoneNumber) {
      return res.status(400).json({ error: 'PlateNumber, CarType, CarSize, DriverName, PhoneNumber required' });
    }
    await db.query(
      'INSERT INTO Car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES (?, ?, ?, ?, ?)',
      [PlateNumber, CarType, CarSize, DriverName, PhoneNumber]
    );
    res.status(201).json({ success: true, message: 'Car registered' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Car with this plate already exists' });
    res.status(500).json({ error: err.message });
  }
});

// Allow listing cars for dropdowns/forms
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Car ORDER BY PlateNumber');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
