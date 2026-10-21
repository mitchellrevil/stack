"""Build the API and attach its settings. Settings are attached once at startup."""

from fastapi import FastAPI

from app.api.v1.router import router
from app.auth import EntraTokens
from app.config import Settings


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings()
    api = FastAPI(title="Stack API")
    api.state.settings = settings
    api.state.tokens = EntraTokens(settings) if settings.auth_enabled else None

    api.include_router(router)
    return api


app = create_app()
