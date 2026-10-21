"""Entra access checks. Add app roles here as the app grows."""

from dataclasses import dataclass
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient
from jwt.exceptions import PyJWKClientConnectionError

from app.config import Settings

bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class CurrentUser:
    name: str
    permissions: tuple[str, ...]
    auth_enabled: bool


class EntraTokens:
    """Keep the signing-key cache for the life of the app"""

    def __init__(self, settings: Settings):
        self.settings = settings
        self.keys = PyJWKClient(
            f"https://login.microsoftonline.com/{settings.entra_tenant_id}"
            "/discovery/v2.0/keys",
            timeout=10,
        )

    def read(self, token: str) -> CurrentUser:
        try:
            key = self.keys.get_signing_key_from_jwt(token)
            claims = jwt.decode(
                token,
                key.key,
                algorithms=["RS256"],
                audience=self.settings.api_client_id,
                issuer=self.settings.issuer,
                options={"require": ["exp", "iat", "nbf", "sub", "tid"]},
            )

            # The delegated scope makes this an API access token. An ID token
            # from the same registration must not grant access to the API.
            scopes = claims.get("scp", "")
            if (
                claims["tid"] != self.settings.entra_tenant_id
                or not isinstance(scopes, str)
                or self.settings.entra_scope not in scopes.split()
            ):
                raise jwt.InvalidTokenError("Wrong tenant or missing API scope")

            roles = claims.get("roles", [])
            if not isinstance(roles, list) or not all(
                isinstance(role, str) for role in roles
            ):
                raise jwt.InvalidTokenError("Invalid app roles")
        except PyJWKClientConnectionError as error:
            # An Entra outage is not a bad password, and certainly not a reason
            # to turn guards off. Let the user retry once the service recovers.
            raise HTTPException(503, "Cannot check sign-in right now") from error
        except jwt.PyJWTError as error:
            raise HTTPException(
                401,
                "Sign in with a valid API access token",
                headers={"WWW-Authenticate": "Bearer"},
            ) from error

        return CurrentUser(
            name=claims.get("name", "Signed-in user"),
            permissions=tuple(roles),
            auth_enabled=True,
        )


def current_user(
    request: Request,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
) -> CurrentUser:
    # FastAPI runs this synchronous dependency in its thread pool. Fetching
    # signing keys therefore does not block the async event loop.
    if not request.app.state.settings.auth_enabled:
        return CurrentUser(name="Demo user", permissions=(), auth_enabled=False)

    if credentials is None:
        raise HTTPException(
            401, "Sign in to continue", headers={"WWW-Authenticate": "Bearer"}
        )

    return request.app.state.tokens.read(credentials.credentials)


def require_permission(permission: str):
    """Use this dependency when a feature needs a permission check."""

    def check(user: Annotated[CurrentUser, Depends(current_user)]) -> CurrentUser:
        if user.auth_enabled and permission not in user.permissions:
            raise HTTPException(403, f"You need the {permission} permission")
        return user

    return check
