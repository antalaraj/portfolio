# Production Deployment Guide: Vercel (Frontend) + Render (Backend & PostgreSQL)

This guide provides step-by-step instructions to deploy your portfolio to production using **Render** for the Django backend & PostgreSQL database and **Vercel** for the Next.js frontend.

---

## Architecture Overview

```
[ Visitor / Recruiter Browser ]
         │
         ▼
[ Vercel Edge CDN ] ──── (Next.js 16 Frontend)
         │
         │ API Requests & Media Rewrites
         ▼
[ Render Web Service ] ──── (Django 5 + Gunicorn + WhiteNoise)
         │
         ├────► [ Render Managed PostgreSQL ]
         │
         └────► [ Cloudinary / Media Storage ] (Uploaded Resumes & Avatars)
```

---

## Step 1: Deploy Backend & Database on Render

### Option A: Using the Blueprint (`render.yaml`) — Automated Setup
1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository: `antalaraj/portfolio`.
4. Render will automatically detect [`render.yaml`](file:///d:/Portfolio/render.yaml) and set up:
   - A managed PostgreSQL database (`portfolio-postgres`).
   - A Python Web Service (`raj-portfolio-backend`).
5. Click **Apply**.

---

### Option B: Manual Web Service Setup on Render
If setting up manually:
1. **Create PostgreSQL Database**:
   - In Render Dashboard: **New +** > **PostgreSQL**.
   - Name: `portfolio-postgres`
   - Plan: **Free** (or Starter)
   - Copy the **Internal Database URL** (or External Database URL).

2. **Create Web Service for Backend**:
   - **New +** > **Web Service**.
   - Connect repository: `antalaraj/portfolio`.
   - **Root Directory**: `backend` (or leave empty if using root commands).
   - **Environment**: `Python 3`
   - **Build Command**:
     ```bash
     pip install --upgrade pip && pip install -r backend/requirements.txt && python backend/manage.py collectstatic --noinput && python backend/manage.py migrate
     ```
   - **Start Command**:
     ```bash
     gunicorn --chdir backend config.wsgi:application --bind 0.0.0.0:$PORT --workers 3
     ```

3. **Configure Environment Variables on Render**:
   In your Web Service **Environment** tab, set:
   | Variable | Value | Description |
   |---|---|---|
   | `PYTHON_VERSION` | `3.13.0` | Python runtime version |
   | `DJANGO_SETTINGS_MODULE` | `config.settings.production` | Enables production settings |
   | `SECRET_KEY` | *(Generate a strong 50+ character random string)* | Production Django secret |
   | `DATABASE_URL` | *(Paste your Render PostgreSQL connection string)* | Database connection |
   | `DJANGO_ALLOWED_HOSTS` | `.onrender.com,localhost,127.0.0.1` *(Add custom domain later)* | Host header validation |
   | `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` *(Update after Vercel deploy)* | Allowed frontend origins |
   | `CSRF_TRUSTED_ORIGINS` | `https://your-frontend.vercel.app` *(Update after Vercel deploy)* | Allowed CSRF origins |
   | `CLOUDINARY_CLOUD_NAME` | *(Optional, your Cloudinary cloud name)* | Persistent media storage |
   | `CLOUDINARY_API_KEY` | *(Optional, your Cloudinary API key)* | Persistent media storage |
   | `CLOUDINARY_API_SECRET` | *(Optional, your Cloudinary API secret)* | Persistent media storage |

4. **Seed Real Portfolio Data & Create Superuser**:
   Once the Web Service deployment status shows **Live**:
   - Open the **Shell** tab in your Render Web Service.
   - Run the custom seed command to populate your exact profile, experiences, projects, and education:
     ```bash
     python backend/manage.py seed_portfolio_data
     ```
   - Create your administrator login:
     ```bash
     python backend/manage.py createsuperuser
     ```
   - Note down your backend URL (e.g. `https://raj-portfolio-backend.onrender.com`).

---

## Step 2: Deploy Frontend on Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository: `antalaraj/portfolio`.
4. Configure the project:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and select `frontend`.
   - **Build Command**: `npm run build` (Default)
   - **Output Directory**: `.next` (Default)

5. **Set Environment Variables on Vercel**:
   Add the following environment variables:
   | Variable | Value | Description |
   |---|---|---|
   | `INTERNAL_API_URL` | `https://raj-portfolio-backend.onrender.com` | Backend URL for Next.js rewrites & SSR |
   | `NEXT_PUBLIC_API_URL` | `https://raj-portfolio-backend.onrender.com` | Public backend API URL |

6. Click **Deploy**.
   Vercel will build and deploy your Next.js frontend in ~45 seconds.
   You will receive your production URL (e.g., `https://portfolio-antalaraj.vercel.app`).

---

## Step 3: Final Linkage & CORS Configuration

1. Return to your **Render Web Service** > **Environment**.
2. Update `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` with your new Vercel domain:
   ```env
   CORS_ALLOWED_ORIGINS=https://portfolio-antalaraj.vercel.app
   CSRF_TRUSTED_ORIGINS=https://portfolio-antalaraj.vercel.app
   ```
3. Render will automatically redeploy with the updated CORS permissions.

---

## Step 4: Verify Your Live Deployment

1. Visit your live Vercel URL (`https://your-portfolio.vercel.app`).
2. Verify all sections load with your data (Hero, About Me, Skills, Projects, Experience, Education, Certifications, Contact).
3. Click the **Resume** button in the header navbar:
   - Verifies navigation to `/resume`.
   - Verifies the high-DPI bezel-less white-border PDF viewer displays properly.
4. Visit `/admin/login` and log in with your superuser credentials to verify CMS access.
