import { Router } from 'express';
import { query } from '../config/db.js';
import { callMl } from '../config/mlClient.js';

const router = Router();

// GET /api/spatial/reports
router.get('/reports', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, reported_on, latitude, longitude, severity, infected_palms
         FROM disease_reports ORDER BY reported_on DESC`,
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/spatial/hotspots
router.get('/hotspots', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, latitude, longitude, radius_km, risk_score, detected_on
         FROM hotspots ORDER BY risk_score DESC`,
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/spatial/detect
router.post('/detect', async (req, res, next) => {
  try {
    res.json(await callMl('/spatial/hotspots', req.body));
  } catch (err) {
    next(err);
  }
});

export default router;
