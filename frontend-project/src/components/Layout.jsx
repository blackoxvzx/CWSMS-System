import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../api';

const nav = [
  { to: '/car', label: 'Car' },
  { to: '/packages', label: 'Packages' },
  { to: '/service-package', label: 'ServicePackage' },
  { to: '/payment', label: 'Payment' },
  { to: '/reports', label: 'Reports' },
];

export default function Layout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    auth.logout().then(() => navigate('/login'));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-primary-800 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden p-2 rounded hover:bg-primary-700"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <span className="font-semibold">CWSMS</span>
          </div>
          <nav className={`absolute md:relative top-14 left-0 right-0 md:top-0 bg-primary-800 md:bg-transparent ${menuOpen ? 'block' : 'hidden md:flex'} md:flex items-center gap-1`}>
            {nav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `block md:inline-block px-4 py-3 md:py-2 rounded md:rounded-md ${isActive ? 'bg-primary-600' : 'hover:bg-primary-700'}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="block w-full text-left md:inline-block px-4 py-3 md:py-2 rounded md:rounded-md hover:bg-primary-700"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
