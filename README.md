# Glam Maps

## Running the Project

You can run this project either using Docker (recommended for consistency) or natively on your local machine.

### Option 1: Using Docker (Recommended)

To run the entire stack (Postgres + PostGIS and the FastAPI backend) cleanly with Docker Compose:

1. Ensure Docker and Docker Compose are installed and running.
2. From the project's root folder, run:
   ```bash
   docker compose up --build -d
   ```
3. The backend API will be available at `http://localhost:8000`.
4. The database is exposed on `localhost:5432` with user `postgres` and password `password`.

To stop the containers:
```bash
docker compose down
```

### Option 2: Running Locally (Without Docker)

If you prefer to run the project natively, you'll need Python 3.11+, Node.js (for the frontend), and a local instance of PostgreSQL with the PostGIS extension installed.

#### 1. Setup the Database
You need a running instance of PostgreSQL with PostGIS.
You can run just the database using Docker if you don't have it installed natively:
```bash
docker compose up db -d
```

#### 2. Run the Backend
The backend uses [uv](https://github.com/astral-sh/uv) for fast dependency management.
```bash
cd backend
uv sync
uv run python -m main
```
The backend API will run on `http://localhost:8000` (or the port specified by the `PORT` environment variable).

#### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend UI will typically run on `http://localhost:5173` (refer to terminal output).
