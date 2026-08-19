from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routers import auth, equipment, facilities, inspections, inspectors, users

Base.metadata.create_all(bind=engine)

app = FastAPI(title='ПожНадзор.pro API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(inspectors.router)
app.include_router(facilities.router)
app.include_router(equipment.router)
app.include_router(inspections.router)


@app.get('/health')
def health_check():
    return {'status': 'ok'}
