import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ setAuth }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    setAuth(false);
    navigate('/login');
  };

  return (
    <>
      <style>
        {`
          .nav-link {
            color: #9cafc3ff;
            text-decoration: none;
            font-size: 1.5rem;
            font-weight: 800;
            transition: color 0.3s ease;
          }
          .nav-link:hover {
            color: #66696cff;
          }
          button.logout-btn {
            font-size: 1.2rem;
            font-weight: 700;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            border: none;
            cursor: pointer;
            transition: transform 0.2s ease, background 0.3s ease;
          }
        `}
      </style>

      <nav
        style={{
          background: 'rgba(1, 11, 36, 1)',
          backdropFilter: 'blur(8px)',
          color: '#f8fafc',
          padding: '0.75rem 1.5rem', // relative units
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          position: 'sticky',
          top: 0,
          width: '100%',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Brand / Company Name */}
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#c5a00aff',
              flexShrink: 0,
            }}
          >
            Ghousia Fabrics By Hassaan & Zeeshan
          </h2>

          {/* Links + Logout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.125rem', // 18px equivalent
              marginLeft: 'auto', // keeps this on the right
              flexWrap: 'wrap', // ensures no overflow on zoom
            }}
          >
            {navLinks.map(({ path, label }) => (
              <Link key={path} to={path} className="nav-link">
                {label}
              </Link>
            ))}

            <button
              className="logout-btn"
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(90deg, #d36b6bff, #bf5151ff)',
                color: '#010305ff',
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  'linear-gradient(90deg, #e85c5cff, #ef5b5bff)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  'linear-gradient(90deg, #d36b6bff, #bf5151ff)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/entries', label: 'Roznamcha' },
  { path: '/accounts', label: 'Khata' },
  { path: '/billbook', label: 'Bill Book' },
];
