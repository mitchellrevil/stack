# Entra sign-in and permissions

The backend owns the auth configuration. With no `ENTRA_CLIENT_ID`, both the frontend guard and backend permission dependency allow access. This is intended for trying the scaffold locally.

Once a client ID is set, the API checks the token signature, issuer, audience, tenant, lifetime and delegated scope. The demo does not require an app role. The browser gets its permissions from `/v1/auth/me`, after the API has verified the token.

## Configure an app registration

You need permission to create or update app registrations in your Entra tenant.

1. Create a **single-tenant** app registration. Copy its application/client ID and directory/tenant ID.
2. Add a **Single-page application** platform with `http://localhost:5173` as a redirect URI. Add your exact HTTPS origin when you deploy. No client secret is needed in the browser.
3. Under **Expose an API**, use `api://<application-client-id>` as the application ID URI. Add a delegated scope called `access_as_user` and give it an appropriate consent description.
4. Set the API's requested access token version to **2** (`api.requestedAccessTokenVersion` in the manifest). The backend accepts v2 tokens for the configured tenant.
5. Grant the SPA delegated permission to the API's `access_as_user` scope. Grant administrator consent if your tenant requires it. For a single registration, use the API's authorised client applications to authorise its own client ID for the scope.
6. Put the client ID and tenant ID in `backend/.env`, then restart the app.

```dotenv
ENTRA_CLIENT_ID=11111111-1111-4111-8111-111111111111
ENTRA_TENANT_ID=22222222-2222-4222-8222-222222222222
ENTRA_API_CLIENT_ID=
ENTRA_SCOPE=access_as_user
```

You can use separate SPA and API registrations. Set `ENTRA_CLIENT_ID` to the SPA ID and `ENTRA_API_CLIENT_ID` to the API ID. Expose the scope on the API registration, then grant the SPA permission to that API scope. Both registrations must use the configured tenant.

## Optional permissions

Define a role in the API's Entra registration, then use it on the route:

```python
@router.get('/reports', dependencies=[Depends(require_permission('Reports.Read'))])
def get_reports():
    ...
```

Register business routers through `backend/app/api/v1/router.py` with `Depends(current_user)`. Pass the same role name to `PermissionGuard` around the page or control. The frontend guard is for the user experience; the backend makes the access decision.

The public `/v1/auth/config` route is needed before login. `/v1/health` is a public liveness check. Both use settings dependencies and expose no private app data. `/v1/auth/me` and `/v1/charts` require authentication when enabled.

## Check the connection

- Signed out: the UI asks you to sign in and `/v1/charts` returns 401.
- Signed in with a valid API token: the charts load without a role assignment.
- An expired, forged or wrong-audience token returns 401. A signing-key service outage returns 503. Neither opens the guard.

Check a real tenant login against your app registration and consent settings.

For deployment, serve the frontend and `/v1` API under the same HTTPS origin, or configure a reverse proxy to route `/v1` to FastAPI. Vite's development proxy is not part of the production build. Keep `.env` out of source control and set the values in your hosting environment.

References: [MSAL React setup](https://learn.microsoft.com/en-us/entra/msal/javascript/react/getting-started), [Microsoft access tokens](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens), [PyJWT validation](https://pyjwt.readthedocs.io/en/stable/usage.html).
