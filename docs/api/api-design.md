# API Design

## Principles
The InsightLoop API follows RESTful principles, utilizing standard HTTP methods and status codes. All responses are wrapped in a standard format for consistency.

## Base URL
`/api`

## Standard Response Format
```json
{
  "success": true,
  "message": "Human readable message",
  "data": { ... } // or array
}
```

## Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "ErrorType"
}
```

## Key Endpoints

### System
- `GET /api/health` - Health check endpoint

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user (default: TEAM_MEMBER)
- `POST /api/auth/login` - Authenticate and set HTTP-Only cookie
- `POST /api/auth/logout` - Clear cookie
- `GET /api/auth/me` - Get current user profile

### Users (`/api/users`)
- `PUT /api/users/profile` - Update own profile (Team Member/Manager/Admin)
- `GET /api/users` - List all users (Manager/Admin)
- `PATCH /api/users/:id/role` - Update role (Admin only)
- `PATCH /api/users/:id/status` - Activate/Deactivate user (Admin only)

### Projects (`/api/projects`)
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create a new project (Manager/Admin)
- `PUT /api/projects/:id` - Update a project (Manager/Admin)
- `DELETE /api/projects/:id` - Delete a project (Manager/Admin)

### Reports (`/api/reports`)

**Team Member Actions:**
- `GET /api/reports/my` - List own reports
- `POST /api/reports` - Create Draft report
- `PUT /api/reports/:id` - Edit Draft or Needs Correction report
- `POST /api/reports/:id/submit` - Submit report (Creates snapshot)
- `GET /api/reports/:id` - View specific report details
- `GET /api/reports/:id/versions` - View version history
- `GET /api/reports/:id/reviews` - View review action history

**Manager/Admin Actions:**
- `GET /api/reports` - List all reports (with filters)
- `POST /api/reports/:id/approve` - Approve submitted report
- `POST /api/reports/:id/request-correction` - Request changes (requires comment body)

### Dashboard (`/api/manager/dashboard`)
- `GET /api/manager/dashboard` - Get aggregated metrics (Manager/Admin)
  - Query Params: `weekStartDate`, `weekEndDate`, `memberId`, `projectId`, `status`.

### AI Assistant (`/api/ai`) (Manager/Admin)
- `GET /api/ai/status` - Check if Gemini AI is configured
- `POST /api/ai/ask` - Ask a freeform natural language query
- `POST /api/ai/weekly-summary` - Generate an executive weekly summary
- `POST /api/ai/project-insights` - Generate project-specific insights and blockers
- `POST /api/ai/risk-analysis` - Analyze reports for major risks
- `POST /api/ai/compare-weeks` - Compare data between two different weeks
