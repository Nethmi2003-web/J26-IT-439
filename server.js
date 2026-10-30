require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { connectDatabase, isDatabaseConnected } = require("./config/db");
const predictionRoutes = require("./routes/predictionRoutes");

const app = express();
const port = Number(process.env.PORT || 5000);
const mlServiceUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

// Allow CLIENT_URL (comma-separated) plus any localhost port, since Vite moves to
// 5174, 5175, ... when 5173 is already taken.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",").map((url) => url.trim());
const localhostOrigin = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(cors({
  origin: (origin, callback) => {
    callback(null, !origin || allowedOrigins.includes(origin) || localhostOrigin.test(origin));
  },
}));
app.use(express.json());

app.get("/health", async (_req, res) => {
  let ml = "down";
  try {
    const response = await fetch(`${mlServiceUrl}/health`);
    if (response.ok) ml = "ok";
  } catch {
    // ML service unreachable
  }
  res.json({ status: "ok", ml, database: isDatabaseConnected() ? "ok" : "down" });
});

app.use("/api", predictionRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

connectDatabase();
app.listen(port, () => {
  console.log(`Node API listening on http://localhost:${port}`);
});
