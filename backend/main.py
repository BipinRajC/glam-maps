from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI

from app.api import routes
from app.core.config import settings
from app.core.database import engine
from app.core.logger import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    # This block executes on startup
    logger.info(f'Starting up {settings.PROJECT_NAME}...')
    try:
        # Example to quickly check connectivity to the DB on startup
        with engine.connect() as _connection:
            logger.info('Successfully connected to the database.')
    except Exception as e:
        logger.error(f'Failed to connect to the database: {e}')

    yield
    # This block executes on shutdown
    logger.info(f'Shutting down {settings.PROJECT_NAME}...')


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.include_router(routes.router, prefix='/api')


@app.get('/')
def read_root():
    return {'message': f'Welcome to {settings.PROJECT_NAME}'}


if __name__ == '__main__':
    uvicorn.run(
        'main:app',
        host=settings.HOST,
        port=settings.PORT,
        reload=False,
    )
