import express from 'express';
import cors from 'cors';
import pg from 'pg';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ==========================================
// 1. Historical Data ටික Database එකෙන් ගන්න API එක
// ==========================================
app.get('/api/history/:product', async (req, res) => {
    try {
        const { product } = req.params;
        // Database එකෙන් අදාළ Product එකේ දත්ත ටික අරගන්නවා (Date අනුව Sort කරලා)
        const result = await pool.query(
            'SELECT date, volume_mt, value_rsmln FROM historical_export_data WHERE product = $1 ORDER BY date ASC',
            [product]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// ==========================================
// 2. Python API එකෙන් අලුත් Forecast එකක් ගන්න API එක
// ==========================================
app.get('/api/forecast/:product', async (req, res) => {
    try {
        const { product } = req.params;
        const months = req.query.months || 3;

        // අපේ Python FastAPI එකට (Port 8000) කතා කරනවා
        const pythonApiUrl = `http://localhost:8000/forecast/${product}?months=${months}`;
        const response = await axios.get(pythonApiUrl);
        
        const forecastData = response.data.forecast;

        // ඒ අලුත් දත්ත Database එකේ export_forecasts Table එකට Save කරනවා
        for (let item of forecastData) {
            await pool.query(
                'INSERT INTO export_forecasts (product, forecast_date, predicted_volume, model_used) VALUES ($1, $2, $3, $4)',
                [product, item.date + '-01', item.predicted_volume, response.data.model_used]
            );
        }

        res.json(response.data);
    } catch (err) {
        console.error("Error connecting to Python API:", err.message);
        res.status(500).json({ error: 'Failed to fetch forecast from ML Model' });
    }
});

// Server එක Start කිරීම
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Node.js Backend running on http://localhost:${PORT}`);
});