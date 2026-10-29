from rest_framework import serializers
from .models import SkillCategory, Skill

class SkillSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Skill
        fields = [
            'id', 'category', 'category_name', 'name', 'proficiency',
            'icon_name', 'display_order', 'is_visible', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class SkillCategorySerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    slug = serializers.SlugField(required=False, allow_blank=True)
    skills_count = serializers.IntegerField(source='skills.count', read_only=True)

    class Meta:
        model = SkillCategory
        fields = ['id', 'name', 'slug', 'display_order', 'skills', 'skills_count']
