import React, { useState, useEffect } from 'react';
import { getHistoryApi, deleteHistoryApi } from '../utils/api';

export default function HistoryPage({ showToast }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async (searchQuery = '') => {
    setLoading(true);
    const res = await getHistoryApi(searchQuery);
    setLoading(false);
    if (res.success) {
      setHistory(res.history);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory(search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this history item?')) return;
    const res = await deleteHistoryApi(id);
    if (res.success) {
      showToast('Log deleted.', 'info');
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } else {
      showToast(res.message || 'Error deleting log.', 'error');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1.25rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>Prediction History</h2>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
            Your saved news verification logs
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '220px', padding: '0.5rem 0.85rem' }}
          />
          <button type="submit" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            Search
          </button>
        </form>
      </div>

      {/* History Items */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-subtle)' }}>
          Loading history...
        </div>
      ) : history.length === 0 ? (
        <div className="clean-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-subtle)' }}>
          No prediction history found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((item) => (
            <div
              key={item._id}
              className="clean-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderLeft: `4px solid ${item.prediction === 'GENUINE' ? '#10B981' : '#F62440'}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.6rem',
                }}
              >
                <span
                  style={{
                    padding: '0.2rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    background: item.prediction === 'GENUINE' ? '#ECFDF5' : '#FEF2F2',
                    color: item.prediction === 'GENUINE' ? '#047857' : '#D91B35',
                    border: `1px solid ${item.prediction === 'GENUINE' ? '#A7F3D0' : '#FECACA'}`,
                  }}
                >
                  {item.prediction === 'GENUINE' ? '✓ Genuine' : '⚠️ Fake'} ({item.confidenceScore}%)
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#DC2626',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: '600', margin: 0 }}>
                "{item.newsContent}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
