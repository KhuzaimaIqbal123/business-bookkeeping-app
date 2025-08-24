import React, { useState, useEffect } from 'react';

export default function AddEntryForm({ onEntryAdded, takeScreenshot }) {
  const [formData, setFormData] = useState({
    type: 'income',
    paymentType: 'cash',
    category: 'party',
    amount: '',
    description: '',
    partyName: '',
    numberOfCheques: '',
    chequeDetails: []
  });

  const [parties, setParties] = useState([]);
  const [availableCheques, setAvailableCheques] = useState([]);
  const [selectedChequeIds, setSelectedChequeIds] = useState([]);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/parties');
        const data = await res.json();
        setParties(data.map(p => p.name));
      } catch (err) {
        console.error('Failed to fetch parties', err);
      }
    };
    fetchParties();
  }, []);

  useEffect(() => {
    const fetchAvailableCheques = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/roznamcha/cheques/available');
        const data = await res.json();
        setAvailableCheques(data);
      } catch (err) {
        console.error('Failed to fetch available cheques', err);
      }
    };
    if (formData.paymentType === 'cheque' && formData.type === 'expense') {
      fetchAvailableCheques();
    } else {
      setAvailableCheques([]);
      setSelectedChequeIds([]);
    }
  }, [formData.paymentType, formData.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'numberOfCheques') {
      const count = parseInt(value) || 0;
      setFormData(prev => ({
        ...prev,
        numberOfCheques: value,
        chequeDetails: Array.from({ length: count }, (_, i) => prev.chequeDetails[i] || { amount: '', date: '' })
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleChequeDetailChange = (index, field, value) => {
    const updated = [...formData.chequeDetails];
    updated[index][field] = value;
    if (field === 'amount') {
      const total = updated.reduce((sum, chq) => sum + (parseFloat(chq.amount) || 0), 0);
      setFormData(prev => ({ ...prev, chequeDetails: updated, amount: total }));
    } else {
      setFormData(prev => ({ ...prev, chequeDetails: updated }));
    }
  };

  const toggleAvailableCheque = (chequeId) => {
    setSelectedChequeIds(prev => {
      const exists = prev.includes(chequeId);
      const newArr = exists ? prev.filter(id => id !== chequeId) : [...prev, chequeId];
      const total = availableCheques
        .filter(chq => newArr.includes(String(chq._id)))
        .reduce((s, c) => s + (Number(c.amount) || 0), 0);
      setFormData(prev => ({ ...prev, amount: total }));
      return newArr;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      numberOfCheques: formData.numberOfCheques ? Number(formData.numberOfCheques) : null
    };

    if (formData.type === 'expense' && formData.paymentType === 'cheque') {
      payload.selectedChequeIds = selectedChequeIds;
      payload.chequeDetails = [];
    }

    if (formData.type === 'income' && formData.paymentType === 'cheque') {
      payload.chequeDetails = (formData.chequeDetails || []).map(cd => ({
        amount: Number(cd.amount) || 0,
        date: cd.date ? cd.date : new Date()
      }));
      payload.amount = payload.chequeDetails.reduce((s, c) => s + c.amount, 0);
    }

    try {
      const res = await fetch('http://localhost:5000/api/roznamcha/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Entry added successfully!');
        setFormData({
          type: 'income',
          paymentType: 'cash',
          category: 'party',
          amount: '',
          description: '',
          partyName: '',
          numberOfCheques: '',
          chequeDetails: []
        });
        setSelectedChequeIds([]);
        onEntryAdded();
        if (typeof takeScreenshot === 'function') {
          takeScreenshot(new Date().toISOString().split('T')[0]);
        }
      } else {
        alert('Error adding entry.');
      }
    } catch (err) {
      alert('Failed to connect to server.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      marginBottom: '30px',
      fontSize: '1.1rem'
    }}>
      <h3 style={{ marginBottom: '15px', fontSize: '1.6rem' }}>Add New Entry</h3>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <select name="type" value={formData.type} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
          <option value="income">Income (Amdaan)</option>
          <option value="expense">Expense (Bnam)</option>
        </select>

        <select name="paymentType" value={formData.paymentType} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
          <option value="cash">Cash</option>
          <option value="cheque">Cheque</option>
        </select>

        <select name="category" value={formData.category} onChange={handleChange} style={{ fontSize: '1.1rem' }}>
          <option value="party">Party Transaction</option>
          <option value="extra">Extra Kharcha</option>
        </select>

        {formData.category === 'party' && (
          <select name="partyName" value={formData.partyName} onChange={handleChange} required style={{ fontSize: '1.1rem' }}>
            <option value="">Select Party</option>
            {parties.map((party, idx) => (
              <option key={idx} value={party}>{party}</option>
            ))}
          </select>
        )}

        {formData.type === 'expense' && formData.paymentType === 'cheque' && (
          <div style={{ width: '100%', border: '1px solid #ddd', padding: 10, borderRadius: 6, fontSize: '1.1rem' }}>
            <strong>Select available cheques to use:</strong>
            {availableCheques.length === 0 ? (
              <p style={{ marginTop: 8 }}>No available cheques.</p>
            ) : (
              <div style={{ marginTop: 8, maxHeight: 180, overflowY: 'auto' }}>
                {availableCheques.map(chq => (
                  <label key={chq._id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <input type="checkbox" checked={selectedChequeIds.includes(String(chq._id))} onChange={() => toggleAvailableCheque(String(chq._id))} />
                    <span>Rs. {chq.amount} — {new Date(chq.date).toLocaleDateString()} ({chq.partyName || '—'})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {formData.type === 'income' && formData.paymentType === 'cheque' && (
          <input type="number" name="numberOfCheques" placeholder="Number of Cheques" value={formData.numberOfCheques} onChange={handleChange} required style={{ fontSize: '1.1rem' ,padding: '8px 10px'}} />
        )}

        <input type="number" name="amount" placeholder="Total Amount" value={formData.amount} onChange={handleChange} required readOnly={
          (formData.type === 'income' && formData.paymentType === 'cheque') ||
          (formData.type === 'expense' && formData.paymentType === 'cheque')
        } style={{ fontSize: '1.1rem', padding: '8px 10px' }} />

        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={{ fontSize: '1.1rem', padding: '8px 10px' }} />

        <button type="submit" style={{ fontSize: '1.1rem', padding: '8px 12px', cursor: 'pointer' }}>Add Entry</button>
      </div>

      {formData.type === 'income' && formData.paymentType === 'cheque' && formData.numberOfCheques > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontSize: '1.4rem', }}>Cheque Details</h4>
          {formData.chequeDetails.map((cheque, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input type="number" placeholder={`Cheque ${idx + 1} Amount`} value={cheque.amount} onChange={(e) => handleChequeDetailChange(idx, 'amount', e.target.value)} required style={{ fontSize: '1.1rem ', padding: '8px 10px' }} />
              <input type="date" placeholder={`Cheque ${idx + 1} Date`} value={cheque.date} onChange={(e) => handleChequeDetailChange(idx, 'date', e.target.value)} required style={{ fontSize: '1.1rem' }} />
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
