import uuid
from django.db import models

class TimeStampedUUIDModel(models.Model):
    """
    Abstract base model providing self-generating UUID primary key 
    and indexed created/updated timestamps.
    """
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
    """
    Abstract base model for content supporting draft, published, and archived states
    with manual display ordering.
    """
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
