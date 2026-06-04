# FastAPI Backend

This is the backend API for the project, built with [FastAPI](https://fastapi.tiangolo.com/).

## Setup

We use `uv` for dependency management and running the application. Make sure you have `uv` installed.

To install dependencies (both standard and development), navigate to the `backend` directory and run:

```bash
cd backend
uv sync
```
*Note: `uv sync` automatically installs all dependencies declared in `pyproject.toml`, including dev dependencies such as Ruff.*

## Code Quality & Formatting

We use `ruff` for linting, code formatting, and import sorting. Before making any commit, please ensure your code is properly formatted by running:

```bash
cd backend
uv run ruff check --fix .
uv run ruff format .
```

This will automatically format strings to single quotes and sort your imports.

## Folder Structure

The application is structured for scalability and separation of concerns:

```
backend/
├── app/
│   ├── api/             # API endpoints and routers (Traffic controllers)
│   ├── core/            # Application settings like DB connection or env variables setup
│   ├── models/          # Database definitions (e.g., SQLAlchemy models)
│   ├── schemas/         # Pydantic schemas for request/response validation 
│   ├── services/        # Business logic containing reusable functions
│   └── main.py          # FastAPI app instantiation
├── pyproject.toml       # Project dependencies
└── README.md
```

## Running the Backend

Use `uv` to run the FastAPI application. Ensure you are in the `backend` directory.

### Development Mode
Run with hot-reloading enabled for development:
```bash
uv run uvicorn app.main:app --reload
```

### Production Mode
Run without hot-reloading for production:
```bash
uv run uvicorn app.main:app
```

## API Documentation

Once the server is running, you can access:
* **Root API:** http://127.0.0.1:8000/
* **Health Check:** http://127.0.0.1:8000/api/health
* **Interactive Swagger Docs:** http://127.0.0.1:8000/docs
