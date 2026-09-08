# Frontend Architecture

## Overview
The InsightLoop frontend is a modern Single Page Application (SPA) built with React and Vite. It is designed for high performance, maintainability, and a premium user experience. The architecture emphasizes a feature-based folder structure, robust state management, and a highly polished UI component system.

## Core Technologies
- **Framework**: React 19
- **Build Tool**: Vite (for rapid HMR and optimized production builds)
- **Language**: TypeScript
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui & Radix UI (accessible, unstyled primitives)
- **Data Fetching**: Axios
- **Form Handling**: React Hook Form + Zod

## Feature-Driven Architecture

Instead of organizing files by type (e.g., all components in one folder, all hooks in another), the frontend utilizes a **Feature-Driven Structure**. This encapsulates all logic, UI, and API calls related to a specific domain into self-contained modules.

### Directory Structure

```text
frontend/src/
├── app/           # Application-wide setup (router configuration, providers)
├── assets/        # Static assets (images, fonts, global CSS)
├── components/    # Shared, generic UI components (mostly shadcn/ui elements like Buttons, Inputs)
├── enums/         # Global typescript enums
├── features/      # Feature modules (The core of the application)
│   ├── auth/      # Login screens, auth context, token handling
│   ├── dashboard/ # Manager analytics UI, charts, filter state
│   ├── reports/   # Report submission forms, version history views
│   └── users/     # Admin user management grids
├── layouts/       # Global page layouts (e.g., SidebarLayout, AuthLayout)
├── lib/           # Shared libraries (Axios instances, utility wrappers)
├── pages/         # Route entry points (compose features and layouts)
├── types/         # Global TypeScript interfaces
└── utils/         # Pure utility functions (date formatting, styling merges)
```

## State Management Strategy

### Server State (TanStack Query)
Almost all asynchronous data fetching, caching, and synchronization is handled by **TanStack Query**. 
- **Caching**: API responses are cached to prevent redundant network requests and provide instant navigation.
- **Invalidation**: When a mutation occurs (e.g., submitting a report), the corresponding query keys are invalidated, triggering an automatic background refetch to keep the UI in sync with the server.
- **Loading/Error States**: TanStack Query elegantly handles `isLoading`, `isError`, and background fetching states, simplifying component logic.

### Form State (React Hook Form)
Complex forms (like the Weekly Report builder) use **React Hook Form**. This minimizes re-renders by maintaining form state outside the React render cycle, resulting in highly performant, jank-free typing experiences even on massive forms. Validation is strongly typed using Zod resolvers.

### Global Client State (React Context)
Minimal global client state is used. Authentication status and the current user profile are managed via a lightweight React Context (`AuthContext`), making the user session accessible anywhere in the component tree.

## Design System & Styling
- **Tailwind CSS**: Utility-first CSS framework allows for rapid styling without leaving the JSX.
- **shadcn/ui**: We utilize shadcn/ui to build our component library. This provides accessible (Radix UI), highly customizable, and premium-feeling components that are owned by the project rather than installed as an opaque node module.
- **Premium Aesthetics**: The UI emphasizes clarity, generous whitespace, subtle micro-interactions (framer-motion), and a cohesive color palette designed to impress enterprise users.
