from django.db import models
from apps.core.models import TimeStampedUUIDModel

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

    def __str__(self):
        return f"Testimonial from {self.author_name} ({self.company})"
