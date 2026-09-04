# Orbitly Studio

Orbitly Studio is a full-stack digital product and design studio web platform built with Next.js, Express, TypeScript, and MongoDB. The platform features an agency portfolio showcasing case studies and engineering notes, paired with a protected administrative dashboard featuring a TipTap rich text editor, JWT authentication, role-based access control, and API security hardening.

---

## Overview

Orbitly Studio bridges client-facing presentation and administrative content management:
- **Public Surface:** Fast, responsive, dark-mode portfolio presenting agency services, selected work, engineering articles, and case study detail views with server-side rendering and dynamic routing.
- **Administrative Surface:** Protected control center allowing authenticated administrators to create, edit, toggle visibility, and delete projects and rich-text blog posts.
- **Backend Architecture:** Express REST API with TypeScript, Mongoose ODM, Zod request validation, rate limiting, and security middleware.

---

## Features

### Public Platform
- **Landing Experience:** Minimal digital design studio interface featuring Hero, About, Services, Process, Selected Work, Testimonials, Blog Preview, and Contact CTA.
- **Case Study Detail Pages (`/projects/[slug]`):** Dynamic routes displaying client details, year, category, challenge, approach, solution, outcome, and responsive imagery.
- **Blog Detail Pages (`/blog/[slug]`):** Dynamic routes rendering sanitized rich text articles with tags, reading time, author metadata, and related navigation.
- **Draft Protection:** Public endpoints strictly serve published content (`published: true`). Drafts return `404 Not Found`.
- **Responsive & Accessible Layout:** Horizontally safe tables, mobile navigation drawer, semantic HTML elements, and keyboard navigation.

### Protected Admin Dashboard
- **Admin Authentication (`/admin/login`):** Credentials validation via JWT token exchange with rate-limited login protection.
- **Dashboard Overview (`/admin`):** Metric counters for total, published, and draft projects and articles with quick action triggers.
- **Project Management (`/admin/projects`):** Project listing with instant publish/unpublish toggles, featured toggles, editing, and confirmation modals for deletion.
- **Project Creation & Editing (`/admin/projects/new`, `/admin/projects/[id]/edit`):** Structured forms with field-level Zod validation feedback and automatic slug generation.
- **Article Management (`/admin/blog`):** Blog management table with real-time status badges and deletion confirmation.
- **Rich Text Editor (`/admin/blog/new`, `/admin/blog/[id]/edit`):** TipTap editor supporting Headings (H1–H3), Paragraphs, Bold, Italic, Underline, Lists, Blockquotes, Dividers, Hyperlinks (with target/rel safety), and Undo/Redo.
- **Draft Controls:** Visual badges distinguishing Published and Draft states across all listings.

### Backend & API Security
- **JWT Authentication:** Signed tokens containing user identifiers and role claims.
- **Role-Based Authorization:** Strict separation between authentication and admin role enforcement.
- **Zod Schema Validation:** Strict request body validation before database operations.
- **Rate Limiting:** Dedicated rate limiters for authentication (`10 req / 15 min`), write endpoints (`60 req / 15 min`), and public reads (`300 req / 15 min`).
- **Security Headers & CORS:** Helmet security headers, strict CORS origin filtering, and 2MB request body parsing limits.
- **XSS Sanitization:** `sanitize-html` removes `<script>`, dangerous attributes, and neutralizes `javascript:` protocols.
- **Centralized Error Handling:** Consistent JSON error envelopes masking internal stack traces and server details.

---

## Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **Rich Text Editor:** TipTap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-underline`)
- **Sanitization:** `sanitize-html`

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Validation:** Zod
- **Security:** Helmet, CORS, `express-rate-limit`

---

## Architecture

```
                                  +-----------------------+
                                  |    Public Visitor     |
                                  +-----------+-----------+
                                              |
                                              v
+-----------------------+         +-----------------------+
|  Admin Administrator  | ------> |    Next.js Frontend   | (Port 3000 / Vercel)
+-----------------------+         +-----------+-----------+
            |                                 |
      Bearer JWT                              |
            v                                 v
+---------------------------------------------------------+
|                    Express REST API                     | (Port 5000 / Render)
|                                                         |
|  [Helmet] -> [CORS] -> [RateLimiter] -> [Auth/Role]     |
|                   -> [Zod Validation]                   |
+----------------------------+----------------------------+
                             |
                             v
+---------------------------------------------------------+
|                  MongoDB Database                       | (MongoDB Atlas)
|          Collections: users, projects, blogs            |
+---------------------------------------------------------+
```

---

## Project Structure

```
ORBITLY-STUDIO-project/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection, environment variables
│   │   ├── controllers/     # Route handlers (auth, projects, blog)
│   │   ├── middleware/      # Auth, requireAdmin, rateLimiter, errorHandler
│   │   ├── models/          # Mongoose models (User, Project, BlogPost)
│   │   ├── routes/          # Express route definitions (auth, projects, blog, admin)
│   │   ├── utils/           # JWT, password hashing, seed utilities
│   │   ├── validators/      # Zod validation schemas
│   │   ├── app.ts           # Express application configuration
│   │   └── server.ts        # Server entry point
│   ├── .env.example         # Backend environment variable template
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── admin/           # Protected admin dashboard, projects, blog, login
│   │   ├── blog/[slug]/     # Public article detail route
│   │   ├── projects/[slug]/ # Public project case study route
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Studio landing page
│   │   └── not-found.tsx    # Custom 404 handler
│   ├── components/
│   │   ├── admin/           # RichTextEditor and admin components
│   │   ├── blog/            # MarkdownContent sanitized renderer
│   │   ├── home/            # Landing page sections
│   │   └── layout/          # Navbar, Footer
│   ├── lib/
│   │   ├── api.ts           # Typed API client and auth token storage
│   │   └── contentUtils.ts  # Markdown-to-HTML conversion & XSS sanitizer
│   ├── types/               # Shared TypeScript interface definitions
│   ├── .env.example         # Frontend environment variable template
│   ├── package.json
│   └── tsconfig.json
├── package.json             # Root workspace script definitions
├── .gitignore               # Ignored artifacts and environment files
└── README.md
```

