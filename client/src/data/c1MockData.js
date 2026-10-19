// Mock data for C1 – Multi-Product Export Forecasting.
// Values are generated deterministically, so they are identical on every load.
// Volumes are in metric tonnes (MT); values are in USD.

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthRange(startYear, startMonth, count) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(startYear, startMonth - 1 + i, 1));
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    return { key: `${y}-${String(m + 1).padStart(2, '0')}`, label: `${MONTH_NAMES[m]} ${String(y).slice(2)}` };
  });
}

const round = (n, d = 0) => Number(n.toFixed(d));

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export const products = [
  {
    id: 'coconut-oil',
    name: 'Coconut Oil',
    short: 'CO',
    color: '#2563EB',
    description: 'Refined and crude coconut oil for food and industrial use.',
    markets: ['India', 'Pakistan', 'UAE'],
    baseVolume: 2100,
    pricePerMt: 1650,
    seed: 11,
  },
  {
    id: 'vco',
    name: 'Virgin Coconut Oil',
    short: 'VCO',
    color: '#16A34A',
    description: 'Cold-pressed premium oil for health, cosmetic and food markets.',
    markets: ['USA', 'Germany', 'Australia'],
    baseVolume: 820,
    pricePerMt: 4300,
    seed: 23,
  },
  {
    id: 'dc',
    name: 'Desiccated Coconut',
    short: 'DC',
    color: '#F59E0B',
    description: 'Dried, grated coconut kernel for bakery and confectionery.',
    markets: ['Netherlands', 'UK', 'Saudi Arabia'],
    baseVolume: 4300,
    pricePerMt: 2350,
    seed: 37,
  },
  {
    id: 'copra',
    name: 'Copra',
    short: 'CP',
    color: '#7C3AED',
    description: 'Dried coconut kernel used for oil extraction.',
    markets: ['India', 'Bangladesh'],
    baseVolume: 1350,
    pricePerMt: 980,
    seed: 41,
  },
  {
    id: 'fresh-nuts',
    name: 'Fresh Nuts',
    short: 'FN',
    color: '#0891B2',
    description: 'Fresh and king coconuts for beverage and retail markets.',
    markets: ['UAE', 'Maldives', 'Qatar'],
    baseVolume: 3100,
    pricePerMt: 610,
    seed: 53,
  },
];

export const getProduct = (id) => products.find((p) => p.id === id);

// ---------------------------------------------------------------------------
// History: 24 months (Sep 2024 – Aug 2026) per product
// ---------------------------------------------------------------------------
export const historyMonths = monthRange(2024, 9, 24);
export const forecastMonths = monthRange(2026, 9, 6); // Sep 2026 – Feb 2027

function seasonal(i, product) {
  // Two harvest peaks per year with a product-specific phase.
  return 1 + 0.11 * Math.sin(((i + product.seed) / 12) * Math.PI * 2) + 0.04 * Math.sin((i / 6) * Math.PI * 2);
}

export const history = Object.fromEntries(
  products.map((p) => {
    const rnd = seeded(p.seed);
    const rows = historyMonths.map((m, i) => {
      const volume = p.baseVolume * seasonal(i, p) * (1 + i * 0.005) * (0.93 + rnd() * 0.14);
      const price = p.pricePerMt * (1 + i * 0.003) * (0.97 + rnd() * 0.06);
      return { month: m.key, label: m.label, volume: Math.round(volume), value: Math.round(volume * price) };
    });
    return [p.id, rows];
  }),
);

// ---------------------------------------------------------------------------
// Forecast: 6 months with 95% prediction interval
// ---------------------------------------------------------------------------
export const forecast = Object.fromEntries(
  products.map((p) => {
    const last = history[p.id].at(-1);
    const unitPrice = last.value / last.volume;
    const rows = forecastMonths.map((m, h) => {
      const i = historyMonths.length + h;
      const volume = p.baseVolume * seasonal(i, p) * (1 + i * 0.005);
      const spread = 0.06 + h * 0.022; // uncertainty widens with the horizon
      return {
        month: m.key,
        label: m.label,
        volume: Math.round(volume),
        volumeLower: Math.round(volume * (1 - spread)),
        volumeUpper: Math.round(volume * (1 + spread)),
        value: Math.round(volume * unitPrice),
        valueLower: Math.round(volume * unitPrice * (1 - spread)),
        valueUpper: Math.round(volume * unitPrice * (1 + spread)),
      };
    });
    return [p.id, rows];
  }),
);

// Sum all products month by month (history and forecast).
function sumSeries(source, months, fields) {
  return months.map((m, idx) => {
    const row = { month: m.key, label: m.label };
    fields.forEach((f) => {
      row[f] = products.reduce((acc, p) => acc + source[p.id][idx][f], 0);
    });
    return row;
  });
}

