import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" size={20} />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400" size={20} />;
      default:
        return <Info className="w-5 h-5 text-cyan-400" size={20} />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast ${type}`}>
        {getIcon()}
        <span style={{ flex: 1 }}>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-subtle)',
              cursor: 'pointer',
              display: 'flex',
              padding: '2px',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
