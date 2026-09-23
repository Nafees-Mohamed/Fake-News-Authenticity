import React, { useState } from 'react';

export default function HomePage({ showToast }) {
  const [inputVal, setInputVal] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    setMessage('Coming in next phase');
    if (showToast) {
      showToast('Coming in next phase', 'info');
    }
  };

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '4rem auto 2rem auto',
        padding: '0 1rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: 'var(--text-main)',
          marginBottom: '2rem',
        }}
      >
        AI based Fake news authenticity system
      </h1>

      <form onSubmit={handleVerify} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Enter news text or URL..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}
        >
          Check
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: '#F1F5F9',
            border: '1px solid #E2E8F0',
            color: '#475569',
            fontSize: '0.95rem',
            fontWeight: '500',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
