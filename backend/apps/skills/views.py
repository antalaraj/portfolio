from rest_framework import views, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsSuperAdminUser
from .models import SkillCategory, Skill
from .serializers import SkillCategorySerializer, SkillSerializer

class PublicSkillsView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = SkillCategory.objects.prefetch_related('skills').all().order_by('display_order')
        output = []
        for cat in categories:
            visible_skills = cat.skills.filter(is_visible=True).order_by('display_order')
            output.append({
                'id': str(cat.id),
                'name': cat.name,
                'slug': cat.slug,
                'skills': SkillSerializer(visible_skills, many=True).data
            })
        return Response({
            'success': True,
            'data': output
        })

class AdminSkillCategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = SkillCategory.objects.all().order_by('display_order')
    serializer_class = SkillCategorySerializer

class AdminSkillViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdminUser]
    queryset = Skill.objects.all().order_by('display_order')
    serializer_class = SkillSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            qs = qs.filter(category_id=category_id)
        return qs
