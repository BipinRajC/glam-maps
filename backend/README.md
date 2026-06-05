# Glam Maps — Backend

FastAPI backend for Glam Maps. Handles waypoint snapping, route generation, pothole checkpoint clustering, and Glam Score calculation using PostGIS spatial queries.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI |
| Database | PostgreSQL + PostGIS (spatial queries) |
| ORM | SQLAlchemy 2.0 (async) + asyncpg driver |
| Schemas | Pydantic v2 |
| Package manager | `uv` |
| Linter / Formatter | Ruff |

## Prerequisites

- Python 3.11+
- [`uv`](https://docs.astral.sh/uv/) installed
- PostgreSQL with the PostGIS extension enabled

## Setup

```bash
cd backend
uv sync
```

Copy `.env.example` to `.env` (or edit `.env` directly) and fill in your values:

```env
DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/glammaps"
GOOGLE_MAPS_ROUTES_API="your_api_key_here"
PORT=8000
HOST="0.0.0.0"
ENV="dev"
```

> **Important:** The `DATABASE_URL` must use the `postgresql+asyncpg://` scheme. The plain `postgresql://` scheme will fail because the app uses SQLAlchemy's async engine.

## Running the Server

```bash
cd backend
uv run main.py
```

The server starts on the port set in `PORT` (default: `8000`). On startup it automatically creates any missing database tables.

Hot-reload is active when `ENV=dev`.

## API Documentation

Once the server is running:

| URL | Description |
|---|---|
| `http://localhost:8000/api/health` | Health check |
| `http://localhost:8000/docs` | Interactive Swagger UI |
| `http://localhost:8000/redoc` | ReDoc |

## Seeding the Database

Seed scripts live in `backend/seed/`. Run them **from the `backend/` directory** after the database is up. They use the `DATABASE_URL` from your `.env` automatically and share the same async engine as the app.

### 1. Waypoints

Populates the `waypoints` table with 37 Bengaluru transit nodes. Safe to re-run — existing rows (matched by name) are skipped.

```bash
uv run python seed/seed_waypoints.py
```

### 2. Potholes

Populates the `potholes` table from `seed/complaints.json` (sourced from MongoDB). Only records with `validationStatus: "approved"` are inserted. Safe to re-run — existing rows (matched by MongoDB `_id`) are skipped.

```bash
# Default: reads seed/complaints.json
uv run python seed/seed_potholes.py

# Custom JSON path
uv run python seed/seed_potholes.py --json /path/to/complaints.json
```

**Recommended seed order:** waypoints → potholes.

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── routes.py        # Route handlers (/health, /route)
│   ├── core/
│   │   ├── config.py        # Settings (reads from .env via pydantic-settings)
│   │   ├── database.py      # Async engine + AsyncSession + get_db dependency
│   │   └── logger.py        # Logging setup
│   ├── models/
│   │   └── models.py        # SQLAlchemy ORM models (Waypoint, Route, Pothole, Obstacle)
│   ├── schemas/
│   │   └── schemas.py       # Pydantic request/response schemas
│   └── services/
│       └── routing.py       # Google Maps Routes API client
├── seed/
│   ├── complaints.json      # Raw pothole data (from MongoDB)
│   ├── seed_waypoints.py    # Seeds the waypoints table
│   └── seed_potholes.py     # Seeds the potholes table
├── main.py                  # FastAPI app + lifespan (DB init)
└── pyproject.toml
```

## Implemented Endpoints

| Method | Path | Status | Description |
|---|---|---|---|
| `GET` | `/api/health` | ✅ Done | Health check |
| `POST` | `/api/route` | ✅ Done | Generate / cache a route between two waypoints via Google Maps |
| `POST` | `/api/snap-to-point` | 🔲 Pending | Snap raw GPS to nearest waypoint |
| `GET` | `/api/checkpoints/{route_id}` | 🔲 Pending | Clustered pothole checkpoints along a route |
| `GET` | `/api/glam-score/{route_id}` | 🔲 Pending | 1–100 glamour-friendliness score for a route |

## Code Quality

Before committing, run:

```bash
cd backend
uv run ruff check --fix .
uv run ruff format .
```
