from django.db import models
from apps.core.models import PublishableModel

class Education(PublishableModel):
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=150)
    field_of_study = models.CharField(max_length=150)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    grade = models.CharField(max_length=50, blank=True, help_text="e.g. CGPA 8.5 / 10 or First Class")
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.degree} - {self.institution}"
