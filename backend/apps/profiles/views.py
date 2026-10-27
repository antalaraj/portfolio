from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from apps.core.permissions import IsSuperAdminUser
from .models import Profile
from .serializers import ProfileSerializer

class PublicProfileView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create()
        return Response({
            'success': True,
            'data': ProfileSerializer(profile).data
        })

class AdminProfileView(views.APIView):
    permission_classes = [IsSuperAdminUser]

    def get(self, request):
        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create()
        return Response({
            'success': True,
            'data': ProfileSerializer(profile).data
        })

    def patch(self, request):
        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create()
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_profile = serializer.save()

        # Synchronize hero section config_data with profile experience badge settings
        try:
            from apps.pages.models import PageSection
            hero_sec = PageSection.objects.filter(section_type='hero').first()
            if hero_sec:
                config_updated = False
                for field in ['show_experience_badge', 'experience_badge_title', 'experience_badge_subtitle']:
                    if field in request.data:
                        hero_sec.config_data[field] = getattr(updated_profile, field)
                        config_updated = True
                if config_updated:
                    hero_sec.save(update_fields=['config_data'])
        except Exception:
            pass

        return Response({
            'success': True,
            'message': 'Profile updated successfully.',
            'data': serializer.data
        })

