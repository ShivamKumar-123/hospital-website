# Saubhagyam Hospital — Premium Hospital Management Website

A fully responsive, modern Hospital Management Website with an advanced Admin Dashboard, built with **React + Vite + Tailwind CSS + JavaScript**. Uses **LocalStorage** as a fake backend — no API required.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Admin login

- **URL:** `/login`
- **Email:** `admin@hospital.com`
- **Password:** `admin123`

After login you'll be redirected to `/admin` (the dashboard).

## What's included

### Public website (10 pages)
1. **Home** — hero, stats, departments, doctors, packages, ambulance CTA, testimonials slider
2. **About** — mission, vision, leadership, timeline, achievements
3. **Departments** — 10 specialties with search
4. **Doctors** — profile cards, filter by department, social links, book CTA
5. **Appointment** — booking form with validation, saves to localStorage, success toast
6. **Packages** — pricing cards for 6 health packages
7. **Ambulance** — emergency CTA, request form, live emergency list
8. **Blog** — articles with search and category filter
9. **Gallery** — masonry grid with lightbox
10. **Contact** — form, embedded map, hours and socials

### Auth
- Fake auth via localStorage
- Protected dashboard routes
- Logout from sidebar

### Admin dashboard (10 sections)
1. **Overview** — counters, bar/line/pie charts, recent activity
2. **Appointments** — full CRUD, approve/reject, status filter, CSV export, pagination
3. **Patients** — CRUD, photo upload (base64), profile modal, medical history
4. **Doctors** — CRUD grid, photo upload, department & availability
5. **Departments** — CRUD with image, doctor count
6. **Ambulance** — request CRUD, inline status, driver/vehicle, CSV export
7. **Blogs** — full CRUD with thumbnail upload
8. **Testimonials** — add/approve/reject/delete
9. **Notifications** — emergency/appointment/patient alerts, mark read, bulk actions
10. **Settings** — hospital identity, contact, emergency, socials, theme color, logo upload

### UI/UX
- Blue/white/cyan medical theme with gradients
- Glassmorphism cards, soft shadows, sticky navbar, animated sidebar
- Framer Motion animations and counters
- Toast notifications, modal popups, confirm dialogs
- Loading skeletons, empty states, scroll-to-top
- Mobile sidebar toggle, fully responsive grids and tables

### Extras
- Search, filters, pagination, CSV export
- Form validation and error handling
- Lazy-loaded routes (code splitting)
- Reusable hooks (`useLocalCollection`, `useCountUp`)

## Folder structure

```
src/
 ├── components/          shared & UI primitives
 │   ├── public/          Navbar, Footer
 │   ├── dashboard/       Sidebar, Topbar
 │   └── ui/              Modal, ConfirmDialog, Toast, EmptyState, Skeleton, Pagination, ScrollToTop, StatusBadge
 ├── pages/
 │   ├── public/          10 public pages
 │   ├── auth/            Login
 │   └── admin/           10 dashboard pages
 ├── layouts/             PublicLayout, DashboardLayout
 ├── routes/              ProtectedRoute
 ├── hooks/               useLocalCollection, useCountUp
 ├── context/             Auth, Settings, Toast
 ├── utils/               storage, seed, format
 └── data/                (seed data lives in utils/seed.js)
```

## LocalStorage keys

All data is namespaced with `medicare:` and seeded on first load:

- `medicare:users` — admin accounts
- `medicare:settings` — hospital identity & theme
- `medicare:patients`
- `medicare:doctors`
- `medicare:departments`
- `medicare:appointments`
- `medicare:ambulance`
- `medicare:blogs`
- `medicare:testimonials`
- `medicare:notifications`
- `medicare:session` — current login

### Utility helpers (`src/utils/storage.js`)

```js
getData(key, fallback)        // read
saveData(key, value)          // overwrite
addRecord(key, record)        // push with uuid + createdAt
updateRecord(key, id, patch)  // partial update
deleteRecord(key, id)         // remove
exportCSV(rows, filename)     // download CSV
clearAll()                    // reset everything
```

To **reset all data**, run in your browser console:
```js
Object.keys(localStorage).filter(k => k.startsWith('medicare:')).forEach(k => localStorage.removeItem(k))
location.reload()
```

## Build for production

```bash
npm run build
npm run preview
```

The build is fully static — deploy to Vercel, Netlify, GitHub Pages or any CDN.

## Tech stack

| Concern         | Library                  |
|-----------------|--------------------------|
| Framework       | React 18 + Vite          |
| Styling         | Tailwind CSS             |
| Routing         | react-router-dom v6      |
| Icons           | react-icons              |
| Animation       | framer-motion            |
| Charts          | recharts                 |
| State           | React Context + Hooks    |
| Backend         | LocalStorage (simulated) |
