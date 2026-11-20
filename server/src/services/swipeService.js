const CURRENT_USER_ID = 1;

// IDs that were seeded as pre-existing likes toward user 1
const SEEDED_LIKES = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

export function getFeed(db, limit = 20) {
  const rows = db.prepare(`
    SELECT id, name, age, photo_url, bio, city, interests, sort_key
    FROM users
    WHERE id != ?
      AND id NOT IN (
        SELECT target_id FROM swipes WHERE swiper_id = ?
      )
    ORDER BY sort_key ASC
    LIMIT ?
  `).all(CURRENT_USER_ID, CURRENT_USER_ID, limit);

  return rows.map(row => ({
    id:       row.id,
    name:     row.name,
    age:      row.age,
    photoUrl: row.photo_url,
    bio:      row.bio,
    city:     row.city,
    interests: (() => {
      try { return JSON.parse(row.interests); } catch { return []; }
    })(),
  }));
  // NOTE: No likedMe field — ever.
}

export function recordSwipe(db, targetId, direction) {
  if (direction !== 'like' && direction !== 'pass') {
    const err = new Error("direction must be 'like' or 'pass'");
    err.status = 400;
    throw err;
  }

  if (targetId === CURRENT_USER_ID) {
    const err = new Error('Cannot swipe on yourself');
    err.status = 404;
    throw err;
  }

  const txn = db.transaction(() => {
    // Validate target exists
    const target = db.prepare('SELECT id, name, age, photo_url, city FROM users WHERE id = ?').get(targetId);
    if (!target) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    // Check already swiped
    const existing = db.prepare(
      'SELECT id FROM swipes WHERE swiper_id = ? AND target_id = ?'
    ).get(CURRENT_USER_ID, targetId);
    if (existing) {
      const err = new Error('Already swiped on this user');
      err.status = 409;
      throw err;
    }

    // Insert swipe
    db.prepare(
      'INSERT INTO swipes (swiper_id, target_id, direction) VALUES (?, ?, ?)'
    ).run(CURRENT_USER_ID, targetId, direction);

    if (direction === 'like') {
      // Did targetId already like user 1?
      const theyLikedMe = db.prepare(
        "SELECT id FROM swipes WHERE swiper_id = ? AND target_id = ? AND direction = 'like'"
      ).get(targetId, CURRENT_USER_ID);

      if (theyLikedMe) {
        // Create match
        const userA = Math.min(CURRENT_USER_ID, targetId);
        const userB = Math.max(CURRENT_USER_ID, targetId);
        const { lastInsertRowid } = db.prepare(
          'INSERT INTO matches (user_a_id, user_b_id) VALUES (?, ?)'
        ).run(userA, userB);

        return {
          matched: true,
          match: {
            id: Number(lastInsertRowid),
            profile: {
              id:       target.id,
              name:     target.name,
              age:      target.age,
              photoUrl: target.photo_url,
              city:     target.city,
            },
          },
        };
      }
    }

    return { matched: false };
  });

  return txn();
}

export function getMatches(db) {
  const rows = db.prepare(`
    SELECT
      m.id,
      m.created_at   AS matchedAt,
      u.id           AS uid,
      u.name,
      u.age,
      u.photo_url,
      u.bio,
      u.city,
      u.interests
    FROM matches m
    JOIN users u
      ON u.id = CASE
        WHEN m.user_a_id = ? THEN m.user_b_id
        ELSE m.user_a_id
      END
    WHERE m.user_a_id = ? OR m.user_b_id = ?
    ORDER BY m.created_at DESC
  `).all(CURRENT_USER_ID, CURRENT_USER_ID, CURRENT_USER_ID);

  return rows.map(row => ({
    id:        row.id,
    matchedAt: row.matchedAt,
    profile: {
      id:       row.uid,
      name:     row.name,
      age:      row.age,
      photoUrl: row.photo_url,
      bio:      row.bio,
      city:     row.city,
      interests: (() => {
        try { return JSON.parse(row.interests); } catch { return []; }
      })(),
    },
  }));
}

export function resetDev(db) {
  const txn = db.transaction(() => {
    db.prepare('DELETE FROM matches').run();
    db.prepare('DELETE FROM swipes WHERE swiper_id = ?').run(CURRENT_USER_ID);

    // Re-insert the 10 seeded likes toward user 1
    const insertSwipe = db.prepare(
      "INSERT INTO swipes (swiper_id, target_id, direction) VALUES (?, 1, 'like')"
    );
    for (const id of SEEDED_LIKES) {
      insertSwipe.run(id);
    }
  });
  txn();
}
