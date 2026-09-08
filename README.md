# InsightLoop 

InsightLoop is a professional full-stack web application designed for comprehensive team reporting and analytics. It provides a secure platform for team members to submit weekly reports and allows managers to review, track, and analyze team performance through an intuitive dashboard.

## ✨ Enterprise-Grade Features

- **Advanced Role-Based Access Control (RBAC)**: Secure, hierarchical role system (Admin, Manager, Team Member) with strict middleware enforcement and personalized views.
- **Immutable Audit Trails**: Military-grade version control for reports. Every submission and manager-requested correction generates a complete, unalterable historical snapshot ensuring 100% compliance tracking.
- **Intelligent RAG AI Assistant**: Features a Gemini-powered Manager Assistant that dynamically retrieves and synthesizes team reporting data, providing natural language insights directly in the dashboard.
- **High-Performance Analytics Engine**: Server-side MongoDB aggregation pipelines capable of crunching thousands of reports in milliseconds to calculate real-time compliance rates, workloads, and trend analyses.
- **Dynamic Review Workflow Engine**: A robust state-machine handling the lifecycle of reports (Draft → Submitted → Needs Correction → Approved) with mandatory feedback loops.
- **Premium User Experience**: Built on Vite and React 19, utilizing TanStack Query for zero-latency UI updates, background caching, and optimistic mutations. Styled with Tailwind CSS and Radix UI primitives for an accessible, state-of-the-art aesthetic.
- **Bulletproof Security**: JWT-based session management locked down with `HttpOnly` and `Secure` cookies, bcrypt password hashing, and API rate limiting to prevent abuse.

## Architecture
- **Frontend**: React (Vite) + TypeScript + Tailwind CSS + shadcn/ui. Built with modern React features and TanStack Query for state/caching.
- **Backend**: Node.js + Express + TypeScript. Organized in a modular structure using Controllers, Services, and Repositories.
- **Database**: MongoDB + Mongoose. Optimized schema with indexes for fast aggregation and historical versioning.

## Tech Stack
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Recharts, React Router, TanStack Query, Axios, Lucide React.
- **Backend**: Node.js, Express, TypeScript, Mongoose, JWT, bcrypt, CORS, Swagger (OpenAPI).
- **Database**: MongoDB.

## Project Structure
```
InsightLoop/
├── backend/          # Node.js Express API
│   ├── src/          # Source code
│   │   ├── config/   # Environment & swagger config
│   │   ├── middleware# Auth, Error, Validation
│   │   ├── models/   # Mongoose schemas
│   │   ├── modules/  # Domain logic (reports, users, dashboard)
│   │   ├── seed/     # Database seeding scripts
│   │   └── utils/    # Helpers
├── frontend/         # React SPA
│   ├── src/
│   │   ├── components# Reusable UI (shadcn)
│   │   ├── features/ # Domain features (dashboard, reports)
│   │   ├── pages/    # Route components
│   │   └── lib/      # API clients
├── docs/             # Engineering documentation
└── README.md         # This file
```

## Prerequisites
- Node.js
- MongoDB (running locally on port 27017 or a valid Atlas URI)

## Installation

### Backend
```bash
cd backend
npm install
# Copy the environment template
cp .env.example .env
```

### Frontend
```bash
cd frontend
npm install
# Copy the environment template
cp .env.example .env
```

## Environment Variables
The application requires certain environment variables. Review `.env.example` in both `backend/` and `frontend/` directories.

**Backend (`backend/.env`)**
- `MONGODB_URI`: Connection string to your MongoDB instance.
- `JWT_SECRET`: Secret key for signing JWTs.
- `CLIENT_URL`: URL of the frontend (e.g., `http://localhost:5173`).
- `GEMINI_API_KEY`: (Optional) Required only for the AI assistant feature.

*Note: Never commit your `.env` file containing real secrets to version control.*

## Running the Application

### Running the Backend
```bash
cd backend
npm run dev
```
The API runs on `http://localhost:5000` by default. Swagger documentation is available at `http://localhost:5000/api/docs`.

### Running the Frontend
```bash
cd frontend
npm run dev
```
The frontend runs on `http://localhost:5173`.

## Seeding the Database
To populate the database with realistic demo data across multiple roles, projects, and weeks:
```bash
cd backend
npm run seed
```

## Demo Accounts
After running the seed script, the following demo accounts are available (Password for all: `password123`):
- **Admin**: `admin@insightloop.com`
- **Manager**: `manager@insightloop.com`
- **Team Member**: `alice@insightloop.com`

*These credentials are for local development and demonstration purposes only.*

## Testing
To run the automated test suites:
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Documentation
Detailed engineering documentation is available in the `docs/` directory:
- Architecture: `docs/architecture/`
- API Design: `docs/api/`
- Database: `docs/database/`
- AI Assistant: `docs/ai/`
- Workflows: `docs/workflows/`
