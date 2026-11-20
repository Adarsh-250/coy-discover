import { Router } from 'express';
import { getMatches } from '../services/swipeService.js';

const router = Router();

router.get('/', (req, res, next) => {
  try {
    const matches = getMatches(req.app.locals.db);
    res.json(matches);
  } catch (err) {
    next(err);
  }
});

export default router;
