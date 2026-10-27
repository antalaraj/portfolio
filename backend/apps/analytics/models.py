from django.db import models

class AnalyticsEvent(models.Model):
    id = models.BigAutoField(primary_key=True)
    path = models.CharField(max_length=255, db_index=True)
    referrer = models.CharField(max_length=255, blank=True)
    ip_hash = models.CharField(max_length=64, help_text="SHA256 hash of IP for privacy")
    user_agent = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Visit to {self.path} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
