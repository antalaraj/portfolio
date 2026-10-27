from django.db import models
from apps.core.models import PublishableModel, TimeStampedUUIDModel

class TechTag(TimeStampedUUIDModel):
    name = models.CharField(max_length=60, unique=True)
    category = models.CharField(max_length=60, default="General", help_text="e.g. AI/ML, Backend, Cloud")

    class Meta:
        ordering = ['name']

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

    def __str__(self):
        return f"{self.project.title} - Image #{self.display_order}"
