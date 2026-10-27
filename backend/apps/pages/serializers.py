from rest_framework import serializers
from .models import Page, PageSection

class PageSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageSection
        fields = [
            'id', 'page', 'section_type', 'title', 'subtitle',
            'display_order', 'is_active', 'config_data', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PageSerializer(serializers.ModelSerializer):
    sections = PageSectionSerializer(many=True, read_only=True)

    class Meta:
        model = Page
        fields = [
            'id', 'title', 'slug', 'description', 'status', 'published_at',
            'display_order', 'sections', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PublicPageSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageSection
        fields = [
            'id', 'section_type', 'title', 'subtitle', 'display_order', 'config_data'
        ]

class PublicPageSerializer(serializers.ModelSerializer):
    sections = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'description', 'sections']

    def get_sections(self, obj):
        active_sections = obj.sections.filter(is_active=True).order_by('display_order')
        return PublicPageSectionSerializer(active_sections, many=True).data
