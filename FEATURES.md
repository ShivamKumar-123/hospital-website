# MediCare+ — Complete Feature List

A premium Hospital Management Website built with **React 18 + Vite + Tailwind CSS**. Uses **LocalStorage** as a fake backend — no API/server required.

---

## 1. Public Website (10 pages)

### 1.1 Home (`/`)
- Multi-slide immersive hero with auto-rotation, gradient overlays and slide indicators
- Animated stat counters (`useCountUp`)
- Trust badges row (JCI, NABH, ISO, AHA, NABL)
- Departments preview grid
- Featured doctors strip
- Featured health packages (₹) with "Popular" tag
- Ambulance emergency CTA section
- Testimonials slider with dot indicators
- Animated background blobs and mesh gradients

### 1.2 About (`/about`)
- Mission, Vision, Values bento cards
- Animated timeline (2006 → 2024)
- Leadership cards (CEO, CMO, Director)
- Achievements stats (awards, accreditations, satisfaction)
- Wave dividers between sections

### 1.3 Departments (`/departments`)
- 10 medical specialties with image, description and availability
- Live search filter
- Hover-tilt card animations
- Doctor count per department

### 1.4 Doctors (`/doctors`)
- Doctor profile cards (photo, qualification, experience, status)
- Filter by department + live search
- Social media links (Twitter, LinkedIn)
- "Book appointment" CTA per doctor
- Available / On Leave status chips

### 1.5 Appointment (`/appointment`)
- Multi-field booking form (patient, phone, email, department, doctor, date, time, symptoms)
- Department → doctor cascade dropdown
- Inline validation (email, phone, required fields)
- Saves to LocalStorage + pushes a notification
- Success toast confirmation
- Auto-fill from logged-in patient account

### 1.6 Packages (`/packages`)
- 6 health-checkup packages (Full Body, Diabetes, Heart, Women, Senior, Executive)
- INR pricing with `en-IN` formatting (₹999 – ₹6,999)
- "Popular" highlight ring on the Heart package
- Feature checklist per package
- Hover-tilt card animations

### 1.7 Ambulance (`/ambulance`)
- Emergency phone CTA (one-tap dial)
- Live ambulance request form (requester, phone, pickup, destination, condition)
- Live emergency case list with status
- Wave divider hero
- Pushes "emergency" notification on submit

### 1.8 Blog (`/blog`)
- Featured article (large card)
- Article grid with category chips and excerpts
- Live search + category filter dropdown
- Broken-image fallback (gradient placeholder)
- Equal-height cards across the grid

### 1.9 Gallery (`/gallery`)
- Masonry image grid (varying heights)
- Click-to-open lightbox with Framer Motion fade
- Lazy-loaded images

### 1.10 Contact (`/contact`)
- Contact form (name, email, subject, message) with toast confirmation
- Embedded location map
- Phone, email, hours and address cards
- Social media links (Facebook, Twitter, Instagram, LinkedIn)

---

## 2. Authentication

### 2.1 Admin auth
- URL: `/login`
- Default credentials seeded via `.env` or fallback (`admin@hospital.com` / `admin123`)
- Auto-redirect to `/admin` on success

### 2.2 Patient auth
- Patient login at `/account/login`
- Patient registration at `/account/register` with password strength meter
- Demo patient seeded (`patient@hospital.com` / `patient123`)

### 2.3 Session & guards
- Session persisted in `localStorage` under `medicare:session`
- `ProtectedRoute` guard with role-based access (`admin` / `patient`)
- Wrong-role users are auto-redirected to their own space
- Logged-out users land on the role-appropriate login page

---

## 3. Patient Dashboard (`/account`)

- Personal profile (name, email, phone) — editable in place
- Tabbed UI (Overview / Profile / Appointments)
- Personal appointment history pulled from LocalStorage
- Quick-book CTA → public appointment page
- Avatar with initial-based fallback

---

## 4. Admin Dashboard (`/admin`)

### 4.1 Overview (`/admin`)
- 4 animated stat cards (Patients, Doctors, Appointments, Revenue ₹)
- Area chart — appointments by month (last 12 months)
- Pie chart — department share
- Bar chart — annual revenue
- Live activity feed (recent notifications)
- Bottom strip — emergencies, pending approvals, on-duty doctors

### 4.2 Appointments (`/admin/appointments`)
- Full CRUD (create, edit, delete)
- Approve / Reject / Mark Completed actions
- Status filter (All / Pending / Approved / Completed)
- Search by patient or doctor
- Pagination
- CSV export

### 4.3 Patients (`/admin/patients`)
- Full CRUD with photo upload (base64)
- Patient profile modal (age, gender, blood group, condition, medical history)
- Search & pagination
- Empty-state graphics

### 4.4 Doctors (`/admin/doctors`)
- Grid layout with profile photos (base64 upload)
- Department + availability + status fields
- Full CRUD
- Search & filter

### 4.5 Departments (`/admin/departments`)
- Image upload (base64) per department
- Doctor count, availability label
- Full CRUD

### 4.6 Ambulance (`/admin/ambulance`)
- Request CRUD
- Inline status switching (Pending / Dispatched / Completed)
- Driver and vehicle assignment
- CSV export

### 4.7 Blogs (`/admin/blogs`)
- Article CRUD with thumbnail upload, category, author, excerpt, content
- Live preview thumbnails in the table

### 4.8 Testimonials (`/admin/testimonials`)
- Add / approve / reject / delete patient testimonials
- 5-star rating display
- Photo avatars

### 4.9 Notifications (`/admin/notifications`)
- Emergency / appointment / patient alert types
- Mark-as-read and bulk actions
- Unread counter in title
- Filter chips

