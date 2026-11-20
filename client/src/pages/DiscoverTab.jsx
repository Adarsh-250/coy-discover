import { useState, useEffect, useCallback } from 'react';
import SwipeDeck from '../components/SwipeDeck.jsx';
import MatchModal from '../components/MatchModal.jsx';
import MatchesList from '../components/MatchesList.jsx';
import { fetchFeed, resetDemo } from '../api.js';

export default function DiscoverTab() {
  const [view, setView]           = useState('swipe');     // 'swipe' | 'matches'
  const [feed, setFeed]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [matchCount, setMatchCount] = useState(0);
  const [pendingMatch, setPendingMatch] = useState(null);  // match payload from API
  const [resetting, setResetting] = useState(false);
  const [matchRefresh, setMatchRefresh] = useState(0);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFeed();
      setFeed(data);
    } catch (err) {
      console.error('Feed error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFeed(); }, [loadFeed]);

  async function handleReset() {
    setResetting(true);
    try {
      await resetDemo();
      setMatchCount(0);
      setMatchRefresh(r => r + 1);
      await loadFeed();
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setResetting(false);
    }
  }

  function handleMatch(match) {
    setPendingMatch(match);
    setMatchCount(c => c + 1);
    setMatchRefresh(r => r + 1);
  }

  function closeModal(goToMatches = false) {
    setPendingMatch(null);
    if (goToMatches) setView('matches');
  }

  const isEmpty = !loading && feed.length === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* ── Header ───────────────────────────────── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 20px 12px',
        borderBottom: '2px solid #111',
        background: '#fff',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <h1 className="wordmark">coy<span>.</span></h1>

        {/* Swipe / Matches toggle */}
        <div style={{
          display: 'flex',
          background: '#F7F7F8',
          border: '2px solid #111',
          borderRadius: 50,
          padding: 3,
          gap: 2,
          boxShadow: '2px 2px 0 #111',
        }}>
          <ToggleBtn label="Swipe" active={view === 'swipe'} onClick={() => setView('swipe')} />
          <ToggleBtn
            label={`Matches${matchCount > 0 ? ` (${matchCount})` : ''}`}
            active={view === 'matches'}
            onClick={() => setView('matches')}
            accent={matchCount > 0}
          />
        </div>
      </header>

      {/* ── Body ─────────────────────────────────── */}
      <div style={{ flex: 1, padding: '20px 16px 12px' }}>
        {view === 'swipe' ? (
          <>
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
                <LoadingSpinner />
              </div>
            )}

            {!loading && !isEmpty && (
              <SwipeDeck
                profiles={feed}
                onSwipeDone={() => {}}
                onMatch={handleMatch}
              />
            )}

            {isEmpty && (
              <EmptyState onReset={handleReset} resetting={resetting} />
            )}
          </>
        ) : (
          <>
            <MatchesList refreshKey={matchRefresh} />
            <div style={{ padding: '16px 0 8px', textAlign: 'center' }}>
              <button
                className="btn-secondary"
                style={{ fontSize: 13, padding: '10px 20px' }}
                onClick={handleReset}
                disabled={resetting}
              >
                {resetting ? 'Resetting…' : '🔄 Reset Demo'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Match Modal ───────────────────────────── */}
      {pendingMatch && (
        <MatchModal
          match={pendingMatch}
          onViewMatches={() => closeModal(true)}
          onKeepSwiping={() => closeModal(false)}
        />
      )}
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function ToggleBtn({ label, active, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 50,
        border: active ? '2px solid #111' : '2px solid transparent',
        background: active ? (accent ? '#FF2E7E' : '#fff') : 'transparent',
        color: active ? (accent ? '#fff' : '#111') : '#6B7280',
        fontWeight: 700,
        fontSize: 13,
        boxShadow: active ? '2px 2px 0 #111' : 'none',
        transition: 'all 0.15s',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

function EmptyState({ onReset, resetting }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '56px 24px', gap: 20, textAlign: 'center',
    }}>
      <div style={{ fontSize: 64 }}>🎉</div>
      <div>
        <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
          You're all caught up!
        </h3>
        <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6 }}>
          You've seen everyone for now.
        </p>
      </div>
      <button
        className="btn-primary"
        onClick={onReset}
        disabled={resetting}
        style={{ opacity: resetting ? 0.6 : 1 }}
      >
        {resetting ? 'Resetting…' : '🔄 Reset Demo Profiles'}
      </button>
      <p style={{ color: '#9CA3AF', fontSize: 12 }}>
        Reloads all 40 profiles for reviewers
      </p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 44, height: 44,
        border: '3px solid #ECE9FE',
        borderTopColor: '#FF2E7E',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <p style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 600 }}>Finding people near you…</p>
    </div>
  );
}
