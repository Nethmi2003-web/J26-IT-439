import 'dotenv/config';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Calls the Python FastAPI service and returns its JSON response.
export async function callMl(path, body) {
  const res = await fetch(`${ML_SERVICE_URL}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = new Error(`ML service error: ${res.status} ${await res.text()}`);
    err.status = 502;
    throw err;
  }
  return res.json();
}
