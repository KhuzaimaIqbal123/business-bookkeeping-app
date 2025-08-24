import React, { useState } from 'react';

export default function EntriesTable({ entries, onUpdated }) {
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({});

  // 🔹 Delete entry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    await fetch(`http://localhost:5000/api/roznamcha/${id}`, { method: "DELETE" });
    onUpdated(); // refresh parent
  };

  // 🔹 Open edit modal
  const handleEdit = (entry) => {
    setEditingEntry(entry._id);
    setFormData(entry);
  };

  // 🔹 Save updated entry
  const handleUpdate = async () => {
    await fetch(`http://localhost:5000/api/roznamcha/${editingEntry}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setEditingEntry(null);
    onUpdated();
  };

  return (
    <div style={{ overflowX: 'auto', marginBottom: '30px', fontSize: '1.1rem' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Today's Entries</h3>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.05)',
        fontSize: '1.1rem'
      }}>
        <thead>
          <tr style={{ background: '#2c3e50', color: '#fff', fontSize: '1.1rem' }}>
            <th>Type</th>
            <th>Payment</th>
            <th>No. of Cheques</th>
            <th>Category</th>
            <th>Party</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th> {/* 👈 new column */}
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr><td colSpan="9" style={{ textAlign: 'center', padding: '12px' }}>No entries yet.</td></tr>
          ) : (
            entries.map((entry) => (
              <tr key={entry._id} style={{ textAlign: 'center', fontSize: '1.1rem' }}>
                <td>{entry.type}</td>
                <td>{entry.paymentType}</td>
                <td>{entry.numberOfCheques || '-'}</td>
                <td>{entry.category}</td>
                <td>{entry.partyName || '-'}</td>
                <td>Rs. {entry.amount.toLocaleString()}</td>
                <td>{entry.description}</td>
                <td>{new Date(entry.date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(entry)} style={{ marginRight: '8px' }}>Edit</button>
                  <button onClick={() => handleDelete(entry._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🔹 Edit Modal */}
      {editingEntry && (
        <div style={{
          background: "#00000090",
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            width: "400px"
          }}>
            <h3>Edit Entry</h3>

            <label>Amount:</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <label>Description:</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditingEntry(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
