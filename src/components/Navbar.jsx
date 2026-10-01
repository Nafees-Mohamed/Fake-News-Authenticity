import React from 'react';

export default function Navbar({ currentUser, onNavigate, onLogout, activeView }) {
  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #FFE5BF',
        padding: '0.85rem 2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Brand */}
        <div
          onClick={() => onNavigate(currentUser ? 'home' : 'login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.1rem',
              color: '#FFFFFF',
            }}
          >
            🛡️
          </div>
          <span
            style={{
              fontSize: '1.2rem',
              fontWeight: '800',
              color: '#0F172A',
            }}
          >
            Truth<span style={{ color: 'var(--primary)' }}>Guard</span> AI
          </span>
        </div>

        {/* Center Navigation Tabs */}
        {currentUser && (
          <nav style={{ display: 'flex', gap: '0.4rem', background: '#FFF2DB', padding: '4px', borderRadius: '10px', border: '1px solid #FFE5BF' }}>
            <button
              onClick={() => onNavigate('home')}
              className={activeView === 'home' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.45rem 1rem', fontSize: '0.875rem', borderRadius: '8px' }}
            >
              Verify News
            </button>

            <button
              onClick={() => onNavigate('history')}
              className={activeView === 'history' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.45rem 1rem', fontSize: '0.875rem', borderRadius: '8px' }}
            >
              History
            </button>

            {(currentUser.role === 'Researcher' || currentUser.role === 'Administrator') && (
              <button
                onClick={() => onNavigate('analytics')}
                className={activeView === 'analytics' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.45rem 1rem', fontSize: '0.875rem', borderRadius: '8px' }}
              >
                Analytics
              </button>
            )}

            {currentUser.role === 'Administrator' && (
              <button
                onClick={() => onNavigate('admin')}
                className={activeView === 'admin' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.45rem 1rem', fontSize: '0.875rem', borderRadius: '8px' }}
              >
                Admin
              </button>
            )}
          </nav>
        )}

        {/* User Session Profile & Actions */}
        <div>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  background: '#FFF2DB',
                  border: '1px solid #FFE5BF',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                    fontWeight: '700',
                    fontSize: '0.75rem',
                  }}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                  {currentUser.name}
                </span>
                <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
                  ({currentUser.role || 'GeneralUser'})
                </span>
              </div>

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
                Sign In
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
