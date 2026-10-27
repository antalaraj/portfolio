# REST API Specification & Contract

**API Version**: `/api/v1/`  
**Protocol**: HTTPS  
**Data Format**: JSON (`application/json`) / Multipart (`multipart/form-data` for uploads)

---

## 1. Global API Standards

### 1.1 Response Envelope Structure

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

#### Paginated List Response
```json
{
  "success": true,
  "count": 24,
  "next": "/api/v1/projects/?page=2",
  "previous": null,
  "results": [ ... ]
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid payload provided",
    "details": {
      "email": ["Enter a valid email address."]
    }
  }
}
```

---

## 2. Authentication Endpoints (`/api/v1/auth/`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login/` | Public (Rate-limited) | Validates credentials, sets HttpOnly session & CSRF cookies. |
| `POST` | `/api/v1/auth/logout/` | Authenticated | Clears session cookie and invalidates session token. |
| `GET` | `/api/v1/auth/me/` | Authenticated | Returns current authenticated user and profile summary. |
| `GET` | `/api/v1/auth/csrf/` | Public | Returns a fresh CSRF token for preflight initialization. |

---

## 3. Public Portfolio APIs (`/api/v1/public/`)

*All public endpoints return strictly `status = 'published'` content. No draft content is ever visible.*

### 3.1 Profile & Initial Bootstrap
- **`GET /api/v1/public/profile/`**: Returns Raj Antala's public biography, headline, active availability indicator, contact emails, and social links.
- **`GET /api/v1/public/settings/`**: Returns global site config (title, footer copyright text, maintenance status).
- **`GET /api/v1/public/navigation/`**: Returns active header menu items and footer links ordered by `display_order`.

### 3.2 Dynamic Pages & Website Builder
- **`GET /api/v1/public/pages/{slug}/`**:  
  Returns page metadata and its ordered active sections.  
  Example: `GET /api/v1/public/pages/home/` returns:
  ```json
  {
    "success": true,
    "data": {
      "title": "Home",
      "slug": "home",
      "sections": [
        {
          "id": "c1f7b0a8-...",
          "section_type": "hero",
          "title": "Raj Antala",
          "subtitle": "AI Engineer | Data Science | Generative AI",
          "display_order": 1,
          "config_data": {
            "show_resume_button": true,
            "show_availability_badge": true,
            "cta_projects_label": "Explore AI Projects"
          }
        },
        {
          "id": "e2a3c9f1-...",
          "section_type": "projects",
          "title": "Featured Projects",
          "subtitle": "Production-grade Machine Learning & Generative AI Systems",
          "display_order": 2,
          "config_data": {
            "max_items": 6,
            "filter_featured_only": true
          }
        }
      ]
    }
  }
  ```

### 3.3 Projects
- **`GET /api/v1/public/projects/`**: Filterable by technology (`?tech=pytorch`), featured status (`?featured=true`), and search query (`?q=nlp`). Paginated.
- **`GET /api/v1/public/projects/{slug}/`**: Detailed project view including full description, tech stack tags, and ordered gallery images.

### 3.4 Skills, Experience, Education, Certifications & Testimonials
- **`GET /api/v1/public/skills/`**: Categorized grouping of visible technical skills with proficiency percentages and icons.
- **`GET /api/v1/public/experience/`**: Chronological work history and internships with bulleted responsibilities.
- **`GET /api/v1/public/education/`**: Academic background and credentials.
- **`GET /api/v1/public/certifications/`**: Industry certifications, issuers, proof URLs, and badge images.
- **`GET /api/v1/public/testimonials/`**: Approved recommendations and endorsements.

