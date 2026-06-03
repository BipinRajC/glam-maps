FROM python:3.12-slim

WORKDIR /app

COPY backend/pyproject.toml backend/
WORKDIR /app/backend
RUN pip install --no-cache-dir .

COPY backend/glam_api/ glam_api/
COPY backend/migrations/ migrations/
COPY backend/alembic.ini .
COPY shared/ /app/shared/

# Default: run the FastAPI service
# Override CMD to run a job, e.g.:
#   python -m glam_api.jobs.sync
#   python -m glam_api.jobs.overpass
#   python -m glam_api.jobs.precompute
CMD ["uvicorn", "glam_api.app.main:app", "--host", "0.0.0.0", "--port", "8080"]
