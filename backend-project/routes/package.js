const express = require('express');
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// List packages (for forms and reports)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Package ORDER BY PackageNumber');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// INSERT package (per spec: insert on Services/Packages form)
router.post('/', async (req, res) => {
  try {
    const { PackageName, PackageDescription, PackagePrice } = req.body;
    if (!PackageName || !PackageDescription || PackagePrice == null) {
      return res.status(400).json({ error: 'PackageName, PackageDescription, PackagePrice required' });
    }
    const [result] = await db.query(
      'INSERT INTO Package (PackageName, PackageDescription, PackagePrice) VALUES (?, ?, ?)',
      [PackageName, PackageDescription, Number(PackagePrice)]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
