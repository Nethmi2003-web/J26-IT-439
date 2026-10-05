# MERN Stack + Python ML Service

A complete, production-ready project skeleton for a full-stack application combining:
- **React** frontend with Vite and TypeScript
- **Node.js/Express** backend with TypeScript
- **MongoDB** database
- **Python FastAPI** machine learning microservice

This is a clean project scaffold with no business logic implemented - ready for you to build upon.

## 📋 Project Overview

This project demonstrates a modern full-stack architecture where:
- React frontend communicates ONLY with the Node.js backend
- Node.js backend communicates with MongoDB and the Python ML service
- Python ML service provides machine learning capabilities via REST API
- All services are containerized with Docker

## 🏗 Architecture

```
┌─────────────────────────────────────────────┐
│           React Frontend                    │
│     (Vite + TypeScript + Tailwind)          │
│           http://localhost:5173             │
└────────────────┬────────────────────────────┘
                 │ HTTP/Axios (CORS-enabled)
                 ↓
┌─────────────────────────────────────────────┐
│      Node.js/Express Backend                │
│      (TypeScript + Mongoose)                │
│         http://localhost:5000               │
└────────────────┬──────────────┬─────────────┘
                 │              │
         HTTP/Axios        HTTP/Axios
                 ↓              ↓
        ┌──────────────┐  ┌──────────────────┐
        │   MongoDB    │  │  Python FastAPI  │
        │ :27017       │  │  ML Service      │
        │              │  │ :8000            │
        └──────────────┘  └──────────────────┘
```

## 🚀 Tech Stack

### Frontend
- **React 18**: UI framework
- **Vite**: Lightning-fast build tool and dev server
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Type-safe development
- **Mongoose**: MongoDB ODM
- **Cors**: Cross-origin resource sharing
- **Helmet**: Security middleware
- **Axios**: HTTP client for ML service

### Database
- **MongoDB**: NoSQL database

### Machine Learning
- **Python 3.11+**: Programming language
- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **NumPy**: Numerical computing
- **Pandas**: Data manipulation
- **Scikit-learn**: ML algorithms
- **Joblib**: Model serialization

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration

## 📁 Folder Structure

```
project-root/
├── frontend/                    # React Vite frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/              # Images, fonts
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── layouts/             # Layout components
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API services
│   │   ├── types/               # TypeScript types
│   │   ├── utils/               # Utilities
│   │   ├── context/             # React Context
│   │   ├── routes/              # Route definitions
│   │   ├── App.tsx              # Main component
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── .env.example             # Example env vars
│   ├── package.json             # Dependencies
│   ├── tsconfig.json            # TS config
│   ├── vite.config.ts           # Vite config
│   ├── tailwind.config.js       # Tailwind config
│   └── README.md                # Frontend docs
│
├── backend/                     # Node.js/Express backend
│   ├── src/
│   │   ├── config/              # Configuration
│   │   │   └── database.ts      # MongoDB connection
│   │   ├── controllers/         # Request handlers
│   │   ├── middleware/          # Custom middleware
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # API routes
│   │   │   └── health.ts        # Health endpoint
│   │   ├── services/
│   │   │   └── mlService.ts     # ML service client
│   │   ├── types/               # TypeScript types
│   │   ├── utils/               # Utilities
│   │   ├── validators/          # Input validation
│   │   ├── app.ts               # Express setup
│   │   └── server.ts            # Server entry
│   ├── .env.example             # Example env vars
│   ├── package.json             # Dependencies
│   ├── tsconfig.json            # TS config
│   ├── Dockerfile               # Docker image
│   └── README.md                # Backend docs
│
├── ml-service/                  # Python FastAPI service
│   ├── app/
│   │   ├── api/                 # API routes
│   │   ├── models/              # ML models
│   │   ├── schemas/             # Pydantic schemas
│   │   │   └── prediction.py    # Prediction models
│   │   ├── services/            # Business logic
│   │   ├── utils/               # Utilities
│   │   └── main.py              # FastAPI app
│   │
│   ├── training/                # ML training pipeline
│   │   ├── dataset/             # Training data
│   │   ├── preprocessing.py     # Data preprocessing
│   │   ├── train.py             # Model training
│   │   ├── evaluate.py          # Model evaluation
│   │   └── README.md            # Training docs
│   │
│   ├── trained_models/          # Saved models
│   ├── requirements.txt         # Dependencies
│   ├── .env.example             # Example env vars
│   ├── Dockerfile               # Docker image
│   └── README.md                # ML service docs
│
├── uploads/                     # File uploads
├── .gitignore                   # Git ignore rules
├── .env.example                 # Example env vars
├── docker-compose.yml           # Docker Compose config
├── package.json                 # Root scripts
└── README.md                    # This file
```

