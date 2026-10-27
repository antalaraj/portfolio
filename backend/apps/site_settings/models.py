from django.db import models
from apps.core.models import TimeStampedUUIDModel

class SiteSetting(TimeStampedUUIDModel):
    site_title = models.CharField(max_length=150, default="Raj Antala | Portfolio")
    primary_email = models.EmailField(default="contact@rajantala.com")
    maintenance_mode = models.BooleanField(default=False)
    analytics_enabled = models.BooleanField(default=True)
    resume_download_enabled = models.BooleanField(default=True)
    revalidation_webhook_url = models.URLField(blank=True, help_text="Next.js ISR revalidation endpoint")
    revalidation_secret = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return self.site_title
