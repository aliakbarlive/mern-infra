# MERN Social RBAC App

A modular MERN stack monorepo for a role-based access control (RBAC) social application, using pnpm workspaces, Docker, and a GitHub Actions CI pipeline.

## Overview

This project is structured as a pnpm monorepo with separate `apps/api` (Express + TypeScript backend) and `apps/web` (React + TypeScript frontend) packages, plus a shared `packages/shared` package for common types and validation schemas. It is built around a role-based user model (`user`, `admin`, `moderator`) as the foundation for an RBAC-driven social app.

## Problem It Solves

Provides a foundation for building a social application where different user roles need different levels of access. It also demonstrates a practical monorepo setup: shared code between frontend and backend, containerized services, and automated CI checks.

## Features

- JWT-based authentication (access token stored in an httpOnly cookie) with register, login, logout, and "me" endpoints
- Role-based user model (`user`, `admin`, `moderator`) stored in MongoDB via Mongoose
- Security middleware: Helmet, CORS, cookie-parser, express-mongo-sanitize, and rate limiting on auth routes
- Structured request logging with Pino
- `/health` and `/ready` endpoints for service monitoring
- Shared types and Zod validation schemas (`packages/shared`) used across the API and web app
- React frontend with React Hook Form, Zod resolvers, TanStack Query, Zustand, and React Router
- Dockerized development and production setups for the API, web app, and MongoDB, with health checks and hot-reload volumes for local development
- GitHub Actions CI pipeline: installs dependencies, type-checks and builds the API/web/shared packages, and runs Docker build sanity checks

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, React Hook Form, TanStack Query, Zustand, Zod |
| Backend | Node.js, Express, TypeScript, Mongoose, JWT, Zod |
| Database | MongoDB |
| Monorepo / Tooling | pnpm workspaces, shared internal package (`@app/shared`) |
| DevOps | Docker, Docker Compose, GitHub Actions CI |

## Architecture / Project Structure

```text
mern-infra/
├── apps/
│   ├── api/        # Express + TypeScript backend
│   └── web/        # React + TypeScript frontend
├── packages/
│   └── shared/     # Shared types and Zod validation schemas
├── docker-compose.yml
├── docker-compose.dev.yml
├── Dockerfile.api
├── Dockerfile.web
└── .github/workflows/ci.yml
```

The API and web apps are independent pnpm workspace packages that both depend on the shared `packages/shared` package for common types and validation logic.

## Getting Started

### Prerequisites

- Node.js
- pnpm
- MongoDB (or use the provided Docker Compose setup)
- Docker (optional, for the containerized setup)

### Installation

```bash
git clone https://github.com/aliakbarlive/mern-infra.git
cd mern-infra
pnpm install
```

## Environment Variables

Backend (`apps/api`), validated with Zod (`src/config/env.ts`):

- `NODE_ENV`
- `PORT` (defaults to 4000 in `.env.example`)
- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `ACCESS_TOKEN_EXPIRES_IN`
- `REFRESH_TOKEN_EXPIRES_IN`
- `COOKIE_DOMAIN`
- `CORS_ORIGIN`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`
- `BCRYPT_SALT_ROUNDS`

Frontend (`apps/web`):

- `VITE_API_BASE_URL` (defaults to `http://localhost:4000` in `.env.example`)

Copy the provided `.env.example` files in `apps/api` and `apps/web` and fill in real values before running the app.

## Run Locally

```bash
pnpm dev:api
pnpm dev:web
```

Or with Docker Compose:

```bash
docker compose -f docker-compose.dev.yml up
```

## Available Scripts

| Command | Purpose |
|---|---|
| `pnpm dev:api` | Run the API in development mode |
| `pnpm dev:web` | Run the web app in development mode |
| `pnpm --filter api build` | Build the API for production |
| `pnpm --filter web build` | Build the web app for production |
| `pnpm --filter api test` | Run API tests (Jest) |
| `pnpm --filter web test` | Run web tests (Vitest) |

## Docker Usage

Multi-stage Dockerfiles are also included (`Dockerfile.api`, `Dockerfile.web`), with the web app served via Nginx in its production stage. `docker-compose.yml` and `docker-compose.dev.yml` define MongoDB, API, and web services with health checks; the dev compose file mounts source volumes for hot reload.

## CI Workflow

The GitHub Actions workflow (`.github/workflows/ci.yml`) installs dependencies, type-checks and builds the API, web, and shared packages, and runs Docker build sanity checks on each push.

## API / App Flow

Authentication currently supports register, login, logout, and fetching the current user (`/me`), using a JWT access token stored in an httpOnly cookie. The user model includes a `role` field (`user`, `admin`, `moderator`), and the `requireAuth` middleware attaches the authenticated user (including role) to the request. RBAC appears to be part of the application direction, but should be expanded with complete role and permission enforcement, since no role-restriction middleware is currently applied to routes.

## Roadmap

- Add role-based authorization middleware to enforce permissions per route, not just authentication
- Implement a refresh token endpoint to make use of the existing `JWT_REFRESH_SECRET` / `REFRESH_TOKEN_EXPIRES_IN` configuration
- Build out the posts, comments, reports, and admin modules referenced in `app.ts`
- Replace the placeholder Feed and Admin pages with real UI and data
- Keep .env.example files in sync as configuration changes
