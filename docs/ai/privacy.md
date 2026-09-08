# AI Privacy and Security Guidelines

Integrating Large Language Models into enterprise reporting workflows necessitates strict data privacy protocols.

## Data Sent to the LLM
The Gemini API only receives data specifically requested by the user's query context. The payload includes:
- Aggregated project metrics (hours, compliance).
- Anonymized or pseudo-anonymized task descriptions and blockers.

## What is NOT Sent
- Passwords, authentication hashes, or session tokens.
- Personal Identifying Information (PII) beyond basic names associated with tasks.
- Historical data outside the immediate scope of the user's explicit query (to enforce least privilege).

## Role-Based Access Control (RBAC) Enforcement
The AI Assistant endpoint (`/api/ai/query`) is protected by strict RBAC middleware.
1. Only users with the `MANAGER` or `ADMIN` role can access the endpoint.
2. The context injected into the prompt is filtered at the database level. A Manager can only query data pertaining to projects they oversee. 
3. The LLM has no direct database access; it can only reason over the explicitly provided JSON payload, preventing prompt injection attacks from accessing unauthorized data.

## Provider Policies
We utilize the Google Gemini API. Administrators should review Google's API Terms of Service regarding data retention and model training policies to ensure compliance with internal company regulations.
