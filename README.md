# Vacev — Photography & Videography Portfolio

A full-stack portfolio website for a photographer/videographer with a public gallery and JWT-protected admin dashboard.

## Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, JWT (access + refresh tokens)
- **Storage:** Local file uploads in `backend/uploads/`

## Features

- Responsive project grid on the homepage (Work page)
- Individual project pages with photo masonry grid and description
- Portfolio and About pages
- Admin dashboard with login, CRUD for projects, and image uploads

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally on `mongodb://localhost:27017`

### Install

```bash
npm run install:all
```

### Seed database

```bash
npm run seed
```

This creates an admin user and sample projects:

- **Email:** `admin@vacev.com`
- **Password:** `admin123`

### Run development servers

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Admin: http://localhost:3000/admin/login

## Project Structure

```
vacev/
├── backend/          # Express API
│   ├── src/
│   │   ├── models/   # User, Project, RefreshToken
│   │   ├── routes/   # auth, projects, admin
│   │   └── uploads/  # Uploaded images
│   └── package.json
├── frontend/         # Next.js app
│   └── src/
│       ├── app/      # Pages (/, /work/[slug], /admin, etc.)
│       ├── components/
│       └── lib/      # API client, auth context
└── package.json
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/refresh` | Cookie | Refresh access token |
| POST | `/api/auth/logout` | — | Logout |
| GET | `/api/projects` | — | List published projects |
| GET | `/api/projects/:slug` | — | Get project by slug |
| GET | `/api/admin/projects` | JWT | List all projects |
| POST | `/api/admin/projects` | JWT | Create project |
| PUT | `/api/admin/projects/:id` | JWT | Update project |
| DELETE | `/api/admin/projects/:id` | JWT | Delete project |
