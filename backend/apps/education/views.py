from rest_framework import serializers, views, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsSuperAdminUser
from apps.core.models import PublishableStatus
from .models import Education

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            'id', 'institution', 'degree', 'field_of_study',
            'start_date', 'end_date', 'grade', 'description',
            'display_order', 'status', 'published_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PublicEducationView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Education.objects.filter(status=PublishableStatus.PUBLISHED).order_by('display_order', '-start_date')
        return Response({
            'success': True,
            'data': EducationSerializer(qs, many=True).data
        })

class AdminEducationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = Education.objects.all().order_by('display_order', '-start_date')
    serializer_class = EducationSerializer
