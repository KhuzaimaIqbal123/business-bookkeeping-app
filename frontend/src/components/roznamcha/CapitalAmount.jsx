import React, { useState, useEffect } from 'react';

export default function CapitalAmount({ capital, todayDate, onCapitalSet }) {
  const [amount, setAmount] = useState('');
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    const fetchCapitalStatus = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/roznamcha/capital');
        const data = await res.json();
        setShouldUpdate(data.isNewDate);
      } catch (err) {
        console.error('Error checking capital status:', err);
      }
    };

    fetchCapitalStatus();
  }, [todayDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return alert('Please enter valid amount');

    try {
      const res = await fetch('http://localhost:5000/api/roznamcha/set-capital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(amount) }),
      });

      const data = await res.json();

      if (data.success) {
        onCapitalSet();
        setShouldUpdate(false);
      } else {
        alert(data.message || 'Error setting capital');
        if (data.currentCapital !== undefined) {
          onCapitalSet();
          setShouldUpdate(false);
        }
      }
    } catch (err) {
      console.error('Error updating capital:', err);
      alert('Failed to update capital. Please try again.');
    }
  };

  if (shouldUpdate) {
    return (
      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: '20px', fontSize: '1.5rem' }}
      >
        <label>Enter Updated Capital: </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 100000"
          required
          style={{ margin: '0 10px', padding: '8px', fontSize: '1.1rem' }}
        />
        <button
          type="submit"
          style={{
            fontSize: '1.1rem',
            padding: '6px 12px',
            cursor: 'pointer',
          }}
        >
          Update Capital
        </button>
      </form>
    );
  }

  return (
    <div
      style={{
        marginBottom: '20px',
        fontWeight: 'bold',
        fontSize: '1.5rem',
      }}
    >
      📊 Current Capital: Rs {capital}
    </div>
  );
}
