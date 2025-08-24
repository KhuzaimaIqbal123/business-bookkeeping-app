import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import logo from './roznamcha/pic.png';

export default function Home({ setAuth }) {
  const features = [
    { title: 'Roznamcha', link: '/entries', icon: '📅', desc: 'Track your daily dealings.' },
    { title: 'Khata', link: '/accounts', icon: '📒', desc: 'Manage parties’ khata & balances.' },
    { title: 'Bill Book', link: '/billbook', icon: '🧾', desc: 'Create and manage shop bills easily.' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#6f819eff' }}>
      <Navbar setAuth={setAuth} />

      {/* Hero Section */}
      {/* Hero Section */}
<div
  style={{
    background: 'linear-gradient(135deg, #121e3fff, #09193cff)',
    color: '#fff',
    padding: '70px 30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // align items to left
    flexWrap: 'wrap',
    gap: '30px'
  }}
>
  {/* Left Side - Logo */}
  <div style={{ flex: '0 0 150px', textAlign: 'center' }}>
    <img
      src={logo}
      alt="Shop Logo"
      style={{
        height: '200px',
        objectFit: 'contain',
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))'
      }}
    />
  </div>

  {/* Right Side - Text */}
  <div style={{ flex: '1', minWidth: '350px', maxWidth: '600px' }}>
    <h1 style={{ fontSize: '3.8rem', marginBottom: '10px', color: 'brown' }}>
      Khata & Roznamcha Management System
    </h1>
  </div>
</div>


      {/* Feature Cards */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '30px',
        padding: '60px',
        flex: 1
      }}>
        {features.map((item, index) => (
          <div
            key={index}
            style={{
              background: '#031128ff',
              padding: '30px',
              borderRadius: '15px',
              width: '350px',
              height: "350px",
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ fontSize: '5rem', marginBottom: '15px' }}>{item.icon}</div>
            <h2 style={{ color: '#b5b7baff',fontSize:"39px",marginBottom:"20px" }}>{item.title}</h2>
            <p style={{ color: '#78a4c7ff', minHeight: '40px' }}>{item.desc}</p>
            <Link
              to={item.link}
              style={{
                display: 'inline-block',
                padding: '10px 15px',
                marginTop: "20px",
                background: '#245fddff',
                color: '#fff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize:"20px",
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1e3a8a')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
            >
              View {item.title}
            </Link>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
