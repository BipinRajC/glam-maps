FROM python:3.11-slim

# Install uv for fast dependency management
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Copy pyproject.toml
COPY pyproject.toml ./

# Generate lockfile and sync dependencies (excluding dev)
RUN uv lock && uv sync --no-dev --no-install-project

# Copy the rest of the application
COPY . .

# Sync the project itself
RUN uv sync --no-dev

# Expose the virtualenv implicitly in PATH
ENV PATH="/app/.venv/bin:$PATH"

# Run the FastAPI application
CMD ["fastapi", "run", "app/main.py", "--port", "8000", "--host", "0.0.0.0"]
