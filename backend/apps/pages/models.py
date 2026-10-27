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
    config_data = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['display_order', 'created_at']

    def __str__(self):
        return f"{self.page.title} - {self.get_section_type_display()} (#{self.display_order})"
