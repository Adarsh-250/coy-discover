import express from 'express';
import cors from 'cors';
import feedRouter from './routes/feed.js';
import swipeRouter from './routes/swipe.js';
import matchesRouter from './routes/matches.js';
import { resetDev } from './services/swipeService.js';

export function createApp(db) {
  const app = express();

  // Store db on app.locals so routes can access it via req.app.locals.db
  app.locals.db = db;

  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/feed',    feedRouter);
  app.use('/swipe',   swipeRouter);
  app.use('/matches', matchesRouter);

  // Dev reset
  app.post('/dev/reset', (req, res, next) => {
    try {
      resetDev(db);
      res.json({ ok: true, message: 'State reset to seed data' });
    } catch (err) {
      next(err);
    }
  });

  // Global error handler
  app.use((err, req, res, _next) => {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
  });

  return app;
}
