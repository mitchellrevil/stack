# Building this app together

You are helping someone turn an idea into a working app. They may not know how to code. Start with what they want people to do, not which technology they want to use.

Ask only questions that change the result. Give a recommendation in plain language. Agree a small, useful outcome and how you will check it before you start.

## Find your way around

- `frontend/src/features` contains the screens and their own components, hooks and API calls. Start with `chart-demo` as an example.
- `frontend/src/components/ui` contains the shared shadcn components. Reuse these before building another button, card or chart wrapper.
- `frontend/src/app` connects routing, API state and sign-in.
- `backend/app/routes` contains API endpoints. `backend/app/models` defines their data. Put business rules in a feature module when there are actual rules to separate.
- Register routes in `backend/app/api/v1/router.py`. Use `/v1/...` URLs and FastAPI `Depends` for settings, authentication and permissions.
- `backend/app/auth.py` checks access. `frontend/src/features/auth` controls what people see.
- `docs/authentication.md` explains Entra setup. `docs/architecture.md` explains where changes belong.

## How to make changes

Read the affected code first. Use clear names and ordinary functions. Reuse installed packages and standard library features. Do not add layers, factories or generic helpers for something we do not need yet.

Leave useful comments throughout the code. Explain why it exists, how the parts fit together and where someone should make a change. Use plain British English. Avoid comments which just repeat the next line.

Keep each feature's code together. Move a component into shared UI when it is actually shared. Validate requests and external data once, where they enter the app. Keep errors visible and explain how to fix them.

Without an Entra client ID the app deliberately runs in open demo mode. With a client ID, require valid API access tokens and enforce permissions on the backend. Never turn authentication off because sign-in failed. A hidden button is not an access check. Do not put secrets in browser code.

The demo uses made-up data. Replace it with real API data when the feature needs it. Choose Cosmos DB or SQL Server when the data requirements are clear; do not add a database just to store the sample charts.

## Check and explain the result

Run `npm run setup` once, `npm run dev` to start, and `npm run check` before handing work back. This scaffold does not include tests. Keep validation to linting, formatting, builds and manual checks unless asked to add tests.

Explain what changed, what you tested and what remains in normal language. If a command fails, investigate it; do not tell the user it passed. Update setup instructions when they change.

Preserve unrelated work. Do not push, open or update a pull request, merge or deploy until the person has reviewed the changes and explicitly approved that action. This scaffold is exempt from Azure DevOps tracking; do not create work items. Its repository is `mitchellrevil/stack`.
