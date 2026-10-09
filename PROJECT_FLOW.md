# YPark Admin Project Flow

This document explains the current frontend, the planned Express API connection,
and the access model for Super Admin and Zone Owner users.

## 1. Applications and Responsibilities

```text
Vendor mobile app       -> vendor operations and parking tracking
Customer mobile app     -> customer parking experience
This web dashboard       -> Super Admin and future Zone Owner operations
Express API              -> authentication, business rules, filtering and persistence
Database                 -> users, zones, vendors, customers, payments and tickets
```

Vendor functionality should remain in the vendor mobile app. Do not add a Vendor
dashboard to this web project.

## 2. Current Frontend Flow

```text
Browser
  |
  v
main.jsx
  |
  +-- BrowserRouter
  +-- QueryClientProvider
  +-- App.jsx
        |
        +-- /login -> LoginPage
        +-- protected routes -> DashboardLayout
                                  |
                                  +-- Sidebar
                                  +-- Header
                                  +-- page component through Outlet
```

Current protected pages:

```text
/dashboard     DashboardHome
/zones         ZoneApproval
/vendors       VendorManagement
/settlements   ManualSettlement
/analytics     PlatformAnalytics
/support       SupportManagement
```

The pages currently use mock data. The Support page includes the UI flow for:

- Open, In Progress and Resolved ticket tabs
- Ticket list and empty state
- New ticket form
- Ticket details
- Replies

## 3. Frontend to Express Request Flow

When real APIs are connected, each request should follow this path:

```text
User action
  |
  v
React page or React Query hook
  |
  v
src/services/api.js
  |
  +-- Adds Authorization: Bearer <token>
  +-- Uses VITE_API_BASE_URL
  +-- Handles 401 by logging out
  |
  v
Express route
  |
  +-- Authentication middleware verifies JWT
  +-- Authorization middleware checks role and scope
  +-- Controller validates request
  +-- Service applies business rules
  +-- Database query reads or writes data
  |
  v
JSON response
  |
  v
React Query updates the page state
```

The browser must not connect directly to the database. The Express API is the
only place that should enforce permissions, calculate totals, and update data.

## 4. Environment Setup

Create `.env` in the project root for local development:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

The frontend should use the same Axios instance for all authenticated requests.
Do not hardcode the Express URL inside a page component.

Suggested service structure:

```text
src/services/
  api.js              Axios instance and auth interceptors
  authService.js      Login and logout requests
  supportService.js   Support ticket requests
  dashboardService.js Dashboard requests
  zoneService.js      Parking area requests
```

## 5. Authentication Flow

### Current frontend store

The Zustand store currently stores the authenticated object as `admin`:

```js
{
  admin: null,
  token: null,
  isAuthenticated: false
}
```

This is acceptable for the current Super Admin-only phase. The existing Sidebar
already reads `admin.name` and `admin.email`.

### Future user shape

When Zone Owner access is introduced, the object can be renamed to `user` or kept
as `admin` temporarily for compatibility. The API should return this shape:

```json
{
  "id": 12,
  "name": "Zone Owner",
  "email": "owner@example.com",
  "role": "ZONE_OWNER",
  "zoneIds": [4, 8, 12, 19, 25],
  "permissions": [
    "dashboard.read",
    "zones.read",
    "settlements.read",
    "support.read",
    "support.reply"
  ]
}
```

Login flow:

```text
1. User submits email and password
2. Frontend calls POST /admin/auth/login
3. Express verifies credentials
4. Express returns user data and JWT
5. Zustand stores user and token
6. Axios sends the token on later requests
7. ProtectedRoute blocks unauthenticated users
8. Express checks role and zone scope on every protected request
```

A frontend role check is useful for navigation, but it is not security. The API
must perform the final authorization check.

## 6. Access Model

The web dashboard has two user types:

| Role | Platform | Data access |
|------|----------|------------|
| `SUPER_ADMIN` | Web | All customers, all zones, vendors, payments, analytics and support |
| `ZONE_OWNER` | Web | Only assigned zones and related payments, analytics and support |
| `VENDOR` | Mobile app | Vendor operations only; not part of this web dashboard |
| `CUSTOMER` | Mobile app | Customer parking experience; not part of this web dashboard |

### Super Admin

A Super Admin can view and manage all 70 zones and all 50 customers. The API can
return platform-wide data for this role.

### Zone Owner

A Zone Owner may own five zones, for example. Every relevant Express query must
be filtered by the user's assigned zone IDs. The frontend should not send an
untrusted `zoneIds` list and expect the API to trust it. Express should derive
allowed zones from the authenticated user.

