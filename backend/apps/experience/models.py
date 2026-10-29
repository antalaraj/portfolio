from django.db import models
from apps.core.models import PublishableModel

class Experience(PublishableModel):
    company = models.CharField(max_length=150)
    job_title = models.CharField(max_length=150)
    employment_type = models.CharField(
        max_length=50,
        choices=[
            ('full-time', 'Full-time'),
            ('internship', 'Internship'),
            ('part-time', 'Part-time'),
            ('contract', 'Contract'),
            ('research', 'Research Fellow'),
            ('freelance', 'Freelance')
        ],
        default='internship'
    )
    location = models.CharField(max_length=150, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    responsibilities = models.JSONField(
        default=list, 
        blank=True, 
        help_text="List of bullet point achievements / contributions"
    )

    def __str__(self):
        return f"{self.job_title} at {self.company}"
