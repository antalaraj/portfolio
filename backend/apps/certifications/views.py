from rest_framework import serializers, views, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsSuperAdminUser
from apps.core.models import PublishableStatus
from .models import Certification

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = [
            'id', 'title', 'issuer', 'issue_date', 'credential_url',
            'certificate_image_url', 'display_order', 'status',
            'published_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PublicCertificationView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Certification.objects.filter(status=PublishableStatus.PUBLISHED).order_by('display_order', '-issue_date')
        return Response({
            'success': True,
            'data': CertificationSerializer(qs, many=True).data
        })

class AdminCertificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = Certification.objects.all().order_by('display_order', '-issue_date')
    serializer_class = CertificationSerializer
