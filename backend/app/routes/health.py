"""Public liveness check. It does not expose application data."""

from fastapi import APIRouter, Depends

from app.dependencies import get_settings

router = APIRouter(tags=["health"], dependencies=[Depends(get_settings)])


@router.get("/health")
def health():
    return {"status": "ok"}
