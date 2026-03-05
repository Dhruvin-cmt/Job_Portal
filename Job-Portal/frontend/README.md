# Job Portal – Frontend

React + Vite + Tailwind CSS frontend for the Job Portal.

## Setup

```bash
cd frontend
npm install
```

## Run (development)

```bash
npm run dev
```

Runs at [http://localhost:5173](http://localhost:5173). API requests to `/api/*` are proxied to the backend (see `vite.config.js`). Ensure the backend is running on port 8080.

## Build

```bash
npm run build
```

Output is in `dist/`. For production, set `VITE_API_URL` to your backend URL if it’s on a different origin.

## Features

- **Home** – Landing, role selection (Job Seeker / Employer)
- **Auth** – Register & login for Employee and Employer (role-based)
- **Job seeker** – Dashboard, resume upload, browse jobs, apply to jobs
- **Employer** – Dashboard, publish job, list your jobs, update status (Open/Closed), delete closed jobs

## Backend integration

The app expects:

- **Employee:** `POST /api/user/emp/register`, `POST /api/user/emp/login`, `POST /api/user/emp/upload`, `POST /api/user/emp/jobs/apply/:id`
- **Employer:** `POST /api/user/employer/register`, `POST /api/user/employer/login`, `POST /api/user/employer/jobs/publish`, `GET /api/user/employer/jobs/getall`, `PUT /api/user/employer/jobs/update/:id`, `DELETE /api/user/employer/jobs/delete/:id`

For **Browse Jobs** to show a list, the backend can expose a public endpoint, e.g. `GET /api/jobs`, returning open jobs as `{ jobs: [...] }` or `{ allJobs: [...] }`. If this endpoint is missing, the Browse Jobs page shows an empty state; Apply still works via `/employee/apply/:jobId` when the user has the job ID.

Auth is cookie-based (`employeetoken` / `employertoken`); the frontend uses `withCredentials: true` on requests.
