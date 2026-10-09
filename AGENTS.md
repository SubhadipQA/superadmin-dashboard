# Agent Instructions for YPark Admin

## Purpose

This repository is the YPark web dashboard. It is currently focused on the
Super Admin experience and will later support a scoped Zone Owner experience.
Vendor operations belong to the vendor mobile app and must not be added here.

Read [README.md](README.md) for the project overview and
[PROJECT_FLOW.md](PROJECT_FLOW.md) for the complete frontend-to-Express flow,
API contracts and access model.

## Project Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

After changing React or configuration files, run at least:

```bash
npm run lint
npm run build
```

Do not commit generated `dist/` output or environment files.

## Architecture

- `src/App.jsx` owns public and protected routes.
- `src/components/layout/` owns the shared dashboard shell.
- `src/pages/` contains feature pages grouped by module.
- `src/store/authStore.js` owns persisted authentication state.
- `src/hooks/` contains reusable React hooks.
- `src/services/` is the home for Axios/API service modules.
- `src/index.css` and `tailwind.config.js` define the shared design system.

Keep feature logic inside its feature page or a nearby feature component. Do not
put Support, zone, settlement or analytics logic into the shared layout.

## Current Modules

```text
/dashboard     Super Admin dashboard
/zones         Parking area approvals
/vendors       Vendor management for platform administration
/settlements   Payment summary
/analytics     Platform analytics
/support       Support tickets, details and replies
```

The current pages use mock data unless a page explicitly has a connected service.
When replacing mock data, preserve the existing loading, empty and error states.

## UI and Styling Rules

- Use the existing Tailwind classes and `ypark-*` color tokens.
- Use the existing Geist and Plus Jakarta Sans typography.
- Use `lucide-react` for icons.
- Keep Support-specific styles inside the Support module.
- Do not add raw brand hex colors to page components.
- Preserve responsive behavior for desktop and mobile widths.
- Avoid unrelated formatting or refactoring while adding a module.

## API Integration Rules

Use `VITE_API_BASE_URL` for the Express API base URL. Create an Axios instance
in `src/services/api.js` and attach the persisted token as:

```text
Authorization: Bearer <token>
```

API responsibilities belong to Express:

- Authenticate the JWT.
- Authorize the user's role.
- Enforce zone ownership and scope.
- Validate payloads.
- Calculate totals and business values.
- Return consistent error responses.

The frontend must not trust a client-provided role or zone list as authorization.

Support endpoints:

```text
POST  /v1/support/ticket
GET   /v1/support/ticket?status=OPEN
GET   /v1/support/ticket/:id
POST  /v1/support/ticket/reply/:id
PATCH /v1/support/ticket/read/:id
```

Support ticket creation should include only the fields needed by the API, such
as category, zoneId when applicable, title and description. Sender identity must
come from the authenticated API user, not from editable frontend fields.

## Access Model

The web dashboard supports these roles:

```text
SUPER_ADMIN  -> all customers, zones, vendors, payments, analytics and support
ZONE_OWNER   -> assigned zones and related dashboard data only
VENDOR       -> mobile app only
CUSTOMER     -> mobile app only
```

Keep the shared `/dashboard` route and render role-appropriate data rather than
copying the whole application. Super Admin sees platform-wide data. Zone Owner
sees only data for their assigned `zoneIds`.

The current Zustand store uses `admin` for compatibility with the existing
Super Admin login. If the API later returns a generic `user`, migrate carefully
or provide a compatibility layer so the Sidebar and protected routes do not
break.

## Change Checklist

Before editing:

1. Read the owning page, route and nearby existing pattern.
2. Identify whether the change is shared or feature-specific.
3. Keep the smallest possible file and API surface.

After editing:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Verify the changed route and its empty/loading/error states.
4. Do not modify unrelated user changes or create a commit automatically.
