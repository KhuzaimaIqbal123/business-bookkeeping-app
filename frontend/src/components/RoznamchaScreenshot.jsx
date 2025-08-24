import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function RoznamchaScreenshot() {
  const { date } = useParams();
  const [screenshot, setScreenshot] = useState(null);
  const cardRef = useRef();

  useEffect(() => {
    const fetchScreenshot = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/roznamcha/screenshot/${date}`);
        if (!res.ok) throw new Error('Screenshot not found');
        const data = await res.json();
        setScreenshot(data.imageData);
      } catch (err) {
        console.error(err);
        alert('Screenshot not available for this date.');
      }
    };
    fetchScreenshot();
  }, [date]);

  // ✅ Print function: only date + image
  const handlePrint = () => {
    if (!screenshot) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const imgSrc = screenshot;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Roznamcha - ${date}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
              color: #000;
              text-align: center;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
            }
          </style>
        </head>
        <body>
          <h1>Roznamcha - ${date}</h1>
          <img src="${imgSrc}" alt="Roznamcha ${date}" />
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const backButtonStyle = {
    padding: '12px 20px',
    backgroundColor: '#294c97ff',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const printButtonStyle = {
    padding: '12px 22px',
    backgroundColor: '#105f44ff',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
              background: '#0e2447ff',
      padding: '60px 20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div 
        ref={cardRef} 
        className="card"
        style={{
          width: '100%',
          maxWidth: '1300px',
          height:"auto",
          backgroundColor: '#000000ff',
          border:"10px solid #786f6fff",
          borderRadius: '16px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          animation: 'fadeIn 0.5s ease-in-out'
        }}
      >
        {/* Back Button */}
        <Link to="/entries" style={{ position: 'absolute', top: '25px', left: '25px' }}>
          <button style={backButtonStyle} className="back-button">
            ← Back to Roznamcha
          </button>
        </Link>

        {/* Print Button at Top Right */}
        <button 
          onClick={handlePrint}
          style={{
            ...printButtonStyle,
            position: 'absolute',
            top: '25px',
            right: '25px',
          }}
          className="print-button"
        >
          🖨 Print Roznamcha
        </button>

        {/* Page Title */}
        <h1 className="page-title" style={{ marginBottom: '25px', fontSize: '28px', color: '#858181ff', fontWeight: '700', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
          Roznamcha - {date}
        </h1>

       { screenshot ? (
  <div style={{
    width: '100%',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    cursor: 'pointer',
    marginBottom: '25px'
  }}>
    <img
      src={screenshot}
      alt={`Roznamcha ${date}`}
      style={{
        width: '100%',         // fit parent width
        height: 'auto',        // maintain aspect ratio
        display: 'block',
        objectFit: 'contain'   // fit within card without cropping
      }}
    />
  </div>
) : (
  <p style={{
    color: '#0b1421ff',
    fontSize: '17px',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '30px 0'
  }}>
    No screenshot available for this date.
  </p>
)}

        {/* Hover styles */}
        <style>{`
          .print-button:hover {
            background-color: #060707ff;
            transform: translateY(-3px);
          }
          .back-button:hover {
            background-color: #1e40af;
            transform: translateY(-3px);
          }
        `}</style>
      </div>
    </div>
  );
}
