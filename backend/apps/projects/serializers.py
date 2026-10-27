from rest_framework import serializers
from .models import TechTag, Project, ProjectGalleryImage

class TechTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechTag
        fields = ['id', 'name', 'category']

class ProjectGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectGalleryImage
        fields = ['id', 'project', 'image_url', 'caption', 'display_order']

class ProjectListSerializer(serializers.ModelSerializer):
    technologies = TechTagSerializer(many=True, read_only=True)
    technology_ids = serializers.PrimaryKeyRelatedField(
        queryset=TechTag.objects.all(),
        many=True,
        write_only=True,
        source='technologies',
        required=False
    )

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'short_description', 'thumbnail_url',
            'github_url', 'live_demo_url', 'technologies', 'technology_ids',
            'is_featured', 'display_order', 'status', 'published_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class ProjectDetailSerializer(serializers.ModelSerializer):
    technologies = TechTagSerializer(many=True, read_only=True)
    technology_ids = serializers.PrimaryKeyRelatedField(
        queryset=TechTag.objects.all(),
        many=True,
        write_only=True,
        source='technologies',
        required=False
    )
    gallery_images = ProjectGalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'short_description', 'full_description',
            'thumbnail_url', 'github_url', 'live_demo_url', 'technologies',
            'technology_ids', 'gallery_images', 'is_featured', 'display_order',
            'status', 'published_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