## 📦 Prerequisites

### For local development without Docker:
- **Node.js** (v16+) and npm
- **Python** (3.11+) with pip
- **MongoDB** (running on localhost:27017)

### For Docker deployment:
- **Docker** (20.10+)
- **Docker Compose** (2.0+)

## 🔧 Installation

### 1. Clone/Set Up the Project

```bash
cd J26-IT-439
```

### 2. Copy environment files

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp ml-service/.env.example ml-service/.env
```

### 3. Install root dependencies

```bash
npm install
```

This installs `concurrently` for running multiple services.

## 🏃 Running Locally

### Option 1: Run all services together

```bash
# From root directory
npm run dev
```

This starts the frontend and backend together using concurrently.

For the ML service, open another terminal:

```bash
cd ml-service
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Option 2: Run each service individually

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# Frontend: http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd backend
npm install
npm run dev
# Backend: http://localhost:5000
```

**Terminal 3 - ML Service:**
```bash
cd ml-service
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# ML Service: http://localhost:8000
```

**Terminal 4 - MongoDB:**

Make sure MongoDB is running on `mongodb://localhost:27017`

### Option 3: Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

All services will be available at:
- Frontend: http://localhost:80 (or http://localhost:5173 if not using Docker)
- Backend: http://localhost:5000
- ML Service: http://localhost:8000
- MongoDB: mongodb://localhost:27017

## 🏥 Health Check Endpoints

### Backend Health
```
GET http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Backend is running",
  "timestamp": "2024-01-01T12:00:00Z",
  "mlService": "available"
}
```

### ML Service Health
```
GET http://localhost:8000/api/ml/health
```

Response:
```json
{
  "success": true,
  "message": "ML service is running"
}
```

## 📚 API Documentation

### Backend API

Access Swagger UI at: `http://localhost:5000` (when implemented)

### ML Service API

Access Swagger UI at: `http://localhost:8000/docs`

Alternative Redoc: `http://localhost:8000/redoc`

## Environment Variables

### Root (.env)
```
MONGODB_URI=mongodb://localhost:27017/project_database
BACKEND_PORT=5000
BACKEND_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

### Frontend (frontend/.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project_database
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

### ML Service (ml-service/.env)
```
PORT=8000
ML_MODEL_PATH=./trained_models
DEBUG=True
```

## 📖 Project Documentation

Each service has its own comprehensive README:

- [Frontend Documentation](frontend/README.md)
- [Backend Documentation](backend/README.md)
- [ML Service Documentation](ml-service/README.md)
- [ML Training Guide](ml-service/training/README.md)

## 🔄 Frontend ↔ Backend Communication

The frontend communicates with the backend exclusively through Axios:

```typescript
// frontend/src/services/api.ts
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})
```

Example:
```typescript
// In a React component
const response = await apiClient.get('/health')
```

## 🔄 Backend ↔ ML Service Communication

The backend communicates with the ML service via Axios:

```typescript
// backend/src/services/mlService.ts
export const checkMLServiceHealth = async () => {
  const response = await axios.get(`${ML_SERVICE_URL}/api/ml/health`)
}
```

## 🐳 Docker Deployment

### Services

- **MongoDB**: Official mongo:7.0 image
- **Backend**: Custom Node.js image
- **Frontend**: Multi-stage build with Nginx
- **ML Service**: Custom Python 3.11 image

### Networks

All services communicate via a Docker bridge network named `mern_network`.

### Volumes

- `mongodb_data`: MongoDB data persistence
- `mongodb_config`: MongoDB configuration

### Building Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build backend frontend
docker-compose build ml-service
```

