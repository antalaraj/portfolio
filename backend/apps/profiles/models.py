from django.db import models
from apps.core.models import TimeStampedUUIDModel

class Profile(TimeStampedUUIDModel):
    full_name = models.CharField(max_length=150, default="Raj Antala")
    headline = models.CharField(max_length=255, default="AI Engineer | Data Science | Generative AI")
    bio = models.TextField(blank=True, default="Passionate AI Engineer and Data Scientist specializing in Machine Learning, Deep Learning, and Generative AI applications.")
    email = models.EmailField(default="contact@rajantala.com")
    phone = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=150, default="India")
    github_url = models.URLField(blank=True, default="https://github.com")
    linkedin_url = models.URLField(blank=True, default="https://linkedin.com")
    twitter_url = models.URLField(blank=True)
    availability_status = models.CharField(
        max_length=100, 
        default="Available for AI / ML Roles & Projects"
    )
    avatar_url = models.URLField(max_length=500, blank=True)
    resume_file_url = models.URLField(max_length=500, blank=True)
    experience_badge_title = models.CharField(
        max_length=100,
        default="3+ Years Experience",
        blank=True
    )
    experience_badge_subtitle = models.CharField(
        max_length=150,
        default="AI / ML Production Systems",
        blank=True
    )
    show_experience_badge = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"

    def __str__(self):
        return f"Profile - {self.full_name}"
