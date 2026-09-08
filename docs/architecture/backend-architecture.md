# Backend Architecture

## Overview
The InsightLoop backend is built on Node.js and Express, utilizing TypeScript for strong typing and improved developer experience. It follows a modular, Controller-Service-Repository (CSR) architectural pattern. This ensures a clean separation of concerns, high maintainability, and scalable business logic.

## Core Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies
- **Security**: bcrypt for password hashing, express-rate-limit for abuse prevention
- **Validation**: Zod for robust schema validation at runtime
- **AI Integration**: `@google/genai` for advanced LLM capabilities

## Architectural Pattern: Controller-Service-Repository

The backend is strictly organized into three distinct layers to separate HTTP transport, business logic, and database interactions.

### 1. Controllers (`src/modules/*/controller.ts`)
- **Responsibility**: Handle incoming HTTP requests and format HTTP responses.
- **Rules**: Controllers should contain **no business logic**. They parse request bodies, parameters, and query strings (often validating them with Zod), pass the structured data to the Service layer, and return standard JSON responses.

### 2. Services (`src/modules/*/service.ts`)
- **Responsibility**: Contain all core business rules, workflow orchestrations, and logic.
- **Rules**: Services are unaware of HTTP (no `req` or `res` objects). They orchestrate actions, validate complex domain rules (e.g., "Can a report be submitted in this state?"), and interact with one or more Repositories.

### 3. Repositories (`src/models/` and direct mongoose calls in Services)
- **Responsibility**: Abstract data persistence.
- **Rules**: Repositories handle Mongoose queries, aggregations, and data mapping. This insulates the business logic from underlying database schema changes.

## Directory Structure

```text
backend/src/
├── config/        # Environment configurations and Swagger setup
├── middleware/    # Express middlewares (Auth, RBAC, Error Handling, Validation)
├── models/        # Mongoose schemas and interface definitions
├── modules/       # Domain-driven feature modules (The core logic)
│   ├── ai/        # Gemini integration and RAG processing
│   ├── auth/      # Login, registration, token management
│   ├── dashboard/ # Aggregation pipelines and manager metrics
│   ├── reports/   # Report lifecycle management
│   └── users/     # User administration
├── routes/        # Main express router aggregations
├── schemas/       # Zod validation schemas for request validation
├── seed/          # Database population scripts for development
├── types/         # Global TypeScript interfaces and custom types
└── utils/         # Helper functions and shared utilities
```

## Security & Authentication Flow
1. **Login**: The user authenticates with email/password. The `AuthService` verifies credentials using bcrypt.
2. **JWT Issuance**: A JWT containing the user ID and role is generated.
3. **HTTP-Only Cookie**: The JWT is set as an `HttpOnly` and `Secure` cookie on the response. This inherently protects the token from Cross-Site Scripting (XSS) attacks.
4. **Middleware Protection**: The `authenticate` middleware extracts the token from the cookie, verifies it, and attaches the user payload to the request object (`req.user`).
5. **RBAC**: The `authorizeRole` middleware checks if `req.user.role` meets the minimum required level for the endpoint, ensuring strict access control.

## Advanced Features
- **Server-Side Aggregations**: The dashboard module leverages complex MongoDB aggregation pipelines to calculate metrics, compliance rates, and trends across thousands of documents efficiently on the database level.
- **RAG Architecture**: The AI module processes natural language queries, fetches relevant structured data from the database, and injects it as context for the Gemini LLM.
