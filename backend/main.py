from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI

from app.api import routes
from app.core.config import settings
from app.core.database import engine
from app.core.logger import logger
from app.models.models import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # This block executes on startup
    logger.info(f'Starting up {settings.PROJECT_NAME}...')
    try:
        async with engine.begin() as conn:
            logger.info('Successfully connected to the database.')
            # run_sync wraps the synchronous create_all call for the async engine
            await conn.run_sync(Base.metadata.create_all)
            logger.info('Database tables created (or already exist).')
    except Exception as e:
        logger.error(f'Failed to connect to the database: {e}')

    yield
    # This block executes on shutdown
    logger.info(f'Shutting down {settings.PROJECT_NAME}...')
    await engine.dispose()


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.include_router(routes.router, prefix='/api')

if __name__ == '__main__':
    uvicorn.run(
        'main:app',
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENV == 'dev',
    )
