import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProfileCard from './ProfileCard.jsx';
import { sendSwipe } from '../api.js';

const CARD_H = 520;

export default function SwipeDeck({ profiles, onSwipeDone, onMatch }) {
  const [deck, setDeck] = useState(profiles);
  const [exiting, setExiting] = useState(null); // { direction, profile }
  const [locked, setLocked] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Sync deck when profiles prop changes (e.g. after reset)
  useEffect(() => { setDeck(profiles); }, [profiles]);

  // Preload next image
  useEffect(() => {
    if (deck.length > 1) {
      const img = new Image();
      img.src = deck[1].photoUrl;
    }
  }, [deck]);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }

  const swipe = useCallback(async (direction) => {
    if (locked || deck.length === 0) return;
    const profile = deck[0];
    setLocked(true);
    setExiting({ direction, profile });

    // Optimistically remove from deck
    setDeck(prev => prev.slice(1));

    try {
      const result = await sendSwipe(profile.id, direction);
      onSwipeDone?.();
      if (result.matched) {
        onMatch?.(result.match);
      }
    } catch (err) {
      // Restore card on failure
      setDeck(prev => [profile, ...prev]);
      showToast(err.message || 'Network error — try again');
    } finally {
      setExiting(null);
      setLocked(false);
    }
  }, [locked, deck, onSwipeDone, onMatch]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowLeft')  swipe('pass');
      if (e.key === 'ArrowRight') swipe('like');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [swipe]);

  if (deck.length === 0 && !exiting) return null;

  const top  = deck[0];
  const next = deck[1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {/* Card stack */}
      <div style={{ position: 'relative', width: '100%', height: CARD_H }}>

        {/* Next card (peeking behind) */}
        {next && (
          <div style={{
            position: 'absolute', inset: 0,
            transform: 'scale(0.96) translateY(8px)',
            transformOrigin: 'bottom center',
            zIndex: 1,
            borderRadius: 24,
          }}>
            <ProfileCard profile={next} isTop={false} style={{ width: '100%', height: '100%' }} />
          </div>
        )}

        {/* Top card — exits with animation */}
        <AnimatePresence>
          {top && (
            <motion.div
              key={top.id}
              initial={{ scale: 1, x: 0, opacity: 1 }}
              exit={exiting ? {
                x: exiting.direction === 'like' ? 420 : -420,
                rotate: exiting.direction === 'like' ? 20 : -20,
                opacity: 0,
                transition: { duration: 0.35, ease: 'easeIn' },
              } : {}}
              style={{ position: 'absolute', inset: 0, zIndex: 2, borderRadius: 24 }}
            >
              <ProfileCard
                profile={top}
                isTop={true}
                onDragEnd={swipe}
                style={{ width: '100%', height: '100%' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <ActionButton
          label="Pass"
          emoji="✕"
          bg="#fff"
          color="#ef4444"
          border="#ef4444"
          disabled={locked || deck.length === 0}
          onClick={() => swipe('pass')}
        />
        <ActionButton
          label="Like"
          emoji="♥"
          bg="#FF2E7E"
          color="#fff"
          border="#111"
          disabled={locked || deck.length === 0}
          onClick={() => swipe('like')}
          large
        />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionButton({ emoji, label, bg, color, border, disabled, onClick, large }) {
  const size = large ? 68 : 56;
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: size, height: size,
        borderRadius: '50%',
        background: bg,
        color,
        border: `2px solid ${border}`,
        boxShadow: '4px 4px 0px #111111',
        fontSize: large ? 26 : 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.1s, box-shadow 0.1s, opacity 0.15s',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '2px 2px 0 #111'; }}
      onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0px #111111'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0px #111111'; }}
    >
      {emoji}
    </button>
  );
}
