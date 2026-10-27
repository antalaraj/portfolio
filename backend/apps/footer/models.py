from django.db import models
from apps.core.models import TimeStampedUUIDModel

class FooterSetting(TimeStampedUUIDModel):
    description = models.TextField(
        default="Raj Antala — AI Engineer, Data Scientist, and Generative AI enthusiast dedicated to building intelligent, reliable, and scalable software systems."
    )
    copyright_text = models.CharField(
        max_length=200, 
        default="© 2026 Raj Antala. All rights reserved."
    )
    is_visible = models.BooleanField(default=True)
    social_links = models.JSONField(
        default=list, 
        blank=True,
        help_text="Array of objects: [{'platform': 'GitHub', 'url': '...', 'icon': 'Github'}, ...]"
    )

    def __str__(self):
        return "Footer Configuration"
