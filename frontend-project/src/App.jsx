import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth } from './api';
import Layout from './components/Layout';
import Login from './pages/Login';
import Car from './pages/Car';
import Packages from './pages/Packages';
import ServicePackage from './pages/ServicePackage';
import Payment from './pages/Payment';
import Reports from './pages/Reports';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.me()
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-100"><div className="text-slate-600">Loading...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/car" replace />} />
        <Route path="car" element={<Car />} />
        <Route path="packages" element={<Packages />} />
        <Route path="service-package" element={<ServicePackage />} />
        <Route path="payment" element={<Payment />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