export const totalHistory = sumSeries(history, historyMonths, ['volume', 'value']);
export const totalForecast = sumSeries(forecast, forecastMonths, [
  'volume', 'volumeLower', 'volumeUpper', 'value', 'valueLower', 'valueUpper',
]);

// ---------------------------------------------------------------------------
// Summary helpers used by the dashboards
// ---------------------------------------------------------------------------
const sum = (rows, f) => rows.reduce((a, r) => a + r[f], 0);

export function productSummary(productId) {
  const h = productId === 'all' ? totalHistory : history[productId];
  const f = productId === 'all' ? totalForecast : forecast[productId];
  const last12 = h.slice(-12);
  const prev12 = h.slice(-24, -12);
  const next3 = f.slice(0, 3);
  const last3 = h.slice(-3);
  return {
    volume12: sum(last12, 'volume'),
    value12: sum(last12, 'value'),
    yoyVolume: sum(last12, 'volume') / sum(prev12, 'volume') - 1,
    yoyValue: sum(last12, 'value') / sum(prev12, 'value') - 1,
    next3Change: sum(next3, 'volume') / sum(last3, 'volume') - 1,
  };
}

// ---------------------------------------------------------------------------
// Pre-2022 vs Post-2022 (structural break: 2022 economic crisis)
// Monthly total export volume with the hybrid model's back-tested forecast.
// ---------------------------------------------------------------------------
function backtest(startYear, count, seed, base, noise, bias) {
  const rnd = seeded(seed);
  return monthRange(startYear, 1, count).map((m, i) => {
    const actual = base * (1 + 0.1 * Math.sin((i / 12) * Math.PI * 2)) * (1 + (rnd() - 0.5) * noise);
    const predicted = actual * (1 + (rnd() - 0.5) * noise * 0.8 + bias);
    return { month: m.key, label: m.label, actual: Math.round(actual), predicted: Math.round(predicted) };
  });
}

export const pre2022Series = backtest(2019, 36, 7, 11200, 0.12, 0.0); // stable regime
export const post2022Series = backtest(2022, 36, 19, 10100, 0.3, 0.03); // volatile regime

// ---------------------------------------------------------------------------
// Model metrics
// MAE / RMSE in MT, MAPE and Coverage (95% interval) in %.
// ---------------------------------------------------------------------------
export const models = [
  {
    id: 'sarimax',
    name: 'SARIMAX',
    color: '#9CA3AF',
    description: 'Seasonal ARIMA with exogenous variables (rainfall, exchange rate, prices).',
    mae: 412,
    rmse: 538,
    mape: 9.8,
    coverage: 88.5,
  },
  {
    id: 'xgboost',
    name: 'XGBoost',
    color: '#2563EB',
    description: 'Gradient-boosted trees on lagged, calendar and market features.',
    mae: 356,
    rmse: 471,
    mape: 8.3,
    coverage: 90.2,
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    color: '#2E7D32',
    description: 'SARIMAX baseline with XGBoost residual correction.',
    mae: 298,
    rmse: 402,
    mape: 6.9,
    coverage: 94.1,
    best: true,
  },
];

export const periodAccuracy = [
  { model: 'SARIMAX', preMape: 7.2, postMape: 13.6, preCoverage: 92.4, postCoverage: 82.1 },
  { model: 'XGBoost', preMape: 6.8, postMape: 10.4, preCoverage: 93.0, postCoverage: 86.7 },
  { model: 'Hybrid', preMape: 5.4, postMape: 8.1, preCoverage: 95.2, postCoverage: 92.3 },
];

// Per-product metrics scale the overall metrics by product size and volatility.
export function productModelMetrics(productId) {
  const p = getProduct(productId);
  const scale = p ? p.baseVolume / 2300 : 1;
  const rnd = seeded(p ? p.seed : 1);
  return models.map((m) => ({
    ...m,
    mae: Math.round(m.mae * scale * (0.85 + rnd() * 0.3)),
    rmse: Math.round(m.rmse * scale * (0.85 + rnd() * 0.3)),
    mape: round(m.mape * (0.85 + rnd() * 0.3), 1),
    coverage: round(Math.min(97.5, m.coverage * (0.97 + rnd() * 0.05)), 1),
  }));
}

// ---------------------------------------------------------------------------
// Contributing factors (feature importance of the hybrid model)
// ---------------------------------------------------------------------------
const baseFactors = [
  { name: 'Lagged export volume (t-1, t-12)', direction: 'up', weight: 0.31 },
  { name: 'Coconut production (national harvest)', direction: 'up', weight: 0.22 },
  { name: 'USD/LKR exchange rate', direction: 'up', weight: 0.16 },
  { name: 'Rainfall deficit (coconut triangle)', direction: 'down', weight: 0.12 },
  { name: 'Global vegetable oil prices', direction: 'up', weight: 0.11 },
  { name: 'Domestic nut price', direction: 'down', weight: 0.08 },
];