### 4.10 Settings (`/admin/settings`)
- Hospital identity (name, tagline, logo upload)
- Contact details (address, phone, email, hours)
- Emergency hotline number
- Social media links
- Theme primary color picker

---

## 5. UI / UX

### 5.1 Design system
- Custom Tailwind palette (`brand` cyan, `violet`, `ink`)
- Three font families (Inter, Plus Jakarta Sans, JetBrains Mono)
- Hero & display font-size clamps for fluid typography
- Glassmorphism cards, soft shadows, glow shadows
- Gradient mesh & grid backgrounds

### 5.2 Theming
- Light & Dark mode with toggle in navbar
- Auto-detects OS preference until user overrides
- Theme applied **before** React mounts (inline script in `index.html`) → no flash
- `<meta name="theme-color">` synced with chosen theme

### 5.3 Animations
- Framer Motion route transitions
- Reveal-on-scroll components (`Reveal`, `Stagger`, `Item`)
- 3D tilt cards (`Tilt`)
- Magnetic hover effect (`Magnetic`)
- Animated background blobs with orbit keyframes
- Marquee strips, shimmer effects, sonar ripples
- Heartbeat-pulse logo on the preloader

### 5.4 Pre-loader
- Fully inline HTML/CSS pre-loader (zero JS deps)
- Mesh gradient, dot grid pulse, 4 orbiting blobs
- Floating particles, aurora sweep
- Sonar ripples + conic aurora ring + orbiting dots
- Animated MediCare+ wordmark with shimmer
- Smooth fade-out once React mounts

### 5.5 Components
- Modal, ConfirmDialog, Toast (Framer Motion)
- EmptyState, Skeleton loaders
- Pagination, StatusBadge, ScrollToTop
- WaveDivider (top/bottom), Loader
- ThemeToggle (sun/moon icon)

### 5.6 Responsiveness
- Fully responsive grids and tables
- Mobile sidebar drawer with backdrop
- Mobile navbar with sheet menu
- Touch-friendly tap targets

---

## 6. State & Data Layer

### 6.1 LocalStorage fake backend
- Namespaced under `medicare:` prefix
- Tiny CRUD wrapper (`getData`, `saveData`, `addRecord`, `updateRecord`, `deleteRecord`)
- Custom `medicare:change` event for same-tab live updates
- Native `storage` event for cross-tab sync
- CSV export utility
- Auto-seeded collections on first load

### 6.2 React Contexts
- **AuthContext** — login, register, updateProfile, logout, role checks
- **SettingsContext** — hospital identity & branding (live-bound to admin Settings page)
- **ThemeContext** — light/dark mode with OS preference detection
- **ToastContext** — global toast queue with Framer Motion animations

### 6.3 Custom Hooks
- `useLocalCollection(key)` — reactive list with add/update/remove + cross-tab sync
- `useCountUp(target, duration)` — eased number-counter animation
- `useSeo({...})` — per-page meta, OG, Twitter, canonical, JSON-LD

### 6.4 Seeded data
- 10 departments, 10 doctors, 4 patients
- 3 appointments, 1 ambulance request
- 3 blogs, 3 testimonials, 3 notifications
- Admin + demo-patient user accounts
- Default hospital settings & theme color

---

## 7. SEO

- Per-page titles, descriptions, keywords (live-updated on route change)
- Canonical URLs and Open Graph tags (`og:title`, `og:image`, `og:url`, `og:type`, `og:site_name`)
- Twitter card tags (`summary_large_image`)
- JSON-LD structured data:
  - **Hospital** schema (address, phone, hours, specialties, sameAs)
  - **WebSite** schema with `SearchAction` for sitelinks search
- `robots.txt` (allows public, disallows `/admin`, `/login`, `/account`)
- `sitemap.xml` (10 public URLs with priority & changefreq)
- `noindex` opt-in for sensitive pages
- Configurable site URL via `VITE_SITE_URL`

---

## 8. Performance

- Lazy-loaded routes via `React.lazy` + `Suspense` (per-page code splitting)
- Image `loading="lazy"` on heavy assets
- `requestAnimationFrame`-based count-up animations
- Pre-rendered theme to prevent FOUC
- `onError` fallback for broken external images (gradient placeholder)
- Single shared chart library (recharts) for all dashboards

---

## 9. Forms & Validation

- Inline error messages (no extra deps — pure React state)
- Email + phone regex validation
- Required field checks
- Password strength meter with 4-bar visualization
- Disabled submit buttons during processing
- Toast success/error feedback on every form

---

## 10. Extras

- **Currency** — Indian Rupee (₹) with `en-IN` lakh/crore grouping
- **CSV export** — Appointments and Ambulance pages
- **Image upload** — base64-encoded for patients, doctors, departments, blogs, settings logo
- **Search & filters** — present on every list page (departments, doctors, blogs, appointments, etc.)
- **Pagination** — admin tables auto-paginate at 10 rows
- **Confirm dialogs** — destructive actions are guarded
- **Reset data** — single-line console command resets everything
- **No backend required** — fully static; deploy to any CDN (Vercel, Netlify, GitHub Pages)

---

## 11. Tech Stack

| Concern        | Library                  |
|----------------|--------------------------|
| Framework      | React 18 + Vite 5        |
| Styling        | Tailwind CSS 3           |
| Routing        | react-router-dom v6      |
| Icons          | lucide-react             |
| Animation      | framer-motion            |
| Charts         | recharts + chart.js      |
| State          | React Context + Hooks    |
| Backend        | LocalStorage (simulated) |
| Build          | Vite (ES modules)        |

---

## 12. Total page count

- **10 public pages** + **3 account pages** + **10 admin pages** + **2 auth pages** = **25 routes**
- **~30 reusable components** (UI primitives + animations + dashboard widgets)
- **4 context providers** + **3 custom hooks**
- **10 LocalStorage collections** with full CRUD
