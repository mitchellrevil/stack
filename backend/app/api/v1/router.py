"""Register every v1 route here. New versions get their own router."""

from fastapi import APIRouter, Depends

from app.auth import current_user
from app.routes import auth, charts, health

router = APIRouter(prefix="/v1")
router.include_router(health.router)
router.include_router(auth.router)
# Include every business router with current_user, then add any finer permission
# checks on its endpoints. Demo mode is handled centrally by the dependency.
router.include_router(charts.router, dependencies=[Depends(current_user)])
