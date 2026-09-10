import React from 'react';

export default function Navbar({ currentUser, onNavigate, onLogout, activeView }) {
  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0.85rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Brand */}
        <div
          onClick={() => onNavigate(currentUser ? 'home' : 'login')}
          style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#0F172A',
            cursor: 'pointer',
          }}
        >
          FakeNews Authenticity System
        </div>

        {/* User actions */}
        <div>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748B' }}>
                {currentUser.name} ({currentUser.email})
              </span>
              <button onClick={onLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={activeView === 'login' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => onNavigate('login')}
              >
                Login
              </button>
              <button
                className={activeView === 'register' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => onNavigate('register')}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
