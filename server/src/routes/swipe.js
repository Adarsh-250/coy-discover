import { Router } from 'express';
import { recordSwipe } from '../services/swipeService.js';

const router = Router();

router.post('/', (req, res, next) => {
  try {
    const targetId = parseInt(req.body.targetId);
    const direction = req.body.direction;

    if (!targetId || isNaN(targetId)) {
      return res.status(400).json({ error: 'targetId must be a valid integer' });
    }

    const result = recordSwipe(req.app.locals.db, targetId, direction);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
