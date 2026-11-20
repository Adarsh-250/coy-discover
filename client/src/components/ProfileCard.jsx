import { motion, useMotionValue, useTransform } from 'framer-motion';

const PILL_COLORS = ['pill-lavender', 'pill-mint', 'pill-yellow', 'pill-peach', 'pill-lavender'];

export default function ProfileCard({ profile, onDragEnd, style, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-160, 0, 160], [-14, 0, 14]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

  function handleDragEnd(_, info) {
    const vx = info.velocity.x;
    const ox = info.offset.x;
    if (ox > 110 || vx > 600) {
      onDragEnd?.('like');
    } else if (ox < -110 || vx < -600) {
      onDragEnd?.('pass');
    }
  }

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      style={{ x: isTop ? x : 0, rotate: isTop ? rotate : 0, ...style, touchAction: 'none' }}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileTap={isTop ? { cursor: 'grabbing' } : {}}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 24,
          border: '2px solid #111',
          boxShadow: '4px 4px 0px #111111',
          overflow: 'hidden',
          position: 'relative',
          background: '#f3f4f6',
          cursor: isTop ? 'grab' : 'default',
          userSelect: 'none',
        }}
      >
        {/* Photo */}
        <img
          src={profile.photoUrl}
          alt={profile.name}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 45%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* LIKE stamp */}
        {isTop && (
          <motion.div
            className="stamp stamp-like"
            style={{ opacity: likeOpacity }}
          >
            LIKE ♥
          </motion.div>
        )}

        {/* NOPE stamp */}
        {isTop && (
          <motion.div
            className="stamp stamp-nope"
            style={{ opacity: nopeOpacity }}
          >
            NOPE ✕
          </motion.div>
        )}

        {/* Info overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '20px 20px 24px',
          pointerEvents: 'none',
        }}>
          {/* Name + Age */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span style={{ color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>
              {profile.name}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 20, fontWeight: 600 }}>
              {profile.age}
            </span>
          </div>

          {/* City badge */}
          {profile.city && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255,255,255,0.4)',
              borderRadius: 50, padding: '3px 10px',
              color: '#fff', fontSize: 12, fontWeight: 600,
              marginBottom: 8,
            }}>
              📍 {profile.city}
            </div>
          )}

          {/* Bio */}
          {profile.bio && (
            <p style={{
              color: 'rgba(255,255,255,0.88)', fontSize: 13, lineHeight: 1.5,
              marginBottom: 10, fontWeight: 500,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {profile.bio}
            </p>
          )}

          {/* Interest pills */}
          {profile.interests?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', pointerEvents: 'auto' }}>
              {profile.interests.map((tag, i) => (
                <span
                  key={tag}
                  className={`pill ${PILL_COLORS[i % PILL_COLORS.length]}`}
                  style={{ fontSize: 11, border: '1.5px solid rgba(0,0,0,0.5)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
