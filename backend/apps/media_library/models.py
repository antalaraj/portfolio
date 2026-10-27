from django.db import models
from apps.core.models import TimeStampedUUIDModel

class MediaAsset(TimeStampedUUIDModel):
    title = models.CharField(max_length=200)
    file_url = models.URLField()
    public_id = models.CharField(max_length=255, blank=True)
    file_type = models.CharField(max_length=50, default='image') # image, document, pdf
    file_size_bytes = models.PositiveIntegerField(default=0)
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
