from rest_framework import serializers, views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsSuperAdminUser
from apps.profiles.models import Profile
from .models import FooterSetting

def sync_footer_with_profile(footer):
    """Keep footer social_links in sync with the primary Profile."""
    profile = Profile.objects.first()
    if not profile or not footer:
        return
    socials = []
    if profile.github_url:
        socials.append({'platform': 'GitHub', 'url': profile.github_url, 'icon': 'Github'})
    if profile.linkedin_url:
        socials.append({'platform': 'LinkedIn', 'url': profile.linkedin_url, 'icon': 'Linkedin'})
    if profile.email:
        socials.append({'platform': 'Email', 'url': f"mailto:{profile.email}", 'icon': 'Mail'})
    
    if footer.social_links != socials:
        footer.social_links = socials
        footer.save(update_fields=['social_links'])

class FooterSettingSerializer(serializers.ModelSerializer):
    contact_email = serializers.SerializerMethodField()
    github_url = serializers.SerializerMethodField()
    linkedin_url = serializers.SerializerMethodField()

    class Meta:
        model = FooterSetting
        fields = [
            'id', 'description', 'copyright_text', 'is_visible',
            'social_links', 'contact_email', 'github_url', 'linkedin_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'contact_email', 'github_url', 'linkedin_url', 'created_at', 'updated_at']

    def get_contact_email(self, obj):
        prof = Profile.objects.first()
        return prof.email if prof else ""

    def get_github_url(self, obj):
        prof = Profile.objects.first()
        return prof.github_url if prof else ""

    def get_linkedin_url(self, obj):
        prof = Profile.objects.first()
        return prof.linkedin_url if prof else ""

class PublicFooterView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        footer = FooterSetting.objects.first()
        if not footer:
            footer = FooterSetting.objects.create()
        sync_footer_with_profile(footer)
        return Response({
            'success': True,
            'data': FooterSettingSerializer(footer).data
        })

class AdminFooterView(views.APIView):
    permission_classes = [IsSuperAdminUser]

    def get(self, request):
        footer = FooterSetting.objects.first()
        if not footer:
            footer = FooterSetting.objects.create()
        sync_footer_with_profile(footer)
        return Response({
            'success': True,
            'data': FooterSettingSerializer(footer).data
        })

    def patch(self, request):
        footer = FooterSetting.objects.first()
        if not footer:
            footer = FooterSetting.objects.create()
        serializer = FooterSettingSerializer(footer, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        sync_footer_with_profile(footer)
        return Response({
            'success': True,
            'message': 'Footer updated successfully.',
            'data': FooterSettingSerializer(footer).data
        })