### 3.5 Contact Form & Analytics Logging
- **`POST /api/v1/public/contact/`**:
  *Rate limit: 5 requests / hour / IP*  
  **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@techcorp.com",
    "subject": "AI Project Inquiry",
    "message": "We would love to discuss a Generative AI opportunity with you."
  }
  ```
- **`POST /api/v1/public/analytics/event/`**:
  Silent telemetry endpoint capturing page path, referrer, and user agent. IP is salted and SHA-256 hashed immediately in memory to maintain GDPR privacy compliance.

---

## 4. Protected Admin CMS APIs (`/api/v1/admin/`)

*All admin endpoints require session authentication with `is_staff = True`. State changes require CSRF headers.*

### 4.1 Analytics Overview
- **`GET /api/v1/admin/analytics/overview/`**:  
  Returns consolidated statistics for the dashboard:
  ```json
  {
    "success": true,
    "data": {
      "total_visitors": 4120,
      "page_views": 18450,
      "total_projects": 12,
      "total_skills": 34,
      "unread_messages": 3,
      "traffic_history": [
        { "date": "2026-10-20", "visits": 140, "views": 520 },
        { "date": "2026-10-21", "visits": 195, "views": 680 }
      ],
      "popular_projects": [
        { "title": "RAG Document Intelligence", "views": 2420 },
        { "title": "Autonomous Agent Swarm", "views": 1890 }
      ]
    }
  }
  ```

### 4.2 Dynamic Website Builder
- **`GET /api/v1/admin/pages/{slug}/`**: Retrieve full page tree with all sections (including inactive).
- **`POST /api/v1/admin/pages/{slug}/sections/`**: Add a new section to the page.
- **`PATCH /api/v1/admin/pages/{slug}/sections/{id}/`**: Update section titles, configuration JSON, or visibility.
- **`DELETE /api/v1/admin/pages/{slug}/sections/{id}/`**: Remove section.
- **`POST /api/v1/admin/pages/{slug}/reorder-sections/`**:  
  **Request Body**:
  ```json
  {
    "order": [
      { "id": "section-uuid-1", "display_order": 1 },
      { "id": "section-uuid-2", "display_order": 2 }
    ]
  }
  ```
- **`POST /api/v1/admin/pages/{slug}/publish/`**: Triggers atomic publish and emits revalidation webhook to Next.js.

### 4.3 Content Domain CRUD Endpoints

Each domain supports standard operations: `GET` (list with filters), `POST` (create), `GET /{id}/` (retrieve), `PUT/PATCH /{id}/` (update), `DELETE /{id}/` (soft-delete or purge), and bulk reordering where applicable.

- **Profile**: `GET /api/v1/admin/profile/`, `PATCH /api/v1/admin/profile/`
- **Projects**: `/api/v1/admin/projects/` (CRUD + gallery sub-resources + reorder)
- **Skills**: `/api/v1/admin/skills/` & `/api/v1/admin/skill-categories/`
- **Experience**: `/api/v1/admin/experience/`
- **Education**: `/api/v1/admin/education/`
- **Certifications**: `/api/v1/admin/certifications/`
- **Testimonials**: `/api/v1/admin/testimonials/` (approve, reject, edit)
- **Navigation**: `/api/v1/admin/navigation/` (reorder items, toggle active)
- **Footer**: `/api/v1/admin/footer/`
- **SEO**: `/api/v1/admin/seo/` (per-page meta tags and OG previews)
- **Settings**: `/api/v1/admin/settings/`

### 4.4 Contact Inbox Management
- **`GET /api/v1/admin/contact/`**: Filterable by `?is_read=false`, `?is_archived=false`, search by name/email/content.
- **`PATCH /api/v1/admin/contact/{id}/`**: Mark as read, archive, or unarchive.
- **`DELETE /api/v1/admin/contact/{id}/`**: Permanently remove inquiry.

### 4.5 Centralized Media Library (`/api/v1/admin/media/`)
- **`GET /api/v1/admin/media/`**: Browse uploaded images and documents with size, dimensions, and Cloudinary URLs.
- **`POST /api/v1/admin/media/upload/`**:  
  Accepts `multipart/form-data` with automatic MIME-type validation, image compression, and direct Cloudinary bucket synchronization.
- **`DELETE /api/v1/admin/media/{id}/`**: Removes database record and triggers asset deletion from Cloudinary.
