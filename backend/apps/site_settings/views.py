from rest_framework import serializers, views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsSuperAdminUser
from .models import SiteSetting

class PublicSiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ['site_title', 'primary_email', 'maintenance_mode', 'resume_download_enabled']

class AdminSiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = [
            'id', 'site_title', 'primary_email', 'maintenance_mode',
            'analytics_enabled', 'resume_download_enabled',
            'revalidation_webhook_url', 'revalidation_secret',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PublicSiteSettingView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        setting = SiteSetting.objects.first()
        if not setting:
            setting = SiteSetting.objects.create()
        return Response({
            'success': True,
            'data': PublicSiteSettingSerializer(setting).data
        })

class AdminSiteSettingView(views.APIView):
    permission_classes = [IsSuperAdminUser]

    def get(self, request):
        setting = SiteSetting.objects.first()
        if not setting:
            setting = SiteSetting.objects.create()
        return Response({
            'success': True,
            'data': AdminSiteSettingSerializer(setting).data
        })

    def patch(self, request):
        setting = SiteSetting.objects.first()
        if not setting:
            setting = SiteSetting.objects.create()
        serializer = AdminSiteSettingSerializer(setting, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'success': True,
            'message': 'Settings updated successfully.',
            'data': serializer.data
        })
