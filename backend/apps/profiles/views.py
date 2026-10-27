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
        serializer.save()
        return Response({
            'success': True,
            'message': 'Profile updated successfully.',
            'data': serializer.data
        })
