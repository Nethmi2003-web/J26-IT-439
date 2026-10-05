# Backend - Node.js + Express + TypeScript

This is the Express backend for the MERN + ML Service project. It handles API requests from the frontend and communicates with the MongoDB database and Python ML service.

## Technology Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Type-safe development
- **Mongoose**: MongoDB ODM
- **Cors**: Cross-origin resource sharing
- **Helmet**: Security headers
- **dotenv**: Environment variable management
- **Axios**: HTTP client for ML service communication

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts        # MongoDB connection logic
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API route handlers
│   │   └── health.ts          # Health check endpoint
│   ├── services/
│   │   └── mlService.ts       # ML service communication
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   ├── validators/            # Input validators
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── .env.example               # Example environment variables
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (running locally on port 27017 or accessible via connection string)

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure the variables:
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `ML_SERVICE_URL`: Python ML service URL (default: http://localhost:8000)
- `NODE_ENV`: Environment (development/production)

## Development

Start the development server with hot reload:

```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

TypeScript will be compiled on the fly using ts-node.

## Building

Create a production build:

```bash
npm run build
```

The compiled JavaScript will be in the `dist/` directory.

## Production

Start the production server:

```bash
npm start
```

## Health Check Endpoints

### Backend Health
```
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "Backend is running",
  "timestamp": "2024-01-01T12:00:00Z",
  "mlService": "available" or "unavailable"
}
```

## Database

### MongoDB Connection

The application connects to MongoDB using Mongoose. Connection configuration is in `src/config/database.ts`.

Connection is established during server startup and gracefully closed during shutdown.

### Models

Place Mongoose schemas in `src/models/`. Example structure is prepared but not implemented yet.

## ML Service Integration

The backend communicates with the Python ML service via HTTP using Axios.

Communication is handled in `src/services/mlService.ts`:

- `checkMLServiceHealth()`: Checks if ML service is running
- `callMLServicePredict()`: Send prediction requests
- `callMLServiceTrain()`: Send training requests
- `getMLServiceModel()`: Get model information
- `getMLServiceMetrics()`: Get model metrics

**Important**: The backend health endpoint does NOT fail if the ML service is unavailable. It returns the ML service status in the response.

## Security

- **Helmet**: Automatically sets security headers
- **CORS**: Configured to allow requests from the frontend
- **Input Validation**: Structure prepared in `src/validators/`

## Error Handling

All errors are caught and handled gracefully. Detailed error messages are shown in development mode only.

## TypeScript

- Strict mode enabled for maximum type safety
- Path aliases configured for cleaner imports
- ESM modules used throughout

## Notes

- All file extensions use `.js` in imports (for ESM compatibility)
- No authentication is implemented yet - add in future
- No database models are created yet - preparation complete
- Database models should be placed in `src/models/`
- Controllers should be placed in `src/controllers/`
- New routes should be added to Express app in `src/app.ts`
