import React, { useState } from 'react';

export default function EntriesTable({ entries, onUpdated }) {
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({});
  const [showKhataNotification, setShowKhataNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // 🔹 Show beautiful notification
  const showKhataReminder = (message) => {
    setNotificationMessage(message);
    setShowKhataNotification(true);
  };

  // 🔹 Close notification
  const closeNotification = () => {
    setShowKhataNotification(false);
  };

  // 🔹 Delete entry
  const handleDelete = async (entry) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    
    await fetch(`http://localhost:5000/api/roznamcha/${entry._id}`, { method: "DELETE" });
    onUpdated(); // refresh parent
    
    // Show special notification if it's a party-related entry
    if (entry.partyName && entry.partyName !== '-') {
      showKhataReminder(`⏰ Remember to delete this entry from \n"${entry.partyName}" Khata as well!`);
    }
  };

  // 🔹 Open edit modal
  const handleEdit = (entry) => {
    setEditingEntry(entry._id);
    setFormData(entry);
  };

  // 🔹 Save updated entry
  const handleUpdate = async () => {
    const originalEntry = entries.find(e => e._id === editingEntry);
    
    await fetch(`http://localhost:5000/api/roznamcha/${editingEntry}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    setEditingEntry(null);
    onUpdated();
    
    // Show special notification if it's a party-related entry
    if (originalEntry.partyName && originalEntry.partyName !== '-') {
      showKhataReminder(`⏰ Remember to update this entry in \n"${originalEntry.partyName}" Khata as well!`);
    }
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
            <th>Actions</th>
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
                  <button onClick={() => handleDelete(entry)}>Delete</button>
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
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            width: "400px",
            zIndex: 1001
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

      {/* 🔹 Beautiful Khata Notification */}
      {showKhataNotification && (
        <>
          <div className="notification-overlay" onClick={closeNotification}></div>
          <div className="khata-notification">
            <h4>⚠️ KHATA UPDATE REMINDER</h4>
            <p style={{whiteSpace: 'pre-line'}}>{notificationMessage}</p>
            <button onClick={closeNotification}>Got it!</button>
          </div>
        </>
      )}


      {/* 🔹 Beautiful Khata Notification */}
{showKhataNotification && (
  <>
    <div className="notification-overlay" onClick={closeNotification}></div>
    <div className="khata-notification">
      <h4>⚠️ KHATA UPDATE REMINDER</h4>
      <p style={{whiteSpace: 'pre-line'}}>{notificationMessage}</p>
      <button onClick={closeNotification}>OK</button>
    </div>
  </>
)}

{/* 🔹 Add CSS styles here */}
<style>
{`
  .khata-notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #4e878aff, #03305dff);
    color: white;
    padding: 25px;
    border-radius: 15px;
    font-size:50px;
    box-shadow: 0 10px 30px rgba(204, 71, 23, 0.4);
    z-index: 10000;
    text-align: center;
    min-width: 450px;
    min-height:250px;
    border: 4px solid #d07806ff;
    animation: pulseWarning 2s infinite;
  }

  .khata-notification h4 {
    margin: 0 0 15px 0;
    font-size: 2rem;
    font-weight: bold;
    display: flex;
    color: #ffeb0aff;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .khata-notification p {
    margin: 0;
    color: #ffffffff;
    font-size: 1.6rem;
    line-height: 1.5;
  }

  .khata-notification button {
    margin-top: 20px;
    color: #d88b06ff;
    background: #000000ff;

    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    font-weight: bold;
    font-size:1.3rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  .khata-notification button:hover {
    background: #0e0a07ff;
    color:  #e3970cff;
    transform: scale(1.05);
  }

  @keyframes pulseWarning {
    0% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7); }
    70% { box-shadow: 0 0 0 15px rgba(255, 107, 53, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0); }
  }

  .notification-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    animation: fadeIn 0.3s;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`}
</style>

    </div>
  );
}