export function contributingFactors(productId) {
  const rnd = seeded(getProduct(productId)?.seed ?? 3);
  const raw = baseFactors.map((f) => ({ ...f, weight: f.weight * (0.75 + rnd() * 0.5) }));
  const total = raw.reduce((a, f) => a + f.weight, 0);
  return raw.map((f) => ({ ...f, weight: round(f.weight / total, 3) })).sort((a, b) => b.weight - a.weight);
}

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------
export const alerts = [
  {
    id: 1,
    severity: 'critical',
    productId: 'copra',
    title: 'Forecast drop exceeds threshold',
    message: 'Copra export volume is forecast to fall 18% in Nov 2026, beyond the 15% alert threshold.',
    date: '2026-10-17T08:40:00Z',
  },
  {
    id: 2,
    severity: 'critical',
    productId: 'dc',
    title: 'Actuals outside prediction interval',
    message: 'Desiccated coconut exports for Aug 2026 fell below the 95% lower bound for 2 consecutive months.',
    date: '2026-10-16T14:05:00Z',
  },
  {
    id: 3,
    severity: 'high',
    productId: 'coconut-oil',
    title: 'Price-driven volume risk',
    message: 'Rising global vegetable oil prices may reduce coconut oil export competitiveness next quarter.',
    date: '2026-10-15T10:20:00Z',
  },
  {
    id: 4,
    severity: 'high',
    productId: 'fresh-nuts',
    title: 'Supply constraint expected',
    message: 'Rainfall deficit in Kurunegala may cut fresh nut supply by 9% from Dec 2026.',
    date: '2026-10-14T07:55:00Z',
  },
  {
    id: 5,
    severity: 'high',
    productId: 'vco',
    title: 'Model drift detected',
    message: 'VCO forecast error (MAPE) rose from 6.2% to 11.4% over the last 3 months. Retraining recommended.',
    date: '2026-10-12T16:30:00Z',
  },
  {
    id: 6,
    severity: 'medium',
    productId: 'vco',
    title: 'Demand growth opportunity',
    message: 'VCO exports to Germany forecast to rise 12% in Q1 2027.',
    date: '2026-10-11T09:10:00Z',
  },
  {
    id: 7,
    severity: 'medium',
    productId: 'dc',
    title: 'Seasonal peak approaching',
    message: 'Desiccated coconut demand typically peaks in Nov–Dec. Forecast shows +7% vs last year.',
    date: '2026-10-09T11:45:00Z',
  },
  {
    id: 8,
    severity: 'medium',
    productId: 'coconut-oil',
    title: 'Wider forecast interval',
    message: 'Prediction interval for Feb 2027 is ±19%, wider than usual due to exchange-rate volatility.',
    date: '2026-10-08T13:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Main dashboard
// ---------------------------------------------------------------------------
export const activityTimeline = [
  { id: 1, title: 'Hybrid model retrained', detail: 'C1 · MAPE improved from 7.4% to 6.9%', time: '2 hours ago', type: 'model' },
  { id: 2, title: 'Monthly export data imported', detail: 'C1 · EDB data for Aug 2026 (5 products)', time: '5 hours ago', type: 'data' },
  { id: 3, title: 'Critical alert raised', detail: 'C1 · Copra forecast drop of 18%', time: 'Yesterday', type: 'alert' },
  { id: 4, title: 'Forecast report generated', detail: 'C1 · Q4 2026 export outlook (PDF)', time: '2 days ago', type: 'report' },
  { id: 5, title: 'Alert thresholds updated', detail: 'C1 · Volume drop threshold set to 15%', time: '4 days ago', type: 'settings' },
];

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------
export const reports = [
  {
    id: 'forecast',
    emoji: '📊',
    title: 'Export Forecast Report',
    description: '6-month volume and value forecast for all products with prediction intervals.',
    updated: '2026-10-17',
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'performance',
    emoji: '📈',
    title: 'Product Performance',
    description: 'Year-over-year export performance, market share and trend by product.',
    updated: '2026-10-15',
    formats: ['PDF'],
  },
  {
    id: 'pre-post-2022',
    emoji: '📉',
    title: 'Pre/Post 2022 Analysis',
    description: 'Structural break analysis and model accuracy before and after the 2022 crisis.',
    updated: '2026-10-10',
    formats: ['PDF', 'CSV'],
  },
];

export const scheduledReports = [
  { id: 1, name: 'Monthly Export Forecast', frequency: 'Monthly · 1st at 08:00', recipients: 'Research team (4)', format: 'PDF', active: true },
  { id: 2, name: 'Weekly Alert Digest', frequency: 'Weekly · Monday 09:00', recipients: 'Supervisor', format: 'PDF', active: true },
  { id: 3, name: 'Quarterly Model Review', frequency: 'Quarterly · 1st Monday', recipients: 'Research team (4)', format: 'Excel', active: false },
];

export const currentUser = { name: 'Avishka', role: 'Researcher – C1', initials: 'AV' };
