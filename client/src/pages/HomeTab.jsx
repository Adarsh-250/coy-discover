export default function HomeTab({ setActiveTab }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 24px 32px',
      minHeight: '100%',
      gap: '32px',
    }}>
      {/* Wordmark */}
      <header>
        <h1 className="wordmark" style={{ fontSize: 32 }}>
          coy<span>.</span>
        </h1>
      </header>

      {/* Placeholder card */}
      <div
        className="neo-card"
        style={{
          width: '100%',
          padding: '40px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{
          width: 64, height: 64,
          borderRadius: '50%',
          background: '#FFF0F6',
          border: '2px solid #111',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>
          🏠
        </div>
        <h2 style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px' }}>Home</h2>
        <p style={{ color: '#6B7280', fontSize: 15, lineHeight: 1.6, maxWidth: 260 }}>
          Switch to the <strong>Discover</strong> tab below to meet new people.
        </p>
        <button
          className="btn-primary"
          style={{ marginTop: 8 }}
          onClick={() => setActiveTab('discover')}
        >
          Go to Discover ✨
        </button>
      </div>

      {/* Decorative badges */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['✈️ Travel', '🎵 Music', '☕ Coffee', '📚 Books', '🧘 Wellness'].map((tag, i) => {
          const colors = ['pill-lavender','pill-mint','pill-yellow','pill-peach','pill-lavender'];
          return (
            <span key={tag} className={`pill ${colors[i]}`}>{tag}</span>
          );
        })}
      </div>
    </div>
  );
}