---

## Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Description | Example / Default |
|----------|-------------|-------------------|
| `PORT` | Port the Express server listens on | `5000` |
| `NODE_ENV` | Application environment mode | `production` or `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://<user>:<pwd>@cluster.mongodb.net/orbitly` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `https://your-frontend-domain.example` |
| `JWT_SECRET` | Secret key used to sign JWT tokens | `min_32_chars_random_secure_key` |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` |
| `ADMIN_NAME` | Initial administrator display name | `Admin User` |
| `ADMIN_EMAIL` | Administrator login email address | `admin@example.com` |
| `ADMIN_PASSWORD`| Initial administrator password | `replace_with_secure_password` |

### Frontend Configuration (`frontend/.env.local`)

| Variable | Description | Example / Default |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `https://your-backend-domain.example` |

---

## Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/Gautamkhushboo/ORBITLY-STUDIO-project.git
cd ORBITLY-STUDIO-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create the local environment files from the provided examples:

```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env` with your local MongoDB connection string, JWT secret, and administrative credentials.
Edit `frontend/.env.local` to point to your local API (`http://localhost:5000`).

### 4. Seed Development Data (Optional)
```bash
npm run seed
```

### 5. Start Development Servers
Run both backend and frontend concurrently:
```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)
- Health Check: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- Admin Login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## API Endpoints

### Authentication
- `POST /api/auth/login` — Authenticates credentials and returns a signed JWT token.

### Projects
- `GET /api/projects` — Retrieves published projects (public).
- `GET /api/projects/:slug` — Retrieves published project details by slug (public).
- `POST /api/projects` — Creates a project (admin only).
- `PUT /api/projects/:id` — Updates an existing project (admin only).
- `DELETE /api/projects/:id` — Deletes a project (admin only).

### Blog
- `GET /api/blog` — Retrieves published blog posts (public).
- `GET /api/blog/:slug` — Retrieves published blog post details by slug (public).
- `POST /api/blog` — Creates an article with rich text content (admin only).
- `PUT /api/blog/:id` — Updates an article (admin only).
- `DELETE /api/blog/:id` — Deletes an article (admin only).

### Admin Management
- `GET /api/admin/projects` — Retrieves all projects including drafts (admin only).
- `GET /api/admin/blog` — Retrieves all blog articles including drafts (admin only).

---

## Content & Draft Logic

The application implements a strict two-tier content visibility architecture:

1. **Public Site (`/`, `/projects/[slug]`, `/blog/[slug]`):**
   - The backend query enforces `{ published: true }`.
   - Draft items are never returned in public listings.
   - Attempting to access an unpublished item by slug returns `HTTP 404 Not Found`.

2. **Admin Panel (`/admin`, `/admin/projects`, `/admin/blog`):**
   - Authenticated administrators with `admin` role can view both published and draft records.
   - Distinct visual badges (`Published` in green, `Draft` in neutral/warning) identify item status.
   - Toggling the publish switch updates the record state in real time via the API.

---

## Production Deployment Guide

### 1. Database: MongoDB Atlas
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read/write permissions to the `orbitly_studio` database.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) or configure specific cloud provider IP ranges.
4. Copy the connection string format:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/orbitly_studio?retryWrites=true&w=majority
   ```

### 2. Backend: Render / Railway
1. Connect the GitHub repository `https://github.com/Gautamkhushboo/ORBITLY-STUDIO-project.git`.
2. Configure service settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
3. Configure Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: Supplied by provider
   - `MONGODB_URI`: `<your-mongodb-atlas-uri>`
   - `CLIENT_URL`: `https://<your-frontend-domain>.vercel.app`
   - `JWT_SECRET`: `<random-32-char-string>`
   - `JWT_EXPIRES_IN`: `7d`
   - `ADMIN_EMAIL`: `admin@yourdomain.com`
   - `ADMIN_PASSWORD`: `<strong-production-password>`
4. Deploy and verify health check at `https://<backend-domain>/api/health`.

### 3. Frontend: Vercel
1. Import the repository on [Vercel](https://vercel.com).
2. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
3. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://<your-backend-domain>` (without trailing `/api`)
4. Deploy and verify navigation, case study views, and admin dashboard operations.

---

## Verification & Testing

The application undergoes automated end-to-end verification covering 42 quality assertions:
- **TypeScript:** Strict type checking on both frontend (`npx tsc --noEmit`) and backend (`tsc`).
- **Production Builds:** Next.js Turbopack production compilation generating all static and dynamic routes.
- **Security:** Verification of 401 on missing tokens, 403 on non-admin tokens, script tag stripping, and XSS sanitization.
- **CRUD Operations:** Complete lifecycle testing of projects and blog posts including slug collisions and draft visibility boundaries.

---

## Repository

- **GitHub:** [https://github.com/Gautamkhushboo/ORBITLY-STUDIO-project.git](https://github.com/Gautamkhushboo/ORBITLY-STUDIO-project.git)
- **Branch:** `main`
