# Database Architecture & Django Models Specification

This document defines the relational database architecture, entity relationships, constraints, indexes, and comprehensive Django model definitions for the portfolio and custom CMS.

---

## 1. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o| PROFILE : "has"
    USER {
        uuid id PK
        string email UK
        string username UK
        boolean is_staff
        boolean is_superuser
        datetime created_at
    }

    PROFILE {
        uuid id PK
        uuid user_id FK
        string full_name
        string headline
        text bio
        string email
        string phone
        string location
        string github_url
        string linkedin_url
        string twitter_url
        string availability_status
        string avatar_url
        string resume_url
        datetime updated_at
    }

    PAGE ||--o{ PAGE_SECTION : "contains"
    PAGE {
        uuid id PK
        string title
        string slug UK
        string status
        datetime published_at
    }

    PAGE_SECTION {
        uuid id PK
        uuid page_id FK
        string section_type
        string title
        string subtitle
        int display_order
        boolean is_active
        jsonb config_data
        datetime updated_at
    }

    PROJECT ||--o{ PROJECT_IMAGE : "has gallery"
    PROJECT ||--m{ PROJECT_TECH_TAG : "tagged with"
    PROJECT {
        uuid id PK
        string title
        string slug UK
        text short_description
        text full_description
        string thumbnail_url
        string github_url
        string live_demo_url
        boolean is_featured
        int display_order
        string status
        datetime created_at
        datetime updated_at
    }

    PROJECT_IMAGE {
        uuid id PK
        uuid project_id FK
        string image_url
        string caption
        int display_order
    }

    PROJECT_TECH_TAG {
        uuid id PK
        string name UK
        string category
    }

    SKILL_CATEGORY ||--o{ SKILL : "groups"
    SKILL_CATEGORY {
        uuid id PK
        string name UK
        string slug UK
        int display_order
    }

    SKILL {
        uuid id PK
        uuid category_id FK
        string name
        int proficiency
        string icon_name
        int display_order
        boolean is_visible
    }

    EXPERIENCE {
        uuid id PK
        string company
        string job_title
        string employment_type
        string location
        date start_date
        date end_date
        boolean is_current
        text description
        jsonb responsibilities
        int display_order
        string status
    }

    EDUCATION {
        uuid id PK
        string institution
        string degree
        string field_of_study
        date start_date
        date end_date
        string grade
        text description
        int display_order
        string status
    }

    CERTIFICATION {
        uuid id PK
        string title
        string issuer
        date issue_date
        string credential_url
        string certificate_image_url
        int display_order
        string status
    }

    TESTIMONIAL {
        uuid id PK
        string author_name
        string designation
        string company
        text quote
        string avatar_url
        boolean is_approved
        int display_order
    }

    NAVIGATION_ITEM {
        uuid id PK
        string label
        string destination
        boolean is_external
        string menu_location
        int display_order
        boolean is_active
    }

    MEDIA_ASSET {
        uuid id PK
        string title
        string file_url
        string public_id
        string file_type
        int file_size_bytes
        int width
        int height
        datetime created_at
    }

    CONTACT_MESSAGE {
        uuid id PK
        string sender_name
        string sender_email
        string subject
        text message
        boolean is_read
        boolean is_archived
        string ip_address
        datetime created_at
    }

    SEO_METADATA {
        uuid id PK
        string page_identifier UK
        string title
        text meta_description
        string keywords
        string canonical_url
        string og_title
        text og_description
        string og_image_url
        string robots_directive
    }

    ANALYTICS_EVENT {
        uuid id PK
        string path
        string referrer
        string ip_hash
        string user_agent
        datetime timestamp
    }
```

---

## 2. Django Model Implementations by Domain

### 2.1 Core Base Models (`apps/core/models.py`)

All domain models inherit from consistent abstract base classes ensuring unified timestamps, UUID keys, and publishing state machines.

```python
import uuid
from django.db import models

class TimeStampedUUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class PublishableStatus(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    PUBLISHED = 'published', 'Published'
    ARCHIVED = 'archived', 'Archived'

class PublishableModel(TimeStampedUUIDModel):
    status = models.CharField(
        max_length=20,
        choices=PublishableStatus.choices,
        default=PublishableStatus.DRAFT,
        db_index=True
    )
    published_at = models.DateTimeField(null=True, blank=True)
    display_order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        abstract = True
        ordering = ['display_order', '-created_at']
```

---

### 2.2 Profile Management (`apps/profiles/models.py`)

```python
from django.db import models
from apps.core.models import TimeStampedUUIDModel

class Profile(TimeStampedUUIDModel):
    full_name = models.CharField(max_length=150, default="Raj Antala")
    headline = models.CharField(max_length=255, default="AI Engineer | Data Science | Generative AI")
    bio = models.TextField(help_text="Detailed personal and professional summary")
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=150, default="India")
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    availability_status = models.CharField(
        max_length=100, 
        default="Available for AI / ML Roles & Projects",
        help_text="Visible badge on hero section"
    )
    avatar_url = models.URLField(blank=True, help_text="Cloudinary URL for profile headshot")
    resume_file_url = models.URLField(blank=True, help_text="Cloudinary URL for primary downloadable PDF")

    def __str__(self):
        return f"Profile - {self.full_name}"
```

---

### 2.3 Dynamic Pages & Website Builder (`apps/pages/models.py`)

```python
from django.db import models
from apps.core.models import PublishableModel, TimeStampedUUIDModel

class Page(PublishableModel):
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title

class SectionType(models.TextChoices):
    HERO = 'hero', 'Hero Banner'
    ABOUT = 'about', 'About Me'
    SKILLS = 'skills', 'Technical Skills'
    PROJECTS = 'projects', 'Featured Projects'
    EXPERIENCE = 'experience', 'Work Experience'
    EDUCATION = 'education', 'Education History'
    CERTIFICATIONS = 'certifications', 'Certifications'
    TESTIMONIALS = 'testimonials', 'Recommendations'
    CONTACT = 'contact', 'Contact Form'
    CUSTOM = 'custom', 'Custom Content'

class PageSection(TimeStampedUUIDModel):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='sections')
    section_type = models.CharField(max_length=50, choices=SectionType.choices)
    title = models.CharField(max_length=200, blank=True)
    subtitle = models.CharField(max_length=300, blank=True)
    display_order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True)
    # JSONB field containing strictly typed, validated configuration parameters per section type
    config_data = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['display_order', 'created_at']

    def __str__(self):
        return f"{self.page.title} - {self.get_section_type_display()} (#{self.display_order})"
```

---

### 2.4 Projects Management (`apps/projects/models.py`)

```python
from django.db import models
from apps.core.models import PublishableModel, TimeStampedUUIDModel

class TechTag(TimeStampedUUIDModel):
    name = models.CharField(max_length=60, unique=True)
    category = models.CharField(max_length=60, default="General", help_text="e.g. AI/ML, Backend, Cloud")

    def __str__(self):
        return self.name

class Project(PublishableModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    short_description = models.CharField(max_length=350)
    full_description = models.TextField(help_text="Detailed markdown or rich text overview")
    thumbnail_url = models.URLField(help_text="Primary display image hosted on Cloudinary")
    github_url = models.URLField(blank=True)
    live_demo_url = models.URLField(blank=True)
    technologies = models.ManyToManyField(TechTag, related_name='projects', blank=True)
    is_featured = models.BooleanField(default=False, db_index=True)

    def __str__(self):
        return self.title

class ProjectGalleryImage(TimeStampedUUIDModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='gallery_images')
    image_url = models.URLField()
    caption = models.CharField(max_length=200, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'created_at']
```

---

### 2.5 Skills Management (`apps/skills/models.py`)

```python
from django.db import models
from apps.core.models import TimeStampedUUIDModel

class SkillCategory(TimeStampedUUIDModel):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = 'Skill Categories'

    def __str__(self):
        return self.name

class Skill(TimeStampedUUIDModel):
    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    proficiency = models.PositiveSmallIntegerField(
        default=85, 
        help_text="Percentage proficiency (1-100)"
    )
    icon_name = models.CharField(max_length=60, blank=True, help_text="Lucide icon identifier or SVG slug")
    display_order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.name} ({self.category.name})"
```

---

### 2.6 Experience & Education (`apps/experience/models.py` & `apps/education/models.py`)

```python
# apps/experience/models.py
from django.db import models
from apps.core.models import PublishableModel

class Experience(PublishableModel):
    company = models.CharField(max_length=150)
    job_title = models.CharField(max_length=150)
    employment_type = models.CharField(
        max_length=50,
        choices=[
            ('full-time', 'Full-time'),
            ('internship', 'Internship'),
            ('part-time', 'Part-time'),
            ('contract', 'Contract'),
            ('research', 'Research Fellow')
        ],
        default='internship'
    )
    location = models.CharField(max_length=150, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    responsibilities = models.JSONField(default=list, blank=True, help_text="List of bullet point achievements")

    def __str__(self):
        return f"{self.job_title} at {self.company}"

# apps/education/models.py
class Education(PublishableModel):
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=150)
    field_of_study = models.CharField(max_length=150)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    grade = models.CharField(max_length=50, blank=True, help_text="GPA or Percentage")
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.degree} - {self.institution}"
```

---

### 2.7 Certifications, Testimonials & Contact (`apps/certifications/models.py`, `apps/testimonials/models.py`, `apps/contact/models.py`)

```python
# apps/certifications/models.py
class Certification(PublishableModel):
    title = models.CharField(max_length=200)
    issuer = models.CharField(max_length=150)
    issue_date = models.DateField()
    credential_url = models.URLField(blank=True)
    certificate_image_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.title} by {self.issuer}"

