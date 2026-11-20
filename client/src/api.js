const BASE = 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const fetchFeed    = ()                       => request('/feed?limit=50');
export const sendSwipe    = (targetId, direction)    => request('/swipe', { method: 'POST', body: JSON.stringify({ targetId, direction }) });
export const fetchMatches = ()                       => request('/matches');
export const resetDemo    = ()                       => request('/dev/reset', { method: 'POST' });
