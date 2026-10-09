# YPark Admin Panel

Internal Super Admin tool for managing the YPark smart parking platform.
Built with React + Vite. Connects to YPark Express API backend.

**Version:** 1.2 — Phase 1
**Last Updated:** October 2026
**Status:** Frontend skeleton complete. Express API connection in progress.

---

## Table of Contents

1. [What Is This](#1-what-is-this)
2. [Who Uses This](#2-who-uses-this)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Getting Started](#5-getting-started)
6. [Environment Variables](#6-environment-variables)
7. [Login](#7-login)
8. [Pages Overview](#8-pages-overview)
9. [Color System](#9-color-system)
10. [Connecting Real APIs](#10-connecting-real-apis)
11. [Build and Deploy](#11-build-and-deploy)
12. [Important Rules](#12-important-rules)
13. [Phase Roadmap](#13-phase-roadmap)
14. [Project Flow](#14-project-flow)

---

## 1. What Is This

YPark Admin Panel is the **internal web dashboard** for the YPark platform.

YPark is a smart parking management system that connects:
- **Parking Area Owners** (roadside operators, malls, societies, buildings)
- **Customers** (vehicle owners who park and pay)
- **Ground Staff** (entry/exit operators, cash collectors)

This admin panel is separate from:
- Vendor mobile app (owners and staff use this)
- Customer mobile app (customers use this)

This panel handles platform-level operations only — approvals, payment summaries, analytics.

---

## 2. Who Uses This

| User | Access | How Created |
|------|--------|-------------|
| Super Admin | Full access — everything | Manually in DB. Never from registration. |
| Org Admin (Phase 3) | Scoped to their parking areas only | Super Admin creates when org purchases dashboard |

**DB userType values:**
```
SUPER_ADMIN  → this panel, full access
ADMIN        → org dashboard, scoped access (Phase 3)
VENDOR       → mobile app only
CUSTOMER     → mobile app only
```

---

## 3. Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| React | 19 | Frontend framework |
| Vite | 8 | Build tool and dev server |
| React Router | v6 | Client side routing |
| Tailwind CSS | v3 | Utility first styling |
| shadcn/ui | latest | Headless UI components |
| Tanstack Query | v5 | API data fetching and caching |
| React Hook Form | latest | Form state management |
| Axios | latest | HTTP client |
| Recharts | latest | Charts and data visualization |
| xlsx + file-saver | latest | Excel export |
| date-fns | latest | Date formatting |
| Zustand | latest | Global auth state |
| lucide-react | latest | Icon library |

---

## 4. Project Structure

```
ypark-admin/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx   → Main layout — sidebar + header + content
│   │   │   ├── Sidebar.jsx           → Left navigation
│   │   │   ├── Header.jsx            → Top bar with page title
│   │   │   └── ProtectedRoute.jsx    → Auth guard
│   │   └── ui/
│   │       ├── Pagination.jsx        → Reusable pagination
│   │       └── [shadcn components]   → button, input, card etc
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx
│   │   ├── dashboard/
│   │   │   └── DashboardHome.jsx
│   │   ├── zones/
│   │   │   └── ZoneApproval.jsx
│   │   ├── vendors/
│   │   │   └── VendorManagement.jsx
│   │   ├── settlements/
│   │   │   └── ManualSettlement.jsx
│   │   ├── analytics/
│   │   │   └── PlatformAnalytics.jsx
│   │   ├── support/
│   │   │   └── SupportManagement.jsx  → Ticket list, creation, details, replies
│   │   └── customers/
│   │       └── CustomerManagement.jsx  ← Hidden, Phase 2
│   │
│   ├── store/
│   │   └── authStore.js              → Zustand auth store
│   │
│   ├── hooks/
│   │   └── usePagination.js          → Reusable pagination logic
│   │
│   ├── services/                     → Empty — API files go here
│   ├── lib/
│   │   └── utils.js                  → shadcn cn() utility
│   │
│   ├── App.jsx                       → Routes
│   ├── main.jsx                      → Entry point
│   └── index.css                     → Tailwind + CSS variables
│
├── FRONTEND_GUIDE.md                 → Full developer reference
├── README.md                         → This file
├── tailwind.config.js
├── vite.config.js
├── jsconfig.json
└── package.json
```

---

## 5. Getting Started

**Requirements:**
- Node.js v18 or above
- npm v9 or above

**Install and run:**

```bash
# Clone the repo
git clone https://github.com/your-org/ypark-admin.git
cd ypark-admin

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

You will be redirected to the login page automatically.

---

## 6. Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-express-api.com/api
```

**For local development:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

**Important:** All environment variables must start with `VITE_` to be accessible in React.

Access in code:
```js
import.meta.env.VITE_API_BASE_URL
```

**Note:** `.env` file is gitignored. Never commit credentials.

---

## 7. Login

**Phase 1 — Mock credentials (current):**
```
Email:    admin@ypark.in
Password: admin123
```

**Phase 2 — Real API:**
Connects to `POST /api/admin/auth/login`.
See `FRONTEND_GUIDE.md` Section 5 for exact implementation.

**Auth flow:**
1. Admin enters email and password
2. Credentials validated against API
3. JWT token stored in Zustand store (persisted to localStorage)
4. All API calls send `Authorization: Bearer <token>` header
5. On 401 response — auto logout and redirect to `/login`

---

## 8. Pages Overview

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Login | `/login` | ✅ Complete | Admin authentication |
| Dashboard | `/dashboard` | ✅ Mock data | Platform overview, stats, revenue chart |
| Parking Areas | `/zones` | ✅ Mock data | Approve or reject parking area submissions |
| Vendors | `/vendors` | ✅ Mock data | Manage vendor accounts |
| Payment Summary | `/settlements` | ✅ Mock data | Daily parking area wise payment summary |
| Analytics | `/analytics` | ✅ Mock data | Revenue, parking visits, city breakdown charts |
| Support | `/support` | ✅ UI skeleton | Ticket list, status tabs, new ticket, details and replies |
| Customers | `/customers` | ⏭ Phase 2 | Hidden — build after customer app |

---

## 9. Color System

All colors are centralized in `tailwind.config.js` using the `ypark-*` prefix.
Use Tailwind classes like `bg-ypark-black`, `text-ypark-deep-blue`, etc.

**Brand Colors:**
```
ypark-black        #0E0E0E   → Sidebar background
ypark-deep-blue    #0B05C7   → Primary brand, CTAs, active states
ypark-bright-blue  #0063FF   → Accent highlights
ypark-light-gray   #F4F4F4   → Table headers, secondary backgrounds
```

**Text Colors:**
```
ypark-text         #1A2332   → Main headings and body text
ypark-text-muted   #506A84   → Secondary text, labels, placeholders
```

**Sidebar Colors:**
```
ypark-sidebar          #0E0E0E   → Sidebar background
ypark-sidebar-hover    #1A1A1A   → Hover state
ypark-sidebar-border   #2A2A2A   → Dividers
ypark-sidebar-muted    #8A8A8A   → Inactive icons/text
```

**Semantic Colors:**
```
ypark-success   #16A34A   → Approved, active, verified
ypark-warning   #F59E0B   → Pending, carry forward
ypark-danger    #DC2626   → Rejected, suspended, error
ypark-info      #0891B2   → Information badges
```

**Typography:**
- Headings: Plus Jakarta Sans (font-heading)
- Body: Geist (font-sans)

**Usage Examples:**
```jsx
// Background
<div className="bg-ypark-black">         // Sidebar
<div className="bg-ypark-light-gray">    // Table header

// Text
<h1 className="text-ypark-text">         // Heading
<p className="text-ypark-text-muted">    // Secondary

// Borders
<div className="border border-ypark-black/10">  // Subtle border

// Buttons
<button className="bg-ypark-deep-blue hover:bg-ypark-deep-blue/90">
<button className="bg-ypark-success hover:bg-ypark-success/90">
```

**Rule:** Never use raw hex colors in components.
Always use `ypark-*` Tailwind classes for consistency.

---

## 10. Connecting Real APIs

**Order of connection — follow this sequence:**

```
1. Create src/services/api.js     → Axios instance with auth interceptor
2. Connect Login                  → POST /admin/auth/login
3. Connect Dashboard              → GET /admin/dashboard/overview
4. Connect Parking Areas          → GET /admin/zones + approve + reject
5. Connect Vendors                → GET /admin/vendors + suspend + activate
6. Connect Payment Summary        → GET /admin/settlements/daily + settle-zone
7. Connect Analytics              → GET /admin/analytics
8. Connect Support                → POST/GET/PATCH /v1/support/ticket
```

**For each page — what to do:**
1. Remove mock data array from the file
2. Add `useQuery` hook with API call
3. Replace mock array reference with `data?.data`
4. Add loading state — use shadcn `<Skeleton />`
5. Add error state — show error message
6. Test filters still work — they pass as query params

### Support API

The Support page currently uses mock data. Replace the local handlers with these
Express endpoints when the backend is ready:

```text
POST  /v1/support/ticket              Create a ticket
GET   /v1/support/ticket              List tickets
GET   /v1/support/ticket/:id          Get ticket details and replies
POST  /v1/support/ticket/reply/:id    Add a reply
PATCH /v1/support/ticket/read/:id     Mark a ticket as read
```

Use a status query for the Support tabs:

```text
GET /v1/support/ticket?status=OPEN
GET /v1/support/ticket?status=IN_PROGRESS
GET /v1/support/ticket?status=RESOLVED
```

Every request must include the authenticated user's bearer token. The Express
API, not the frontend, is responsible for checking whether the user can access
the requested ticket or zone.

**Full implementation details for every page:**
See `FRONTEND_GUIDE.md` — Section 7 and Section 10.

---

## 11. Build and Deploy

**Build for production:**
```bash
npm run build
```

Output goes to `dist/` folder.

**Preview production build locally:**
```bash
npm run preview
```

**Deploy options:**

```
Vercel (recommended)
→ Connect GitHub repo
→ Set VITE_API_BASE_URL in Vercel environment variables
→ Auto deploys on every push to main

Netlify
→ Build command: npm run build
→ Publish directory: dist
→ Set environment variables in Netlify dashboard

VPS / Ubuntu server
→ Build locally: npm run build
→ Serve dist/ with Nginx
→ Point domain to server
```

**Nginx config for SPA routing:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

This is required because React Router handles routing client side.
Without this, refreshing any page other than `/` returns 404.

---

## 12. Important Rules

**Never do these:**

```
❌ Never commit .env file
❌ Never hardcode API URLs — always use import.meta.env.VITE_API_BASE_URL
❌ Never rename zone_type values in code — ON_ROAD and OFF_ROAD are DB values
❌ Never add colors outside the defined palette
❌ Never build Phase 3 Org Dashboard before first paying client
❌ Never mix vendor mobile app logic into this admin panel
❌ Never trust a frontend role check as the only authorization layer
```

**Always do these:**

```
✅ Update FRONTEND_GUIDE.md when adding new pages or connecting APIs
✅ Keep mock data arrays clearly labeled with comments
✅ Use existing helper functions — getZoneTypeBadge, statusConfig etc
✅ Follow existing folder structure — pages in pages/, store in store/
✅ Test pagination after connecting each API — server side pagination
✅ Wrap all API calls in try/catch with user-visible error messages
✅ Keep Super Admin and Zone Owner access in the same web app with server-side scope filtering
✅ Keep Vendor operations in the vendor mobile app
```

**Display labels vs technical terms:**

```
In UI display     →  "Parking Area", "Govt. Authorized", "Private", "Payment Summary"
In code/DB/API    →  zone, zone_type, ON_ROAD, OFF_ROAD
Never mix these   →  display labels never go into API params or DB
```

---

## 13. Phase Roadmap

```
Phase 1 — Now (Complete)
✅ Project setup and folder structure
✅ Color system and Tailwind configuration
✅ Auth — login page, protected routes, Zustand store
✅ Dashboard home — stats, revenue chart, recent parking areas
✅ Parking Area Approval — list, search, filter, approve/reject
✅ Vendor Management — list, search, filter, suspend/activate
✅ Payment Summary — daily parking area cards, carry forward, mark paid, Excel export
✅ Platform Analytics — charts, city breakdown, date filter
✅ Pagination — reusable component on all list pages
✅ FRONTEND_GUIDE.md — full developer reference

Phase 1 Remaining
⬜ Connect real Express APIs (all pages)
⬜ Loading states and error handling
⬜ Notification system (after API webhooks ready)

Support module
✅ Support page skeleton and navigation
✅ Ticket creation, status tabs, details and reply UI with mock data
⬜ Connect Support UI to `/v1/support/ticket` APIs
⬜ Add unread counts and production error/loading states

Phase 2
⬜ Customer Management page
⬜ Automated payment summary — cron job on backend (no frontend change)
⬜ PDF export for payment summary and analytics reports
⬜ Sub Admin management

Phase 3
⬜ Zone Owner Dashboard (build when required by the first multi-zone owner)
⬜ Zone-scoped parking area view — filtered by assigned zone IDs
⬜ Zone Owner revenue and staff reports
⬜ Permission-based navigation for Zone Owners
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `FRONTEND_GUIDE.md` | Deep dive — every component, every mock data 
| `PROJECT_FLOW.md` | Frontend-to-Express flow, API contracts, roles and future access model |

## 14. Project Flow

See [`PROJECT_FLOW.md`](PROJECT_FLOW.md) for the complete implementation flow,
including how the frontend calls Express, how to replace mock data, and how to
prepare Super Admin and Zone Owner access without adding Vendor functionality
to this web dashboard.

---

*YPark Admin Panel — README.md | Version 1.1 | Phase 1 | July 2026*  
*Update version number and phase status when significant changes are made.*