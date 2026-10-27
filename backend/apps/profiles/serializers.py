from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'id', 'full_name', 'headline', 'bio', 'email', 'phone',
            'location', 'github_url', 'linkedin_url', 'twitter_url',
            'availability_status', 'avatar_url', 'resume_file_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
