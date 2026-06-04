from fastapi import FastAPI

from app.api import routes
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(routes.router, prefix='/api')


@app.get('/')
def read_root():
    return {'message': f'Welcome to {settings.PROJECT_NAME}'}
