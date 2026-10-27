from django.db import models
from apps.core.models import TimeStampedUUIDModel

class SkillCategory(TimeStampedUUIDModel):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = 'Skill Categories'

    def __str__(self):
        return self.name

class Skill(TimeStampedUUIDModel):
    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    proficiency = models.PositiveSmallIntegerField(
        default=85, 
        help_text="Percentage proficiency (1-100)"
    )
    icon_name = models.CharField(max_length=60, blank=True, help_text="Lucide icon identifier or slug")
    display_order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.name} ({self.category.name})"
