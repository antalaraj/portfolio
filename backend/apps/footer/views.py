from rest_framework import serializers, views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsSuperAdminUser
from .models import FooterSetting

class FooterSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterSetting
        fields = [
            'id', 'description', 'copyright_text', 'is_visible',
            'social_links', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PublicFooterView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        footer = FooterSetting.objects.first()
        if not footer:
            footer = FooterSetting.objects.create(
                social_links=[
                    {'platform': 'GitHub', 'url': 'https://github.com', 'icon': 'Github'},
                    {'platform': 'LinkedIn', 'url': 'https://linkedin.com', 'icon': 'Linkedin'}
                ]
            )
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
        return Response({
            'success': True,
            'message': 'Footer updated successfully.',
            'data': serializer.data
        })
