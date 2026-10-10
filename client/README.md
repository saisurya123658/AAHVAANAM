# AAHVAANAM – LUXURY ROOMS (Kurnool City)

> **Official Hospitality Booking & Management Platform**  
> Location: Opposite Kurnool New Bus Stand, Kurnool City, Andhra Pradesh, India  
> Reception Desk: `+91 96402 89999` • WhatsApp: `+91 96402 89999`  
> Tagline: *"Stay • Comfort • Feel at Home"*

---

## 1. Project Overview

**AAHVAANAM – LUXURY ROOMS** is a full-stack MERN hotel booking and lodge management platform inspired by the authentic royal maroon, burgundy, gold, cream, and white visual identity of Aahvaanam Lodge in Kurnool.

The platform provides two major systems:
1. **Public Guest Experience**:
   - Cinematic hero section with real property photos and live search widget.
   - Real-time MongoDB room availability search (strict date overlap logic).
   - Multi-step booking stepper (Dates ➔ Room Selection ➔ Guest Details ➔ Summary Review ➔ Confirmation).
   - Printable luxury reservation voucher with instant WhatsApp and Phone triggers.
   - Reservation lookup (`/booking/:reference`) to track live reservation status.
   - Categorized photo gallery with fullscreen lightbox and zoom (`/gallery`).
   - Landmark showcase and direct Google Maps directions (`/location`).
   - Direct inquiry and contact message form (`/contact`).
   - Sticky mobile action bar with large touch targets (`CALL`, `WHATSAPP`, `BOOK NOW`).

