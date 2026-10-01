import React, { useState } from 'react';
import { verifyNewsApi } from '../utils/api';

export default function HomePage({ currentUser, showToast }) {
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!inputVal.trim()) {
      showToast('Please enter a news article, headline, or URL to analyze.', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    const res = await verifyNewsApi(inputVal);
    setLoading(false);

    if (res.success) {
      setResult(res);
      showToast('Authenticity analysis complete!', 'success');
    } else {
      showToast(res.message || 'Error conducting analysis.', 'error');
    }
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '3rem auto 2rem auto',
        padding: '0 1.25rem',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: '#FFF2DB',
            border: '1px solid #FFE5BF',
            color: '#B45309',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1rem',
          }}
        >
          ✨ Welcome, {currentUser ? currentUser.name : 'User'} ({currentUser?.role || 'GeneralUser'})
        </div>

        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            color: 'var(--text-main)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}
        >
          AI based <span style={{ color: 'var(--primary)' }}>Fake news authenticity system</span>
        </h1>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '1rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}
        >
          Paste any news article headline, content excerpt, or URL below to verify authenticity.
        </p>
      </div>

      {/* Input Card */}
      <div className="clean-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <form onSubmit={handleVerify}>
          <div className="input-group" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.95rem' }}>
                News Content / Headline / URL
              </label>
              {inputVal && (
                <button
                  type="button"
                  onClick={() => {
                    setInputVal('');
                    setResult(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-subtle)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Clear Input
                </button>
              )}
            </div>

            <textarea
              className="input-field"
              rows={4}
              placeholder="Paste news headline, article content, or web link here..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{
                minHeight: '120px',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                padding: '0.85rem 2rem',
                fontSize: '0.95rem',
                minWidth: '200px',
              }}
            >
              {loading ? 'Analyzing Content...' : 'Verify News'}
            </button>
          </div>
        </form>
      </div>

      {/* Result Card */}
      {result && (
        <div
          className="clean-card animate-fade-in"
          style={{
            padding: '1.75rem',
            borderLeft: `5px solid ${result.prediction === 'GENUINE' ? '#10B981' : '#F62440'}`,
            background: '#FFFFFF',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: result.prediction === 'GENUINE' ? '#ECFDF5' : '#FEF2F2',
                  border: `1px solid ${result.prediction === 'GENUINE' ? '#A7F3D0' : '#FECACA'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                }}
              >
                {result.prediction === 'GENUINE' ? '✓' : '⚠️'}
              </div>

              <div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                  Authenticity Verdict
                </div>
                <div
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: '800',
                    color: result.prediction === 'GENUINE' ? '#047857' : '#D91B35',
                  }}
                >
                  {result.prediction === 'GENUINE' ? 'GENUINE NEWS' : 'SUSPICIOUS / FAKE NEWS'}
                </div>
              </div>
            </div>

            <div
              style={{
                background: '#FFFAF3',
                border: '1px solid #FFE5BF',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'right',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Confidence Score</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: result.prediction === 'GENUINE' ? '#047857' : '#D91B35' }}>
                {result.confidenceScore}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${result.confidenceScore}%`,
                  height: '100%',
                  background: result.prediction === 'GENUINE' ? '#10B981' : '#F62440',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '1rem' }}>
            {result.explanation}
          </p>

          {result.keywordsFound && result.keywordsFound.length > 0 && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#991B1B',
                marginBottom: '1rem',
              }}
            >
              🚩 <strong>Flagged Phrase Markers:</strong> {result.keywordsFound.join(', ')}
            </div>
          )}

          <div
            style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #E2E8F0',
              fontSize: '0.8rem',
              color: 'var(--text-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>Engine: {result.modelUsed || 'AI Authenticity Engine'}</span>
            <span>Recorded in History (ID: #{result.recordId?.substr(-6)})</span>
          </div>
        </div>
      )}
    </div>
  );
}
