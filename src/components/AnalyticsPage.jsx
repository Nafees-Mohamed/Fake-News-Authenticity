import React, { useState, useEffect } from 'react';
import { getAdminMetricsApi, exportDatasetApi } from '../utils/api';

export default function AnalyticsPage({ showToast }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await getAdminMetricsApi();
      if (res.success) {
        setMetrics(res.metrics);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  const handleExport = async () => {
    const res = await exportDatasetApi();
    if (res.success) {
      const jsonStr = JSON.stringify(res.data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Anonymized_Fake_News_Dataset_${Date.now()}.json`;
      a.click();
      showToast('Dataset exported successfully.', 'success');
    } else {
      showToast('Error exporting dataset.', 'error');
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '3rem auto', padding: '0 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Research & Analytics Module</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Misinformation trends analysis & anonymized data exports for research
          </p>
        </div>

        <button onClick={handleExport} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
          📥 Export Anonymized Dataset (.JSON)
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading analytics metrics...</div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="clean-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Verified Content</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.2rem' }}>{metrics?.totalVerifications || 0}</div>
            </div>

            <div className="clean-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fake News Ratio</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#DC2626', marginTop: '0.2rem' }}>{metrics?.fakeRatio || '0%'}</div>
            </div>

            <div className="clean-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Genuine Articles</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#047857', marginTop: '0.2rem' }}>{metrics?.genuineCount || 0}</div>
            </div>

            <div className="clean-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Latency</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.2rem' }}>{metrics?.apiLatency || '42ms'}</div>
            </div>
          </div>

          <div className="clean-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.6rem' }}>Research Feedback & Model Retraining</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Researchers can flag false positive or false negative classifications. Feedback submitted is recorded in audit logs and queued for periodic model retraining cycles.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
