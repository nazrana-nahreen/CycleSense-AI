import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.services.seed_data import seed_articles
from app.routers import (
    auth_router,
    users_router,
    periods_router,
    symptoms_router,
    articles_router,
    reports_router,
)
from app.routers.ml_prediction import router as ml_router

# Configure logging without leaking sensitive health payload data
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("cyclesense_api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup & shutdown lifespan events:
    Ensures tables exist and initial verified educational articles are seeded.
    """
    logger.info("Initializing CycleSense AI database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Seed articles if not already present
    db = SessionLocal()
    try:
        seed_articles(db)
        logger.info("Database verification and article seeding complete.")
    finally:
        db.close()

    yield
    logger.info("CycleSense AI API shutting down.")


app = FastAPI(
    title="CycleSense AI API",
    description="Evidence-backed Menstrual Health, Symptom Analytics, and PCOS Education API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
origins = settings.cors_origins_list
if not origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global consistent error handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        errors.append({
            "field": field,
            "message": err.get("msg", "Invalid value"),
            "type": err.get("type", "value_error"),
        })
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Input validation failed. Please check the submitted fields.",
            "errors": errors,
        },
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


# Attach modular routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(periods_router)
app.include_router(symptoms_router)
app.include_router(articles_router)
app.include_router(reports_router)
app.include_router(ml_router)


@app.get("/", tags=["Health"])
def root():
    return {
        "name": "CycleSense AI API",
        "status": "operational",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
    }
