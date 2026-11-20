import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { createDb } from '../src/db.js';
import { seedDatabase } from '../src/seed.js';
import { createApp } from '../src/app.js';
import fs from 'fs';
import os from 'os';
import path from 'path';

// ─── Helpers ───────────────────────────────────────────────────────────────

function buildApp(dbPath) {
  const db = createDb(dbPath);
  seedDatabase(db);
  return { app: createApp(db), db };
}

// ─── In-memory DB setup ────────────────────────────────────────────────────

let app, db;

beforeEach(() => {
  ({ app, db } = buildApp(':memory:'));
});

afterEach(() => {
  db.close();
});

// ═══════════════════════════════════════════════════════════════════════════
// 1. GET /feed — excludes user 1, excludes already-swiped, no likedMe field
// ═══════════════════════════════════════════════════════════════════════════
describe('GET /feed', () => {
  it('excludes user 1 (the logged-in user)', async () => {
    const res = await request(app).get('/feed').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    const hasUser1 = res.body.some(u => u.id === 1);
    expect(hasUser1).toBe(false);
  });

  it('excludes profiles already swiped by user 1', async () => {
    // Swipe on user 2
    await request(app).post('/swipe').send({ targetId: 2, direction: 'pass' }).expect(200);

    const res = await request(app).get('/feed').expect(200);
    const hasUser2 = res.body.some(u => u.id === 2);
    expect(hasUser2).toBe(false);
  });

  it('contains NO likedMe property anywhere in the response', async () => {
    const res = await request(app).get('/feed').expect(200);
    const json = JSON.stringify(res.body);
    expect(json).not.toContain('likedMe');
  });

  it('returns profiles with expected shape', async () => {
    const res = await request(app).get('/feed').expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    const profile = res.body[0];
    expect(profile).toHaveProperty('id');
    expect(profile).toHaveProperty('name');
    expect(profile).toHaveProperty('age');
    expect(profile).toHaveProperty('photoUrl');
    expect(profile).toHaveProperty('city');
    expect(profile).toHaveProperty('interests');
    expect(Array.isArray(profile.interests)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. Liking someone who already liked user 1 → matched: true
// ═══════════════════════════════════════════════════════════════════════════
describe('POST /swipe — mutual like creates a match', () => {
  it('returns matched: true when liking a profile that already liked user 1', async () => {
    // IDs 2,4,6,8,10,12,14,16,18,20 pre-liked user 1 in seed data
    const res = await request(app)
      .post('/swipe')
      .send({ targetId: 2, direction: 'like' })
      .expect(200);

    expect(res.body.matched).toBe(true);
    expect(res.body.match).toBeDefined();
    expect(res.body.match.id).toBeTypeOf('number');
    expect(res.body.match.profile.id).toBe(2);
    expect(res.body.match.profile).toHaveProperty('photoUrl');
    expect(res.body.match.profile).toHaveProperty('city');
  });

  it('the match appears in GET /matches after a mutual like', async () => {
    await request(app).post('/swipe').send({ targetId: 4, direction: 'like' }).expect(200);

    const res = await request(app).get('/matches').expect(200);
    expect(res.body.length).toBeGreaterThan(0);

    const match = res.body.find(m => m.profile.id === 4);
    expect(match).toBeDefined();
    expect(match).toHaveProperty('id');
    expect(match).toHaveProperty('matchedAt');
    expect(match.profile).toHaveProperty('name');
    expect(match.profile).toHaveProperty('bio');
    expect(Array.isArray(match.profile.interests)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. Liking someone who did NOT like user 1 → matched: false
// ═══════════════════════════════════════════════════════════════════════════
describe('POST /swipe — no match when target did not like user 1', () => {
  it('returns matched: false for a profile that did NOT like user 1', async () => {
    // User 3 is not in the seeded-likes list
    const res = await request(app)
      .post('/swipe')
      .send({ targetId: 3, direction: 'like' })
      .expect(200);

    expect(res.body.matched).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. Passing on someone who liked user 1 → matched: false, no match created
// ═══════════════════════════════════════════════════════════════════════════
describe('POST /swipe — passing on a liker creates no match', () => {
  it('returns matched: false when user 1 passes on a profile that liked them', async () => {
    // User 6 pre-liked user 1
    const res = await request(app)
      .post('/swipe')
      .send({ targetId: 6, direction: 'pass' })
      .expect(200);

    expect(res.body.matched).toBe(false);
  });

  it('GET /matches stays empty after passing on a liker', async () => {
    await request(app).post('/swipe').send({ targetId: 6, direction: 'pass' });
    const res = await request(app).get('/matches').expect(200);
    expect(res.body.length).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. Swiping twice on same profile → 409
// ═══════════════════════════════════════════════════════════════════════════
describe('POST /swipe — duplicate swipe', () => {
  it('returns 409 when swiping on the same profile twice', async () => {
    await request(app).post('/swipe').send({ targetId: 5, direction: 'pass' }).expect(200);
    const res = await request(app).post('/swipe').send({ targetId: 5, direction: 'like' }).expect(409);
    expect(res.body).toHaveProperty('error');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. Invalid direction → 400 | Nonexistent targetId → 404
// ═══════════════════════════════════════════════════════════════════════════
describe('POST /swipe — validation errors', () => {
  it('returns 400 for an invalid direction', async () => {
    const res = await request(app)
      .post('/swipe')
      .send({ targetId: 3, direction: 'superlike' })
      .expect(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 for a nonexistent targetId', async () => {
    const res = await request(app)
      .post('/swipe')
      .send({ targetId: 9999, direction: 'like' })
      .expect(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when trying to swipe on user 1 (self)', async () => {
    const res = await request(app)
      .post('/swipe')
      .send({ targetId: 1, direction: 'like' })
      .expect(404);
    expect(res.body).toHaveProperty('error');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. Persistence: file-based DB preserves swipes & matches across close/reopen
// ═══════════════════════════════════════════════════════════════════════════
describe('Persistence — file-based DB', () => {
  it('preserves swipes and matches across DB close and reopen', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coy-test-'));
    const dbPath = path.join(tmpDir, 'test.db');

    // First session: open DB, seed, swipe on user 2 (who pre-liked user 1)
    const { app: app1, db: db1 } = buildApp(dbPath);
    await request(app1).post('/swipe').send({ targetId: 2, direction: 'like' }).expect(200);
    db1.close();

    // Second session: reopen same file
    const { app: app2, db: db2 } = buildApp(dbPath);

    // Swipe on user 2 again should be 409 (already swiped)
    await request(app2).post('/swipe').send({ targetId: 2, direction: 'like' }).expect(409);

    // Match from first session should still be there
    const matchRes = await request(app2).get('/matches').expect(200);
    expect(matchRes.body.some(m => m.profile.id === 2)).toBe(true);

    db2.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
