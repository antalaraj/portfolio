from django.db import models
from apps.core.models import TimeStampedUUIDModel

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

    def __str__(self):
        return f"{self.subject} from {self.sender_name} ({self.sender_email})"
