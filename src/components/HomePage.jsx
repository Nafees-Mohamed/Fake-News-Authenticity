import React, { useState } from 'react';

export default function HomePage() {
  const [inputVal, setInputVal] = useState('');

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

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Enter news text or URL..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
        />
        <button className="btn-primary" style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}>
          Check
        </button>
      </div>
    </div>
  );
}
