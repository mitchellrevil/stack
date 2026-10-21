"""Shared FastAPI dependencies. Routes ask for what they need through Depends."""

from fastapi import Request

from app.config import Settings


def get_settings(request: Request) -> Settings:
    return request.app.state.settings
