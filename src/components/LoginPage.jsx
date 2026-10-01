import React, { useState } from 'react';
import { loginUser } from '../utils/api';

export default function LoginPage({ onNavigate, onLoginSuccess, showToast, initialEmail = '' }) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      showToast('Please enter email and password.', 'error');
      return;
    }

    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success) {
      showToast(result.message, 'success');
      onLoginSuccess(result.user);
    } else {
      showToast(result.message, 'error');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3.5rem 1rem',
      }}
    >
      <div
        className="clean-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '390px',
          padding: '2.25rem 2rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#FFF2DB',
              border: '1px solid #FFE5BF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              margin: '0 auto 0.85rem auto',
            }}
          >
            🔐
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.35rem' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Sign in to access AI news authenticity engine
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontWeight: '700',
            }}
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
}
