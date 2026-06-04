# Glam Maps dev ergonomics

dev-api:
    cd backend && uvicorn glam_api.app.main:app --reload --port 8000

sync:
    cd backend && python -m glam_api.jobs.sync

overpass:
    cd backend && python -m glam_api.jobs.overpass

precompute:
    cd backend && python -m glam_api.jobs.precompute

migrate:
    cd backend && alembic upgrade head

test-api:
    cd backend && pytest -v

dev-web:
    cd frontend && npm run dev

build-web:
    cd frontend && npm run build

dev:
    just dev-api & just dev-web
