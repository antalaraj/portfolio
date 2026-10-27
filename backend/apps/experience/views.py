from rest_framework import serializers, views, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsSuperAdminUser
from apps.core.models import PublishableStatus
from .models import Experience

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'id', 'company', 'job_title', 'employment_type', 'location',
            'start_date', 'end_date', 'is_current', 'description',
            'responsibilities', 'display_order', 'status', 'published_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PublicExperienceView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Experience.objects.filter(status=PublishableStatus.PUBLISHED).order_by('display_order', '-start_date')
        return Response({
            'success': True,
            'data': ExperienceSerializer(qs, many=True).data
        })

class AdminExperienceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = Experience.objects.all().order_by('display_order', '-start_date')
    serializer_class = ExperienceSerializer
