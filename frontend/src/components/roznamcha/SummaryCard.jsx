import React from 'react';

export default function SummaryCard({ summary = {} }) {
  const {
    income = { cash: 0, cheque: 0 },
    expense = { cash: 0, cheque: 0 },
    updatedCapital = 0,
    availableCheques = [],
    amountInHandCash = 0,
    amountInHandCheques = 0,
  } = summary;

  return (
    <div
      style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        fontSize: '1.15rem',
      }}
    >
      <h3 style={{ fontSize: '1.6rem', marginBottom: '15px' }}>
        Today's Summary
      </h3>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          marginTop: '10px',
        }}
      >
        {/* Income */}
        <div>
          <h4 style={{ fontSize: '1.3rem' }}>Income</h4>
          <p>Cash: Rs. {income.cash.toLocaleString()}</p>
          <p>Cheque: Rs. {income.cheque.toLocaleString()}</p>
          <p>Total: Rs. {(income.cash + income.cheque).toLocaleString()}</p>
        </div>

        {/* Expense */}
        <div>
          <h4 style={{ fontSize: '1.3rem' }}>Expense</h4>
          <p>Cash: Rs. {expense.cash.toLocaleString()}</p>
          <p>Cheque: Rs. {expense.cheque.toLocaleString()}</p>
          <p>Total: Rs. {(expense.cash + expense.cheque).toLocaleString()}</p>
        </div>

        {/* Updated Capital */}
        <div>
          <h4 style={{ fontSize: '1.3rem' }}>Updated Capital</h4>
          <p>Rs. {updatedCapital.toLocaleString()}</p>
        </div>

        {/* Available Cheques */}
        <div>
          <h4 style={{ fontSize: '1.3rem' }}>Available Cheques</h4>
          <p>Total Amount: Rs. {amountInHandCheques.toLocaleString()}</p>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            {availableCheques.length > 0 ? (
              availableCheques.map((chq, index) => (
                <li key={chq._id || index}>
                  Rs. {chq.amount.toLocaleString()} —{' '}
                  {new Date(chq.date).toLocaleDateString()}{' '}
                  {chq.partyName ? `(${chq.partyName})` : ''}
                </li>
              ))
            ) : (
              <li>No available cheques</li>
            )}
          </ul>
        </div>

        {/* Amount in Hand Cash */}
        <div>
          <h4 style={{ fontSize: '1.3rem' }}>Amount in Hand (Cash)</h4>
          <p>Rs. {amountInHandCash.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
