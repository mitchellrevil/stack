# Where changes belong

The frontend renders the app and calls the API. FastAPI owns data access, business rules and permissions. The starter uses static sample data so it runs without a database.

## Add a feature

Create `frontend/src/features/<feature-name>`. Keep its page, components, hooks and API calls together. Use `.ts` for code without JSX and `.tsx` for React components. Register its page in `frontend/src/app/router.tsx`.

Use `frontend/src/api/client.ts` for HTTP requests and define a Zod response contract beside the feature API call. TanStack Query handles loading, errors and caching. Do not add a separate global store for data already owned by Query.

Reuse `frontend/src/components/ui` for shared controls. The whole shadcn component set is available locally. Keep feature-specific components in their feature until another feature actually uses them.

## Add an API route

Add an `APIRouter` under `backend/app/routes`, define its request and response models, then register it in `backend/app/api/v1/router.py`. Use `Depends` to obtain settings and the current user. Put permission checks in `Depends(require_permission(...))` so the endpoint cannot accidentally skip them.

All application API URLs start with `/v1`. A breaking contract change should get a new versioned router, while existing clients keep using v1. FastAPI's `/docs` and `/openapi.json` are documentation endpoints, not versioned business routes.

The frontend and API agree on auth mode through `/v1/auth/config`. There is no second frontend switch which can drift from the backend.
