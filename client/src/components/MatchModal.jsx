import { motion, AnimatePresence } from 'framer-motion';

export default function MatchModal({ match, onViewMatches, onKeepSwiping }) {
  if (!match) return null;

  const { profile } = match;

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}
        onClick={onKeepSwiping}
      >
        <motion.div
          key="modal-card"
          initial={{ scale: 0.7, y: 60, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
          exit={{ scale: 0.8, y: 40, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 380,
            background: '#fff',
            border: '2px solid #111',
            borderRadius: 28,
            boxShadow: '6px 6px 0 #111',
            padding: '36px 28px 32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          {/* Confetti emoji banner */}
          <div style={{ fontSize: 32 }}>🎉✨💘</div>

          {/* Headline */}
          <div>
            <h2 style={{
              fontSize: 32, fontWeight: 800, letterSpacing: '-1px',
              color: '#FF2E7E', marginBottom: 8,
            }}>
              It's a match!
            </h2>
            <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6 }}>
              You and <strong style={{ color: '#111' }}>{profile.name}</strong> liked each other.
              <br />
              <span style={{ fontStyle: 'italic' }}>Never who — until now.</span>
            </p>
          </div>

          {/* Avatars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: -12, position: 'relative' }}>
            <Avatar src="https://picsum.photos/seed/coyuser1/200/200" alt="You" offset={-8} />
            {/* Heart badge */}
            <div style={{
              zIndex: 10,
              width: 36, height: 36,
              borderRadius: '50%',
              background: '#FF2E7E',
              border: '2px solid #111',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
              boxShadow: '2px 2px 0 #111',
              position: 'relative',
              margin: '0 -6px',
            }}>
              ♥
            </div>
            <Avatar src={profile.photoUrl} alt={profile.name} offset={8} />
          </div>

          {/* Profile name + city */}
          <div>
            <p style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>
              {profile.name}, {profile.age}
            </p>
            {profile.city && (
              <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>📍 {profile.city}</p>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <button className="btn-primary" style={{ width: '100%' }} onClick={onViewMatches}>
              View Matches
            </button>
            <button className="btn-secondary" style={{ width: '100%' }} onClick={onKeepSwiping}>
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Avatar({ src, alt, offset }) {
  return (
    <div style={{
      width: 90, height: 90,
      borderRadius: '50%',
      border: '3px solid #111',
      boxShadow: '3px 3px 0 #111',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 5,
      marginLeft: offset,
    }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}
