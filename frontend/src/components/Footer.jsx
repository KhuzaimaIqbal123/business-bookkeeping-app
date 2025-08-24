import React from 'react';

export default function Footer() {
  return (
    <>
      <footer className="footer-container">
        <div className="footer-content">
          {/* Left side text */}
          <p className="footer-text">
            © 2025 Ghosia Fabrics | Wakeelan Wali Gali #7, Madni Center Basement Shop #9,10
          </p>
        </div>
      </footer>

      <style>
        {`
          .footer-container {
            background: linear-gradient(135deg, #010919ff, #010815ff);
              color: #9cafc3ff;

            padding: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            width: 100%;
          }

          .footer-content {
            display: flex;
            justify-content: space-between; /* text left, icons right */
            align-items: center;
            flex-wrap: nowrap;
            width: 100%;          /* full width */
            padding: 0 20px;      /* small left/right padding */
            box-sizing: border-box;
          }

          .footer-text {
            font-size: 20px;
            letter-spacing: 0.5px;
            margin: 0;
            color: #9cafc3ff;
            font-weight: 600;
            white-space: nowrap;   /* prevent wrapping */
          }


          @media (max-width: 600px) {
            .footer-content {
              flex-direction: column;
              gap: 10px;
              text-align: center;
              padding: 10px;
            }
          }
        `}
      </style>
    </>
  );
}
