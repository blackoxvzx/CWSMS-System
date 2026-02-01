# CWSMS - Car Washing Sales Management System

SmartPark car washing sales management web application (TSS National Integrated Assessment 2024–2025).

## Structure

- **backend-project** – Node.js + Express, MySQL, session-based auth
- **frontend-project** – React, Vite, Tailwind CSS, Axios
- **ERD.md** – Entity Relationship Diagram description (draw on paper as per instructions)
- **database/init.sql** – Database schema and seed data

## Prerequisites

- Node.js (v18+)
- MySQL Server
- npm or yarn

## Setup

### 1. Database

1. Create database and tables using MySQL:

```bash
cd backend-project
mysql -u root -p < database/init.sql
```

Or run the contents of `backend-project/database/init.sql` in MySQL Workbench or any MySQL client.

### 2. Backend

```bash
cd backend-project
cp .env.example .env
# Edit .env: set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (CWSMS)
npm install
npm start
```

Backend runs at **http://localhost:5000**.

### 3. Frontend

```bash
cd frontend-project
npm install
npm run dev
```

Frontend runs at **http://localhost:3000** and proxies `/api` to the backend.

## Default Login

- **Username:** receptionist  
- **Password:** receptionist123  

## Menu (Pages)

- **Car** – Register cars (insert only)
- **Packages** – Add and list service packages (insert + list)
- **ServicePackage** – Create, list, update, delete service records; generate bill
- **Payment** – Record payments (insert + list)
- **Reports** – Daily report: PlateNumber, PackageName, PackageDescription, AmountPaid, PaymentDate
- **Logout** – Session logout

## CRUD Rules (per assessment)

- **Insert** on all four forms: Car, Packages, ServicePackage, Payment
- **Delete, Update, Retrieve** only on ServicePackage (Service Record) form

## Seed Data (Packages)

- Basic wash – Exterior hand wash – 5,000 RWF  
- Classic wash – Interior hand wash – 10,000 RWF  
- Premium wash – Exterior and Interior hand wash – 20,000 RWF  

## Saving Work (per assessment)

Save your work in a folder named: **FirstName_LastName_National_Practical_Exam_2025**

## Removing Project (per assessment)

Remove the project and related configurations only after being marked, and ask permission from the assessor before removing.

---

## Deployment (Render + Vercel)

### Backend on Render

1. **Push** the repo to GitHub (ensure `backend-project/` is in the repo).
2. Go to [Render](https://render.com) → **New** → **Web Service**.
3. Connect the repo and set:
   - **Root Directory:** `backend-project`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node version:** 18 or 20 (in **Environment** or add `engines` in `package.json`).
4. Add **Environment Variables** in the Render dashboard:
   - `NODE_ENV` = `production`
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (use a hosted MySQL, e.g. PlanetScale, Railway, or your own).
   - `SESSION_SECRET` = a long random string (or let Render generate).
   - `FRONTEND_URL` = your Vercel frontend URL, e.g. `https://your-app.vercel.app` (no trailing slash).
5. Deploy. Note the backend URL (e.g. `https://cwsms-backend.onrender.com`).

**Optional:** You can use the **Blueprint** flow and point Render at `backend-project/render.yaml` instead of setting fields manually.

### Frontend on Vercel

1. Go to [Vercel](https://vercel.com) → **Add New** → **Project** and import the same GitHub repo.
2. Set:
   - **Root Directory:** `frontend-project`
   - **Framework Preset:** Vite (auto-detected).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add **Environment Variable:**
   - `VITE_API_URL` = `https://cwsms-system.onrender.com/api`
4. Deploy. Vercel will give you a URL like `https://your-app.vercel.app`.

### After deployment

1. In **Render** (backend), set `FRONTEND_URL` to your **Vercel** URL (e.g. `https://your-app.vercel.app`) so CORS and cookies work. Redeploy if needed.
2. Use the Vercel URL to open the app; it will call the Render backend at [https://cwsms-system.onrender.com](https://cwsms-system.onrender.com).

### Troubleshooting: 500 on login

**500 on `/api/auth/login`** usually means the backend on Render **cannot reach the database**. Render does not provide MySQL.

1. **Use a hosted MySQL** (e.g. [PlanetScale](https://planetscale.com), [Railway](https://railway.app), [Aiven](https://aiven.io), or your own server).
2. In **Render** → your service → **Environment**, set:
   - `DB_HOST` = your MySQL host
   - `DB_USER` = your MySQL user
   - `DB_PASSWORD` = your MySQL password
   - `DB_NAME` = `CWSMS`
3. Create the database and tables on that MySQL (run `backend-project/database/init.sql`).
4. Redeploy the backend on Render.

**Check DB from Render:** Open `https://cwsms-system.onrender.com/api/health/db`. If it returns `{ "ok": false, "db": "disconnected" }`, the database connection from Render is failing.

**401 on login** = wrong username/password. Default user: `receptionist` / `receptionist123` (must exist in the `User` table).