2. **Admin Management Dashboard**:
   - Secure JWT authentication with HTTP-only cookies and RBAC (`SUPER_ADMIN`, `ADMIN`, `STAFF`).
   - Real-time KPI statistics (Total bookings, today's check-ins, check-outs, pending, confirmed, available rooms, occupied rooms, maintenance rooms).
   - Visual Room Matrix (with interactive date-picker to view room occupancy on any date).
   - Status workflow transitions: `PENDING` ➔ `CONFIRMED` ➔ `CHECKED_IN` ➔ `CHECKED_OUT` and cancellation handling.
   - Room management with configurable prices or "Contact for Price" fallback.
   - Customer directory and guest stay history.
   - Gallery manager, contact enquiry manager, and audit activity logging.
   - Live hotel configuration without modifying code.

---

## 2. Technology Stack

### Frontend (`/client`)
- **React 18** with **TypeScript** & **Vite**
- **Tailwind CSS** with custom luxury Indian hospitality palette (`--primary: #5A0710`, `--gold: #D4A72C`, `--cream: #FFF8E7`)
- **React Router v6** for nested public and admin route layouts
- **TanStack Query (React Query)** for efficient caching and stale-while-revalidate data fetching
- **React Hook Form** + **Zod** for typed form validation
- **Lucide React** icons
- **Framer Motion** & custom transitions with `prefers-reduced-motion` support

### Backend (`/server`)
- **Node.js** & **Express** with **TypeScript**
- **MongoDB** & **Mongoose ODM**
- **JWT** (JSON Web Tokens) with HTTP-only cookies and Bearer fallback
- **bcryptjs** (12 salt rounds) for password hashing
- **Zod** schema validation middleware
- **Helmet**, **CORS**, and **express-rate-limit**
- Pluggable **NotificationService** abstraction (ready for WhatsApp Business API, SMS gateways, and Email)
- Atomic availability verification to prevent double bookings

---

## 3. Architecture & Directory Structure

```
lodge/
├── client/
│   ├── public/
│   │   ├── images/
│   │   │   ├── rooms/        # Authentic cropped high-res room photos
│   │   │   └── aahvaanam-poster.png
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── api/              # Axios instance and typed requests
│   │   ├── components/
│   │   │   └── common/       # Navbar, Footer, MobileActionBar, SearchWidget, Lightbox, ConfirmModal
│   │   ├── hooks/            # useAuth, useSettings
│   │   ├── layouts/          # PublicLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── public/       # Home, Rooms, RoomDetail, Booking, Success, Status, Gallery, About, Location, Contact
│   │   │   └── admin/        # Dashboard, Bookings, Rooms, Customers, Gallery, Enquiries, Settings, Users, AuditLogs
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── config/           # DB connection & environment variables
│   │   ├── controllers/      # Auth, Rooms, Availability, Bookings, Customers, Gallery, Enquiries, Settings, Admin
│   │   ├── middleware/       # requireAuth, requireAdmin, requireSuperAdmin, rateLimiter, errorHandler, validate
│   │   ├── models/           # Admin, Room, Booking, Customer, Gallery, Enquiry, Settings, AuditLog
│   │   ├── routes/           # REST endpoint routers
│   │   ├── services/         # availability.service, booking.service, notification.service, audit.service
│   │   ├── utils/            # Reference generator (AAH-2026-XXXX), date calculations
│   │   ├── validators/       # Zod schemas
│   │   ├── app.ts            # Express app configuration
│   │   └── server.ts         # Bootstrap entry
│   ├── scripts/
│   │   ├── seed.ts           # Database initialization and demo inventory seed
│   │   └── create-admin.ts   # Interactive CLI for creating admin users
│   ├── tsconfig.json
│   └── package.json
│
├── package.json              # Root orchestration
└── README.md
```

---

## 4. Availability Engine & Date Overlap Logic

A physical room cannot be double-booked. When searching or creating a booking, the engine evaluates:

```
existingCheckIn < requestedCheckOut
AND
existingCheckOut > requestedCheckIn
```

- If room `101` is reserved from **10 Sept → 12 Sept**:
  - Searching **11 Sept → 13 Sept** is **blocked** (`10 < 13` and `12 > 11`).
  - Searching **12 Sept → 15 Sept** is **available** (guest departs on the 12th; check-in begins at 12:00 PM).
- Cancelled reservations (`status: 'CANCELLED'`) do not block inventory.
- Right before `POST /api/bookings` commits to the database, a final atomic availability check prevents race conditions.

---

## 5. Quick Start & Installation

### Prerequisites
- **Node.js**: v18+ (Tested on v22)
- **MongoDB**: Community Server running locally or MongoDB Atlas URI

### 1. Setup Environment Variables
In `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/aahvaanam
JWT_SECRET=aahvaanam_luxury_rooms_jwt_secret_key_2026_kurnool
JWT_EXPIRES_IN=8h
CLIENT_URL=http://localhost:5173

# Optional Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 2. Install Dependencies
```bash
# In project root:
npm run install:all
```

### 3. Seed Database with Authentic Inventory
```bash
npm run seed
```
This populates:
- **Super Admin Account**:
  - Email: `admin@aahvaanam.com`
  - Password: `AahvaanamAdmin2026!`
- **5 Physical Rooms** (Deluxe AC Rooms, Premium AC Suites, Family Rooms) with authentic cropped photos.
- **Official Hotel Settings** (Opp: Kurnool New Bus Stand, `+91 96402 89999`, check-in/out policies).
- **Categorized Photo Gallery** items.
- **Sample Reservations & Audit Logs** for dashboard preview.

### 4. Create Custom Admin User (Optional)
```bash
npm run create-admin
```
Prompts interactively for admin name, email, password, and role (`SUPER_ADMIN`, `ADMIN`, `STAFF`).

### 5. Run Development Servers
```bash
# Runs both Server (port 5000) and Client (port 5173) concurrently:
npm run dev
```

- **Public Website**: [http://localhost:5173](http://localhost:5173)
- **Admin Portal**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 6. REST API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/admin/login` | Public | Admin login with HTTP-only cookie + token return |
| `POST` | `/api/auth/admin/logout` | Public | Clears session cookie |
| `GET` | `/api/auth/admin/me` | Authenticated | Current admin profile and role |
| `GET` | `/api/rooms` | Public | List rooms (filterable by roomType & status) |
| `GET` | `/api/rooms/:id` | Public | Room details and amenities |
| `GET` | `/api/availability` | Public | Real-time availability check for dates & guests |
| `GET` | `/api/availability/grid` | Authenticated | Room inventory status matrix for any date |
| `POST` | `/api/bookings` | Public (Rate-limited) | Submit booking request |
| `GET` | `/api/bookings/:id` | Public | Retrieve reservation by ID |
| `GET` | `/api/bookings/ref/:reference` | Public | Retrieve reservation by booking reference |
| `GET` | `/api/admin/bookings` | Admin / Staff | Paginated bookings with search and filter |
| `PATCH` | `/api/admin/bookings/:id/status` | Admin / Staff | Transition booking status with audit trail |
| `DELETE` | `/api/admin/bookings/:id` | Admin | Delete booking record |
| `POST` | `/api/rooms` | Admin | Create physical room |
| `PUT` | `/api/rooms/:id` | Admin | Update room details, price, or maintenance |
| `DELETE` | `/api/rooms/:id` | Admin | Delete physical room |
| `GET` | `/api/gallery` | Public | Categorized gallery photos |
| `POST` | `/api/admin/gallery` | Admin | Add photo to gallery |
| `DELETE` | `/api/admin/gallery/:id` | Admin | Remove photo from gallery |
| `POST` | `/api/enquiries` | Public (Rate-limited) | Submit contact enquiry |
| `GET` | `/api/admin/enquiries` | Admin | View contact enquiries |
| `PATCH` | `/api/admin/enquiries/:id` | Admin | Mark contacted or closed |
| `GET` | `/api/settings` | Public | Retrieve hotel settings |
| `PUT` | `/api/admin/settings` | Admin | Update hotel settings |
| `GET` | `/api/admin/dashboard/stats` | Admin | Comprehensive KPIs, trends, and occupancy |
| `GET` | `/api/admin/admins` | Super Admin | Manage admin accounts |
| `POST` | `/api/admin/admins` | Super Admin | Create new admin account |
| `GET` | `/api/admin/audit-logs` | Admin | Chronological staff audit feed |

---

## 7. Production Build & Deployment

To compile and produce optimized production artifacts:
```bash
# Build both frontend and backend:
npm run build

# Start production server:
npm start
```
The client build output is in `client/dist/` and backend compiled code is in `server/dist/`.

---

## 8. Verified Hotel Information
- **Hotel**: AAHVAANAM – LUXURY ROOMS
- **Location**: Opposite Kurnool New Bus Stand, Kurnool City, Andhra Pradesh 518003
- **Contact**: +91 96402 89999
- **Key Amenities**: A/C Rooms, High-Speed WiFi, RO Purified Drinking Water, Lift Facility to All Floors, 24-Hour Hot Water Supply, Daily Sanitization.
