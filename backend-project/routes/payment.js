const express = require('express');
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// INSERT only (per spec: insert on Payment form)
router.post('/', async (req, res) => {
  try {
    const { RecordNumber, AmountPaid, PaymentDate } = req.body;
    if (!RecordNumber || AmountPaid == null || !PaymentDate) {
      return res.status(400).json({ error: 'RecordNumber, AmountPaid, PaymentDate required' });
    }
    const [result] = await db.query(
      'INSERT INTO Payment (RecordNumber, AmountPaid, PaymentDate) VALUES (?, ?, ?)',
      [RecordNumber, Number(AmountPaid), PaymentDate]
    );
    res.status(201).json({ success: true, PaymentNumber: result.insertId });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'Invalid Service Record' });
    res.status(500).json({ error: err.message });
  }
});

// List payments (for reports)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.PaymentNumber, p.RecordNumber, p.AmountPaid, p.PaymentDate,
       sp.PlateNumber, sp.ServiceDate, pk.PackageName, pk.PackageDescription
       FROM Payment p
       JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
       JOIN Package pk ON sp.PackageNumber = pk.PackageNumber
       ORDER BY p.PaymentDate DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
