from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.periods import router as periods_router
from app.routers.symptoms import router as symptoms_router
from app.routers.articles import router as articles_router
from app.routers.reports import router as reports_router

__all__ = [
    "auth_router",
    "users_router",
    "periods_router",
    "symptoms_router",
    "articles_router",
    "reports_router",
]