# apps/testimonials/models.py
class Testimonial(TimeStampedUUIDModel):
    author_name = models.CharField(max_length=120)
    designation = models.CharField(max_length=120)
    company = models.CharField(max_length=150, blank=True)
    quote = models.TextField()
    avatar_url = models.URLField(blank=True)
    is_approved = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', '-created_at']

# apps/contact/models.py
class ContactMessage(TimeStampedUUIDModel):
    sender_name = models.CharField(max_length=120)
    sender_email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False, db_index=True)
    is_archived = models.BooleanField(default=False, db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
```

---

### 2.8 Navigation, Footer, SEO & Analytics

```python
# apps/navigation/models.py
class NavigationItem(TimeStampedUUIDModel):
    label = models.CharField(max_length=80)
    destination = models.CharField(max_length=255, help_text="Internal path or external URL")
    is_external = models.BooleanField(default=False)
    menu_location = models.CharField(
        max_length=20, 
        choices=[('header', 'Header'), ('footer', 'Footer'), ('both', 'Both')],
        default='header'
    )
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

# apps/seo/models.py
class SEOMetadata(TimeStampedUUIDModel):
    page_identifier = models.CharField(max_length=80, unique=True, help_text="e.g. 'global', 'home', 'projects'")
    title = models.CharField(max_length=150)
    meta_description = models.CharField(max_length=300)
    keywords = models.CharField(max_length=300, blank=True)
    canonical_url = models.URLField(blank=True)
    og_title = models.CharField(max_length=150, blank=True)
    og_description = models.CharField(max_length=300, blank=True)
    og_image_url = models.URLField(blank=True)
    robots_directive = models.CharField(max_length=100, default="index, follow")

# apps/analytics/models.py
class AnalyticsEvent(models.Model):
    id = models.BigAutoField(primary_key=True)
    path = models.CharField(max_length=255, db_index=True)
    referrer = models.CharField(max_length=255, blank=True)
    ip_hash = models.CharField(max_length=64, help_text="SHA256 salted hash of IP for unique count privacy")
    user_agent = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
```
