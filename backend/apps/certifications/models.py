from django.db import models
from apps.core.models import PublishableModel

class Certification(PublishableModel):
    title = models.CharField(max_length=200)
    issuer = models.CharField(max_length=150)
    issue_date = models.DateField()
    credential_url = models.URLField(blank=True)
    certificate_image_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.title} by {self.issuer}"
