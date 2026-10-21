"""Read configuration once at startup. The API also shares public auth settings."""

from uuid import UUID

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    entra_client_id: str = ""
    entra_tenant_id: str = ""
    entra_api_client_id: str = ""
    entra_scope: str = "access_as_user"

    @model_validator(mode="after")
    def check_entra_settings(self):
        # An absent client ID is the only switch for open demo mode. A typo in
        # enabled auth must stop startup rather than quietly remove protection.
        if self.entra_client_id:
            UUID(self.entra_client_id)
            UUID(self.entra_tenant_id)
            if self.entra_api_client_id:
                UUID(self.entra_api_client_id)
            if not self.entra_scope.strip():
                raise ValueError("ENTRA_SCOPE is required when Entra is enabled")
        return self

    @property
    def auth_enabled(self) -> bool:
        return bool(self.entra_client_id)

    @property
    def api_client_id(self) -> str:
        return self.entra_api_client_id or self.entra_client_id

    @property
    def issuer(self) -> str:
        return f"https://login.microsoftonline.com/{self.entra_tenant_id}/v2.0"