Example behavior:

```text
GET /v1/zones
SUPER_ADMIN -> all zones
ZONE_OWNER  -> only zones assigned to the authenticated owner
```

For a Zone Owner, the same `/dashboard` route can render a scoped dashboard.
Use shared layout and components, but role-specific data and cards:

```text
/dashboard
  SUPER_ADMIN -> platform overview
  ZONE_OWNER  -> assigned-zone overview
```

Do not copy the entire application to create a second dashboard.

## 7. Support API Flow

The current Support page uses local mock data. Replace the local handlers with
these requests when the Express API is ready:

```text
POST  /v1/support/ticket
GET   /v1/support/ticket
GET   /v1/support/ticket/:id
POST  /v1/support/ticket/reply/:id
PATCH /v1/support/ticket/read/:id
```

Use the status tabs with a query parameter:

```text
GET /v1/support/ticket?status=OPEN
GET /v1/support/ticket?status=IN_PROGRESS
GET /v1/support/ticket?status=RESOLVED
```

### Create ticket request

```json
{
  "category": "PAYMENT",
  "zoneId": 12,
  "title": "Payment was not reflected",
  "description": "The payment is not showing in the settlement summary."
}
```

`zoneId` can be required for a Zone Owner and optional for a Super Admin if the
issue is platform-wide. Express must verify that a Zone Owner owns the selected
zone.

### Ticket response

```json
{
  "id": 1,
  "ticketNumber": "T-12345",
  "category": "PAYMENT",
  "zoneId": 12,
  "title": "Payment was not reflected",
  "description": "The payment is not showing in the settlement summary.",
  "status": "OPEN",
  "isRead": false,
  "createdBy": {
    "id": 12,
    "name": "Zone Owner",
    "email": "owner@example.com"
  },
  "createdAt": "2026-10-09T10:30:00Z",
  "replies": []
}
```

### Reply request

```json
{
  "message": "We are checking this with the payments team."
}
```

The API should add the authenticated user to the reply. The frontend should not
be allowed to submit an arbitrary sender name or email.

### Recommended ticket fields

```text
id
 ticketNumber
category
zoneId
createdBy
assignedTo
status
isRead
title
description
createdAt
updatedAt
```

Use a consistent status enum in the API:

```text
OPEN
IN_PROGRESS
RESOLVED
```

## 8. Replacing Mock Data Safely

For each page:

```text
1. Keep the page layout and components
2. Move the endpoint call into src/services/
3. Replace the mock array with a useQuery request
4. Add loading state
5. Add error state and retry action
6. Add empty state for an empty successful response
7. Send filters and pagination as query parameters
8. Test Super Admin and Zone Owner responses separately
```

For Support, the replacement order is:

```text
1. Create supportService.js
2. Add listTickets(status)
3. Add createTicket(payload)
4. Add getTicket(id)
5. Add replyToTicket(id, payload)
6. Add markTicketRead(id)
7. Replace local state in SupportManagement.jsx
8. Keep the current UI states for loading, error and empty results
```

## 9. Express Backend Rules

The Express application should have separate middleware layers:

```text
 authenticateJWT
 requireRole('SUPER_ADMIN', 'ZONE_OWNER')
 requireZoneAccess(zoneId)
 validateRequest
 controller
 service
 repository/database
```

Recommended API grouping:

```text
/v1/auth/*
/v1/dashboard/*
/v1/zones/*
/v1/vendors/*
/v1/settlements/*
/v1/analytics/*
/v1/support/*
```

The API should return a consistent error shape:

```json
{
  "success": false,
  "message": "You do not have access to this zone.",
  "code": "FORBIDDEN"
}
```

Use these HTTP statuses consistently:

```text
200 -> successful read or update
201 -> successful creation
400 -> invalid request data
401 -> missing or invalid token
403 -> authenticated but not allowed
404 -> resource does not exist or is outside the user's scope
409 -> business conflict
500 -> unexpected server error
```

## 10. Implementation Order

```text
Current
  1. Build and review page skeletons
  2. Confirm navigation and visual language

Next
  3. Create Express API and database contracts
  4. Add Axios service and auth interceptor
  5. Connect login
  6. Connect dashboard and zone APIs
  7. Connect Support APIs
  8. Add loading, error and permission states

Later
  9. Add Zone Owner role and assigned-zone filtering
 10. Render the scoped Zone Owner dashboard
 11. Add permission-based sidebar items
```

This order keeps the current Super Admin experience stable while leaving a clear
path for scoped Zone Owner access later.
