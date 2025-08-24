import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

// ============ Shared Styles ============
const colors = {
  bg: '#f5f7fb',
  card: '#ffffff',
  text: '#111827',
  subtext: '#6b7280',
  primary: '#1f2937',
  primaryBtn: '#0f172a',
  border: '#e5e7eb',
  accent: '#2563eb',
};

const pageWrap = {
  padding: '20px',
  background: colors.bg,
  minHeight: '100vh',
};

const sectionTitle = {
  fontSize: '20px',
  fontWeight: 700,
  color: colors.primary,
  margin: '4px 0 12px',
};

const card = {
  background: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
  padding: '16px',
};

const inputGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: 900,
  letterSpacing: '0.02em',
  color: colors.subtext,
  textTransform: 'uppercase',
};

const inputStyle = {
  padding: '10px 12px',
  borderRadius: '10px',
  border: `1px solid ${colors.border}`,
  outline: 'none',
  fontSize: '14px',
  background: '#fff',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
};

const btn = {
  padding: '10px 14px',
  borderRadius: '10px',
  border: 'none',
  background: colors.primaryBtn,
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(15,23,42,0.25)',
};

const lightBtn = {
  ...btn,
  background: '#fff',
  color: colors.primaryBtn,
  border: `1px solid ${colors.border}`,
  boxShadow: 'none',
};

const inlineInputStyle = {
  width: '100%',
  padding: '4px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  fontSize: '14px'
};

const partyBtn = {
  padding: '10px 14px',
  borderRadius: '999px',
  border: '1px solid #cacacdff',
  background: '#f8f8f8ff',
  color: colors.text,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '14px',
  minWidth: '140px',
  textAlign: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  transition: 'all 0.2s ease',
};

const pillRow = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '12px',
  alignItems: 'end',
};

const totalBillBox = {
  padding: '10px 12px',
  borderRadius: '10px',
  border: `1px solid ${colors.border}`,
  background: '#f3f4f6',
  fontWeight: 700,
  color: colors.primary,
  fontSize: '14px',
};

const thStyle = {
  border: `1px solid ${colors.border}`,
  padding: '10px',
  textAlign: 'left',
  backgroundColor: '#eef2ff',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  color: colors.primary,
  fontWeight: 700,
};

const tdStyle = {
  border: `1px solid ${colors.border}`,
  padding: '10px',
  fontSize: '14px',
  color: colors.text,
  background: '#fff',
};

const tableContainerStyle = {
  maxHeight: '420px',
  overflowY: 'auto',
  marginTop: '16px',
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
};

// ============ Component ============
export default function Khata() {
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);

const [formData, setFormData] = useState({
  itemName: '',
  numberOfItems: '',
  rate: '',
  entryType: 'bnam',
  type: 'cash',
  description: '',
  amount: '', // <-- new field
});

const [editingEntryId, setEditingEntryId] = useState(null);
const [editedEntry, setEditedEntry] = useState({});

  const [newPartyName, setNewPartyName] = useState('');
  const [showEntryTypeOptions, setShowEntryTypeOptions] = useState(false);
  const [showTypeOptions, setShowTypeOptions] = useState(false);

  // Cheque states
  const [availableCheques, setAvailableCheques] = useState([]);
  const [selectedChequeIds, setSelectedChequeIds] = useState([]);
  const [loadingCheques, setLoadingCheques] = useState(false);
  const [chequeError, setChequeError] = useState('');

  // Total bill dynamic: for cheque → sum of selected cheques, else qty*rate
  const chequeSum = availableCheques
    .filter(c => selectedChequeIds.includes(c._id))
    .reduce((acc, c) => acc + (Number(c.amount) || 0), 0);

  const totalBill =
    formData.type === 'cheque'
      ? chequeSum
      : (Number(formData.numberOfItems) || 0) * (Number(formData.rate) || 0);

  // Init
  useEffect(() => {
    fetchParties();
  }, []);

  // When payment type toggles to cheque → load available cheques
  useEffect(() => {
    if (formData.type === 'cheque') {
      void fetchAvailableCheques();
    } else {
      // switching back to cash clears cheque selection
      setSelectedChequeIds([]);
      setChequeError('');
    }
  }, [formData.type]);

  const fetchParties = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/parties');
      setParties(res.data);
    } catch (err) {
      console.error('Failed to fetch parties:', err);
    }
  };

  const fetchAvailableCheques = async () => {
    try {
      setLoadingCheques(true);
      setChequeError('');
      const res = await axios.get('http://localhost:5000/api/cheques/available');
      setAvailableCheques(res.data || []);
    } catch (err) {
      console.error('Failed to fetch cheques:', err);
      setChequeError('Failed to load cheques.');
    } finally {
      setLoadingCheques(false);
    }
  };

