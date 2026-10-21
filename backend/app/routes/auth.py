"""Public sign-in settings and the current user's verified permissions."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.auth import CurrentUser, current_user
from app.config import Settings
from app.dependencies import get_settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/config")
def auth_config(settings: Annotated[Settings, Depends(get_settings)]):
    # This route must be public: the browser needs it before it can sign in.
    # These identifiers are public. Never add client secrets to this response.
    return {
        "enabled": settings.auth_enabled,
        "clientId": settings.entra_client_id,
        "tenantId": settings.entra_tenant_id,
        "scope": f"api://{settings.api_client_id}/{settings.entra_scope}"
        if settings.auth_enabled
        else "",
    }


@router.get("/me")
def me(user: Annotated[CurrentUser, Depends(current_user)]):
    return {"name": user.name, "permissions": user.permissions}
