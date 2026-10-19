import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import healthRoutes from './routes/health.js';
import exportRoutes from './routes/exports.js';
import crownRoutes from './routes/crown.js';
import droughtRoutes from './routes/drought.js';
import spatialRoutes from './routes/spatial.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/health', healthRoutes);
app.use('/api/exports', exportRoutes);   // Component 1
app.use('/api/crown', crownRoutes);      // Component 2
app.use('/api/drought', droughtRoutes);  // Component 3
app.use('/api/spatial', spatialRoutes);  // Component 4

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({ error: 'Database is not reachable. Is PostgreSQL running?' });
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

export default app;
