const express = require('express');
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// Daily report: PlateNumber, PackageName, PackageDescription, AmountPaid, PaymentDate
router.get('/daily', async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const [rows] = await db.query(
      `SELECT p.PlateNumber, pk.PackageName, pk.PackageDescription, pay.AmountPaid, pay.PaymentDate
       FROM Payment pay
       JOIN ServicePackage sp ON pay.RecordNumber = sp.RecordNumber
       JOIN Car p ON sp.PlateNumber = p.PlateNumber
       JOIN Package pk ON sp.PackageNumber = pk.PackageNumber
       WHERE pay.PaymentDate = ?
       ORDER BY pay.PaymentNumber`,
      [date]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
