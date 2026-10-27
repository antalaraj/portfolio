from django.db import models
from apps.core.models import TimeStampedUUIDModel

class NavigationItem(TimeStampedUUIDModel):
    label = models.CharField(max_length=80)
    destination = models.CharField(max_length=255, help_text="Path like /#projects or /resume or full URL")
    is_external = models.BooleanField(default=False)
    menu_location = models.CharField(
        max_length=20, 
        choices=[('header', 'Header'), ('footer', 'Footer'), ('both', 'Both')],
        default='header'
    )
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', 'label']

    def __str__(self):
        return f"{self.label} -> {self.destination} ({self.menu_location})"
