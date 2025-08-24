import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from './roznamcha/pic.png'; // replace with your logo path

export default function Login({ setAuth }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ Hardcoded credentials
    if (name === 'ali' && password === 'ali') {
      setAuth(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #012a23ff, #050d34ff)',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      padding: '20px',
      // marginTop:"-30px"
          }}>
      {/* Logo and Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <img src={logoImg} alt="Logo" style={{ width: '200px', height: '200px', marginRight: '10px',marginTop:"-150px",marginBottom:"0px" }} />
        <h1 style={{
          marginTop:"-140px",
          fontSize: '60px',
          fontWeight: '700',
          color: '#785605ff',
          textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
        }}>
          Welcome to Ghousia Fabrics <br /> by Hassaan & Zeeshan
        </h1>
      </div>

     

      {/* Login Card */}
      <div style={{
        background: '#0201018f',
        padding: '50px 40px',
        borderRadius: '20px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
        width: '500px',
        height:"400px",
                  marginRight:"-170px",
                  marginTop:"30px",

        maxWidth: '90%',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{
          marginBottom: '30px',
          color: '#6b747cff',
          fontSize: '32px',
          fontWeight: '700',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          Login to System
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: '100%',
            
              padding: '12px',
              marginBottom: '20px',
                            color:"lightgray",
                            fontStyle:"bold",
                            fontWeight:"30px",
                        
              // border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '17px',
              // outline: 'none',
                            backgroundColor: '#463e3eff', // <-- Add this line

              // transition: 'all 0.3s ease',
            }}
            
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              color:"lightgray",
              marginBottom: '25px',
              // border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '15px',
              // outline: 'none',
              // transition: 'all 0.3s ease',
              backgroundColor: '#463e3eff', // <-- Add this line

            }}
          
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#26517cff',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',

              boxShadow: '0 6px 15px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#34495e';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#2c3e50';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 15px rgba(0,0,0,0.1)';
            }}
          >
            Login
          </button>
        </form>

        <p style={{
          marginTop: '20px',
          fontSize: '13px',
          color: 'gray'
        }}>
          © 2025 Ghosia Fabrics
        </p>
      </div>
    </div>
  );
}
