from django.db import models
from apps.core.models import TimeStampedUUIDModel

class SEOMetadata(TimeStampedUUIDModel):
    page_identifier = models.CharField(
        max_length=80, 
        unique=True, 
        help_text="e.g. 'global', 'home', 'projects', 'about', 'contact'"
    )
    title = models.CharField(max_length=150)
    meta_description = models.CharField(max_length=300)
    keywords = models.CharField(max_length=300, blank=True)
    canonical_url = models.URLField(blank=True)
    og_title = models.CharField(max_length=150, blank=True)
    og_description = models.CharField(max_length=300, blank=True)
    og_image_url = models.URLField(blank=True)
    robots_directive = models.CharField(max_length=100, default="index, follow")

    class Meta:
        ordering = ['page_identifier']
        verbose_name_plural = 'SEO Metadata'

    def __str__(self):
        return f"SEO for {self.page_identifier}"
