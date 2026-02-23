# Copilot / AI Agent Instructions — Akyildiz Yonetim

Purpose: give an AI code assistant the minimal, high-value context to be productive in this mono-repo (frontend Vue app + backend .NET API).

1) Big picture
- Frontend: a Vite + Vue 3 SPA (Composition API) located at the repo root. Key folders: `src/`, `src/features/`, `src/services/`, `src/stores/`, `src/router/`.
- Backend: a separate .NET 8 solution under `akyildiz-yonetim-backend/` using Clean Architecture. Top folders: `AkyildizYonetim.API/`, `AkyildizYonetim.Application/`, `AkyildizYonetim.Domain/`, `AkyildizYonetim.Persistence/`.
- Integration: Frontend talks to the backend via REST; the frontend uses an environment variable `VITE_API_BASE_URL` (see `env.example`) to locate the API.

2) Start & developer flows (most common)
- Frontend (local):
  - `npm install`
  - `cp env.example .env.local` and set `VITE_API_BASE_URL`
  - `npm run dev` (Vite dev server)
  - `npm run build` and `npm run preview` for production build preview
- Backend (local):
  - `dotnet restore` && `dotnet build`
  - `dotnet run --project AkyildizYonetim.API` (runs API)
  - Windows build helper: `build.bat --test`; PowerShell: `.
build.ps1 -Test`
  - Tests: `dotnet test` (backend) and Playwright tests for frontend (`npx playwright test` or via the configured scripts)

3) Key files to inspect for behavior and examples
- Frontend entry: `src/main.js` and `App.vue` — see how stores and router are wired.
- Router: `src/router/` — maps pages to components (guards, auth checks live here).
- State: `src/stores/` (Pinia) — follow store naming patterns and composition usage (getters, actions).
- HTTP: `src/services/` — wrappers around API calls; prefer reusing these rather than adding ad-hoc fetches.
- Feature modules: `src/features/*` — feature-local components, composables and store usage demonstrate project conventions.
- Backend startup: `akyildiz-yonetim-backend/AkyildizYonetim.API/Program.cs` and `appsettings.json` — middleware, DI, migrations behavior.
- API docs / examples: backend contains multiple API markdown docs (e.g. `Flats-API-Documentation.md`) and exposes Swagger at `/swagger` when running.

4) Project-specific patterns & conventions
- Frontend is feature-first: add new pages under `src/features/<feature>/` and related Pinia stores under `src/stores/` (one store per domain concept is common).
- Use `src/services/*` for all HTTP interactions; components should call services or stores, not raw fetches.
- Styling: Tailwind + DaisyUI. Utilities and global styles are in `src/style.css` and `tailwind.config.js`.
- Tests: Playwright is the E2E framework for the frontend (`playwright.config.ts` exists). Backend unit/integration tests use `.NET` test projects under `AkyildizYonetim.Tests`.

5) Integration and infra notes
- Database: EF Core migrations live in the persistence projects; `migrations.sql` and automatic migrations are referenced in the backend README.
- Docker: `akyildiz-yonetim-backend/Dockerfile` exists; use `DOCKER_BUILDKIT=0` if BuildKit socket errors occur (see backend README troubleshooting).
- JWT auth: backend uses JWT; config in `appsettings.json` and environment variables. Endpoints for auth are under `AkyildizYonetim.API/Controllers/Auth`.

6) When editing code, what to update
- If you change API surface: update backend API docs (Markdown files at repo root of backend) and adjust `VITE_API_BASE_URL` expectations.
- If you add DB entities or change schema: add EF migrations in persistence, run & commit migration files.
- If you introduce global styles or Tailwind config changes: update `tailwind.config.js` and `src/style.css`.

7) Useful quick examples
- Frontend: start dev and open the dashboard route
  - `npm install && cp env.example .env.local && npm run dev`
- Backend: run API locally
  - `dotnet restore && dotnet run --project akyildiz-yonetim-backend/AkyildizYonetim.API`

8) Search hints for agents
- Look for feature examples in `src/features/tenants/`, `src/features/payments/`, and `src/features/expenses/`.
- For backend behavior, inspect `AkyildizYonetim.Application/` for business rules and `AkyildizYonetim.Persistence/` for EF Core mappings.

9) Sources used to create this guidance
- `README.md` (repo root)
- `akyildiz-yonetim-backend/README.md`
- `package.json`, `src/` directories, and `akyildiz-yonetim-backend/AkyildizYonetim.API/Program.cs`

If anything here is unclear or you'd like me to expand a section (examples for a specific feature, request/response shapes, or test running), tell me which area and I'll iterate.
