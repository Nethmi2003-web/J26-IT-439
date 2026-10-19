import { Router } from 'express';
import { query } from '../config/db.js';
import { callMl } from '../config/mlClient.js';

const router = Router();

// Reports whether the API, database, and ML service are reachable.
router.get('/', async (req, res) => {
  const status = { api: 'ok', database: 'down', mlService: 'down' };
  try {
    await query('SELECT 1');
    status.database = 'ok';
  } catch { /* leave as down */ }
  try {
    await callMl('/health');
    status.mlService = 'ok';
  } catch { /* leave as down */ }
  res.json(status);
});

export default router;
