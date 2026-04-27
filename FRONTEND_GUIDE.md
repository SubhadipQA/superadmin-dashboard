# YPark Admin Panel — Frontend Developer Guide
**Version 1.0 | Phase 1 Complete | April 2026**

This document is the single source of truth for the YPark Admin Panel frontend.
Every page, every component, every piece of mock data, every API endpoint needed,
and exactly what to change when going dynamic — all in one place.

Read this before touching any code.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [How To Run](#4-how-to-run)
5. [Auth System](#5-auth-system)
6. [Layout Components](#6-layout-components)
7. [Pages — Module by Module](#7-pages--module-by-module)
   - [Dashboard Home](#71-dashboard-home)
  - [Parking Area Approval](#72-parking-area-approval)
   - [Vendor Management](#73-vendor-management)
  - [Payment Summary](#74-payment-summary)
   - [Platform Analytics](#75-platform-analytics)
   - [Login Page](#76-login-page)
8. [Shared Components](#8-shared-components)
9. [State Management](#9-state-management)
10. [API Connection Guide](#10-api-connection-guide)
11. [Color System](#11-color-system)
12. [What Is Mock vs Dynamic](#12-what-is-mock-vs-dynamic)
13. [Phase 2 — What Comes Next](#13-phase-2--what-comes-next)

---

## 1. Project Overview

YPark Admin Panel is the internal Super Admin tool for managing the YPark
smart parking platform. It is a separate web application from the vendor
mobile app and customer mobile app.

**Who uses this panel:**
- Super Admin (you) — full access to everything
- Phase 3 — Org Admin (municipality, mall, corporate) — scoped to their parking areas only

**What this panel does:**
- Approve or reject parking area submissions from vendors
- Manage vendor accounts — view, suspend, activate
- Payment summary — daily parking area wise payment review
- Platform analytics — revenue, parking visits, city breakdown
- Future — customer management, sub admin management

**What this panel does NOT do:**
- Vendor operations (handled in vendor mobile app)
- Customer parking (handled in customer mobile app)
- Staff parking visit management (handled in vendor mobile app)

---

## 2. Tech Stack

```
React 18 + Vite          → Frontend framework and build tool
React Router v6          → Client side routing
Tailwind CSS v3          → Styling
shadcn/ui                → Headless UI components
Tanstack Query           → API data fetching and caching (ready, not yet connected)
React Hook Form          → Form handling
Axios                    → HTTP client (configured, not yet connected)
Recharts                 → Charts and data visualization
xlsx + file-saver        → Excel export functionality
date-fns                 → Date formatting
Zustand + persist        → Global auth state with localStorage persistence
lucide-react             → Icons
clsx + tailwind-merge    → Conditional class merging utility
```

---

## 3. Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.jsx     → Main layout wrapper, sidebar + header + outlet
│   │   ├── Sidebar.jsx             → Left navigation, logo, nav items, logout
│   │   ├── Header.jsx              → Top bar, page title, admin info
│   │   └── ProtectedRoute.jsx      → Auth guard, redirects to /login if not authenticated
│   └── ui/
│       ├── Pagination.jsx          → Reusable pagination component
│       └── [shadcn components]     → button, input, card, table, badge etc
│
├── pages/
│   ├── auth/
│   │   └── LoginPage.jsx           → Admin login page
│   ├── dashboard/
│   │   └── DashboardHome.jsx       → Overview stats, revenue chart, recent parking areas
│   ├── zones/
│   │   └── ZoneApproval.jsx        → Parking area list, search, filter, approve/reject panel
│   ├── vendors/
│   │   └── VendorManagement.jsx    → Vendor list, search, filter, suspend/activate panel
│   ├── settlements/
│   │   └── ManualSettlement.jsx    → Daily parking area payment summary cards, mark paid, export
│   ├── analytics/
│   │   └── PlatformAnalytics.jsx   → Charts, stat cards, city breakdown, vendor growth
│   └── customers/
│       └── CustomerManagement.jsx  → HIDDEN — Phase 2, not in navigation
│
├── store/
│   └── authStore.js                → Zustand auth store, login/logout, persisted
│
├── hooks/
│   └── usePagination.js            → Reusable pagination logic hook
│
├── services/                       → EMPTY — API service files go here when connecting
├── lib/
│   └── utils.js                    → shadcn utility — cn() function
│
├── App.jsx                         → Route definitions, protected route wrapping
├── main.jsx                        → App entry, BrowserRouter, QueryClientProvider
└── index.css                       → Tailwind directives, CSS variables for color system
```

---

## 4. How To Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

**Dev server runs at:** `http://localhost:5173`

**Login credentials (mock — Phase 1):**
```
Email:    admin@ypark.in
Password: admin123
```

**Environment variables needed when connecting real API:**
```
VITE_API_BASE_URL=https://your-express-api.com/api
```

Create `.env` file in project root with above variable.

---

## 5. Auth System

**File:** `src/store/authStore.js`
**Library:** Zustand with persist middleware

### How It Works Now (Mock)
Login page checks hardcoded credentials inside `LoginPage.jsx`.
On success calls `login(adminData, token)` from auth store.
Store saves to localStorage via persist middleware.
`ProtectedRoute.jsx` checks `isAuthenticated` — redirects to `/login` if false.

### Store Shape
```js
{
  admin: {
    id: 1,
    name: 'Super Admin',
    email: 'admin@ypark.in',
    role: 'SUPER_ADMIN'
  },
  token: 'jwt-token-string',
  isAuthenticated: true,
  login: (adminData, token) => void,
  logout: () => void
}
```

### How To Make Dynamic
**Remove** the `MOCK_ADMIN` constant from `LoginPage.jsx`.

**Replace** the mock validation block with:
```js
// In LoginPage.jsx handleLogin function
// Remove this mock block:
if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
  login(MOCK_ADMIN.data, MOCK_ADMIN.token)
  navigate('/dashboard')
}

// Replace with real API call:
import axios from 'axios'

const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/auth/login`, {
  email,
  password
})
login(response.data.admin, response.data.token)
navigate('/dashboard')
```

**Add Axios interceptor** in `src/services/api.js` (create this file):
```js
import axios from 'axios'
import useAuthStore from '@/store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

**API Endpoint Required:**
```
POST /api/admin/auth/login
Body:     { email: string, password: string }
Response: { admin: AdminObject, token: string }

AdminObject: {
  id: number,
  name: string,
  email: string,
  role: 'SUPER_ADMIN'
}
```

---

## 6. Layout Components

### 6.1 DashboardLayout
**File:** `src/components/layout/DashboardLayout.jsx`

Wrapper for all protected pages. Renders Sidebar + Header + page content via `<Outlet />`.
No dynamic data needed. Static layout forever.

### 6.2 Sidebar
**File:** `src/components/layout/Sidebar.jsx`

**Currently static:** Nav items hardcoded. Admin name and email from Zustand store.

**What is dynamic already:** Admin name and email pulled from `useAuthStore` — shows real data after login.

**navItems array — current:**
```js
Dashboard    → /dashboard
Parking Area Approval → /zones
Vendors      → /vendors
Payment Summary → /settlements
Analytics    → /analytics
```

**To add new nav item later:**
Add object to `navItems` array with `label`, `path`, `icon`.
No other changes needed.

**Logout:** Calls `logout()` from authStore, navigates to `/login`.

### 6.3 Header
**File:** `src/components/layout/Header.jsx`

**Currently static:** Page titles hardcoded in `pageTitles` object keyed by pathname.

**To add title for new page:** Add entry to `pageTitles` object:
```js
'/new-page': { title: 'Page Title', subtitle: 'Page subtitle text' }
```

No API needed for header ever.

### 6.4 ProtectedRoute
**File:** `src/components/layout/ProtectedRoute.jsx`

Reads `isAuthenticated` from Zustand store.
If false → redirects to `/login`.
If true → renders children.

No changes needed when going dynamic. Works with real token automatically.

---

## 7. Pages — Module by Module

---

### 7.1 Dashboard Home
**File:** `src/pages/dashboard/DashboardHome.jsx`
**Route:** `/dashboard`

#### What It Does
Overview page. Shows platform health at a glance.
Stat cards, revenue chart, recent parking area submissions, top parking areas.

#### Components Inside This File
| Component | Purpose | Dynamic? |
|-----------|---------|----------|
| `StatCard` | Reusable stat card with icon, value, trend | Yes — values from API |
| Revenue Bar Chart | Stacked bar — last 7 days | Yes — data from API |
| Recent Parking Area Submissions | Last 4 parking area submissions | Yes — from API |
| Top Performing Parking Areas | Top 5 parking areas by revenue | Yes — from API |

#### Mock Data — What To Remove
```js
// REMOVE these arrays when going dynamic:
const stats = [...]           // Line ~8  — replace with API data
const recentZones = [...]     // Line ~35 — replace with API data
const topZones = [...]        // Line ~65 — replace with API data
const last7DaysRevenue = [...] // Line ~78 — replace with API data
```

#### Helper Functions — Keep These
```js
getZoneTypeBadge()   // Pure display logic, no data dependency
statusConfig         // Pure display config, no data dependency
```

#### How To Make Dynamic
```js
// Add Tanstack Query imports
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

// Replace mock data with:
const { data: dashboardData, isLoading } = useQuery({
  queryKey: ['dashboard-overview'],
  queryFn: () => api.get('/admin/dashboard/overview').then(r => r.data)
})

// Pass to components:
// dashboardData.stats → StatCards
// dashboardData.last7Days → Revenue Chart
// dashboardData.recentZones → Recent parking areas list
// dashboardData.topZones → Top parking areas list
```

#### APIs Required
```
GET /api/admin/dashboard/overview
Response: {
  stats: {
    revenueThisMonth: number,
    revenueChange: string,
    activeZones: number,
    newZonesThisWeek: number,
    sessionsToday: number,
    sessionChange: string,
    newVendorsThisWeek: number
  },
  last7Days: [
    { date: string, upi: number, cash: number, online: number, subscription: number }
  ],
  recentZones: [
    { id, name, owner, city, zone_type, has_marked_slots, submitted, status }
  ],
  topZones: [
    { name, city, revenue, sessions }
  ]
}
```

#### Loading State — Add When Dynamic
Wrap stat cards and chart in skeleton loaders.
shadcn `<Skeleton />` component already installed.

---

### 7.2 Parking Area Approval
**File:** `src/pages/zones/ZoneApproval.jsx`
**Route:** `/zones`

#### What It Does
Lists all submitted parking areas with search and filter.
Clicking any row or Review button opens right side detail panel.
Panel shows full parking area info, documents, feature flags.
Approve or reject with reason from panel.

#### Components Inside This File
| Component | Purpose | Dynamic? |
|-----------|---------|----------|
| `ZoneDetailPanel` | Right slide panel — full parking area details | Yes — zone data from API |
| `InfoRow` | Label/value row inside panel | No — display only |
| `Flag` | Feature flag row — yes/no display | No — display only |
| Main table | Paginated parking area list | Yes — data from API |
| Search input | Filters parking areas by name/owner/city | Param passed to API |
| Status select | Filters by PENDING/APPROVED/REJECTED | Param passed to API |
| Type select | Filters by ON_ROAD/OFF_ROAD | Param passed to API |

#### Mock Data — What To Remove
```js
// REMOVE this array:
const mockZones = [...]    // Line ~5 — replace with API data
```

#### Helper Functions — Keep These
```js
getZoneTypeBadge(zone_type, has_marked_slots)  // Keep — display only
statusConfig                                    // Keep — display only
```

#### Pagination
Uses `usePagination` hook from `src/hooks/usePagination.js`.
Currently paginates mock data locally — 10 items per page.

**When going dynamic:** Switch to server side pagination.
Pass `page` and `limit` to API. Use total count from response.
Update `usePagination` hook or replace with server pagination logic.

#### How To Make Dynamic
```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'

// Replace mockZones useState with:
const [page, setPage] = useState(1)

const { data, isLoading } = useQuery({
  queryKey: ['zones', search, statusFilter, typeFilter, page],
  queryFn: () => api.get('/admin/zones', {
    params: { search, status: statusFilter, type: typeFilter, page, limit: 10 }
  }).then(r => r.data)
})

// zones = data?.data
// total = data?.total

// Approve mutation:
const approveMutation = useMutation({
  mutationFn: (zoneId) => api.post(`/admin/zones/${zoneId}/approve`),
  onSuccess: () => queryClient.invalidateQueries(['zones'])
})

// Reject mutation:
const rejectMutation = useMutation({
  mutationFn: ({ zoneId, reason }) =>
    api.post(`/admin/zones/${zoneId}/reject`, { rejection_reason: reason }),
  onSuccess: () => queryClient.invalidateQueries(['zones'])
})
```

#### APIs Required
```
GET /api/admin/zones
Params:   { search?, status?, type?, page, limit }
Response: {
  data: Zone[],
  total: number,
  page: number,
  totalPages: number
}

Zone object: {
  id, name, owner, owner_phone, owner_email,
  city, state, address, zone_type, has_marked_slots,
  total_slots, payment_required, booking_enabled,
  subscription_enabled, default_hourly_rate,
  submitted, status, rejection_reason, documents
}

POST /api/admin/zones/:id/approve
Body:     {}
Response: { success: true, message: string }

POST /api/admin/zones/:id/reject
Body:     { rejection_reason: string }
Response: { success: true, message: string }
```

#### Important Notes
- `handleApprove` and `handleReject` currently update local state only
- When dynamic these call mutations which invalidate query and refetch
- `selectedZone` panel stays as local useState — no change needed
- Document view buttons currently have no action — connect to S3/Cloudflare URLs later

---

### 7.3 Vendor Management
**File:** `src/pages/vendors/VendorManagement.jsx`
**Route:** `/vendors`

#### What It Does
Lists all registered vendors with search and filter.
Clicking row opens right side detail panel.
Panel shows business details, bank info, KYC status, their parking areas.
Suspend or activate vendor account from panel.

#### Components Inside This File
| Component | Purpose | Dynamic? |
|-----------|---------|----------|
| `VendorDetailPanel` | Right slide panel — full vendor profile | Yes — vendor data from API |
| `InfoRow` | Label/value display row | No — display only |
| Main table | Paginated vendor list | Yes — data from API |
| Search input | Filter by name/phone/city/business | Param to API |
| KYC select | Filter by VERIFIED/PENDING/REJECTED | Param to API |
| Status select | Filter by ACTIVE/SUSPENDED | Param to API |

#### Mock Data — What To Remove
```js
// REMOVE this array:
const mockVendors = [...]    // Line ~5 — replace with API data
```

#### Helper Functions — Keep These
```js
kycConfig            // Keep — display only
accountConfig        // Keep — display only
zoneStatusConfig     // Keep — display only
businessTypeLabel    // Keep — display only
```

#### How To Make Dynamic
```js
const { data, isLoading } = useQuery({
  queryKey: ['vendors', search, kycFilter, statusFilter, page],
  queryFn: () => api.get('/admin/vendors', {
    params: { search, kyc_status: kycFilter, status: statusFilter, page, limit: 10 }
  }).then(r => r.data)
})

const toggleStatusMutation = useMutation({
  mutationFn: ({ vendorId, action }) =>
    api.post(`/admin/vendors/${vendorId}/${action}`),
    // action = 'suspend' or 'activate'
  onSuccess: () => queryClient.invalidateQueries(['vendors'])
})
```

#### APIs Required
```
GET /api/admin/vendors
Params:   { search?, kyc_status?, status?, page, limit }
Response: {
  data: Vendor[],
  total: number,
  page: number,
  totalPages: number
}

Vendor object: {
  id, name, email, phone, city, state,
  business_name, business_type, gst_number,
  kyc_status, account_status, zones_count,
  joined, zones: Zone[],
  bank_holder_name, bank_account_number, bank_ifsc
}

POST /api/admin/vendors/:id/suspend
Body:     {}
Response: { success: true }

POST /api/admin/vendors/:id/activate
Body:     {}
Response: { success: true }

GET /api/admin/vendors/:id/zones
Response: { zones: VendorZone[] }
```

#### Important Notes
- `handleToggleStatus` updates local state now — replace with mutation
- KYC document viewing not implemented — needs S3 document URLs from vendor_profiles table
- Bank details shown masked — `****4521` format handled by API, not frontend

---

### 7.4 Payment Summary
**File:** `src/pages/settlements/ManualSettlement.jsx`
**Route:** `/settlements`

#### What It Does
This is the most business-critical page.
Shows daily parking area wise payment summary cards.
Each card shows UPI/Cash/Online/Monthly Pass breakdown.
Shows service charge calculation and carry forward from previous day.
Admin marks a parking area as paid after manual bank transfer.
Exports to Excel for accounting.

#### This Page Is Different From Others
Payment summary is not a table — it is parking area cards.
Pagination shows 5 cards per page (cards are tall).
Date picker controls which day's payment summaries are shown.

#### Components Inside This File
| Component | Purpose | Dynamic? |
|-----------|---------|----------|
| `ZoneSettlementCard` | Full payment summary breakdown per parking area | Yes — data from API |
| `SummaryCard` | Top summary numbers | Yes — calculated from API data |
| `AmountRow` | Label/amount display row | No — display only |
| Date picker | Selects payment summary date | Param to API |
| Status filter | All/Pending/Settled | Param to API |
| Export button | Downloads Excel of current view | Works with dynamic data too |

#### Mock Data — What To Remove
```js
// REMOVE this array:
const mockDailySettlements = [...]    // Line ~5 — replace with API data
```

#### The Payment Summary Data Model
This page reads from `vendor_daily_settlements` table.
This table is filled manually by admin clicking "Mark as Settled".
In Phase 2 a cron job fills it automatically.

Each parking area card maps to one row in `vendor_daily_settlements`.

#### How To Make Dynamic
```js
const { data: settlements, isLoading } = useQuery({
  queryKey: ['settlements', selectedDate, statusFilter],
  queryFn: () => api.get('/admin/settlements/daily', {
    params: { date: selectedDate, status: statusFilter }
  }).then(r => r.data)
})

const settleMutation = useMutation({
  mutationFn: (settlementData) =>
    api.post('/admin/settlements/settle-zone', settlementData),
  onSuccess: () => queryClient.invalidateQueries(['settlements'])
})
```

#### What Happens When Mark as Settled Is Clicked
Two DB operations happen atomically on backend:
1. INSERT or UPDATE `vendor_daily_settlements` row with status = SETTLED
2. UPDATE all `payments` rows for that zone+date → settlement_status = SETTLED

Frontend sends all calculated numbers. Backend validates and saves.

#### APIs Required
```
GET /api/admin/settlements/daily
Params:   { date: 'YYYY-MM-DD', status?: 'PENDING' | 'SETTLED' | 'ALL' }
Response: {
  data: DailySettlement[],
  summary: {
    totalGross: number,
    totalCommission: number,
    totalPending: number,
    settledCount: number,
    pendingCount: number
  }
}

DailySettlement object: {
  zone_id, zone_name, owner_name, owner_phone, city,
  upi_amount, cash_amount, online_amount, subscription_amount,
  total_gross, upi_commission, cash_commission,
  total_commission, carry_forward_amount,
  vendor_payable, total_sessions, subscription_users,
  settlement_status, settled_at
}

POST /api/admin/settlements/settle-zone
Body: {
  zone_id: number,
  settlement_date: string,
  upi_amount: number,
  cash_amount: number,
  online_amount: number,
  subscription_amount: number,
  upi_commission: number,
  cash_commission: number,
  carry_forward_deducted: number,
  vendor_payable: number,
  total_gross: number,
  total_commission: number
}
Response: { success: true, settlement_id: number }
```

#### Excel Export
`handleExport` function uses xlsx + file-saver.
Works with both mock and real data — reads from `filtered` array.
No changes needed when going dynamic.
Filename includes selected date: `ypark_settlement_2026-04-25.xlsx`

Current frontend filename now uses: `ypark_payment_summary_2026-04-25.xlsx`

#### Important Notes
- Carry forward logic: yesterday's `cash_commission` deducted from today's `vendor_payable`
- Backend must check yesterday's row for carry forward — frontend displays what API sends
- `cash_commission_status` values: `CARRY_FORWARD` / `DEDUCTED` / `COLLECTED`
- Phase 2: cron job at 9PM auto-fills `vendor_daily_settlements` — this page UI never changes

---

### 7.5 Platform Analytics
**File:** `src/pages/analytics/PlatformAnalytics.jsx`
**Route:** `/analytics`

#### What It Does
Platform wide analytics with charts and breakdowns.
Date range filter — Today, This Week, This Month, Last 3 Months, Custom.
City filter — dynamic from available parking areas.
6 stat cards, revenue line chart, top parking areas bar, vehicle pie, city table, vendor growth bar.

#### Components Inside This File
| Component | Purpose | Dynamic? |
|-----------|---------|----------|
| `StatCard` | 6 platform stat cards | Yes — from API |
| Revenue Line Chart | Daily revenue by method | Yes — from API |
| Top Parking Areas Bar Chart | Horizontal bar — top 5 parking areas | Yes — from API |
| Vehicle Pie Chart | Parking visit split by vehicle type | Yes — from API |
| City Breakdown Table | Revenue per city with totals | Yes — from API |
| Vendor Growth Bar | Monthly new vendor count | Yes — from API |
| `CustomTooltip` | Chart tooltip — all line/bar charts | No — display only |
| `PieTooltip` | Chart tooltip — pie chart | No — display only |

#### Mock Data — What To Remove
```js
// REMOVE all these:
const dailyRevenue = [...]           // Line ~15
const topZones = [...]               // Line ~30
const vehicleDistribution = [...]    // Line ~40
const cityBreakdown = [...]          // Line ~50
const vendorGrowth = [...]           // Line ~65
```

#### Date Filter State
```js
dateFilter    // 'today' | 'week' | 'month' | '3months' | 'custom'
customFrom    // 'YYYY-MM-DD' — only used when dateFilter = 'custom'
customTo      // 'YYYY-MM-DD' — only used when dateFilter = 'custom'
cityFilter    // city name or 'ALL'
```

When dynamic — pass these as params to API. Chart data updates automatically.

#### How To Make Dynamic
```js
const { data: analyticsData, isLoading } = useQuery({
  queryKey: ['analytics', dateFilter, customFrom, customTo, cityFilter],
  queryFn: () => api.get('/admin/analytics', {
    params: {
      period: dateFilter,
      from: customFrom,
      to: customTo,
      city: cityFilter === 'ALL' ? undefined : cityFilter
    }
  }).then(r => r.data)
})
```

#### City Filter — Dynamic Population
Currently cities hardcoded from `cityBreakdown` array.
When dynamic:
```js
// Cities come from API response
const cities = useMemo(() => {
  return ['ALL', ...(analyticsData?.cityBreakdown?.map(c => c.city) || [])]
}, [analyticsData])
```

#### APIs Required
```
GET /api/admin/analytics
Params: {
  period: 'today' | 'week' | 'month' | '3months' | 'custom',
  from?: 'YYYY-MM-DD',   // only when period = custom
  to?: 'YYYY-MM-DD',     // only when period = custom
  city?: string          // omit for all cities
}
Response: {
  stats: {
    revenueThisMonth: number,
    sessionsThisMonth: number,
    platformCommission: number,
    activeZones: number,
    totalVendors: number,
    newCustomersThisWeek: number
  },
  dailyRevenue: [
    { date: string, upi: number, cash: number, online: number, subscription: number }
  ],
  topZones: [
    { name: string, revenue: number }
  ],
  vehicleDistribution: [
    { name: string, value: number, color: string }
  ],
  cityBreakdown: [
    { city: string, zones: number, sessions: number, revenue: number, commission: number }
  ],
  vendorGrowth: [
    { month: string, vendors: number }
  ]
}
```

#### Important Notes
- Chart colors are hardcoded in component — `#1565C0`, `#2E7D32`, `#00BCD4`, `#7B1FA2`
- These never change — do not move to API
- `vehicleDistribution` color field from API should match these exact values
- Custom date range: Apply button triggers new query — both dates must be filled

---

### 7.6 Login Page
**File:** `src/pages/auth/LoginPage.jsx`
**Route:** `/login` (public)

#### What It Does
Admin login with email and password.
Shows loading spinner during auth.
Shows error message on invalid credentials.
On success stores admin data in Zustand and redirects to `/dashboard`.

#### Mock Credentials — What To Remove
```js
// REMOVE this entire constant:
const MOCK_ADMIN = {
  email: 'admin@ypark.in',
  password: 'admin123',
  data: { id: 1, name: 'Super Admin', email: 'admin@ypark.in', role: 'SUPER_ADMIN' },
  token: 'mock-jwt-token-ypark-admin',
}

// REMOVE this mock validation block:
await new Promise((resolve) => setTimeout(resolve, 800))
if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
  login(MOCK_ADMIN.data, MOCK_ADMIN.token)
  navigate('/dashboard')
} else {
  setError('Invalid email or password')
}
```

#### Replace With Real API Call
```js
try {
  const response = await api.post('/admin/auth/login', { email, password })
  login(response.data.admin, response.data.token)
  navigate('/dashboard')
} catch (err) {
  setError(err.response?.data?.message || 'Invalid email or password')
}
```

---

## 8. Shared Components

### 8.1 Pagination
**File:** `src/components/ui/Pagination.jsx`

Reusable across all pages. Shows "Showing X to Y of Z results" and page number buttons.
Handles ellipsis for large page counts automatically.

**Props:**
```js
currentPage   // number — current active page
totalPages    // number — total number of pages
totalItems    // number — total record count
itemsPerPage  // number — records per page
onPageChange  // function — called with new page number
```

**Used in:**
- Parking Area Approval — 10 items per page
- Vendor Management — 10 items per page
- Payment Summary — 5 cards per page

**When going server side pagination:**
Replace `usePagination` hook usage with server response values.
`Pagination` component itself never changes.

### 8.2 usePagination Hook
**File:** `src/hooks/usePagination.js`

Takes full data array and items per page.
Returns `paginatedData` (sliced array), page controls, and `resetPage` function.

**When going dynamic:** This hook is used for client side pagination with mock data.
When API returns paginated data — stop using this hook.
Instead use page state directly and pass API response values to `<Pagination />`.

---

## 9. State Management

### Global State — Zustand
Only auth state is global. Everything else is local component state.

```
useAuthStore
├── admin         → logged in admin object
├── token         → JWT token for API calls
├── isAuthenticated → boolean — used by ProtectedRoute
├── login()       → called on successful login
└── logout()      → called on logout button, clears everything
```

Persisted to localStorage as `ypark-admin-auth`.
On page refresh — state restored from localStorage automatically.
Token expiry not handled yet — add interceptor response handler for 401.

### Local State — Per Page
Each page manages its own state. No cross-page state sharing needed.

```
ZoneApproval
├── zones          → array (replace with useQuery when dynamic)
├── search         → string — search input value
├── statusFilter   → string — dropdown value
├── typeFilter     → string — dropdown value
└── selectedZone   → object | null — detail panel

VendorManagement
├── vendors        → array (replace with useQuery when dynamic)
├── search         → string
├── kycFilter      → string
├── statusFilter   → string
└── selectedVendor → object | null

ManualSettlement
├── settlements    → array (replace with useQuery when dynamic)
├── selectedDate   → string 'YYYY-MM-DD'
└── statusFilter   → string

PlatformAnalytics
├── dateFilter     → string
├── customFrom     → string
├── customTo       → string
└── cityFilter     → string
```

---

## 10. API Connection Guide

### Step by Step — How To Connect Each Page

**Step 1 — Create API service file**
```js
// src/services/api.js
import axios from 'axios'
import useAuthStore from '@/store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
```

**Step 2 — Connect login first**
Test that token is saved and header is sent.

**Step 3 — Connect dashboard overview**
Simplest read-only endpoint. Good first test.

**Step 4 — Connect parking area approval**
List + approve + reject. Tests mutations.

**Step 5 — Connect vendor management**
List + suspend/activate. Similar to parking areas.

**Step 6 — Connect payment summary**
Most complex. Test carry forward logic carefully.

**Step 7 — Connect analytics**
Read-only but complex response shape.

### Tanstack Query Setup — Already Done
`QueryClient` is already configured in `main.jsx`.
`defaultOptions` set — retry once, no refetch on window focus.
Just import `useQuery` and `useMutation` in each page file.

---

## 11. Color System

All colors defined as CSS variables in `src/index.css`.
Tailwind config maps these variables to utility classes.

### Brand Colors (use these everywhere)
```
#0D1B2A    → Dark Background — sidebar, login page
#132236    → Dark Card — sidebar items
#1A3048    → Dark Border — sidebar separators
#1565C0    → Primary Blue — buttons, active states, links
#0D47A1    → Primary Blue Dark — hover states
#77A7DF    → Primary Light — subtle highlights
#00BCD4    → Accent Cyan — accent badges, online payment
#F0F4F8    → Light Background — page background
#FFFFFF    → White — cards, panels
#D1D5DC    → Border — card borders, input borders
#1A2332    → Text Heading — all headings
#2C3E50    → Text Body — body text
#506A84    → Text Subtext — labels, secondary text
#8BA8C8    → Card Text — sidebar nav items inactive
```

### Semantic Colors
```
#2E7D32    → Success Green — approved, active, verified
#F57F17    → Warning Orange — pending, carry forward
#C0392B    → Danger Red — rejected, suspended, error
#7B1FA2    → Purple — monthly pass only
```

---

## 12. What Is Mock vs Dynamic

### Currently Mock (needs API later)
| Location | What Is Mock | Replace With |
|----------|-------------|--------------|
| `LoginPage.jsx` | MOCK_ADMIN credentials | POST /admin/auth/login |
| `DashboardHome.jsx` | stats, recentZones, topZones, last7DaysRevenue | GET /admin/dashboard/overview |
| `ZoneApproval.jsx` | mockZones array | GET /admin/zones |
| `ZoneApproval.jsx` | handleApprove, handleReject (local state) | POST /admin/zones/:id/approve and reject |
| `VendorManagement.jsx` | mockVendors array | GET /admin/vendors |
| `VendorManagement.jsx` | handleToggleStatus (local state) | POST /admin/vendors/:id/suspend or activate |
| `ManualSettlement.jsx` | mockDailySettlements array | GET /admin/settlements/daily |
| `ManualSettlement.jsx` | handleSettle (local state) | POST /admin/settlements/settle-zone |
| `PlatformAnalytics.jsx` | all 5 data arrays | GET /admin/analytics |

### Already Dynamic (works with real data now)
| Location | What Works Now |
|----------|---------------|
| `Sidebar.jsx` | Admin name and email from authStore |
| `Header.jsx` | Page title changes per route |
| `ProtectedRoute.jsx` | Auth check from authStore |
| `Pagination.jsx` | Works with any data array |
| `usePagination.js` | Works with any data array |
| All filter/search inputs | State wired — just needs real data |
| Excel export | Works with any data — mock or real |
| Zone type badges | Pure display logic |
| Status badges | Pure display logic |

---

## 13. Phase 2 — What Comes Next

### Customer Management Page
**File:** `src/pages/customers/CustomerManagement.jsx` — exists but hidden
**When to build:** After customer mobile app is built and `customer_profiles` table has data
**What to add to nav:** Add back to `navItems` in `Sidebar.jsx`
**Data needed:** Customer profiles, parking visit history, saved vehicles

### Notification System
**When to build:** When Express API has webhook events for parking area submissions, vendor registrations
**What to add:** Bell icon in Header, notifications dropdown, unread count badge
**DB needed:** notifications table per admin user

### Sub Admin Management
**When to build:** Phase 3 — when team grows
**What to add:** New page `/sub-admins`, create/suspend sub admin accounts, audit logs

### Org Admin Dashboard
**When to build:** Phase 3 — when first paying org client signs up
**Approach:** Separate route group `/org/*` with scoped data
**Key rule:** Org admin sees only parking areas where `owner_id` matches their account

### Automated Payment Summary — Phase 2
**What changes in frontend:** Nothing — zero UI changes
**What changes in backend:** Cron job at 9PM fills `vendor_daily_settlements` automatically
**vendor_daily_settlements table:** Already designed — same structure Phase 1 uses manually

### PDF Export
**When needed:** Government bodies need PDF reports for audit
**Add to:** Payment Summary page and Analytics page
**Library to use:** `@react-pdf/renderer` or server side PDF generation

---

*YPark Admin Panel — FRONTEND_GUIDE.md | Version 1.0 | Phase 1 | April 2026*
*Update this document whenever a new page is added or an API is connected.*