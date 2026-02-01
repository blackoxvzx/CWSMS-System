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

// CORS: allow frontend (Vercel URL in production, localhost in dev)
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((o) => o.trim())
  : ['http://localhost:3000'];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
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

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`CWSMS Backend running on http://localhost:${PORT}`);
});
