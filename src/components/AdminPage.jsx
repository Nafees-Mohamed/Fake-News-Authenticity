import React, { useState, useEffect } from 'react';
import { getAdminMetricsApi, getAdminUsersApi, toggleUserStatusApi } from '../utils/api';

export default function AdminPage({ showToast }) {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const mRes = await getAdminMetricsApi();
    if (mRes.success) setMetrics(mRes.metrics);

    const uRes = await getAdminUsersApi();
    if (uRes.success) setUsers(uRes.users);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'deactivated' : 'active';
    const res = await toggleUserStatusApi(userId, newStatus);
    if (res.success) {
      showToast(res.message, 'success');
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
    } else {
      showToast(res.message || 'Error updating status.', 'error');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1.25rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Administrator Dashboard</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Monitor system metrics, manage user permissions, and review platform activities
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading administrator dashboard...</div>
      ) : (
        <div>
          {/* Health Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="clean-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Accounts</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.2rem' }}>{metrics?.totalUsers || 0}</div>
            </div>

            <div className="clean-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Verifications</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.2rem' }}>{metrics?.totalVerifications || 0}</div>
            </div>

            <div className="clean-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Operational Health</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#047857', marginTop: '0.4rem' }}>{metrics?.systemHealth || 'Operational'}</div>
            </div>
          </div>

          {/* User Management Table */}
          <div className="clean-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem' }}>User Management & Account Controls</h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #FFE5BF', color: 'var(--text-subtle)' }}>
                    <th style={{ padding: '0.75rem' }}>Name</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Role</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '600', color: 'var(--text-main)' }}>{u.name}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', background: '#FFF2DB', border: '1px solid #FFE5BF', color: '#B45309', fontSize: '0.775rem', fontWeight: '600' }}>
                          {u.role || 'GeneralUser'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ color: u.status === 'deactivated' ? '#DC2626' : '#047857', fontWeight: '700' }}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleToggleStatus(u._id, u.status || 'active')}
                          style={{
                            background: 'transparent',
                            border: `1px solid ${u.status === 'deactivated' ? '#A7F3D0' : '#FECACA'}`,
                            padding: '0.3rem 0.65rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: u.status === 'deactivated' ? '#047857' : '#DC2626',
                          }}
                        >
                          {u.status === 'deactivated' ? 'Activate Account' : 'Deactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
