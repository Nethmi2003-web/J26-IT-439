# Frontend - React + Vite + TypeScript

This is the React frontend application for the MERN + ML Service project.

## Technology Stack

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable React components
│   ├── pages/           # Page components
│   ├── layouts/         # Layout components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and other services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── context/         # React Context
│   ├── routes/          # Route definitions
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with Tailwind
├── .env.example         # Example environment variables
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

```bash
cd frontend
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Configure the variables:
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Development

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Building

Create a production build:

```bash
npm run build
```

Output will be in the `dist/` directory.

## Preview

Preview production build locally:

```bash
npm run preview
```

## Environment Configuration

The application reads environment variables from a `.env` file. The `VITE_API_URL` variable should point to your backend API.

The Axios configuration is in `src/services/api.ts` and reads from `import.meta.env.VITE_API_URL`.

## Health Check

The App component includes a health check that communicates with the backend at `/api/health` endpoin to verify the backend is running.

## Notes

- All API communication goes through the configured Axios instance
- Environment variables prefixed with `VITE_` are exposed to the frontend
- TypeScript is configured with strict mode for type safety
- Tailwind CSS is configured with content paths for automatic purging
