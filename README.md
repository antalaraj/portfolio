# Raj Antala — Personal Portfolio & Custom CMS

> **Professional Positioning**: AI Engineer | Data Science | Generative AI  
> **Architecture**: Decoupled Next.js 16 (App Router) + Django REST Framework + PostgreSQL (Neon) + Cloudinary  
> **Design Theme**: Minimalist, High-Precision White-Theme (`#FFFFFF`, `#F8FAFC`, `#2563EB`)

---

## Architecture & Documentation

Comprehensive architectural blueprints and documentation are available in the [`docs/`](./docs) directory:

- [System Architecture Specification](./docs/architecture.md): System topology, security, authentication, on-demand ISR cache revalidation, and AI RAG readiness.
- [Project Directory & File Structure](./docs/folder_structure.md): Modular layout across `frontend/`, `backend/`, and `docs/`.
- [Database ER Diagram & Django Models](./docs/database_design.md): Entity relationship diagram, relational constraints, and Django ORM models across 14 domain apps.
- [REST API Specification](./docs/api_specification.md): Public endpoints, protected admin CRUD contracts, response envelope schemas, and rate limits.
- [UI / UX Design System Specification](./docs/ui_design_system.md): Strict white-theme color tokens, typography scales, component guidelines, and responsive breakpoint matrix (320px – 1920px).
- [Production Deployment Guide](./docs/deployment_guide.md): Step-by-step deployment to Vercel, Render, Neon, and Cloudinary.
- [Phased Development Roadmap](./docs/development_roadmap.md): 9-phase execution plan and milestone completion history.

---

## Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Recharts
- **Backend**: Python 3.13, Django 5.x, Django REST Framework, Whitenoise, Gunicorn
- **Database**: PostgreSQL (Neon in production, SQLite for offline development)
- **Media Storage**: Cloudinary (Image transformations, secure document hosting)
- **Containerization**: Docker & Docker Compose

---

## Development Lifecycle & Progress

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 1** | System Analysis, Architecture, Database Design, API Spec & UI Tokens | **Completed** |
| **Phase 2** | Django Backend, 14 Domain Apps, Models, DRF ViewSets & Seed Data | **Completed** |
| **Phase 3** | Public Portfolio Frontend (Home, Projects, Skills, Resume, etc.) | **Completed** |
| **Phase 4** | Custom Admin Dashboard Shell, Auth & Analytics (Recharts) | **Completed** |
| **Phase 5** | Complete CMS CRUD Modules & Dynamic Drag-and-Drop Website Builder | **Completed** |
| **Phase 6** | End-to-End Frontend/Backend Integration & Cache Revalidation | **Completed** |
| **Phase 7** | Quality Assurance, Security Audit & Mobile Viewport Polish | **Completed** |
| **Phase 8** | Production Deployment Preparation (Vercel, Render, Neon, Docker) | **Completed** |
| **Phase 9** | Future AI Assistant / Chatbot Integration (pgvector + RAG) | Prepared for Future Cycle |

---

## Quickstart Guide

### Option 1: Native Local Setup

#### Prerequisites
- Python 3.11+
- Node.js 20+

#### 1. Backend Setup (Django REST Framework)
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed initial data (Creates Raj Antala profile, AI projects, skills, builder sections)
python manage.py seed_portfolio_data

# Start backend server
python manage.py runserver 8000
```
Backend API will be running at `http://localhost:8000/api/v1/`.

#### 2. Frontend Setup (Next.js 16)
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Public Portfolio will be live at `http://localhost:3000`.

---

### Option 2: Docker Compose (One-Command Setup)

Run the entire full-stack application (PostgreSQL + Django Backend + Next.js Frontend) with:
```bash
docker-compose up --build
```
- **Public Portfolio**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3000/admin`
- **Django REST API**: `http://localhost:8000/api/v1/`

---

## Admin CMS Credentials (Default Seed)

- **Login URL**: `http://localhost:3000/admin/login`
- **Username**: `rajantala`
- **Password**: `RajPortfolio2026!`

*(Note: Change this password immediately upon initial login in production).*

---

## Admin CMS Capabilities

Through the custom admin dashboard, you can:
1. **Dynamic Website Builder** (`/admin/builder`):
   - Reorder homepage sections (Hero, About, Projects, Skills, Experience, Education, Certifications, Testimonials, Contact) with up/down controls.
   - Toggle visibility on/off without writing code.
   - Customize titles, subtitles, and layout options.
2. **Projects Manager** (`/admin/projects`): Add, edit, tag with AI/ML technologies, reorder, and publish projects.
3. **Skills Manager** (`/admin/skills`): Categorize by Machine Learning, Generative AI, Data Engineering, and Web Development.
4. **Experience & Education** (`/admin/experience`, `/admin/education`): Manage career milestones and academic qualifications.
5. **Certifications & Testimonials** (`/admin/certifications`, `/admin/testimonials`): Showcase credentials and social proof.
6. **Navigation & Footer** (`/admin/navigation`, `/admin/footer`): Update links and social profiles.
7. **Contact Inbox** (`/admin/contact`): View, search, and manage incoming client and recruiter inquiries.
8. **Media Library** (`/admin/media`): Manage uploaded assets.
9. **SEO & Settings** (`/admin/seo`, `/admin/settings`): Configure meta tags, OpenGraph previews, and site configuration.

---

## Running Automated Tests

```bash
# Run Django backend test suite
cd backend
python manage.py test apps.core

# Verify Next.js production build
cd frontend
npm run build
```

---

## Production Deployment

Refer to [`docs/deployment_guide.md`](./docs/deployment_guide.md) for full instructions on deploying to **Vercel** (Frontend), **Render** (Backend), **Neon** (PostgreSQL), and **Cloudinary** (Media Assets).
