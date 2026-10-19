import { Router } from 'express';
import { query } from '../config/db.js';
import { callMl } from '../config/mlClient.js';

const router = Router();

// GET /api/drought/risk
router.get('/risk', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT d.name AS district, r.period_start, r.risk_index, r.risk_level
         FROM drought_risk r
         JOIN districts d ON d.id = r.district_id
        ORDER BY r.period_start DESC, d.name`,
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/drought/predict  { district, horizonMonths }
router.post('/predict', async (req, res, next) => {
  try {
    res.json(await callMl('/drought/predict', req.body));
  } catch (err) {
    next(err);
  }
});

export default router;
