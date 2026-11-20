import { useEffect, useState } from 'react';
import { fetchMatches } from '../api.js';

const PILL_COLORS = ['pill-lavender', 'pill-mint', 'pill-yellow', 'pill-peach'];

function timeAgo(isoString) {
  const ms = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MatchesList({ refreshKey }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMatches()
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
        <Spinner />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '56px 24px', gap: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 56 }}>💔</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.3px' }}>No matches yet</h3>
        <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, maxWidth: 240 }}>
          Keep swiping in Discover to meet new people!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 0' }}>
      {matches.map(m => (
        <MatchCard key={m.id} match={m} />
      ))}
    </div>
  );
}

function MatchCard({ match }) {
  const { profile, matchedAt } = match;
  return (
    <div
      className="neo-card"
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px',
        borderRadius: 20,
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 68, height: 68, flexShrink: 0,
        borderRadius: '50%',
        border: '2px solid #111',
        overflow: 'hidden',
        boxShadow: '2px 2px 0 #111',
      }}>
        <img
          src={profile.photoUrl}
          alt={profile.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px' }}>
            {profile.name}
          </span>
          <span style={{ color: '#6B7280', fontSize: 13 }}>{profile.age}</span>
        </div>

        {profile.city && (
          <p style={{ color: '#6B7280', fontSize: 12, marginBottom: 6 }}>📍 {profile.city}</p>
        )}

        {/* Interest pills */}
        {profile.interests?.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {profile.interests.slice(0, 3).map((tag, i) => (
              <span key={tag} className={`pill ${PILL_COLORS[i % PILL_COLORS.length]}`}
                style={{ fontSize: 10, padding: '2px 8px' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Timestamp + heart */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <span style={{
          background: '#FF2E7E', color: '#fff',
          borderRadius: '50%', width: 28, height: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, border: '1.5px solid #111', boxShadow: '1px 1px 0 #111',
        }}>♥</span>
        <span style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 600 }}>
          {timeAgo(matchedAt)}
        </span>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 32, height: 32, border: '3px solid #ECE9FE',
      borderTopColor: '#FF2E7E', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  );
}
