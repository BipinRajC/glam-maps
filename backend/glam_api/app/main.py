from fastapi import FastAPI

from glam_api.app.routers import health, routes, wa

app = FastAPI(title="Glam Maps API")

app.include_router(health.router)
app.include_router(routes.router)
app.include_router(wa.router)
