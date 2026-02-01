const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/car');
const packageRoutes = require('./routes/package');
const servicePackageRoutes = require('./routes/servicePackage');
const paymentRoutes = require('./routes/payment');
const reportsRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// CORS: allow frontend (Vercel *.vercel.app + FRONTEND_URL list + localhost)
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((o) => o.trim())
  : ['http://localhost:3000'];

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    if (host.endsWith('.vercel.app')) return true;
  } catch (_) {}
  return false;
}

app.use(cors({
  origin: (origin, cb) => {
    if (isAllowedOrigin(origin)) return cb(null, true);
  cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'cwsms-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: isProduction ? 'none' : 'lax'
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/service-packages', servicePackageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportsRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/health/db', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    console.error('DB health check failed:', err.message);
    res.status(503).json({ ok: false, db: 'disconnected', error: err.message });
  }
});

app.get("/", (_req, res) => { res.send("CWSMS Backend is running 🚀"); });

app.listen(PORT, () => {
  console.log(`CWSMS Backend running on http://localhost:${PORT}`);
});
