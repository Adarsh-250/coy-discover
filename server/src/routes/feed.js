import { Router } from 'express';
import { getFeed } from '../services/swipeService.js';

const router = Router();

router.get('/', (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const feed = getFeed(req.app.locals.db, limit);
    res.json(feed);
  } catch (err) {
    next(err);
  }
});

export default router;
