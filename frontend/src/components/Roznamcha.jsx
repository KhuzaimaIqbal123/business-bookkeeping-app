import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

import Navbar from './Navbar';
import Footer from './Footer';
import CapitalAmount from './roznamcha/CapitalAmount';
import AddEntryForm from './roznamcha/AddEntryForm';
import EntriesTable from './roznamcha/EntriesTable';
import SummaryCard from './roznamcha/SummaryCard';

export default function Roznamcha({ refreshParties }) {
  const [entries, setEntries] = useState([]);
  const [capital, setCapital] = useState(0);
  const [summary, setSummary] = useState(null);
  const [todayDate, setTodayDate] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const pageRef = useRef(null);
  const navigate = useNavigate();

  const fetchAll = async () => {
    try {
      const today = new Date();
      const localDate = today.toLocaleDateString('en-CA');
      setTodayDate(localDate);

      const res1 = await fetch('http://localhost:5000/api/roznamcha/today');
      const todayEntries = await res1.json();
      setEntries(todayEntries);

      const res2 = await fetch('http://localhost:5000/api/roznamcha/capital');
      const capData = await res2.json();
      setCapital(capData?.currentCapital || 0);

      const res3 = await fetch('http://localhost:5000/api/roznamcha/summary');
      const summaryData = await res3.json();
      setSummary(summaryData);

      takeScreenshot(localDate);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const takeScreenshot = async (date) => {
    if (!pageRef.current) return;
    try {
      const canvas = await html2canvas(pageRef.current, { scale: 1.2 });
      const imgData = canvas.toDataURL('image/png');
      await fetch('http://localhost:5000/api/roznamcha/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, imageData: imgData }),
      });
      console.log('✅ Screenshot saved for', date);
    } catch (err) {
      console.error('Failed to capture screenshot', err);
    }
  };

  const handleViewDateClick = () => setShowDateModal(true);
  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const handleDateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/roznamcha/screenshot/${selectedDate}`
      );
      if (!res.ok) throw new Error('Screenshot not found');
      navigate(`/roznamcha/screenshot/${selectedDate}`);
      setShowDateModal(false);
      setSelectedDate('');
    } catch (err) {
      console.error(err);
      alert('Screenshot not available for the selected date.');
    }
  };

  const closeModal = () => {
    setShowDateModal(false);
    setSelectedDate('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '18px',
        lineHeight: '1.6',
      }}
    >
      <Navbar />

      <div
        ref={pageRef}
        style={{
          padding: '20px',
          flex: 1,
          position: 'relative',
          fontSize: '1.1rem',
        }}
      >
        <h2 style={{ marginBottom: '25px', fontSize: '2.2rem' }}>
          Roznamcha - Daily Transactions ({todayDate})
        </h2>

        {/* Top right button */}
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <button
            onClick={handleViewDateClick}
            style={{
              padding: '10px 16px',
              backgroundColor: '#60686eff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              transition: '0.3s',
              fontSize: '1rem',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#50585e')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#60686eff')}
          >
            View any date Roznamcha
          </button>
        </div>

        {/* Modal */}
        {showDateModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              animation: 'fadeIn 0.3s',
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                width: '320px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                animation: 'slideDown 0.3s',
                fontSize: '1rem',
              }}
            >
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>
                Select Date
              </h3>
              <form onSubmit={handleDateSubmit}>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  style={{
                    padding: '10px',
                    width: '100%',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    marginBottom: '15px',
                    fontSize: '1rem',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '10px 12px',
                    backgroundColor: '#06c957ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    width: '100%',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  View
                </button>
              </form>
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#888',
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        <CapitalAmount capital={capital} todayDate={todayDate} onCapitalSet={fetchAll} />
        <AddEntryForm onEntryAdded={fetchAll} takeScreenshot={takeScreenshot} />
        <EntriesTable entries={entries} onUpdated={fetchAll} />
        {summary && <SummaryCard summary={summary} capital={capital} />}
      </div>

      <Footer />

      {/* Modal Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
