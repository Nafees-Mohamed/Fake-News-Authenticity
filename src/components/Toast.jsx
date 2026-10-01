import React from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;

  const getBadgeStyle = () => {
    switch (type) {
      case 'success':
        return { bg: '#ECFDF5', border: '#A7F3D0', color: '#047857', icon: '✓' };
      case 'error':
        return { bg: '#FEF2F2', border: '#FECACA', color: '#DC2626', icon: '⚠️' };
      default:
        return { bg: '#FFF2DB', border: '#FFE5BF', color: '#F62440', icon: 'ℹ' };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className="toast-container">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          background: '#FFFFFF',
          border: `1px solid ${style.border}`,
          color: '#0F172A',
          fontSize: '0.9rem',
          fontWeight: '600',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
          minWidth: '280px',
          maxWidth: '400px',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: style.bg,
            color: style.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '0.85rem',
            flexShrink: 0,
          }}
        >
          {style.icon}
        </div>

        <span style={{ flex: 1, color: '#0F172A', fontWeight: '600' }}>{message}</span>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              fontSize: '1.1rem',
              lineHeight: '1',
              padding: '2px 4px',
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
