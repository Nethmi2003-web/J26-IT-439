import fs from 'fs';
import csv from 'csv-parser';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ⚠️ අපේ CSV ෆයිල් එක තියෙන path එක
const csvFilePath = '../ml-service/c1-export-forecasting/data/processed/master_export_data.csv';

const results = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    console.log(`Total rows to insert: ${results.length}`);
    
    try {
      for (let row of results) {
        const query = `
          INSERT INTO historical_export_data 
          (date, product, volume_mt, value_rsmln, ncpi_final, lkr_usd, global_coconut_price, global_palm_price) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        
        const values = [
          row.Date,
          row.Product,
          parseFloat(row.Volume_MT) || 0,
          parseFloat(row.Value_RsMln) || 0,
          parseFloat(row.NCPI_Final) || 0,
          parseFloat(row.LKR_USD) || 0,
          parseFloat(row.Global_Coconut_Price) || 0,
          parseFloat(row.Global_Palm_Price) || 0
        ];

        await pool.query(query, values);
      }
      console.log('✅ All data inserted successfully!');
      process.exit(0);
      
    } catch (err) {
      console.error('❌ Error inserting data:', err);
      process.exit(1);
    }
  });