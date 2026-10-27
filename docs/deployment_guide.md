# Production Deployment Guide: Raj Antala Portfolio & Custom CMS

This comprehensive deployment runbook details step-by-step procedures to deploy the full-stack system across **Vercel** (Frontend), **Render** (Django REST Backend), **Neon** (PostgreSQL), and **Cloudinary** (Media Assets).

---

## Architecture Topology

```
                  ┌──────────────────────────────────────────────┐
                  │           User Browser / Visitor             │
                  └───────────────┬──────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Frontend: Vercel (Edge CDN)                                           │
│  Domain: https://rajantala.com                                         │
│  - Next.js 16 App Router (TypeScript, Tailwind CSS, Lucide, Recharts)  │
│  - ISR / Dynamic Server Rendering with 60s revalidation                │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ HTTPS REST API
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Backend: Render (Web Service / Docker)                                │
│  Domain: https://api.rajantala.com or https://raj-portfolio.onrender.com│
│  - Django 5.x REST Framework                                           │
│  - Gunicorn WSGI Server + Whitenoise Static Serving                    │
│  - Rate Limiting, CORS & CSRF Protection                               │
└───────────────┬─────────────────────────────────┬──────────────────────┘
                │                                 │
                ▼                                 ▼
┌───────────────────────────────┐ ┌──────────────────────────────────────┐
│  Database: Neon (Serverless)  │ │  Media Storage: Cloudinary           │
│  PostgreSQL 16 with SSL       │ │  Project Screenshots, Resumes & Media│
└───────────────────────────────┘ └──────────────────────────────────────┘
```

---

## Step 1: Database Setup (Neon PostgreSQL)

1. Sign up or log into [Neon Console](https://neon.tech).
2. Create a new project:
   - **Project Name**: `raj-portfolio`
   - **Postgres Version**: 16
   - **Region**: Choose the region closest to your target audience (e.g., `US East (Ohio)` or `Asia Pacific (Singapore)`).
3. Copy the connection string from the Neon dashboard:
   ```
   postgres://[user]:[password]@[neon-hostname]/neondb?sslmode=require
   ```
4. Keep this connection string ready for the backend environment variable `DATABASE_URL`.

---

## Step 2: Media Storage Setup (Cloudinary)

1. Sign up or log into [Cloudinary](https://cloudinary.com).
2. Navigate to your Dashboard and copy:
   - **Cloud Name**: `your-cloud-name`
   - **API Key**: `your-api-key`
   - **API Secret**: `your-api-secret`
3. In Cloudinary Settings > Upload, create an upload preset or leave as default. Images uploaded through the admin CMS will automatically be stored with secure HTTPS URLs.

---

## Step 3: Backend Deployment (Render)

### Option A: Using the `render.yaml` Blueprint (Automated)

1. Push your repository to GitHub.
2. In the Render Dashboard, click **New > Blueprint**.
3. Select your repository. Render will automatically detect [render.yaml](file:///d:/Portfolio/render.yaml).
4. Supply the secret environment variables when prompted:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string.
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key.
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
   - `CORS_ALLOWED_ORIGINS`: `https://rajantala.com,https://your-frontend.vercel.app`
   - `CSRF_TRUSTED_ORIGINS`: `https://rajantala.com,https://your-frontend.vercel.app`
   - `DJANGO_ALLOWED_HOSTS`: `.onrender.com,api.rajantala.com`
5. Click **Apply Blueprint**. Render will build and deploy the web service.

### Option B: Manual Web Service Creation

1. In Render Dashboard, click **New > Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name**: `raj-portfolio-backend`
   - **Runtime**: `Python 3`
   - **Branch**: `main`
   - **Build Command**:
     ```bash
     pip install --upgrade pip && pip install -r backend/requirements.txt && python backend/manage.py collectstatic --noinput && python backend/manage.py migrate
     ```
   - **Start Command**:
     ```bash
     gunicorn --chdir backend config.wsgi:application --bind 0.0.0.0:$PORT --workers 3
     ```
4. Set the Environment Variables under **Settings > Environment**:
   ```ini
   PYTHON_VERSION=3.13.0
   DJANGO_SETTINGS_MODULE=config.settings.production
   SECRET_KEY=generate-a-strong-random-50-character-string
   DATABASE_URL=postgres://[user]:[password]@[neon-hostname]/neondb?sslmode=require
   DJANGO_ALLOWED_HOSTS=.onrender.com,api.rajantala.com
   CORS_ALLOWED_ORIGINS=https://rajantala.com,https://your-frontend.vercel.app
   CSRF_TRUSTED_ORIGINS=https://rajantala.com,https://your-frontend.vercel.app
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
5. Click **Deploy**.

### Initial Seed Data on Render

Once deployed, open the Render **Shell** tab for the web service and run:
```bash
python backend/manage.py seed_portfolio_data
```
This initializes the superuser account:
- **Username**: `rajantala`
- **Password**: `RajPortfolio2026!` *(Change this immediately upon logging in)*
And seeds all project data, profile information, skills, and builder sections.

---

## Step 4: Frontend Deployment (Vercel)

1. Log into [Vercel](https://vercel.com).
2. Click **Add New... > Project**.
3. Import your GitHub repository.
4. In the Project Configuration:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add the Environment Variables:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://raj-portfolio-backend.onrender.com` | Public browser API base URL |
   | `INTERNAL_API_URL` | `https://raj-portfolio-backend.onrender.com` | Server-side SSR API base URL |
   | `REVALIDATION_SECRET_TOKEN` | `generate-random-secret-key` | Token to trigger on-demand ISR |
6. Click **Deploy**. Vercel will build and publish the frontend at `https://[your-project].vercel.app`.

---

## Step 5: Custom Domain & SSL Setup

### Frontend Custom Domain (`rajantala.com`)
1. In Vercel Project Settings > **Domains**, add `rajantala.com` and `www.rajantala.com`.
2. Configure DNS with your domain registrar:
   - `A` Record: `@` pointing to `76.76.21.21` (Vercel IP).
   - `CNAME` Record: `www` pointing to `cname.vercel-dns.com`.
3. Vercel automatically generates and renews Let's Encrypt SSL certificates.

### Backend Custom Domain (`api.rajantala.com`)
1. In Render Service Settings > **Custom Domains**, add `api.rajantala.com`.
2. Add a `CNAME` record in your DNS provider:
   - `CNAME`: `api` pointing to `raj-portfolio-backend.onrender.com`.
3. Render automatically provisions SSL via Let's Encrypt.
4. Update `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` on Render to match `https://rajantala.com`.
5. Update `NEXT_PUBLIC_API_URL` on Vercel to `https://api.rajantala.com`.

---

## Step 6: Post-Deployment Verification Checklist

1. [ ] **Public Homepage**: Visit `https://rajantala.com` and confirm:
   - Hero banner with Raj Antala's AI Engineer positioning.
   - Dynamic builder sections load in order.
   - Project cards display with GitHub and live demo links.
   - Skills grid categorizes Machine Learning, Generative AI, and Engineering tools.
   - Experience timeline and education credentials render properly.
2. [ ] **CMS Admin Login**: Visit `https://rajantala.com/admin/login` and log in with your superuser credentials.
3. [ ] **Website Builder**: Go to `/admin/builder`, rearrange a section or toggle visibility, save, and check the live site.
4. [ ] **Contact Form Submission**: Submit a test message on `/` contact section, verify:
   - Success toast appears in browser.
   - Message appears in CMS Contact Inbox at `/admin/contact`.
5. [ ] **SEO Verification**: Check source code of `https://rajantala.com` to confirm OpenGraph tags, meta description, and JSON-LD structured data.
