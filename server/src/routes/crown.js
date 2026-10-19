import { Router } from 'express';
import { query } from '../config/db.js';
import { callMl } from '../config/mlClient.js';

const router = Router();

// GET /api/crown/predictions
router.get('/predictions', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT p.id, i.file_path, p.label, p.confidence, p.created_at
         FROM crown_predictions p
         JOIN crown_images i ON i.id = p.image_id
        ORDER BY p.created_at DESC
        LIMIT 100`,
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/crown/predict  { imagePath }
router.post('/predict', async (req, res, next) => {
  try {
    res.json(await callMl('/crown/predict', req.body));
  } catch (err) {
    next(err);
  }
});

export default router;
