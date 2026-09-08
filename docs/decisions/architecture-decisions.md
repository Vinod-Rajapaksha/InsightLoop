# Architectural Decision Records (ADRs)

This document tracks significant architectural decisions made during the development of InsightLoop.

---

## ADR 1: Choosing a Monolithic Architecture over Microservices

**Context:** The application needs to support authentication, report management, and analytics dashboarding.
**Decision:** We chose a modular monolithic architecture (Node.js/Express) over a microservices approach.
**Rationale:** Given the current scope, a monolith significantly reduces deployment complexity, cognitive load, and infrastructure overhead. Cross-domain queries (e.g., fetching user data for a report) are trivial in a monolith. The codebase is organized into domain-driven modules, ensuring that if the application scales sufficiently, it can be easily refactored into microservices later.

---

## ADR 2: Selecting MongoDB for Data Persistence

**Context:** We needed a database capable of handling structured reporting data and immutable version snapshots.
**Decision:** We chose MongoDB with Mongoose ODM over a traditional relational SQL database.
**Rationale:** 
1. **Schema Flexibility**: The `ReportVersion` collection stores a complete historical snapshot of a report. Since a report contains complex sub-documents (tasks, blockers, achievements), MongoDB's BSON structure allows us to store the entire state elegantly in a `Mixed` type field without complex JOINs or extensive schema migrations.
2. **Aggregation Pipeline**: MongoDB provides exceptionally powerful aggregation capabilities, which are crucial for the complex, server-side filtering required by the Manager Dashboard.

---

## ADR 3: Server-Side vs. Client-Side Filtering

**Context:** The Manager Dashboard needs to filter reports by week, project, member, and status.
**Decision:** We implemented server-side filtering and aggregation rather than sending all data to the client and filtering locally.
**Rationale:** While client-side filtering feels instantaneous, it does not scale. As an organization grows, loading hundreds of historical reports to calculate metrics on the client would crash the browser. Server-side aggregations ensure that the frontend only receives the exact data it needs to render charts, resulting in stable, low-latency performance regardless of dataset size.

---

## ADR 4: Adopting TanStack Query for State Management

**Context:** The React frontend needs to manage complex asynchronous state, loading spinners, and data synchronization.
**Decision:** We chose TanStack Query (formerly React Query) over Redux or raw `useEffect` fetches.
**Rationale:** TanStack Query eliminates massive amounts of boilerplate code. It treats server state as distinct from client state. It automatically handles background caching, deduplication of requests, and query invalidation. This ensures the frontend UI is always snappy and data is implicitly synchronized with the server when mutations occur (like approving a report).
