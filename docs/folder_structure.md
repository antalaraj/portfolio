# Project Directory & File Structure

This document outlines the complete directory layout for the personal portfolio and custom CMS. The structure follows a clean, modular design separating frontend, backend, documentation, and operational assets.

```
d:/Portfolio/
├── .env.example                       # Root template for all environment configurations
├── .gitignore                         # Master gitignore for Python, Node, OS, and secrets
├── README.md                          # Repository overview, setup instructions & run commands
│
├── docs/                              # Architecture, Design & API Documentation
│   ├── architecture.md                # System architecture, security, caching & AI readiness
│   ├── folder_structure.md            # Directory and file organization guide
│   ├── database_design.md             # ER diagrams, schema relationships & Django models
│   ├── api_specification.md           # DRF endpoints, public vs admin contracts & schemas
│   ├── ui_design_system.md            # White-theme tokens, typography, shadcn & responsive specs
│   └── development_roadmap.md         # Phased execution plan, milestones & checklists
│
├── frontend/                          # Next.js 14+ App Router Client Application
│   ├── package.json                   # Dependencies, build scripts and linting tools
│   ├── tsconfig.json                  # Strict TypeScript configuration
│   ├── tailwind.config.ts             # Tailwind CSS tokens, colors, breakpoints & animations
│   ├── postcss.config.mjs             # PostCSS processing
│   ├── next.config.mjs                # Next.js image domains (Cloudinary), redirects & headers
│   ├── components.json                # shadcn/ui configuration
│   ├── .env.local.example             # Frontend environment variables template
│   │
│   ├── public/                        # Static assets, fallback avatars, favicon & robots.txt
│   │   ├── favicon.ico
│   │   ├── logo.svg
│   │   └── images/
│   │
│   └── src/
│       ├── app/                       # Next.js App Router Structure
│       │   ├── layout.tsx             # Root layout with font injection and theme provider
│       │   ├── not-found.tsx          # Custom 404 page (White-theme polished)
│       │   ├── error.tsx              # Global error boundary
│       │   ├── loading.tsx            # Global route skeleton loader
│       │   │
│       │   ├── (public)/              # Public Portfolio Route Group
│       │   │   ├── layout.tsx         # Public layout with dynamic Navbar & Footer
│       │   │   ├── page.tsx           # Homepage (Composed dynamically via Builder)
│       │   │   ├── about/
│       │   │   │   └── page.tsx       # Dedicated About page
│       │   │   ├── projects/
│       │   │   │   ├── page.tsx       # Filterable projects listing
│       │   │   │   └── [slug]/
│       │   │   │       └── page.tsx   # Detailed Project presentation page
│       │   │   ├── skills/
│       │   │   │   └── page.tsx       # Categorized interactive skills view
│       │   │   ├── experience/
│       │   │   │   └── page.tsx       # Professional career & internship timeline
│       │   │   ├── education/
│       │   │   │   └── page.tsx       # Academic degrees & background
│       │   │   ├── certifications/
│       │   │   │   └── page.tsx       # Verifiable credentials & certificates
│       │   │   ├── resume/
│       │   │   │   └── page.tsx       # Interactive PDF viewer & download hub
│       │   │   ├── contact/
│       │   │   │   └── page.tsx       # Contact submission form & channels
│       │   │   ├── sitemap.ts         # Dynamic SEO sitemap generator
│       │   │   └── robots.ts          # Dynamic robots.txt generator
│       │   │
│       │   ├── admin/                 # Custom Admin CMS Route Group
│       │   │   ├── login/
│       │   │   │   └── page.tsx       # Secure admin login form
│       │   │   ├── (dashboard)/       # Authenticated Dashboard Shell Layout
│       │   │   │   ├── layout.tsx     # Admin shell (Sidebar, Header, Breadcrumbs)
│       │   │   │   ├── page.tsx       # Analytics Overview Dashboard (Recharts)
│       │   │   │   ├── builder/       # Drag-and-Drop Dynamic Website Builder
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── profile/       # Personal profile & social links manager
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── projects/      # Project list, create, edit & gallery
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   ├── new/page.tsx
│       │   │   │   │   └── [id]/page.tsx
│       │   │   │   ├── skills/        # Skills CRUD & ordering
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── experience/    # Work experience CRUD
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── education/     # Academic background CRUD
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── certifications/# Certificates & proof links CRUD
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── resume/        # Resume version & PDF file manager
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── testimonials/  # Recommendations & approvals
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── navigation/    # Navbar menu item manager
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── footer/        # Footer columns & copyright manager
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── media/         # Centralized Media Library & uploader
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── contact/       # Inbox, message status & archives
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── seo/           # Global & per-page meta tag manager
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── analytics/     # Detailed visitor metrics & event logs
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── settings/      # Site configuration & maintenance mode
│       │   │   │   │   └── page.tsx
│       │   │   │   └── account/       # Password & security settings
│       │   │   │       └── page.tsx
│       │   │
│       │   └── api/                   # Next.js API Routes (Server Proxies / ISR)
│       │       └── revalidate/
│       │           └── route.ts       # On-demand ISR revalidation webhook handler
│       │
│       ├── components/                # Reusable UI Components
│       │   ├── ui/                    # shadcn/ui primitive components (Button, Input, Card, etc.)
│       │   ├── public/                # Public portfolio presentation blocks
│       │   │   ├── Navbar.tsx
│       │   │   ├── Footer.tsx
│       │   │   ├── HeroSection.tsx
│       │   │   ├── AboutSection.tsx
│       │   │   ├── SkillsGrid.tsx
│       │   │   ├── ProjectCard.tsx
│       │   │   ├── ExperienceTimeline.tsx
│       │   │   ├── EducationCard.tsx
│       │   │   ├── CertificationCard.tsx
│       │   │   └── ContactForm.tsx
│       │   └── admin/                 # Admin dashboard components
│       │       ├── AdminSidebar.tsx
│       │       ├── AdminHeader.tsx
│       │       ├── StatCard.tsx
│       │       ├── DataTable.tsx      # Reusable table with search, sort & pagination
│       │       ├── ConfirmDialog.tsx
│       │       ├── MediaPickerModal.tsx
│       │       └── SectionBuilder/    # Drag-and-drop section list & inspector
│       │
│       ├── features/                  # Complex feature logic (forms, builder state)
│       ├── services/                  # API client functions (Axios / Fetch abstractions)
│       │   ├── api.ts                 # Base API client with credentials & CSRF
│       │   ├── publicApi.ts           # Public data fetchers
│       │   └── adminApi.ts            # Authenticated admin operations
│       ├── hooks/                     # Custom React hooks (useAuth, useDebounce, etc.)
│       ├── lib/                       # Utility helpers (utils.ts, date formatters, cn)
│       └── types/                     # Shared TypeScript interfaces & types
│           ├── api.ts
│           ├── cms.ts
│           └── models.ts
│
└── backend/                           # Django & Django REST Framework Service
    ├── manage.py                      # Django CLI utility
    ├── requirements.txt               # Pinned Python package dependencies
    ├── runtime.txt                    # Python version pin for Render (e.g. python-3.11.9)
    ├── .env.example                   # Backend environment variables template
    │
    ├── config/                        # Core Django Project Configuration
    │   ├── __init__.py
    │   ├── asgi.py
    │   ├── wsgi.py
    │   ├── urls.py                    # Root URL router (/api/v1/ and admin routes)
    │   └── settings/
    │       ├── __init__.py
    │       ├── base.py                # Common apps, middleware, DRF configuration
    │       ├── development.py         # Local SQLite / Dev Postgres, verbose logs
    │       └── production.py          # Strict CORS, SSL, Cloudinary, Neon PG
    │
    └── apps/                          # Modular Django Domain Applications
        ├── accounts/                  # Superadmin model, authentication & profile
        ├── profiles/                  # Raj Antala professional info, headline, bio
        ├── pages/                     # Website builder: pages, sections, order & JSONB schema
        ├── projects/                  # Projects, gallery, tags, tech stack & order
        ├── skills/                    # Skill categories, items, proficiency & icons
        ├── experience/                # Jobs, internships, roles & descriptions
        ├── education/                 # Academic institutions, degrees, timelines
        ├── certifications/            # Certificates, credentials & issue dates
        ├── testimonials/              # Recommendations & endorsement quotes
        ├── navigation/                # Dynamic header & footer menus
        ├── media_library/             # Uploaded assets, Cloudinary integration
        ├── contact/                   # Contact inquiries, read/unread states, emails
        ├── seo/                       # Global & page-specific meta tags, OG tags
        ├── analytics/                 # Privacy-friendly page views & visitor metrics
        ├── site_settings/             # General settings, availability status, maintenance
        └── ai_assistant/              # Future RAG service, embeddings & vector query stubs
```
