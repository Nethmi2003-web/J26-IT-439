import { Router } from 'express';
import { query } from '../config/db.js';
import { callMl } from '../config/mlClient.js';

const router = Router();

// GET /api/exports?product=Coconut oil
router.get('/', async (req, res, next) => {
  try {
    const { product } = req.query;
    const { rows } = await query(
      `SELECT product, period_month, volume_mt, value_lkr, destination
         FROM export_records
        WHERE ($1::text IS NULL OR product = $1)
        ORDER BY period_month`,
      [product || null],
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/exports/forecasts
router.get('/forecasts', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT product, period_month, volume_mt, value_lkr, lower_bound, upper_bound
         FROM export_forecasts ORDER BY product, period_month`,
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/exports/forecast  { product, horizon }
router.post('/forecast', async (req, res, next) => {
  try {
    res.json(await callMl('/export/forecast', req.body));
  } catch (err) {
    next(err);
  }
});

export default router;