## 🚀 Available Commands

### Root Level

```bash
# Install all dependencies
npm run install:all

# Start development (frontend + backend)
npm run dev

# Build all services
npm run build

# Build frontend
npm run build:client

# Build backend
npm run build:server

# Start frontend dev server
npm run client

# Start backend dev server
npm run server
```

### Frontend

```bash
cd frontend
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Linting
```

### Backend

```bash
cd backend
npm run dev      # Development
npm run build    # Compile TypeScript
npm run start    # Production
npm run lint     # Linting
```

### ML Service

```bash
cd ml-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## ✅ Project Status

✓ Folder structure created
✓ React Vite frontend configured
✓ Node.js Express backend configured
✓ Python FastAPI ML service scaffolded
✓ MongoDB connection prepared
✓ Docker containerization setup
✓ Environment configuration files
✓ Health check endpoints
✓ Frontend ↔ Backend communication ready
✓ Backend ↔ ML Service communication ready

❌ Business logic NOT implemented
❌ ML model NOT trained
❌ Actual predictions NOT implemented
❌ Authentication NOT implemented
❌ Database schemas NOT created

## 🎯 Next Steps

### 1. Development Database
- Ensure MongoDB is running locally
- Configure `MONGODB_URI` in `.env` files

### 2. Install Dependencies

```bash
# Install all dependencies
npm run install:all

# Install ML service dependencies
cd ml-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Start Development

```bash
npm run dev
```

### 4. Verify Setup

Visit:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health
- ML Service Docs: http://localhost:8000/docs

### 5. Implement Features

- Create database models in `backend/src/models/`
- Create API endpoints in `backend/src/routes/`
- Implement controllers in `backend/src/controllers/`
- Add React components in `frontend/src/components/`
- Implement ML training in `ml-service/training/`
- Implement ML API endpoints in `ml-service/app/`

## 📝 Important Notes

### Security
- This scaffold uses permissive CORS settings for development
- Restrict CORS origins in production
- Never commit `.env` files with secrets
- Use `.env.example` for safe defaults

### Database
- MongoDB connection is handled gracefully
- Connection errors don't crash the app
- Health checks show MongoDB status

### ML Service
- The backend health endpoint doesn't fail if ML service is unavailable
- ML service unavailability is reported in the health response
- All endpoints return "Not implemented yet" - add your logic here

### TypeScript
- Strict mode enabled for maximum type safety
- Path aliases configured for cleaner imports

## 🤝 Contributing

This is a project skeleton meant for team development. Each team member can focus on their domain:
- Frontend developer → `frontend/`
- Backend developer → `backend/`
- ML engineer → `ml-service/`

## 📄 License

ISC

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5173
lsof -i :5173

# Find process using port 5000
lsof -i :5000

# Find process using port 8000
lsof -i :8000
```

### MongoDB Connection Error
Ensure MongoDB is running:
```bash
# Start MongoDB
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### Python Virtual Environment
Make sure to activate the virtual environment:
```bash
cd ml-service
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### CORS Errors
Ensure `VITE_API_URL` in `client/.env` matches your backend URL.

### Docker Issues
```bash
# Clear Docker cache
docker system prune -a

# Rebuild all images
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## 📞 Support

For questions about specific services, see their respective README files in `frontend/`, `backend/`, and `ml-service/` directories.
