const express = require('express');
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// INSERT
router.post('/', async (req, res) => {
  try {
    const { PlateNumber, PackageNumber, ServiceDate } = req.body;
    if (!PlateNumber || !PackageNumber || !ServiceDate) {
      return res.status(400).json({ error: 'PlateNumber, PackageNumber, ServiceDate required' });
    }
    const [result] = await db.query(
      'INSERT INTO ServicePackage (PlateNumber, PackageNumber, ServiceDate) VALUES (?, ?, ?)',
      [PlateNumber, PackageNumber, ServiceDate]
    );
    res.status(201).json({ success: true, RecordNumber: result.insertId });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'Invalid Car or Package' });
    res.status(500).json({ error: err.message });
  }
});

// RETRIEVE all
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT sp.RecordNumber, sp.PlateNumber, sp.PackageNumber, sp.ServiceDate,
       c.DriverName, c.CarType, c.CarSize, p.PackageName, p.PackageDescription, p.PackagePrice
       FROM ServicePackage sp
       JOIN Car c ON sp.PlateNumber = c.PlateNumber
       JOIN Package p ON sp.PackageNumber = p.PackageNumber
       ORDER BY sp.ServiceDate DESC, sp.RecordNumber DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RETRIEVE one (for bill)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT sp.RecordNumber, sp.ServiceDate, sp.PlateNumber,
       c.DriverName, c.CarType, c.CarSize, c.PhoneNumber,
       p.PackageName, p.PackageDescription, p.PackagePrice
       FROM ServicePackage sp
       JOIN Car c ON sp.PlateNumber = c.PlateNumber
       JOIN Package p ON sp.PackageNumber = p.PackageNumber
       WHERE sp.RecordNumber = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Service record not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE (only on ServiceRecord per spec)
router.put('/:id', async (req, res) => {
  try {
    const { PlateNumber, PackageNumber, ServiceDate } = req.body;
    if (!PlateNumber || !PackageNumber || !ServiceDate) {
      return res.status(400).json({ error: 'PlateNumber, PackageNumber, ServiceDate required' });
    }
    const [result] = await db.query(
      'UPDATE ServicePackage SET PlateNumber=?, PackageNumber=?, ServiceDate=? WHERE RecordNumber=?',
      [PlateNumber, PackageNumber, ServiceDate, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE (only on ServiceRecord per spec)
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM ServicePackage WHERE RecordNumber = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