const handleEditClick = (entry) => {
  setEditingEntryId(entry._id);
  setEditedEntry({
    itemName: entry.itemName,
    numberOfItems: entry.numberOfItems,
    rate: entry.rate,
    amount: entry.amount,
    totalBill: entry.totalBill,
    bnam: entry.bnam,
    jama: entry.jama,
    type: entry.type,
    description: entry.description
  });
};

const handleSaveEdit = async (entryId) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/parties/${selectedParty._id}/entries/${entryId}`,
      editedEntry
    );

    // Update local state
    setSelectedParty(prev => ({
      ...prev,
      entries: prev.entries.map(entry => 
        entry._id === entryId ? res.data.updatedEntry : entry
      )
    }));

    setEditingEntryId(null);
    setEditedEntry({});
    alert('Entry updated successfully');
  } catch (err) {
    console.error('Failed to update entry:', err);
    alert('Failed to update entry');
  }
};

const handleDeleteEntry = async (entryId) => {
  if (!window.confirm('Are you sure you want to delete this entry?')) return;
  
  try {
    await axios.delete(`http://localhost:5000/api/parties/${selectedParty._id}/entries/${entryId}`);
    
    // Update local state
    setSelectedParty(prev => ({
      ...prev,
      entries: prev.entries.filter(entry => entry._id !== entryId)
    }));
    
    alert('Entry deleted successfully');
  } catch (err) {
    console.error('Failed to delete entry:', err);
    alert('Failed to delete entry');
  }
};

  const handlePartyClick = async (partyId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/parties/${partyId}`);
      setSelectedParty(res.data);
    } catch (err) {
      console.error('Failed to fetch party:', err);
    }
  };

  const handleChequeSelect = (chequeId) => {
    setSelectedChequeIds(prev =>
      prev.includes(chequeId)
        ? prev.filter(id => id !== chequeId)
        : [...prev, chequeId]
    );
  };

  const handleEntrySubmit = async (e) => {
    e.preventDefault();
    if (!selectedParty?._id) return;

    // For cheque, must pick at least one cheque
    if (formData.type === 'cheque' && selectedChequeIds.length === 0) {
      setChequeError('Please select at least one cheque.');
      return;
    }

   const effectiveValue = formData.amount ? Number(formData.amount) : totalBill;

    const bnamValue = formData.entryType === 'bnam' ? effectiveValue : '';
    const jamaValue = formData.entryType === 'jama' ? effectiveValue : '';

    try {
      const res = await axios.post(
        `http://localhost:5000/api/parties/${selectedParty._id}/entries`,
        {
          itemName: formData.itemName,
          numberOfItems: Number(formData.numberOfItems),
          rate: Number(formData.rate),
          bnam: bnamValue,
          jama: jamaValue,
          type: formData.type,
          description: formData.description,
          amount: Number(formData.amount) || '',   // 👈 add this
          selectedChequeIds, // 👈 important
        }
      );

     setSelectedParty(prev => ({
  ...prev,
  entries: [...(prev?.entries || []), res.data.entry],  // 👈 new entry end me add
}));



      // Clear form + cheque picks
      setFormData({
        itemName: '',
        numberOfItems: '',
        rate: '',
        entryType: 'bnam',
        type: 'cash',
        description: '',
        amount:'',
      });
      setSelectedChequeIds([]);
      setShowEntryTypeOptions(false);
      setShowTypeOptions(false);

      // Refresh available cheques list so used ones disappear
      if (formData.type === 'cheque') {
        void fetchAvailableCheques();
      }
    } catch (err) {
      console.error('Failed to add entry:', err);
    }
  };

  const handleNewParty = async (e) => {
    e.preventDefault();
    if (!newPartyName.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/parties', {
        name: newPartyName.trim()
      });
      setParties([...parties, res.data]);
      setNewPartyName('');
    } catch (err) {
      console.error('Failed to add party:', err);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={pageWrap}>
        {/* Parties + Add Party */}
        <div style={{ ...card, marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
            <div>
              <div style={sectionTitle}>All Parties - Khata</div>
              <p style={{ margin: 0, color: colors.subtext, fontSize: '13px' }}>
                Click on a party to see its records.
              </p>
            </div>
            <form onSubmit={handleNewParty} style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
              <div style={inputGroup}>
                <label style={labelStyle}>New Party Name</label>
                <input
                  type="text"
                  value={newPartyName}
                  onChange={(e) => setNewPartyName(e.target.value)}
                  required
                  style={{ ...inputStyle, minWidth: '220px' }}
                />
              </div>
              <button type="submit" style={btn}>Add Party</button>
            </form>
          </div>

          <div style={{ ...pillRow, marginTop: '14px' }}>
            {parties.map(party => (
              <button
                key={party._id}
                onClick={() => handlePartyClick(party._id)}
                style={partyBtn}
              >
                {party.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Party + Entry Form */}
        {selectedParty && (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={card}>
              <div style={sectionTitle}>Entries for {selectedParty.name}</div>

              <form onSubmit={handleEntrySubmit} style={{ display: 'grid', gap: '14px' }}>
                {/* Grid row 1 */}
                <div style={grid}>
                  <div style={inputGroup}>
                    <label style={labelStyle}>Item Name</label>
                    <input
                      type="text"
                      value={formData.itemName}
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div style={inputGroup}>
                    <label style={labelStyle}>Number of Items</label>
                    <input
                      type="number"
                      value={formData.numberOfItems}
                      onChange={(e) => setFormData({ ...formData, numberOfItems: e.target.value })}
                      style={inputStyle}
                      disabled={formData.type === 'cheque' || formData.amount}
                    />
                  </div>

                  <div style={inputGroup}>
                    <label style={labelStyle}>Rate</label>
                    <input
                      type="number"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      style={inputStyle}
                      disabled={formData.type === 'cheque'|| formData.amount}
                    />
                  </div>

                  <div style={inputGroup}>
                    <label style={labelStyle}>Total Bill</label>
                    <div style={totalBillBox}>
                        {formData.amount ? formData.amount : totalBill || 0}
                      </div>
                  </div>
                </div>

                {/* Grid row 2 */}
                <div style={grid}>
                  <div style={inputGroup}>
                    <label style={labelStyle}>Choose Entry Type ( Bnam / Jama )</label>
                    {!showEntryTypeOptions ? (
                      <button
                        type="button"
                        onClick={() => setShowEntryTypeOptions(true)}
                        style={{
                          ...btn,
                          background: '#fff',
                          color: colors.primaryBtn,
                          border: `1px solid ${colors.border}`,
                          boxShadow: 'none'
                        }}
                      >
                        {formData.entryType === 'bnam' ? 'Bnam' : 'Jama'}
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['bnam', 'jama'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, entryType: type });
                              setShowEntryTypeOptions(false);
                            }}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              border: `1px solid ${colors.border}`,
                              background: formData.entryType === type ? colors.accent : '#fff',
                              color: formData.entryType === type ? '#fff' : colors.text,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            {type === 'bnam' ? 'Bnam' : 'Jama'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={inputGroup}>
                    <label style={labelStyle}>Amount</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      style={inputStyle}
                      placeholder="For Only Cash Payment"
                    />
                  </div>


                  {/* CASH / CHEQUE */}
                  <div style={inputGroup}>
                    <label style={labelStyle}>Choose Payment Type ( Cash / Cheque )</label>
                    {!showTypeOptions ? (
                      <button
                        type="button"
                        onClick={() => setShowTypeOptions(true)}
                        style={{
                          ...btn,
                          background: '#fff',
                          color: colors.primaryBtn,
                          border: `1px solid ${colors.border}`,
                          boxShadow: 'none'
                        }}
                      >
                        {formData.type === 'cash' ? 'Cash' : 'Cheque'}
                        
                      </button>
                      
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['cash', 'cheque'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, type });
                              setShowTypeOptions(false);
                            }}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              border: `1px solid ${colors.border}`,
                              background: formData.type === type ? colors.accent : '#fff',
                              color: formData.type === type ? '#fff' : colors.text,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            {type === 'cash' ? 'Cash' : 'Cheque'}
                          </button>
                        ))}
                        
                      </div>
                    )}
                  </div>

                  <div style={inputGroup}>
                    <label style={labelStyle}>Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{ ...inputStyle, minWidth: '220px' }}
                    />
                  </div>
                </div>

                {/* Cheque selection UI */}
                {formData.type === 'cheque' && (
                  <div style={{ ...card, borderStyle: 'dashed' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      marginBottom: 8
                    }}>
                      <div style={sectionTitle}>Select Cheques</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button type="button" style={lightBtn} onClick={fetchAvailableCheques}>
                          Refresh
                        </button>
                        <button
                          type="button"
                          style={lightBtn}
                          onClick={() => setSelectedChequeIds([])}
                        >
                          Clear Selection
                        </button>
                      </div>
                    </div>

                    {loadingCheques && <p style={{ color: colors.subtext }}>Loading cheques…</p>}
                    {chequeError && <p style={{ color: '#b91c1c', fontWeight: 600 }}>{chequeError}</p>}

                    {!loadingCheques && !chequeError && (
                      <>
                        {availableCheques.length === 0 ? (
                          <p style={{ color: colors.subtext, fontSize: '14px' }}>
                            No available cheques.
                          </p>
                        ) : (
                          <>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {availableCheques.map(chq => (
                                <label
                                  key={chq._id}
                                  style={{
                                    border: `1px solid ${colors.border}`,
                                    padding: '8px 10px',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    cursor: 'pointer',
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedChequeIds.includes(chq._id)}
                                    onChange={() => handleChequeSelect(chq._id)}
                                  />
                                  <span style={{ fontSize: 14 }}>
                                    Rs {Number(chq.amount) || 0} — {String(chq.date || '').slice(0, 10)}
                                  </span>
                                </label>
                              ))}
                            </div>

                            <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                              <div style={{ ...totalBillBox }}>Selected Cheques: {selectedChequeIds.length}</div>
                              <div style={{ ...totalBillBox }}>Cheques Sum: {chequeSum || 0}</div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={btn}>Add Entry</button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        itemName: '',
                        numberOfItems: '',
                        rate: '',
                        entryType: 'bnam',
                        type: 'cash',
                        description: ''
                      })
                    }
                    style={lightBtn}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Entries Table */}
            <div style={card}>
              <div style={sectionTitle}>Entries Table</div>
              <div style={tableContainerStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
  <tr>
    <th style={thStyle}>Date</th>
    <th style={thStyle}>Item</th>
    <th style={thStyle}>Qty</th>
    <th style={thStyle}>Rate</th>
    <th style={thStyle}>Total Bill</th>
    <th style={thStyle}>Bnam</th>
    <th style={thStyle}>Jama</th>
    <th style={thStyle}>Amount</th>
    <th style={thStyle}>Type</th>
    <th style={thStyle}>Description</th>
    <th style={thStyle}>Baki</th>
    <th style={thStyle}>Actions</th>
  </tr>
</thead>
                 <tbody>
  {(selectedParty.entries || []).map((entry, index) => (
    <tr key={entry._id || index}>
      <td style={tdStyle}>{entry.date?.slice(0, 10)}</td>
      
      {/* Item Name */}
      <td style={tdStyle}>
        {editingEntryId === entry._id ? (
          <input
            type="text"
            value={editedEntry.itemName || entry.itemName}
            onChange={(e) => setEditedEntry({...editedEntry, itemName: e.target.value})}
            style={{ ...inputStyle, width: '100%', padding: '4px' }}
          />
        ) : (
          entry.itemName
        )}
      </td>
      
      {/* Number of Items */}
      <td style={tdStyle}>
        {editingEntryId === entry._id ? (
          <input
            type="number"
            value={editedEntry.numberOfItems ?? entry.numberOfItems}
            onChange={(e) => setEditedEntry({...editedEntry, numberOfItems: e.target.value})}
            style={{ ...inputStyle, width: '100%', padding: '4px' }}
          />
        ) : (
          entry.numberOfItems
        )}
      </td>
      
      {/* Rate */}
      <td style={tdStyle}>
        {editingEntryId === entry._id ? (
          <input
            type="number"
            value={editedEntry.rate ?? entry.rate}
            onChange={(e) => setEditedEntry({...editedEntry, rate: e.target.value})}
            style={{ ...inputStyle, width: '100%', padding: '4px' }}
          />
        ) : (
          entry.rate
        )}
      </td>
      
      {/* Total Bill */}
      <td style={tdStyle}>
        {editingEntryId === entry._id ? (
          <input
            type="number"
            value={editedEntry.amount ?? (editedEntry.totalBill ?? entry.totalBill)}
            onChange={(e) => setEditedEntry({...editedEntry, amount: e.target.value})}
            style={{ ...inputStyle, width: '100%', padding: '4px' }}
          />
        ) : (
          entry.amount ? entry.amount : entry.totalBill
        )}
      </td>
      
      {/* Bnam */}
      <td style={tdStyle}>
        {editingEntryId === entry._id ? (
          <input
            type="number"
            value={editedEntry.bnam ?? entry.bnam}
            onChange={(e) => setEditedEntry({...editedEntry, bnam: e.target.value})}
            style={{ ...inputStyle, width: '100%', padding: '4px' }}
          />
        ) : (
          entry.bnam === 0 ? '' : entry.bnam
        )}
      </td>
      
      {/* Jama */}
      <td style={tdStyle}>
        {editingEntryId === entry._id ? (
          <input
            type="number"
            value={editedEntry.jama ?? entry.jama}
            onChange={(e) => setEditedEntry({...editedEntry, jama: e.target.value})}
            style={{ ...inputStyle, width: '100%', padding: '4px' }}
          />
        ) : (
          entry.jama === 0 ? '' : entry.jama
        )}
      </td>
      
      {/* Amount */}
      <td style={tdStyle}>
        {editingEntryId === entry._id ? (
          <input
            type="number"
            value={editedEntry.amount ?? entry.amount}
            onChange={(e) => setEditedEntry({...editedEntry, amount: e.target.value})}
            style={{ ...inputStyle, width: '100%', padding: '4px' }}
          />
        ) : (
          entry.amount
        )}
      </td>
      
      {/* Type */}
      <td style={tdStyle}>
        {editingEntryId === entry._id ? (
          <select
            value={editedEntry.type ?? entry.type}
            onChange={(e) => setEditedEntry({...editedEntry, type: e.target.value})}
            style={{ ...inputStyle, width: '100%', padding: '4px' }}
          >
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
          </select>
        ) : (
          entry.type
        )}
      </td>
      
      {/* Description */}
      <td style={tdStyle}>
        {editingEntryId === entry._id ? (
          <input
            type="text"
            value={editedEntry.description ?? entry.description}
            onChange={(e) => setEditedEntry({...editedEntry, description: e.target.value})}
            style={{ ...inputStyle, width: '100%', padding: '4px' }}
          />
        ) : (
          entry.description
        )}
      </td>
      
      {/* Baki (Read-only) */}
      <td style={tdStyle}>{Math.abs(entry.remainingBalance)}</td>
      
      {/* Actions */}
      <td style={tdStyle}>
        {editingEntryId === entry._id ? (
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={() => handleSaveEdit(entry._id)}
              style={{ ...lightBtn, padding: '4px 8px', background: '#10b981' }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingEntryId(null);
                setEditedEntry({});
              }}
              style={{ ...lightBtn, padding: '4px 8px', background: '#6b7280' }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={() => handleEditClick(entry)}
              style={{ ...lightBtn, padding: '4px 8px' }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteEntry(entry._id)}
              style={{ ...btn, padding: '4px 8px', background: '#dc2626' }}
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  ))}
</tbody>
                </table>
              </div>
            </div>

          </div>
        )}
        
      </div>
    </div>
  );
}
